import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();
  if (user?.role !== "Admin") return redirect("/dashboard");
  return <>{children}</>;
}
