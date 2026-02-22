/**
 * Migration script for PharmabuLink Africa
 * This runs migrations to create the database schema
 */

import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("pharmalink.db");
const db = drizzle(sqlite, { schema });

await migrate(db, { migrationsFolder: "./src/db/migrations" });

console.log("Migrations completed successfully");
