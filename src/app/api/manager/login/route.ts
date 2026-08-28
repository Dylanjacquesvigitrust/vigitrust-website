import { NextResponse } from "next/server";
import {
  clearManagerSessionCookie,
  loginManager,
  setManagerSessionCookie,
} from "@/lib/manager-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    const result = await loginManager(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    setManagerSessionCookie(response, result.managerId, result.passwordHash);
    return response;
  } catch (error) {
    console.error("[manager login]", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearManagerSessionCookie(response);
  return response;
}
