import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "renewal_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "systemadmin#23";

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || DEFAULT_ADMIN_USERNAME;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function safeEqual(a: string, b: string): boolean {
  const left = sha256(a);
  const right = sha256(b);
  return timingSafeEqual(left, right);
}

export function getAdminSessionSecret(): string {
  return sha256(`vigitrust-admin:${getAdminUsername()}:${getAdminPassword()}`).toString("hex");
}

export function credentialsMatch(username: string, password: string): boolean {
  return safeEqual(username.trim(), getAdminUsername()) && safeEqual(password, getAdminPassword());
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!value) return false;

  if (safeEqual(value, getAdminSessionSecret())) return true;

  const legacyToken = process.env.RENEWAL_ADMIN_TOKEN;
  return Boolean(legacyToken && safeEqual(value, legacyToken));
}

export async function requireAdminApi(): Promise<NextResponse | null> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

export function setAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_COOKIE, getAdminSessionSecret(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
