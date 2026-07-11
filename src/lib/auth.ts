/**
 * Auth helpers for PharmabuLink Africa.
 * Password hashing and admin credentials previously lived in the file-based
 * store. They are kept here so API routes can import them without depending on
 * the (now deprecated) file-based data store.
 */

import crypto from "crypto";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "pharmalink_salt").digest("hex");
}

// Hardcoded admin credentials.
// In production, store these in environment variables and use a proper secrets manager.
export const ADMIN_EMAIL = "admin@pharmalink.africa";
export const ADMIN_PASSWORD_HASH = hashPassword("PharmaAdmin2024!");
export const ADMIN_PHONE = "+254792965970";
