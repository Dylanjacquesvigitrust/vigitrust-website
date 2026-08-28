import bcrypt from "bcryptjs";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendManagerSetupEmail } from "@/lib/email";

export const MANAGER_COOKIE = "manager_session";
export const MANAGER_SESSION_MAX_AGE = 60 * 60 * 24 * 30;
export const MANAGER_INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

export type ManagerSession = {
  managerId: string;
  customerId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(sha256(a));
  const right = Buffer.from(sha256(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateInviteToken(): string {
  return randomBytes(32).toString("hex");
}

function sessionToken(managerId: string, passwordHash: string): string {
  return sha256(`vigitrust-manager:${managerId}:${passwordHash}`);
}

export async function getManagerSession(): Promise<ManagerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MANAGER_COOKIE)?.value;
  if (!token) return null;

  const managers = await prisma.managerAccount.findMany({
    where: { status: "active", passwordHash: { not: null } },
    select: {
      id: true,
      customerId: true,
      email: true,
      firstName: true,
      lastName: true,
      passwordHash: true,
    },
  });

  for (const m of managers) {
    if (!m.passwordHash) continue;
    if (safeEqual(token, sessionToken(m.id, m.passwordHash))) {
      return {
        managerId: m.id,
        customerId: m.customerId,
        email: m.email,
        firstName: m.firstName,
        lastName: m.lastName,
      };
    }
  }

  return null;
}

export async function requireManagerApi(): Promise<
  { session: ManagerSession } | { error: NextResponse }
> {
  const session = await getManagerSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }
  return { session };
}

export function setManagerSessionCookie(response: NextResponse, managerId: string, passwordHash: string) {
  response.cookies.set(MANAGER_COOKIE, sessionToken(managerId, passwordHash), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MANAGER_SESSION_MAX_AGE,
  });
}

export function clearManagerSessionCookie(response: NextResponse) {
  response.cookies.set(MANAGER_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function activateManagerWithPassword(
  inviteToken: string,
  password: string,
): Promise<{ ok: true; managerId: string; passwordHash: string } | { ok: false; error: string }> {
  const manager = await prisma.managerAccount.findUnique({ where: { inviteToken } });
  if (!manager) {
    return { ok: false, error: "Invalid or expired setup link." };
  }
  if (manager.inviteExpiresAt && manager.inviteExpiresAt < new Date()) {
    return { ok: false, error: "This setup link has expired. Contact support." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const passwordHash = hashPassword(password);
  await prisma.managerAccount.update({
    where: { id: manager.id },
    data: {
      passwordHash,
      status: "active",
      inviteToken: null,
      inviteExpiresAt: null,
    },
  });

  return { ok: true, managerId: manager.id, passwordHash };
}

export async function loginManager(
  email: string,
  password: string,
): Promise<{ ok: true; managerId: string; passwordHash: string } | { ok: false; error: string }> {
  const manager = await prisma.managerAccount.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!manager || manager.status !== "active" || !manager.passwordHash) {
    return { ok: false, error: "Invalid email or password." };
  }
  if (!verifyPassword(password, manager.passwordHash)) {
    return { ok: false, error: "Invalid email or password." };
  }
  return { ok: true, managerId: manager.id, passwordHash: manager.passwordHash };
}

export async function resendManagerSetupEmail(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return { ok: false, error: "Email is required." };
  }

  const manager = await prisma.managerAccount.findUnique({
    where: { email: normalized },
    include: {
      customer: {
        include: {
          licenceAllocations: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!manager) {
    return { ok: false, error: "No manager account found for this email." };
  }

  if (manager.status === "active") {
    return { ok: false, error: "Your account is already set up. Sign in with your password." };
  }

  let inviteToken = manager.inviteToken;
  const expired = !manager.inviteExpiresAt || manager.inviteExpiresAt < new Date();
  if (!inviteToken || expired) {
    inviteToken = generateInviteToken();
    await prisma.managerAccount.update({
      where: { id: manager.id },
      data: {
        inviteToken,
        inviteExpiresAt: new Date(Date.now() + MANAGER_INVITE_TTL_MS),
      },
    });
  }

  const coursesBySlug = new Map<string, { title: string; quantity: number }>();
  for (const allocation of manager.customer.licenceAllocations) {
    const existing = coursesBySlug.get(allocation.courseSlug);
    if (existing) {
      existing.quantity += allocation.quantityPurchased;
    } else {
      coursesBySlug.set(allocation.courseSlug, {
        title: allocation.courseTitle,
        quantity: allocation.quantityPurchased,
      });
    }
  }

  const courses = [...coursesBySlug.values()];
  if (!courses.length) {
    return { ok: false, error: "No training licences found for this account." };
  }

  const emailResult = await sendManagerSetupEmail({
    to: normalized,
    firstName: manager.firstName ?? undefined,
    inviteToken,
    courses,
    orderRef: manager.customerId,
  });

  if (!emailResult.sent) {
    return { ok: false, error: emailResult.reason ?? "Could not send setup email." };
  }

  return { ok: true };
}
