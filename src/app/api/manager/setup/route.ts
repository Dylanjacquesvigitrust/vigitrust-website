import { NextResponse } from "next/server";
import {
  activateManagerWithPassword,
  setManagerSessionCookie,
} from "@/lib/manager-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string; password?: string };
    const token = body.token?.trim() ?? "";
    const password = body.password ?? "";

    if (!token) {
      return NextResponse.json({ error: "Missing setup token." }, { status: 400 });
    }

    const result = await activateManagerWithPassword(token, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    setManagerSessionCookie(response, result.managerId, result.passwordHash);
    return response;
  } catch (error) {
    console.error("[manager setup]", error);
    return NextResponse.json({ error: "Setup failed." }, { status: 500 });
  }
}
