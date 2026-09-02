import { RenewalCodesAdmin } from "@/components/admin/renewal-codes-admin";

export default function AdminRenewalCodesPage() {
  return (
    <section className="section-pad">
      <div className="container-vt max-w-6xl">
        <div className="mb-8">
          <p className="type-eyebrow text-vt-red">Admin</p>
          <h1 className="brand-display mt-2 text-3xl text-vt-ink">Renewal codes</h1>
          <p className="mt-2 max-w-2xl text-sm text-vt-muted">
            Codes are created automatically after a successful Stripe payment. You can also
            add one manually, search records, and attach the external renewal/reference ID
            used on the other platform.
          </p>
        </div>
        <RenewalCodesAdmin />
      </div>
    </section>
  );
}
