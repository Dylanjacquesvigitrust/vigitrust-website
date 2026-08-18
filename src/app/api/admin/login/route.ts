import { NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  credentialsMatch,
  setAdminSessionCookie,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let username = "";
  let password = "";

  try {
    const body = (await request.json()) as { username?: string; password?: string; token?: string };
    username = body.username?.trim() ?? "";
    password = body.password ?? body.token ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!username || !password || !credentialsMatch(username, password)) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookie(response);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAdminSessionCookie(response);
  return response;
}
