import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "renewal_admin";

export function getAdminToken(): string | undefined {
  return process.env.RENEWAL_ADMIN_TOKEN;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = getAdminToken();
  if (!expected) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === expected;
}

export async function requireAdminApi(): Promise<NextResponse | null> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}
