import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminToken } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const expected = getAdminToken();
  if (!expected) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  let token: string | undefined;
  try {
    const body = (await request.json()) as { token?: string };
    token = body.token?.trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!token || token !== expected) {
    return NextResponse.json({ error: "Invalid access token." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
