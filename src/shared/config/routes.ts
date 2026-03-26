import type { Route } from "next";

export const PATH = {
  ROOT: "/",
  AUTH: {
    ROOT: "/auth",
    SIGN_IN: "/auth/sign-in" as Route,
    SIGN_UP: "/auth/sign-up" as Route,
    FORGOT_PASSWORD: "/auth/forgot-password" as Route,
    RESET_PASSWORD: "/auth/reset-password" as Route,
    VERIFY_EMAIL: "/auth/verify-email" as Route,
  },
  ACCOUNT: {
    ROOT: "/account" as Route,
    SETTINGS: "/account" as Route,
  },
  STUDIO: {
    ROOT: "/studio" as Route,
  },
  SITE: {
    ROOT: "/" as Route,
  },
} as const;
