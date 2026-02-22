/**
 * Migration script for PharmabuLink Africa
 * This runs migrations to create the database schema
 */

import { runMigrations } from "@kilocode/app-builder-db";
import { db } from "./index";

await runMigrations(db, {}, { migrationsFolder: "./src/db/migrations" });
