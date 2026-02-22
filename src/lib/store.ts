/**
 * Simple file-based data store for PharmabuLink Africa.
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
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Failed to create data directory:", err);
  }
}

function readJSON<T>(filePath: string): T[] {
  ensureDataDir();
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data ? JSON.parse(data) as T[] : [];
  } catch (err) {
    console.error("Failed to read JSON file:", filePath, err);
    return [];
  }
}

function writeJSON<T>(filePath: string, data: T[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write JSON file:", filePath, err);
  }
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

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function deleteUserById(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  writeJSON(USERS_FILE, filtered);
  return true;
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

export function deletePharmacy(id: string): boolean {
  const pharmacies = getPharmacies();
  const filtered = pharmacies.filter((p) => p.id !== id);
  if (filtered.length === pharmacies.length) return false;
  writeJSON(PHARMACIES_FILE, filtered);
  return true;
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

export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  writeJSON(ORDERS_FILE, filtered);
  return true;
}

// ─── Pharmacy Subscription (Monthly Payments) ─────────────────────────────────

export interface Subscription {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyCity: string;
  subscriptionType: "monthly";
  monthlyAmount: number;
  deliveryAddress: string;
  status: "active" | "paused" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, "subscriptions.json");

export function getSubscriptions(): Subscription[] {
  return readJSON<Subscription>(SUBSCRIPTIONS_FILE);
}

export function getSubscriptionById(id: string): Subscription | undefined {
  return getSubscriptions().find((s) => s.id === id);
}

export function getSubscriptionsByPatient(patientId: string): Subscription[] {
  return getSubscriptions().filter((s) => s.patientId === patientId);
}

export function getSubscriptionsByPharmacy(pharmacyId: string): Subscription[] {
  return getSubscriptions().filter((s) => s.pharmacyId === pharmacyId);
}

export function getActiveSubscriptionsByPatient(patientId: string): Subscription[] {
  return getSubscriptionsByPatient(patientId).filter((s) => s.status === "active");
}

export function createSubscription(data: Omit<Subscription, "id" | "createdAt" | "updatedAt" | "status">): Subscription {
  const subscriptions = getSubscriptions();
  const subscription: Subscription = {
    ...data,
    id: crypto.randomUUID(),
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  subscriptions.push(subscription);
  writeJSON(SUBSCRIPTIONS_FILE, subscriptions);
  return subscription;
}

export function updateSubscription(id: string, data: Partial<Subscription>): Subscription | null {
  const subscriptions = getSubscriptions();
  const idx = subscriptions.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  subscriptions[idx] = {
    ...subscriptions[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(SUBSCRIPTIONS_FILE, subscriptions);
  return subscriptions[idx];
}

export function cancelSubscription(id: string): Subscription | null {
  return updateSubscription(id, { status: "cancelled" });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * Hardcoded admin credentials.
 * In production, store these in environment variables and use a proper secrets manager.
 */
export const ADMIN_EMAIL = "admin@pharmalink.africa";
export const ADMIN_PASSWORD_HASH = hashPassword("PharmaAdmin2024!");
export const ADMIN_PHONE = "+254792965970";
export const PLATFORM_FEE_PERCENT = 8; // 8% platform fee

// Currency exchange rates to KES (simulated - in production use a real API)
export const EXCHANGE_RATES: Record<string, number> = {
  KES: 1,        // Kenyan Shilling
  USD: 157.50,   // US Dollar to KES
  EUR: 168.75,   // Euro to KES
  GBP: 198.50,   // British Pound to KES
  BIF: 0.053,    // Burundian Franc to KES
  UGX: 0.042,    // Ugandan Shilling to KES
  TZS: 0.060,    // Tanzanian Shilling to KES
  RWF: 0.112,    // Rwandan Franc to KES
};

export type SupportedCurrency = keyof typeof EXCHANGE_RATES;

export function convertToKES(amount: number, currency: SupportedCurrency): number {
  return amount * EXCHANGE_RATES[currency];
}

// ─── Payment ──────────────────────────────────────────────────────────────────────

export type PaymentMethod = "mpesa" | "airtel_money" | "mobile_money_bi" | "card" | "paypal";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  pharmacyId: string;
  pharmacyName: string;
  medicationName: string;
  quantity: number;
  originalAmount: number;
  originalCurrency: SupportedCurrency;
  exchangeRate: number;
  amountInKES: number;
  platformFee: number;
  pharmacyPayout: number;
  adminPhone: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  status: PaymentStatus;
  paymentMessage: string; // Message sent to patient after payment
  payoutStatus: "pending" | "sent" | "failed";
  payoutReference: string;
  createdAt: string;
  updatedAt: string;
}

const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");

export function getPayments(): Payment[] {
  return readJSON<Payment>(PAYMENTS_FILE);
}

export function getPaymentById(id: string): Payment | undefined {
  return getPayments().find((p) => p.id === id);
}

export function getPaymentByOrderId(orderId: string): Payment | undefined {
  return getPayments().find((p) => p.orderId === orderId);
}

export function getPaymentsByPatient(patientId: string): Payment[] {
  return getPayments().filter((p) => p.patientId === patientId);
}

export function getPaymentsByPharmacy(pharmacyId: string): Payment[] {
  return getPayments().filter((p) => p.pharmacyId === pharmacyId);
}

export function getCompletedPayments(): Payment[] {
  return getPayments().filter((p) => p.status === "completed");
}

export function getPendingPayouts(): Payment[] {
  return getPayments().filter((p) => p.status === "completed" && p.payoutStatus === "pending");
}

export function createPayment(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Payment {
  const payments = getPayments();
  const payment: Payment = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  payments.push(payment);
  writeJSON(PAYMENTS_FILE, payments);
  return payment;
}

export function updatePayment(id: string, data: Partial<Payment>): Payment | null {
  const payments = getPayments();
  const idx = payments.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  payments[idx] = {
    ...payments[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(PAYMENTS_FILE, payments);
  return payments[idx];
}

export function processPayment(
  orderId: string,
  amount: number,
  currency: SupportedCurrency,
  paymentMethod: PaymentMethod,
  patientData: { id: string; name: string; phone: string },
  pharmacyData: { id: string; name: string },
  medicationData: { name: string; quantity: number }
): Payment {
  const amountInKES = convertToKES(amount, currency);
  const platformFee = (amountInKES * PLATFORM_FEE_PERCENT) / 100;
  const pharmacyPayout = amountInKES - platformFee;
  
  const paymentReference = `PL${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  return createPayment({
    orderId,
    patientId: patientData.id,
    patientName: patientData.name,
    patientPhone: patientData.phone,
    pharmacyId: pharmacyData.id,
    pharmacyName: pharmacyData.name,
    medicationName: medicationData.name,
    quantity: medicationData.quantity,
    originalAmount: amount,
    originalCurrency: currency,
    exchangeRate: EXCHANGE_RATES[currency],
    amountInKES,
    platformFee,
    pharmacyPayout,
    adminPhone: ADMIN_PHONE,
    paymentMethod,
    paymentReference,
    status: "completed",
    paymentMessage: `Payment received! You paid ${amount} ${currency} (${amountInKES.toFixed(2)} KES) for ${medicationData.name}. Your medication will be prepared by ${pharmacyData.name}. Thank you for using PharmabuLink Africa!`,
    payoutStatus: "pending",
    payoutReference: "",
  });
}

export function updatePayoutStatus(
  paymentId: string,
  payoutStatus: "sent" | "failed",
  payoutReference: string
): Payment | null {
  return updatePayment(paymentId, {
    payoutStatus,
    payoutReference,
  });
}

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

// ─── Patient Profile (Extended Info) ──────────────────────────────────────────

export interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth: string;
  age: number;
  gender: "male" | "female" | "other";
  address: string;
  city: string;
  country: "kenya" | "burundi";
  occupation: string;
  educationLevel: string;
  profilePicture: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalNotes: string;
  allergies: string;
  createdAt: string;
  updatedAt: string;
}

const PATIENT_PROFILES_FILE = path.join(DATA_DIR, "patient_profiles.json");

export function getPatientProfiles(): PatientProfile[] {
  return readJSON<PatientProfile>(PATIENT_PROFILES_FILE);
}

export function getPatientProfileByUserId(userId: string): PatientProfile | undefined {
  return getPatientProfiles().find((p) => p.userId === userId);
}

export function getPatientProfileById(id: string): PatientProfile | undefined {
  return getPatientProfiles().find((p) => p.id === id);
}

export function createPatientProfile(data: Omit<PatientProfile, "id" | "createdAt" | "updatedAt">): PatientProfile {
  const profiles = getPatientProfiles();
  const profile: PatientProfile = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  profiles.push(profile);
  writeJSON(PATIENT_PROFILES_FILE, profiles);
  return profile;
}

export function updatePatientProfile(id: string, data: Partial<PatientProfile>): PatientProfile | null {
  const profiles = getPatientProfiles();
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  profiles[idx] = {
    ...profiles[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(PATIENT_PROFILES_FILE, profiles);
  return profiles[idx];
}

export function deletePatientProfile(id: string): boolean {
  const profiles = getPatientProfiles();
  const filtered = profiles.filter((p) => p.id !== id);
  if (filtered.length === profiles.length) return false;
  writeJSON(PATIENT_PROFILES_FILE, filtered);
  return true;
}

// ─── Pharmacy Staff ───────────────────────────────────────────────────────────

export interface PharmacyStaff {
  id: string;
  pharmacyId: string;
  name: string;
  email: string;
  phone: string;
  role: "pharmacist" | "assistant" | "technician" | "delivery" | "counselor";
  qualification: string;
  licenseNumber: string;
  isActive: boolean;
  passwordHash: string;
  createdAt: string;
}

const PHARMACY_STAFF_FILE = path.join(DATA_DIR, "pharmacy_staff.json");

export function getPharmacyStaff(): PharmacyStaff[] {
  return readJSON<PharmacyStaff>(PHARMACY_STAFF_FILE);
}

export function getPharmacyStaffByPharmacy(pharmacyId: string): PharmacyStaff[] {
  return getPharmacyStaff().filter((s) => s.pharmacyId === pharmacyId);
}

export function getPharmacyStaffById(id: string): PharmacyStaff | undefined {
  return getPharmacyStaff().find((s) => s.id === id);
}

export function getPharmacyStaffByEmail(email: string): PharmacyStaff | undefined {
  return getPharmacyStaff().find((s) => s.email.toLowerCase() === email.toLowerCase());
}

export function createPharmacyStaff(data: Omit<PharmacyStaff, "id" | "createdAt" | "isActive">): PharmacyStaff {
  const staff = getPharmacyStaff();
  const newStaff: PharmacyStaff = {
    ...data,
    id: crypto.randomUUID(),
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  staff.push(newStaff);
  writeJSON(PHARMACY_STAFF_FILE, staff);
  return newStaff;
}

export function updatePharmacyStaff(id: string, data: Partial<PharmacyStaff>): PharmacyStaff | null {
  const staff = getPharmacyStaff();
  const idx = staff.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  staff[idx] = { ...staff[idx], ...data };
  writeJSON(PHARMACY_STAFF_FILE, staff);
  return staff[idx];
}

export function deletePharmacyStaff(id: string): boolean {
  const staff = getPharmacyStaff();
  const filtered = staff.filter((s) => s.id !== id);
  if (filtered.length === staff.length) return false;
  writeJSON(PHARMACY_STAFF_FILE, filtered);
  return true;
}

// ─── Prescription ──────────────────────────────────────────────────────────────

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  pharmacyId: string;
  pharmacyName: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  instructions: string;
  prescriberName: string;
  prescriberLicense: string;
  documentUrl: string;
  status: "pending" | "verified" | "rejected" | "filled";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const PRESCRIPTIONS_FILE = path.join(DATA_DIR, "prescriptions.json");

export function getPrescriptions(): Prescription[] {
  return readJSON<Prescription>(PRESCRIPTIONS_FILE);
}

export function getPrescriptionById(id: string): Prescription | undefined {
  return getPrescriptions().find((p) => p.id === id);
}

export function getPrescriptionsByPatient(patientId: string): Prescription[] {
  return getPrescriptions().filter((p) => p.patientId === patientId);
}

export function getPrescriptionsByPharmacy(pharmacyId: string): Prescription[] {
  return getPrescriptions().filter((p) => p.pharmacyId === pharmacyId);
}

export function createPrescription(data: Omit<Prescription, "id" | "createdAt" | "updatedAt" | "status">): Prescription {
  const prescriptions = getPrescriptions();
  const prescription: Prescription = {
    ...data,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  prescriptions.push(prescription);
  writeJSON(PRESCRIPTIONS_FILE, prescriptions);
  return prescription;
}

export function updatePrescription(id: string, data: Partial<Prescription>): Prescription | null {
  const prescriptions = getPrescriptions();
  const idx = prescriptions.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  prescriptions[idx] = {
    ...prescriptions[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(PRESCRIPTIONS_FILE, prescriptions);
  return prescriptions[idx];
}

export function deletePrescription(id: string): boolean {
  const prescriptions = getPrescriptions();
  const filtered = prescriptions.filter((p) => p.id !== id);
  if (filtered.length === prescriptions.length) return false;
  writeJSON(PRESCRIPTIONS_FILE, filtered);
  return true;
}

// ─── Patient Record (Pharmacy Counseling Records) ─────────────────────────────

export interface PatientRecord {
  id: string;
  pharmacyId: string;
  patientId: string;
  patientName: string;
  patientSex: "male" | "female" | "other";
  patientAge: number;
  patientLocation: string;
  visitDate: string;
  reasonForVisit: string;
  symptoms: string;
  diagnosis: string;
  medicationGiven: string;
  medicationDosage: string;
  reasonForMedication: string;
  pharmacistNotes: string;
  followUpDate: string;
  createdAt: string;
  updatedAt: string;
}

const PATIENT_RECORDS_FILE = path.join(DATA_DIR, "patient_records.json");

export function getPatientRecords(): PatientRecord[] {
  return readJSON<PatientRecord>(PATIENT_RECORDS_FILE);
}

export function getPatientRecordById(id: string): PatientRecord | undefined {
  return getPatientRecords().find((p) => p.id === id);
}

export function getPatientRecordsByPharmacy(pharmacyId: string): PatientRecord[] {
  return getPatientRecords().filter((p) => p.pharmacyId === pharmacyId);
}

export function getPatientRecordsByPatient(patientId: string): PatientRecord[] {
  return getPatientRecords().filter((p) => p.patientId === patientId);
}

export function createPatientRecord(data: Omit<PatientRecord, "id" | "createdAt" | "updatedAt">): PatientRecord {
  const records = getPatientRecords();
  const record: PatientRecord = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  records.push(record);
  writeJSON(PATIENT_RECORDS_FILE, records);
  return record;
}

export function updatePatientRecord(id: string, data: Partial<PatientRecord>): PatientRecord | null {
  const records = getPatientRecords();
  const idx = records.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  records[idx] = {
    ...records[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(PATIENT_RECORDS_FILE, records);
  return records[idx];
}

export function deletePatientRecord(id: string): boolean {
  const records = getPatientRecords();
  const filtered = records.filter((p) => p.id !== id);
  if (filtered.length === records.length) return false;
  writeJSON(PATIENT_RECORDS_FILE, filtered);
  return true;
}

// ─── Family Pharmacist Assignment ────────────────────────────────────────────

export interface FamilyPharmacist {
  id: string;
  patientId: string;
  patientName: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacistName: string;
  status: "active" | "inactive" | "pending_payment";
  monthlyFee: number;  // Monthly payment amount
  paymentStatus: "pending" | "paid" | "overdue" | "cancelled";
  paymentMethod: "mpesa" | "mobile_money" | "card" | "";
  paymentDate: string;
  nextPaymentDate: string;
  assignedAt: string;
  notes: string;
}

const FAMILY_PHARMACISTS_FILE = path.join(DATA_DIR, "family_pharmacists.json");

export function getFamilyPharmacists(): FamilyPharmacist[] {
  return readJSON<FamilyPharmacist>(FAMILY_PHARMACISTS_FILE);
}

export function getFamilyPharmacistById(id: string): FamilyPharmacist | undefined {
  return getFamilyPharmacists().find((f) => f.id === id);
}

export function getFamilyPharmacistsByPatient(patientId: string): FamilyPharmacist[] {
  return getFamilyPharmacists().filter((f) => f.patientId === patientId);
}

export function getFamilyPharmacistsByPharmacy(pharmacyId: string): FamilyPharmacist[] {
  return getFamilyPharmacists().filter((f) => f.pharmacyId === pharmacyId);
}

export function getActiveFamilyPharmacistByPatient(patientId: string): FamilyPharmacist | undefined {
  return getFamilyPharmacists().find((f) => f.patientId === patientId && f.status === "active");
}

export function createFamilyPharmacist(data: Omit<FamilyPharmacist, "id" | "assignedAt" | "status" | "paymentStatus" | "paymentDate" | "nextPaymentDate">): FamilyPharmacist {
  const familyPharmacists = getFamilyPharmacists();
  // Deactivate any existing active assignment for this patient
  familyPharmacists.forEach((f) => {
    if (f.patientId === data.patientId && f.status === "active") {
      f.status = "inactive";
    }
  });
  
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  const familyPharmacist: FamilyPharmacist = {
    ...data,
    id: crypto.randomUUID(),
    status: "pending_payment",  // Wait for payment
    paymentStatus: "pending",
    paymentDate: "",
    nextPaymentDate: nextMonth.toISOString(),
    assignedAt: new Date().toISOString(),
  };
  familyPharmacists.push(familyPharmacist);
  writeJSON(FAMILY_PHARMACISTS_FILE, familyPharmacists);
  return familyPharmacist;
}

export function updateFamilyPharmacist(id: string, data: Partial<FamilyPharmacist>): FamilyPharmacist | null {
  const familyPharmacists = getFamilyPharmacists();
  const idx = familyPharmacists.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  familyPharmacists[idx] = { ...familyPharmacists[idx], ...data };
  writeJSON(FAMILY_PHARMACISTS_FILE, familyPharmacists);
  return familyPharmacists[idx];
}

export function deleteFamilyPharmacist(id: string): boolean {
  const familyPharmacists = getFamilyPharmacists();
  const filtered = familyPharmacists.filter((f) => f.id !== id);
  if (filtered.length === familyPharmacists.length) return false;
  writeJSON(FAMILY_PHARMACISTS_FILE, filtered);
  return true;
}

// ─── Family Doctor Service (Pharmacy offers to be family doctor) ──────────────────

export interface FamilyDoctorService {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacistName: string;
  description: string;
  monthlyFee: number;  // Monthly charge for family doctor service
  servicesIncluded: string;  // What's included in the service
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

const FAMILY_DOCTOR_SERVICES_FILE = path.join(DATA_DIR, "family_doctor_services.json");

export function getFamilyDoctorServices(): FamilyDoctorService[] {
  return readJSON<FamilyDoctorService>(FAMILY_DOCTOR_SERVICES_FILE);
}

export function getFamilyDoctorServiceById(id: string): FamilyDoctorService | undefined {
  return getFamilyDoctorServices().find((f) => f.id === id);
}

export function getFamilyDoctorServicesByPharmacy(pharmacyId: string): FamilyDoctorService[] {
  return getFamilyDoctorServices().filter((f) => f.pharmacyId === pharmacyId);
}

export function getAvailableFamilyDoctorServices(): FamilyDoctorService[] {
  return getFamilyDoctorServices().filter((f) => f.isAvailable);
}

export function createFamilyDoctorService(data: Omit<FamilyDoctorService, "id" | "createdAt" | "updatedAt" | "isAvailable">): FamilyDoctorService {
  const services = getFamilyDoctorServices();
  const service: FamilyDoctorService = {
    ...data,
    id: crypto.randomUUID(),
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  services.push(service);
  writeJSON(FAMILY_DOCTOR_SERVICES_FILE, services);
  return service;
}

export function updateFamilyDoctorService(id: string, data: Partial<FamilyDoctorService>): FamilyDoctorService | null {
  const services = getFamilyDoctorServices();
  const idx = services.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  services[idx] = { ...services[idx], ...data, updatedAt: new Date().toISOString() };
  writeJSON(FAMILY_DOCTOR_SERVICES_FILE, services);
  return services[idx];
}

export function deleteFamilyDoctorService(id: string): boolean {
  const services = getFamilyDoctorServices();
  const filtered = services.filter((f) => f.id !== id);
  if (filtered.length === services.length) return false;
  writeJSON(FAMILY_DOCTOR_SERVICES_FILE, filtered);
  return true;
}

// ─── Profile Update Request (Pending Admin Approval) ─────────────────────────────

export interface ProfileUpdateRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedFields: {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    age?: number;
    gender?: string;
    address?: string;
    city?: string;
    occupation?: string;
    educationLevel?: string;
    profilePicture?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    medicalNotes?: string;
    allergies?: string;
  };
  status: "pending" | "approved" | "rejected";
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

const PROFILE_UPDATE_REQUESTS_FILE = path.join(DATA_DIR, "profile_update_requests.json");

export function getProfileUpdateRequests(): ProfileUpdateRequest[] {
  return readJSON<ProfileUpdateRequest>(PROFILE_UPDATE_REQUESTS_FILE);
}

export function getProfileUpdateRequestById(id: string): ProfileUpdateRequest | undefined {
  return getProfileUpdateRequests().find((p) => p.id === id);
}

export function getProfileUpdateRequestsByUser(userId: string): ProfileUpdateRequest[] {
  return getProfileUpdateRequests().filter((p) => p.userId === userId);
}

export function getPendingProfileUpdateRequests(): ProfileUpdateRequest[] {
  return getProfileUpdateRequests().filter((p) => p.status === "pending");
}

export function createProfileUpdateRequest(data: Omit<ProfileUpdateRequest, "id" | "status" | "adminNotes" | "createdAt" | "updatedAt">): ProfileUpdateRequest {
  const requests = getProfileUpdateRequests();
  const request: ProfileUpdateRequest = {
    ...data,
    id: crypto.randomUUID(),
    status: "pending",
    adminNotes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  requests.push(request);
  writeJSON(PROFILE_UPDATE_REQUESTS_FILE, requests);
  return request;
}

export function updateProfileUpdateRequest(id: string, data: Partial<ProfileUpdateRequest>): ProfileUpdateRequest | null {
  const requests = getProfileUpdateRequests();
  const idx = requests.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  requests[idx] = { ...requests[idx], ...data, updatedAt: new Date().toISOString() };
  writeJSON(PROFILE_UPDATE_REQUESTS_FILE, requests);
  return requests[idx];
}

export function deleteProfileUpdateRequest(id: string): boolean {
  const requests = getProfileUpdateRequests();
  const filtered = requests.filter((p) => p.id !== id);
  if (filtered.length === requests.length) return false;
  writeJSON(PROFILE_UPDATE_REQUESTS_FILE, filtered);
  return true;
}
