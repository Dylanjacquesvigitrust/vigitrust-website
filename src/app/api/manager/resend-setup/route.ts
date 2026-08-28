import { NextResponse } from "next/server";
import { resendManagerSetupEmail } from "@/lib/manager-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const result = await resendManagerSetupEmail(body.email ?? "");
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[manager resend-setup]", error);
    return NextResponse.json({ error: "Failed to resend setup email." }, { status: 500 });
  }
}
