import { Resend } from "resend";
import { getCourseAccessForSlug } from "@/lib/stripe-catalog";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

function getFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "VigiTrust <onboarding@resend.dev>"
  );
}

export type PurchaseEmailCourse = {
  slug: string;
  title: string;
  url: string;
};

export function resolvePurchasedCourses(cartSlugs: string): PurchaseEmailCourse[] {
  const slugs = cartSlugs
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const courses: PurchaseEmailCourse[] = [];
  for (const slug of slugs) {
    const access = getCourseAccessForSlug(slug);
    if (access) {
      courses.push({ slug, title: access.title, url: access.url });
    }
  }
  return courses;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(params: {
  firstName: string;
  courses: PurchaseEmailCourse[];
  orderRef: string;
}) {
  const name = params.firstName || "there";
  const courseBlocks = params.courses
    .map(
      (course) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #e6ebf1;">
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#0b1f3a;">
            ${escapeHtml(course.title)}
          </p>
          <a href="${escapeHtml(course.url)}"
             style="display:inline-block;background:#c62828;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;font-size:14px;">
            Open your course
          </a>
          <p style="margin:10px 0 0;font-size:12px;color:#5b6777;word-break:break-all;">
            ${escapeHtml(course.url)}
          </p>
        </td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Segoe UI,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px 28px 24px;border:1px solid #e6ebf1;">
          <tr>
            <td>
              <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#c62828;font-weight:700;">VigiTrust</p>
              <h1 style="margin:10px 0 0;font-size:24px;line-height:1.3;color:#0b1f3a;">Your course access is ready</h1>
              <p style="margin:14px 0 0;font-size:15px;line-height:1.55;color:#334155;">
                Hi ${escapeHtml(name)}, thanks for your purchase. You can start learning straight away using the link below.
              </p>
              <table role="presentation" width="100%" style="margin-top:8px;">
                ${courseBlocks}
              </table>
              <p style="margin:18px 0 0;font-size:13px;line-height:1.5;color:#5b6777;">
                Order reference: ${escapeHtml(params.orderRef)}
              </p>
              <p style="margin:18px 0 0;font-size:13px;line-height:1.5;color:#5b6777;">
                If you have any trouble accessing the course, reply to this email or contact
                <a href="mailto:info@vigitrust.com" style="color:#c62828;">info@vigitrust.com</a>.
              </p>
              <p style="margin:22px 0 0;font-size:14px;color:#0b1f3a;">
                Kind regards,<br />The VigiTrust team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends course access email after a successful Stripe payment.
 * No-ops (with a log) when Resend is not configured.
 */
export async function sendCourseAccessEmail(params: {
  to: string;
  firstName?: string;
  cartSlugs: string;
  orderRef: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const courses = resolvePurchasedCourses(params.cartSlugs);
  if (!courses.length) {
    return { sent: false, reason: "No course access links mapped for this cart." };
  }

  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping course access email.");
    return { sent: false, reason: "RESEND_API_KEY not configured." };
  }

  const to = params.to.trim().toLowerCase();
  const firstName = params.firstName?.trim() || "there";
  const subject =
    courses.length === 1
      ? `Your ${courses[0].title} course access`
      : "Your VigiTrust course access";

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject,
    html: buildEmailHtml({
      firstName,
      courses,
      orderRef: params.orderRef,
    }),
  });

  if (error) {
    console.error("[email] Resend send failed:", error);
    return { sent: false, reason: error.message };
  }

  console.info("[email] Course access email sent", { to, courses: courses.map((c) => c.slug) });
  return { sent: true };
}
