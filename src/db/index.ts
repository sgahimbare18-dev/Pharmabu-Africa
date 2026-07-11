/**
 * Database client for PharmabuLink Africa
 * Uses Drizzle ORM with Bun SQLite
 */

import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

export const db = drizzle("pharmalink.db", { schema });
