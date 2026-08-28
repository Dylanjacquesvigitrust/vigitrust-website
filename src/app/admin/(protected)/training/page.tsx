import { prisma } from "@/lib/db";
import { AdminRetryProvisioningButton } from "@/components/admin/admin-retry-provisioning-button";
import { getCustomerCourseSummaries } from "@/lib/training-employees";

export const dynamic = "force-dynamic";

export default async function AdminTrainingPage() {
  const [customers, purchases, managers, allocations, assignments, reachGroups] =
    await Promise.all([
      prisma.customer.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.trainingPurchase.findMany({
        orderBy: { purchasedAt: "desc" },
        take: 100,
        include: { customer: true },
      }),
      prisma.managerAccount.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { customer: true },
      }),
      prisma.courseLicenceAllocation.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.trainingAssignment.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { employee: true },
      }),
      prisma.reachGroupMapping.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    ]);

  const summariesByCustomer = new Map<string, Awaited<ReturnType<typeof getCustomerCourseSummaries>>>();
  for (const c of customers) {
    summariesByCustomer.set(c.id, await getCustomerCourseSummaries(c.id));
  }

  return (
    <section className="section-pad">
      <div className="container-vt max-w-6xl space-y-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type-eyebrow text-vt-red">Admin</p>
            <h1 className="brand-display mt-2 text-3xl text-vt-ink">Training licences</h1>
          </div>
          <nav className="flex gap-3 text-sm">
            <a href="/admin/renewal-codes/" className="font-semibold text-vt-muted hover:text-vt-ink">
              Renewal codes
            </a>
            <span className="font-semibold text-vt-ink">Training</span>
          </nav>
        </div>

        <Section title="Customers" count={customers.length}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-vt-muted">
                <th className="py-2">Company</th>
                <th className="py-2">Email</th>
                <th className="py-2">Licence summary</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-vt-border">
                  <td className="py-2">{c.companyName ?? "—"}</td>
                  <td className="py-2">{c.billingEmail}</td>
                  <td className="py-2">
                    {(summariesByCustomer.get(c.id) ?? [])
                      .map((s) => `${s.courseTitle}: ${s.totalAssigned}/${s.totalPurchased}`)
                      .join("; ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Purchases" count={purchases.length}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-vt-muted">
                <th className="py-2">Date</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Session</th>
                <th className="py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-t border-vt-border">
                  <td className="py-2">{p.purchasedAt.toLocaleString()}</td>
                  <td className="py-2">{p.customer.companyName ?? p.purchaserEmail}</td>
                  <td className="py-2 font-mono text-xs">{p.stripeCheckoutSessionId}</td>
                  <td className="py-2">
                    {p.amountTotal != null ? `€${(p.amountTotal / 100).toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Managers" count={managers.length}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-vt-muted">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => (
                <tr key={m.id} className="border-t border-vt-border">
                  <td className="py-2">
                    {[m.firstName, m.lastName].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="py-2">{m.email}</td>
                  <td className="py-2 capitalize">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Licence allocations" count={allocations.length}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-vt-muted">
                <th className="py-2">Course</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Assigned</th>
                <th className="py-2">Reach group</th>
                <th className="py-2">Status</th>
                <th className="py-2">Error</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a) => (
                <tr key={a.id} className="border-t border-vt-border">
                  <td className="py-2">{a.courseTitle}</td>
                  <td className="py-2">{a.quantityPurchased}</td>
                  <td className="py-2">{a.quantityAssigned}</td>
                  <td className="py-2 font-mono text-xs">{a.reachGroupId ?? "—"}</td>
                  <td className="py-2">{a.provisioningStatus}</td>
                  <td className="py-2 text-xs text-vt-red">{a.provisioningError ?? ""}</td>
                  <td className="py-2">
                    {a.provisioningStatus === "failed" || a.provisioningStatus === "pending" ? (
                      <AdminRetryProvisioningButton allocationId={a.id} />
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Employees / assignments" count={assignments.length}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-vt-muted">
                <th className="py-2">Employee</th>
                <th className="py-2">Course</th>
                <th className="py-2">Licence</th>
                <th className="py-2">Training</th>
                <th className="py-2">Reach user</th>
                <th className="py-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-t border-vt-border">
                  <td className="py-2">
                    {a.employee.firstName} {a.employee.lastName} ({a.employee.email})
                  </td>
                  <td className="py-2">{a.courseSlug}</td>
                  <td className="py-2">{a.status}</td>
                  <td className="py-2">{a.trainingStatus}</td>
                  <td className="py-2 font-mono text-xs">{a.reachUserId ?? "—"}</td>
                  <td className="py-2 text-xs text-vt-red">{a.provisioningError ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Reach groups" count={reachGroups.length}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-vt-muted">
                <th className="py-2">Name</th>
                <th className="py-2">Course slug</th>
                <th className="py-2">Reach group ID</th>
              </tr>
            </thead>
            <tbody>
              {reachGroups.map((g) => (
                <tr key={g.id} className="border-t border-vt-border">
                  <td className="py-2">{g.reachGroupName}</td>
                  <td className="py-2">{g.courseSlug}</td>
                  <td className="py-2 font-mono text-xs">{g.reachGroupId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </section>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-vt-border">
      <h2 className="text-lg font-bold text-vt-ink">
        {title} <span className="text-sm font-normal text-vt-muted">({count})</span>
      </h2>
      <div className="mt-4 overflow-x-auto">{children}</div>
    </div>
  );
}
