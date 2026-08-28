import bcrypt from "bcryptjs";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const MANAGER_COOKIE = "manager_session";
export const MANAGER_SESSION_MAX_AGE = 60 * 60 * 24 * 30;
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
