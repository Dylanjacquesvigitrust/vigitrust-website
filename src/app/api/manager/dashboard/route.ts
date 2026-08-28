import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireManagerApi } from "@/lib/manager-auth";
import {
  addEmployeeToCourse,
  getCustomerCourseSummaries,
  retryFailedAssignment,
  syncCustomerTrainingStatus,
} from "@/lib/training-employees";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireManagerApi();
  if ("error" in auth) return auth.error;

  await syncCustomerTrainingStatus(auth.session.customerId);

  const [summaries, employees] = await Promise.all([
    getCustomerCourseSummaries(auth.session.customerId),
    prisma.trainingAssignment.findMany({
      where: { customerId: auth.session.customerId },
      include: { employee: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    manager: auth.session,
    courses: summaries,
    employees: employees.map((a) => ({
      id: a.id,
      employeeId: a.employeeId,
      firstName: a.employee.firstName,
      lastName: a.employee.lastName,
      email: a.employee.email,
      courseSlug: a.courseSlug,
      licenceStatus: a.status,
      trainingStatus: a.trainingStatus,
      completedAt: a.completedAt,
      progressPercent: a.progressPercent,
      provisioningError: a.provisioningError,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireManagerApi();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as {
    action?: string;
    courseSlug?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    assignmentId?: string;
  };

  if (body.action === "retry" && body.assignmentId) {
    const result = await retryFailedAssignment(auth.session.customerId, body.assignmentId);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, assignmentId: result.assignmentId });
  }

  if (!body.courseSlug || !body.firstName || !body.lastName || !body.email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const result = await addEmployeeToCourse({
    customerId: auth.session.customerId,
    courseSlug: body.courseSlug,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, assignmentId: result.assignmentId });
}
