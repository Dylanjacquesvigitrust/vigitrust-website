import { NextResponse } from "next/server";
import { recoverManagerSetupLink } from "@/lib/manager-auth";

export const runtime = "nodejs";

/** Returns an on-site manager setup link for a pending purchase email (no email send). */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const result = await recoverManagerSetupLink(body.email ?? "");
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, alreadyActive: result.alreadyActive ?? false },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: true, setupUrl: result.setupUrl });
  } catch (error) {
    console.error("[manager recover-setup]", error);
    return NextResponse.json({ error: "Failed to recover setup link." }, { status: 500 });
  }
}
