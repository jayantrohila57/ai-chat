import "server-only";

export const serverEnv = {
  NODE_ENV: String(process.env.NODE_ENV),
  PORT: Number(process.env.PORT),
  VERCEL_URL: String(process.env.VERCEL_URL),
  SKIP_ENV_VALIDATION: Boolean(process.env.SKIP_ENV_VALIDATION),
  USE_DEBUG_LOGS: Boolean(process.env.USE_DEBUG_LOGS),
  BETTER_AUTH_SECRET: String(process.env.BETTER_AUTH_SECRET),
  BETTER_AUTH_URL: String(process.env.BETTER_AUTH_URL),
  GITHUB_CLIENT_ID: String(process.env.GITHUB_CLIENT_ID),
  GITHUB_CLIENT_SECRET: String(process.env.GITHUB_CLIENT_SECRET),
  RESEND_API_KEY: String(process.env.RESEND_API_KEY),
  RESEND_FROM_EMAIL: String(process.env.RESEND_FROM_EMAIL),
  VERCEL: Number(process.env.VERCEL),
  DATABASE_URL: String(process.env.DATABASE_URL),
  ARKJET_API_KEY: String(process.env.ARKJET_API_KEY),
  BLOB_READ_WRITE_TOKEN: String(process.env.BLOB_READ_WRITE_TOKEN),
};
