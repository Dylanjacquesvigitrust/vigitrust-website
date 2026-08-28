import { redirect } from "next/navigation";
import { getManagerSession } from "@/lib/manager-auth";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getManagerSession();
  if (!session) {
    redirect("/manager/login/");
  }
  return <>{children}</>;
}
