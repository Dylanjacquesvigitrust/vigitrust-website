import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  return <div className="min-h-[70vh] bg-vt-mist">{children}</div>;
}
