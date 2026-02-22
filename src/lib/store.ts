/**
 * Simple file-based data store for PharmaLink Africa.
 * Uses a JSON file in /tmp for persistence across requests in development.
 * In production, replace with a real database (PostgreSQL via Drizzle or Prisma).
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PHARMACIES_FILE = path.join(DATA_DIR, "pharmacies.json");
const MEDICATIONS_FILE = path.join(DATA_DIR, "medications.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

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

// ─── Medication ───────────────────────────────────────────────────────────────

export interface Medication {
  id: string;
  pharmacyId: string;
  name: string;
  genericName: string;          // Generic/chemical name
  description: string;          // What the medication does
  whatItCures: string;         // Conditions it treats
  dosage: string;               // e.g. "500mg tablets"
  usageInstructions: string;   // How to take it
  sideEffects: string;          // Common side effects
  price: number;               // Price in KES/BIF
  stock: number;                // Available quantity
  category: string;             // e.g. "Pain Relief", "Antibiotics", etc.
  imageUrl: string;            // Optional image
  requiresPrescription: boolean;
  status: "active" | "inactive" | "out_of_stock";
  createdAt: string;
  updatedAt: string;
}

export function getMedications(): Medication[] {
  return readJSON<Medication>(MEDICATIONS_FILE);
}

export function getMedicationById(id: string): Medication | undefined {
  return getMedications().find((m) => m.id === id);
}

export function getMedicationsByPharmacy(pharmacyId: string): Medication[] {
  return getMedications().filter((m) => m.pharmacyId === pharmacyId);
}

export function getActiveMedications(): Medication[] {
  return getMedications().filter((m) => m.status === "active" && m.stock > 0);
}

export function createMedication(data: Omit<Medication, "id" | "createdAt" | "updatedAt" | "status">): Medication {
  const medications = getMedications();
  const medication: Medication = {
    ...data,
    id: crypto.randomUUID(),
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  medications.push(medication);
  writeJSON(MEDICATIONS_FILE, medications);
  return medication;
}

export function updateMedication(id: string, data: Partial<Medication>): Medication | null {
  const medications = getMedications();
  const idx = medications.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  medications[idx] = {
    ...medications[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(MEDICATIONS_FILE, medications);
  return medications[idx];
}

export function deleteMedication(id: string): boolean {
  const medications = getMedications();
  const filtered = medications.filter((m) => m.id !== id);
  if (filtered.length === medications.length) return false;
  writeJSON(MEDICATIONS_FILE, filtered);
  return true;
}

// ─── Order/Consultation ──────────────────────────────────────────────────────

export type OrderStatus = "pending" | "consulting" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

export interface Order {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  pharmacyId: string;
  pharmacyName: string;
  medicationId: string;
  medicationName: string;
  medicationPrice: number;
  quantity: number;
  totalPrice: number;
  symptoms: string;              // Patient's symptoms/consultation reason
  pharmacyNotes: string;        // Pharmacist's notes/advice
  status: OrderStatus;
  paymentMethod: "pay_on_delivery";
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}

export function getOrders(): Order[] {
  return readJSON<Order>(ORDERS_FILE);
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function getOrdersByPatient(patientId: string): Order[] {
  return getOrders().filter((o) => o.patientId === patientId);
}

export function getOrdersByPharmacy(pharmacyId: string): Order[] {
  return getOrders().filter((o) => o.pharmacyId === pharmacyId);
}

export function getPendingConsultations(pharmacyId: string): Order[] {
  return getOrdersByPharmacy(pharmacyId).filter(
    (o) => o.status === "pending" || o.status === "consulting"
  );
}

export function createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt" | "status" | "pharmacyNotes">): Order {
  const orders = getOrders();
  const order: Order = {
    ...data,
    id: crypto.randomUUID(),
    status: "pending",
    pharmacyNotes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(order);
  writeJSON(ORDERS_FILE, orders);
  return order;
}

export function updateOrder(id: string, data: Partial<Order>): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = {
    ...orders[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(ORDERS_FILE, orders);
  return orders[idx];
}

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * Hardcoded admin credentials.
 * In production, store these in environment variables and use a proper secrets manager.
 */
export const ADMIN_EMAIL = "admin@pharmalink.africa";
export const ADMIN_PASSWORD_HASH = hashPassword("PharmaAdmin2024!");

// ─── Messages (Pharmacy to Admin) ─────────────────────────────────────────────

export interface Message {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacistName: string;
  subject: string;
  content: string;
  status: "unread" | "read" | "responded";
  type: "deletion_request" | "general";
  createdAt: string;
}

export function getMessages(): Message[] {
  return readJSON<Message>(MESSAGES_FILE);
}

export function getMessageById(id: string): Message | undefined {
  return getMessages().find((m) => m.id === id);
}

export function getMessagesByPharmacy(pharmacyId: string): Message[] {
  return getMessages().filter((m) => m.pharmacyId === pharmacyId);
}

export function getUnreadMessagesCount(): number {
  return getMessages().filter((m) => m.status === "unread").length;
}

export function createMessage(data: Omit<Message, "id" | "status" | "createdAt">): Message {
  const messages = getMessages();
  const message: Message = {
    ...data,
    id: crypto.randomUUID(),
    status: "unread",
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  writeJSON(MESSAGES_FILE, messages);
  return message;
}

export function updateMessageStatus(id: string, status: "unread" | "read" | "responded"): Message | null {
  const messages = getMessages();
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  messages[idx].status = status;
  writeJSON(MESSAGES_FILE, messages);
  return messages[idx];
}

// Delete a document file from the filesystem
export function deleteDocumentFile(filePath: string): boolean {
  try {
    // Handle both absolute and relative paths
    const fullPath = filePath.startsWith("/") 
      ? path.join(process.cwd(), "public", filePath)
      : path.join(UPLOADS_DIR, filePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Clear pharmacy documents (called by admin when processing deletion requests)
export function clearPharmacyDocuments(pharmacyId: string): Pharmacy | null {
  const pharmacies = getPharmacies();
  const idx = pharmacies.findIndex((p) => p.id === pharmacyId);
  if (idx === -1) return null;
  
  // Delete the actual files
  if (pharmacies[idx].licenseDocument) {
    deleteDocumentFile(pharmacies[idx].licenseDocument);
  }
  if (pharmacies[idx].qualificationDocument) {
    deleteDocumentFile(pharmacies[idx].qualificationDocument);
  }
  if (pharmacies[idx].pharmacyRegDocument) {
    deleteDocumentFile(pharmacies[idx].pharmacyRegDocument);
  }
  
  // Clear the document paths in the database
  pharmacies[idx].licenseDocument = "";
  pharmacies[idx].qualificationDocument = "";
  pharmacies[idx].pharmacyRegDocument = "";
  
  writeJSON(PHARMACIES_FILE, pharmacies);
  return pharmacies[idx];
}
