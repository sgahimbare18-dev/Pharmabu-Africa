/**
 * Simple file-based data store for PharmaLink Africa.
 * Uses a JSON file in /tmp for persistence across requests in development.
 * In production, replace with a real database (PostgreSQL via Drizzle or Prisma).
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PHARMACIES_FILE = path.join(DATA_DIR, "pharmacies.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filePath: string): T[] {
  ensureDataDir();
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T[];
  } catch {
    return [];
  }
}

function writeJSON<T>(filePath: string, data: T[]) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "pharmalink_salt").digest("hex");
}

// ─── User (Patient) ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: "kenya" | "burundi";
  passwordHash: string;
  role: "patient";
  createdAt: string;
}

export function getUsers(): User[] {
  return readJSON<User>(USERS_FILE);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: Omit<User, "id" | "createdAt">): User {
  const users = getUsers();
  const user: User = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeJSON(USERS_FILE, users);
  return user;
}

// ─── Pharmacy ─────────────────────────────────────────────────────────────────

export interface Pharmacy {
  id: string;
  pharmacyName: string;
  pharmacistName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  country: "kenya" | "burundi";
  city: string;
  address: string;
  passwordHash: string;
  role: "pharmacy";
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

export function getPharmacies(): Pharmacy[] {
  return readJSON<Pharmacy>(PHARMACIES_FILE);
}

export function getPharmacyByEmail(email: string): Pharmacy | undefined {
  return getPharmacies().find((p) => p.email.toLowerCase() === email.toLowerCase());
}

export function createPharmacy(data: Omit<Pharmacy, "id" | "createdAt" | "status">): Pharmacy {
  const pharmacies = getPharmacies();
  const pharmacy: Pharmacy = {
    ...data,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  pharmacies.push(pharmacy);
  writeJSON(PHARMACIES_FILE, pharmacies);
  return pharmacy;
}
