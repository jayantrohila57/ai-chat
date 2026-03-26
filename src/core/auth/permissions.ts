import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";
import { APP_ROLE } from "./auth.roles";

const statement = {
  ...defaultStatements,
  workspace: ["read", "manage"],
  profile: ["read", "update"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  ...userAc.statements,
  profile: ["read", "update"],
});

export const customer = ac.newRole({
  ...userAc.statements,
  profile: ["read", "update"],
});

export const staff = ac.newRole({
  ...userAc.statements,
  workspace: ["read", "manage"],
  profile: ["read", "update"],
  user: ["list", "get", "update"],
});

export const admin = ac.newRole(adminAc.statements);

export const ROLE_KEY = {
  ADMIN: APP_ROLE.ADMIN,
  STAFF: APP_ROLE.STAFF,
  USER: APP_ROLE.USER,
  CUSTOMER: APP_ROLE.CUSTOMER,
} as const;
