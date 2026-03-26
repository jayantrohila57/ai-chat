import { APP_ROLE, normalizeRole } from "./auth.roles";
import { getServerSession } from "./auth.server";

export async function requireStudioAccess() {
  const { session, user } = await getServerSession();
  const role = normalizeRole(user?.role);
  const isStaffOrAdmin = role === APP_ROLE.ADMIN || role === APP_ROLE.STAFF;

  return {
    session,
    user,
    role,
    isStaffOrAdmin,
  };
}
