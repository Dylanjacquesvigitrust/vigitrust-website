import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/renewal-codes");
  }

  return (
    <section className="section-pad">
      <div className="container-vt max-w-md rounded-2xl bg-white p-8 ring-1 ring-vt-border">
        <p className="type-eyebrow text-vt-red">Admin</p>
        <h1 className="brand-display mt-2 text-2xl text-vt-ink">Sign in</h1>
        <p className="mt-2 text-sm text-vt-muted">
          Access renewal codes generated from Stripe payments.
        </p>
        <LoginForm />
      </div>
    </section>
  );
}
