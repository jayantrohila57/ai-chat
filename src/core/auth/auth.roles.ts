export const APP_ROLE = {
  ADMIN: "admin",
  STAFF: "staff",
  USER: "user",
  CUSTOMER: "customer",
} as const;

export const APP_ROLES = [APP_ROLE.ADMIN, APP_ROLE.STAFF, APP_ROLE.USER, APP_ROLE.CUSTOMER] as const;

export type AppRole = (typeof APP_ROLES)[number];

const LEGACY_ROLE_MAP: Record<string, AppRole> = {
  admin: APP_ROLE.ADMIN,
  staff: APP_ROLE.STAFF,
  user: APP_ROLE.USER,
  customer: APP_ROLE.CUSTOMER,
};

export function normalizeRole(role: string | null | undefined): AppRole {
  if (!role) return APP_ROLE.USER;
  return LEGACY_ROLE_MAP[role] ?? APP_ROLE.USER;
}

export function resolveNewUserRole(role: string | null | undefined): AppRole {
  return normalizeRole(role);
}

export const ROLE_GUARD = {
  admin: [APP_ROLE.ADMIN],
  staff: [APP_ROLE.ADMIN, APP_ROLE.STAFF],
  customer: [APP_ROLE.ADMIN, APP_ROLE.STAFF, APP_ROLE.USER, APP_ROLE.CUSTOMER],
} as const;

export function roleCanAccessStudio(role: AppRole): boolean {
  return role === APP_ROLE.ADMIN || role === APP_ROLE.STAFF;
}
