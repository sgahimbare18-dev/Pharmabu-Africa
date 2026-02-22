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
  // Pharmacist professional credentials
  licenseNumber: string;           // e.g. PPB/2024/XXXXX (Kenya Pharmacy & Poisons Board)
  pharmacistQualification: string; // e.g. "Bachelor of Pharmacy (B.Pharm)"
  pharmacistUniversity: string;    // e.g. "University of Nairobi"
  pharmacistGraduationYear: string; // e.g. "2018"
  // Pharmacy business registration
  pharmacyRegNumber: string;       // Official pharmacy/business registration number
  pharmacyRegAuthority: string;    // e.g. "Kenya Pharmacy & Poisons Board", "ARCOS Burundi"
  pharmacyRegExpiry: string;       // Expiry date of pharmacy registration (YYYY-MM-DD)
  // Location
  country: "kenya" | "burundi";
  city: string;
  address: string;
  // Additional info
  operatingHours: string;          // e.g. "Mon-Fri 8am-8pm, Sat 9am-5pm"
  servicesOffered: string;         // e.g. "Dispensing, Telepharmacy, Delivery"
  // Uploaded credential documents (file paths)
  licenseDocument: string;        // Path to pharmacist license document
  qualificationDocument: string;  // Path to qualification certificate
  pharmacyRegDocument: string;    // Path to pharmacy registration certificate
  // Auth
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

export function getPharmacyById(id: string): Pharmacy | undefined {
  return getPharmacies().find((p) => p.id === id);
}

export function updatePharmacyStatus(
  id: string,
  status: "verified" | "rejected"
): Pharmacy | null {
  const pharmacies = getPharmacies();
  const idx = pharmacies.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  pharmacies[idx].status = status;
  writeJSON(PHARMACIES_FILE, pharmacies);
  return pharmacies[idx];
}

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * Hardcoded admin credentials.
 * In production, store these in environment variables and use a proper secrets manager.
 */
export const ADMIN_EMAIL = "admin@pharmalink.africa";
export const ADMIN_PASSWORD_HASH = hashPassword("PharmaAdmin2024!");
