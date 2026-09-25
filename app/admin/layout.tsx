import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Jika belum login ATAU role bukan ADMIN, langsung lempar ke /login
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <>{children}</>;
}