import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg'; // Changed from @neondatabase/serverless
import { drizzle } from 'drizzle-orm/node-postgres'; // Changed from neon-serverless
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
     ssl: process.env.DATABASE_URL.includes('render.com')
    ? { rejectUnauthorized: false }
    : false,
 });
export const db = drizzle(pool, { schema });
