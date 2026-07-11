/**
 * Migration script for PharmabuLink Africa
 * This runs migrations to create the database schema
 */

import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "./schema";

const db = drizzle("pharmalink.db", { schema });

await migrate(db, { migrationsFolder: "./src/db/migrations" });

console.log("Migrations completed successfully");
