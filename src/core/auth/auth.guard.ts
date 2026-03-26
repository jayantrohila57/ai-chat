import { type AppRole, normalizeRole, ROLE_GUARD } from "./auth.roles";

export type GuardType = keyof typeof ROLE_GUARD;

export function canUseGuard(guard: GuardType, role: string | null | undefined): boolean {
  const normalized = normalizeRole(role);
  const allowedRoles = ROLE_GUARD[guard] as readonly AppRole[];
  return allowedRoles.includes(normalized);
}

export function ensureRole(guard: GuardType, role: string | null | undefined): AppRole {
  const normalized = normalizeRole(role);
  if (!canUseGuard(guard, normalized)) {
    throw new Error(`Forbidden for role: ${normalized}`);
  }
  return normalized;
}
