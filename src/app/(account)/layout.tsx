import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { PATH } from "@/shared/config/routes";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  return children;
}
