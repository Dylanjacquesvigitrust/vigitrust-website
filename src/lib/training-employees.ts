import { AssignmentStatus, TrainingStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  addUserToGroup,
  enrollUserInCourse,
  findUserByEmail,
  inviteUser,
  isReachConfigured,
  mapReachTrainingStatus,
  ReachApiError,
} from "@/lib/reach360";
import { getReachLearnerPortalUrl, getTrainingProductBySlug } from "@/lib/training-products";
import { sendEmployeeTrainingAssignedEmail } from "@/lib/email";

export type AddEmployeeInput = {
  customerId: string;
  courseSlug: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type AddEmployeeResult =
  | { ok: true; assignmentId: string; employeeId: string }
  | { ok: false; error: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function countActiveAssignments(allocationId: string): Promise<number> {
  return prisma.trainingAssignment.count({
    where: {
      allocationId,
      status: { in: [AssignmentStatus.reserved, AssignmentStatus.assigned] },
    },
  });
}

async function allocationRemaining(allocation: {
  id: string;
  quantityPurchased: number;
  quantityAssigned: number;
}): Promise<number> {
  const inFlight = await countActiveAssignments(allocation.id);
  return allocation.quantityPurchased - Math.max(allocation.quantityAssigned, inFlight);
}

/** Pick an allocation with remaining licences (FIFO by createdAt). */
async function findAllocationWithCapacity(customerId: string, courseSlug: string) {
  const allocations = await prisma.courseLicenceAllocation.findMany({
    where: { customerId, courseSlug },
    orderBy: { createdAt: "asc" },
  });

  for (const allocation of allocations) {
    const remaining = await allocationRemaining(allocation);
    if (remaining > 0) return allocation;
  }
  return null;
}

async function provisionEmployeeInReach(params: {
  employeeId: string;
  assignmentId: string;
  allocationId: string;
  email: string;
  firstName: string;
  lastName: string;
  reachGroupId: string;
  reachGroupName: string;
  courseSlug: string;
}): Promise<void> {
  const { employeeId, assignmentId, allocationId, email, firstName, lastName, reachGroupId, reachGroupName, courseSlug } =
    params;

  const product = getTrainingProductBySlug(courseSlug);
  if (!product) {
    throw new ReachApiError(`Unknown course: ${courseSlug}`, 0);
  }

  try {
    if (!isReachConfigured()) {
      throw new ReachApiError("REACH360_API_KEY is not configured.", 0);
    }

    let reachUserId: string | null = null;
    let reachInvitationId: string | null = null;

    const existing = await findUserByEmail(email);
    if (existing) {
      reachUserId = existing.id;
      await addUserToGroup(reachGroupId, existing.id);
      await enrollUserInCourse(product.reachCourseId, existing.id);
      await prisma.employee.update({
        where: { id: employeeId },
        data: { reachUserId: existing.id },
      });
    } else {
      try {
        const invitation = await inviteUser({
          email,
          firstName,
          lastName,
          groups: [reachGroupName],
        });
        reachInvitationId = invitation.id;
      } catch (error) {
        if (error instanceof ReachApiError && error.code === "user_exists") {
          const user = await findUserByEmail(email);
          if (user) {
            reachUserId = user.id;
            await addUserToGroup(reachGroupId, user.id);
            await enrollUserInCourse(product.reachCourseId, user.id);
            await prisma.employee.update({
              where: { id: employeeId },
              data: { reachUserId: user.id },
            });
          } else {
            throw error;
          }
        } else if (error instanceof ReachApiError && error.code === "invite_pending") {
          // Invitation already pending — treat as in progress, still assign licence
          console.warn("[employee] invite_pending for", email);
        } else {
          throw error;
        }
      }
    }

    await prisma.$transaction([
      prisma.trainingAssignment.update({
        where: { id: assignmentId },
        data: {
          status: AssignmentStatus.assigned,
          reachUserId,
          reachInvitationId,
          assignedAt: new Date(),
          provisioningError: null,
        },
      }),
      prisma.courseLicenceAllocation.update({
        where: { id: allocationId },
        data: { quantityAssigned: { increment: 1 } },
      }),
    ]);

    await sendEmployeeTrainingAssignedEmail({
      to: email,
      firstName,
      courseTitle: product.title,
      reachPortalUrl: getReachLearnerPortalUrl(),
      isNewInvite: !reachUserId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reach provisioning failed.";
    await prisma.trainingAssignment.update({
      where: { id: assignmentId },
      data: {
        status: AssignmentStatus.failed,
        provisioningError: message,
      },
    });
    throw error;
  }
}

export async function addEmployeeToCourse(input: AddEmployeeInput): Promise<AddEmployeeResult> {
  const email = normalizeEmail(input.email);
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();

  if (!firstName || !lastName || !email) {
    return { ok: false, error: "Name and email are required." };
  }

  const product = getTrainingProductBySlug(input.courseSlug);
  if (!product) {
    return { ok: false, error: "Unknown training course." };
  }

  const allocation = await findAllocationWithCapacity(input.customerId, input.courseSlug);
  if (!allocation) {
    return { ok: false, error: "No licences remaining for this course." };
  }

  if (!allocation.reachGroupId || !allocation.reachGroupName) {
    return {
      ok: false,
      error: "Reach group is not ready yet. Please try again shortly or contact support.",
    };
  }

  const existingAssignment = await prisma.trainingAssignment.findFirst({
    where: {
      customerId: input.customerId,
      courseSlug: input.courseSlug,
      status: { in: [AssignmentStatus.reserved, AssignmentStatus.assigned] },
      employee: { email },
    },
  });
  if (existingAssignment) {
    return { ok: false, error: "This employee is already assigned to this course." };
  }

  const result = await prisma.$transaction(async (tx) => {
    const fresh = await tx.courseLicenceAllocation.findUnique({ where: { id: allocation.id } });
    if (!fresh) {
      return { ok: false as const, error: "No licences remaining for this course." };
    }

    const inFlight = await tx.trainingAssignment.count({
      where: {
        allocationId: fresh.id,
        status: { in: [AssignmentStatus.reserved, AssignmentStatus.assigned] },
      },
    });
    if (fresh.quantityPurchased - Math.max(fresh.quantityAssigned, inFlight) < 1) {
      return { ok: false as const, error: "No licences remaining for this course." };
    }

    const employee = await tx.employee.upsert({
      where: {
        customerId_email: { customerId: input.customerId, email },
      },
      create: {
        customerId: input.customerId,
        firstName,
        lastName,
        email,
      },
      update: { firstName, lastName },
    });

    const assignment = await tx.trainingAssignment.create({
      data: {
        customerId: input.customerId,
        employeeId: employee.id,
        allocationId: allocation.id,
        courseSlug: input.courseSlug,
        status: AssignmentStatus.reserved,
        trainingStatus: TrainingStatus.not_started,
      },
    });

    return { ok: true as const, employee, assignment };
  });

  if (!result.ok) return result;

  try {
    await provisionEmployeeInReach({
      employeeId: result.employee.id,
      assignmentId: result.assignment.id,
      allocationId: allocation.id,
      email,
      firstName,
      lastName,
      reachGroupId: allocation.reachGroupId,
      reachGroupName: allocation.reachGroupName,
      courseSlug: input.courseSlug,
    });
    return { ok: true, assignmentId: result.assignment.id, employeeId: result.employee.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to provision employee.";
    await prisma.trainingAssignment.update({
      where: { id: result.assignment.id },
      data: { status: AssignmentStatus.failed, provisioningError: message },
    });
    return { ok: false, error: message };
  }
}

export async function retryFailedAssignment(
  customerId: string,
  assignmentId: string,
): Promise<AddEmployeeResult> {
  const assignment = await prisma.trainingAssignment.findFirst({
    where: { id: assignmentId, customerId, status: AssignmentStatus.failed },
    include: {
      employee: true,
      allocation: true,
    },
  });

  if (!assignment) {
    return { ok: false, error: "Assignment not found." };
  }

  if (!assignment.allocation.reachGroupId || !assignment.allocation.reachGroupName) {
    return { ok: false, error: "Reach group not configured." };
  }

  const remaining = await allocationRemaining(assignment.allocation);
  if (remaining < 1) {
    return { ok: false, error: "No licences remaining." };
  }

  await prisma.trainingAssignment.update({
    where: { id: assignmentId },
    data: { status: AssignmentStatus.reserved, provisioningError: null },
  });

  try {
    await provisionEmployeeInReach({
      employeeId: assignment.employeeId,
      assignmentId: assignment.id,
      allocationId: assignment.allocationId,
      email: assignment.employee.email,
      firstName: assignment.employee.firstName,
      lastName: assignment.employee.lastName,
      reachGroupId: assignment.allocation.reachGroupId,
      reachGroupName: assignment.allocation.reachGroupName,
      courseSlug: assignment.courseSlug,
    });
    return { ok: true, assignmentId: assignment.id, employeeId: assignment.employeeId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Retry failed.";
    await prisma.trainingAssignment.update({
      where: { id: assignmentId },
      data: { status: AssignmentStatus.failed, provisioningError: message },
    });
    return { ok: false, error: message };
  }
}

export async function syncAssignmentProgress(assignmentId: string): Promise<void> {
  const assignment = await prisma.trainingAssignment.findUnique({
    where: { id: assignmentId },
    include: { employee: true },
  });
  if (!assignment) return;

  const reachUserId = assignment.reachUserId ?? assignment.employee.reachUserId;
  if (!reachUserId) return;

  const product = getTrainingProductBySlug(assignment.courseSlug);
  if (!product) return;

  const report = await getLearnerReportSafe(reachUserId);
  const courseSession = report.courses?.find((c) => c.courseId === product.reachCourseId);

  if (!courseSession) return;

  const trainingStatus = mapReachTrainingStatus(courseSession.status);
  const prismaStatus =
    trainingStatus === "completed"
      ? TrainingStatus.completed
      : trainingStatus === "in_progress"
        ? TrainingStatus.in_progress
        : TrainingStatus.not_started;

  await prisma.trainingAssignment.update({
    where: { id: assignmentId },
    data: {
      trainingStatus: prismaStatus,
      progressPercent: courseSession.progress ?? undefined,
      completedAt: courseSession.completedAt ? new Date(courseSession.completedAt) : null,
      lastSyncedAt: new Date(),
    },
  });
}

async function getLearnerReportSafe(userId: string) {
  const { getLearnerReport } = await import("@/lib/reach360");
  return getLearnerReport(userId);
}

export async function syncCustomerTrainingStatus(customerId: string): Promise<void> {
  const assignments = await prisma.trainingAssignment.findMany({
    where: { customerId, status: AssignmentStatus.assigned },
    select: { id: true },
  });
  for (const a of assignments) {
    try {
      await syncAssignmentProgress(a.id);
    } catch (error) {
      console.warn("[training-sync] failed for assignment", a.id, error);
    }
  }
}

export type CourseSummary = {
  courseSlug: string;
  courseTitle: string;
  totalPurchased: number;
  totalAssigned: number;
  totalRemaining: number;
  reachGroupId: string | null;
  reachGroupName: string | null;
};

export async function getCustomerCourseSummaries(customerId: string): Promise<CourseSummary[]> {
  const allocations = await prisma.courseLicenceAllocation.findMany({
    where: { customerId },
    orderBy: { courseSlug: "asc" },
  });

  const bySlug = new Map<string, CourseSummary & { allocationIds: string[] }>();

  for (const a of allocations) {
    const existing = bySlug.get(a.courseSlug);
    if (existing) {
      existing.totalPurchased += a.quantityPurchased;
      existing.totalAssigned += a.quantityAssigned;
      existing.allocationIds.push(a.id);
      if (a.reachGroupId) {
        existing.reachGroupId = a.reachGroupId;
        existing.reachGroupName = a.reachGroupName;
      }
    } else {
      bySlug.set(a.courseSlug, {
        courseSlug: a.courseSlug,
        courseTitle: a.courseTitle,
        totalPurchased: a.quantityPurchased,
        totalAssigned: a.quantityAssigned,
        totalRemaining: 0,
        reachGroupId: a.reachGroupId,
        reachGroupName: a.reachGroupName,
        allocationIds: [a.id],
      });
    }
  }

  const summaries: CourseSummary[] = [];
  for (const entry of bySlug.values()) {
    let reserved = 0;
    for (const allocationId of entry.allocationIds) {
      reserved += await countActiveAssignments(allocationId);
    }
    const consumed = Math.max(entry.totalAssigned, reserved);
    summaries.push({
      courseSlug: entry.courseSlug,
      courseTitle: entry.courseTitle,
      totalPurchased: entry.totalPurchased,
      totalAssigned: entry.totalAssigned,
      totalRemaining: entry.totalPurchased - consumed,
      reachGroupId: entry.reachGroupId,
      reachGroupName: entry.reachGroupName,
    });
  }

  return summaries;
}
