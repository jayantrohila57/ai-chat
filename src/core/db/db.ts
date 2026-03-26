import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { serverEnv } from "@/shared/config/env.server";
import * as schema from "./db.schema";

const pool = new Pool({ connectionString: serverEnv.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
