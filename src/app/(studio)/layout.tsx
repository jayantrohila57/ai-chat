import { redirect } from "next/navigation";
import { normalizeRole, roleCanAccessStudio } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { PATH } from "@/shared/config/routes";

export default async function Layout({ children }: LayoutProps<"/">) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  const role = normalizeRole(user?.role);
  if (!roleCanAccessStudio(role)) {
    return redirect(PATH.SITE.ROOT);
  }

  return children;
}
