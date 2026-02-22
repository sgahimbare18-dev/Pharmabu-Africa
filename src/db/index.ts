/**
 * Database client for PharmabuLink Africa
 * Uses Drizzle ORM with app-builder-db for persistence
 */

import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

export const db = createDatabase(schema);
