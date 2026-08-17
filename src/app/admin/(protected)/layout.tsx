import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <div className="min-h-[70vh] bg-vt-mist">{children}</div>;
}
