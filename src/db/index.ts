/**
 * Database client for PharmabuLink Africa
 * Uses Drizzle ORM with better-sqlite3 for local SQLite storage
 */

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("pharmalink.db");
export const db = drizzle(sqlite, { schema });
