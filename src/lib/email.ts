import { Resend } from "resend";
import { training } from "@/content/courses";

const OPS_ORDER_EMAIL =
  process.env.OPS_ORDER_EMAIL?.trim().toLowerCase() || "dylan.jacques@vigitrust.com";

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Course slug → Reach share URL (env overrides). */
const COURSE_ACCESS_LINKS: Record<string, string> = {
  "gdpr-fundamentals":
    process.env.COURSE_LINK_GDPR_FUNDAMENTALS?.trim() ||
    "https://vigitrust-9067.reach360.com/share/course/6720ac09-68d9-404c-9204-e522ae19af3b",
  "payment-card-security-pci":
    process.env.COURSE_LINK_PCI_INTRO?.trim() ||
    "https://vigitrust-9067.reach360.com/share/course/4aa3d474-560a-4e36-9b8b-70395b948d7d",
  "introduction-to-pci-dss":
    process.env.COURSE_LINK_PCI_DSS_INTRO?.trim() ||
    "https://vigitrust-9067.reach360.com/share/course/cf8b73f3-2ad1-46c7-b635-81fc743de401",
  "cybersecurity-fundamentals":
    process.env.COURSE_LINK_CYBERSECURITY_FUNDAMENTALS?.trim() ||
    "https://vigitrust-9067.reach360.com/share/course/b158aa49-7830-46c9-b63b-7d0b9ceaeecd",
  "secure-coding":
    process.env.COURSE_LINK_SECURE_CODING?.trim() ||
    "https://vigitrust-9067.reach360.com/share/course/2d701c03-823f-4e06-8ee7-92db22576541",
};

export type PurchaseEmailCourse = {
  slug: string;
  title: string;
  url: string;
  quantity: number;
};

export type OrderLine = {
  slug: string;
  title: string;
  quantity: number;
  url?: string;
};

/** Parse `slug:qty|slug:qty` from checkout metadata. */
export function parseCartSummary(cartSummary: string): Array<{ slug: string; quantity: number }> {
  return cartSummary
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [slug, qtyStr] = part.split(":");
      const quantity = Number.parseInt(qtyStr ?? "1", 10);
      return {
        slug: (slug ?? "").trim(),
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      };
    })
    .filter((l) => l.slug);
}

export async function resolveOrderLines(params: {
  cartSummary?: string;
  cartSlugs?: string;
}): Promise<OrderLine[]> {
  const bySlug = new Map(training.courses.map((c) => [c.slug, c]));

  let parsed = params.cartSummary ? parseCartSummary(params.cartSummary) : [];
  if (!parsed.length && params.cartSlugs) {
    parsed = params.cartSlugs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((slug) => ({ slug, quantity: 1 }));
  }

  return parsed.map(({ slug, quantity }) => {
    const course = bySlug.get(slug);
    return {
      slug,
      title: course?.title ?? slug,
      quantity,
      url: COURSE_ACCESS_LINKS[slug],
    };
  });
}

export function totalOrderQuantity(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

function buildCourseAccessHtml(params: {
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

/** Single-seat purchase: email customer the Reach course link. */
export async function sendCourseAccessEmail(params: {
  to: string;
  firstName?: string;
  lines: OrderLine[];
  orderRef: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const courses: PurchaseEmailCourse[] = params.lines
    .filter((l) => l.url)
    .map((l) => ({
      slug: l.slug,
      title: l.title,
      url: l.url!,
      quantity: l.quantity,
    }));

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
    html: buildCourseAccessHtml({
      firstName,
      courses,
      orderRef: params.orderRef,
    }),
  });

  if (error) {
    console.error("[email] Course access send failed:", error);
    return { sent: false, reason: error.message };
  }

  console.info("[email] Course access email sent", { to, courses: courses.map((c) => c.slug) });
  return { sent: true };
}

/** Multi-seat / bulk purchase: notify VigiTrust ops to provision in Reach manually. */
export async function sendBulkOrderOpsEmail(params: {
  lines: OrderLine[];
  orderRef: string;
  customerEmail: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  amountTotal?: number | null;
  currency?: string | null;
}): Promise<{ sent: boolean; reason?: string }> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping ops order email.");
    return { sent: false, reason: "RESEND_API_KEY not configured." };
  }

  const totalQty = totalOrderQuantity(params.lines);
  const name = [params.firstName, params.lastName].filter(Boolean).join(" ") || "—";
  const amount =
    params.amountTotal != null
      ? `${(params.amountTotal / 100).toFixed(2)} ${(params.currency ?? "eur").toUpperCase()}`
      : "—";

  const lineRows = params.lines
    .map(
      (l) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #e6ebf1;">${escapeHtml(l.title)}</td>
          <td style="padding:8px;border-bottom:1px solid #e6ebf1;">${escapeHtml(l.slug)}</td>
          <td style="padding:8px;border-bottom:1px solid #e6ebf1;text-align:right;">${l.quantity}</td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f7fa;font-family:Segoe UI,Arial,sans-serif;">
<table role="presentation" width="100%" style="background:#f5f7fa;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:640px;background:#fff;border-radius:12px;padding:28px;border:1px solid #e6ebf1;">
<tr><td>
<p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#c62828;font-weight:700;">VigiTrust ops</p>
<h1 style="margin:10px 0 0;font-size:22px;color:#0b1f3a;">Bulk training order — manual Reach setup</h1>
<p style="margin:14px 0 0;font-size:15px;line-height:1.55;color:#334155;">
A customer purchased <strong>${totalQty}</strong> course seat(s). Create their Reach group, assign the course(s), and give them manager/login access.
</p>
<table role="presentation" width="100%" style="margin-top:18px;font-size:14px;color:#334155;">
<tr><td style="padding:6px 0;width:140px;color:#5b6777;">Customer</td><td>${escapeHtml(name)}</td></tr>
<tr><td style="padding:6px 0;color:#5b6777;">Email</td><td>${escapeHtml(params.customerEmail)}</td></tr>
<tr><td style="padding:6px 0;color:#5b6777;">Company</td><td>${escapeHtml(params.company?.trim() || "—")}</td></tr>
<tr><td style="padding:6px 0;color:#5b6777;">Phone</td><td>${escapeHtml(params.phone?.trim() || "—")}</td></tr>
<tr><td style="padding:6px 0;color:#5b6777;">Amount</td><td>${escapeHtml(amount)}</td></tr>
<tr><td style="padding:6px 0;color:#5b6777;">Order</td><td style="font-family:monospace;font-size:12px;">${escapeHtml(params.orderRef)}</td></tr>
</table>
<table role="presentation" width="100%" style="margin-top:20px;border-collapse:collapse;font-size:14px;">
<thead>
<tr style="text-align:left;color:#5b6777;">
<th style="padding:8px;border-bottom:2px solid #e6ebf1;">Course</th>
<th style="padding:8px;border-bottom:2px solid #e6ebf1;">Slug</th>
<th style="padding:8px;border-bottom:2px solid #e6ebf1;text-align:right;">Qty</th>
</tr>
</thead>
<tbody>${lineRows}</tbody>
</table>
</td></tr></table></td></tr></table></body></html>`;

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: OPS_ORDER_EMAIL,
    subject: `Bulk order: ${totalQty} seat(s) — ${params.company?.trim() || params.customerEmail}`,
    html,
  });

  if (error) {
    console.error("[email] Ops bulk order send failed:", error);
    return { sent: false, reason: error.message };
  }

  console.info("[email] Ops bulk order email sent", { to: OPS_ORDER_EMAIL, orderRef: params.orderRef });
  return { sent: true };
}
