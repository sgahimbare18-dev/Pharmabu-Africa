/**
 * Database schema for PharmabuLink Africa
 * Uses Drizzle ORM with SQLite
 */

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ─── Users (Patients) ──────────────────────────────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  country: text("country", { enum: ["kenya", "burundi"] }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["patient"] }).notNull().default("patient"),
  createdAt: text("created_at").notNull(),
});

// ─── Pharmacies ─────────────────────────────────────────────────────────────────

export const pharmacies = sqliteTable("pharmacies", {
  id: text("id").primaryKey(),
  pharmacyName: text("pharmacy_name").notNull(),
  pharmacistName: text("pharmacist_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  // Pharmacist professional credentials
  licenseNumber: text("license_number").notNull(),
  pharmacistQualification: text("pharmacist_qualification").notNull(),
  pharmacistUniversity: text("pharmacist_university"),
  pharmacistGraduationYear: text("pharmacist_graduation_year"),
  // Pharmacy business registration
  pharmacyRegNumber: text("pharmacy_reg_number").notNull(),
  pharmacyRegAuthority: text("pharmacy_reg_authority").notNull(),
  pharmacyRegExpiry: text("pharmacy_reg_expiry"),
  // Location
  country: text("country", { enum: ["kenya", "burundi"] }).notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  // Additional info
  operatingHours: text("operating_hours"),
  servicesOffered: text("services_offered"),
  // Uploaded credential documents (file paths)
  licenseDocument: text("license_document"),
  qualificationDocument: text("qualification_document"),
  pharmacyRegDocument: text("pharmacy_reg_document"),
  // Auth
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["pharmacy"] }).notNull().default("pharmacy"),
  status: text("status", { enum: ["pending", "verified", "rejected"] }).notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});

// ─── Medications ───────────────────────────────────────────────────────────────

export const medications = sqliteTable("medications", {
  id: text("id").primaryKey(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  description: text("description"),
  whatItCures: text("what_it_cures"),
  dosage: text("dosage"),
  usageInstructions: text("usage_instructions"),
  sideEffects: text("side_effects"),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  category: text("category"),
  imageUrl: text("image_url"),
  requiresPrescription: integer("requires_prescription", { mode: "boolean" }).default(false),
  status: text("status", { enum: ["active", "inactive", "out_of_stock"] }).notNull().default("active"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Orders/Consultations ──────────────────────────────────────────────────────

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => users.id),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone").notNull(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  pharmacyName: text("pharmacy_name").notNull(),
  medicationId: text("medication_id").notNull().references(() => medications.id),
  medicationName: text("medication_name").notNull(),
  medicationPrice: real("medication_price").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: real("total_price").notNull(),
  symptoms: text("symptoms"),
  pharmacyNotes: text("pharmacy_notes"),
  status: text("status", { 
    enum: ["pending", "consulting", "confirmed", "preparing", "ready", "delivered", "cancelled"] 
  }).notNull().default("pending"),
  paymentMethod: text("payment_method", { enum: ["pay_on_delivery"] }).notNull().default("pay_on_delivery"),
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Subscriptions (Monthly Payments) ─────────────────────────────────────────

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => users.id),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone").notNull(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  pharmacyName: text("pharmacy_name").notNull(),
  pharmacyCity: text("pharmacy_city").notNull(),
  subscriptionType: text("subscription_type", { enum: ["monthly"] }).notNull().default("monthly"),
  monthlyAmount: real("monthly_amount").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  status: text("status", { enum: ["active", "paused", "cancelled"] }).notNull().default("active"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Payments ───────────────────────────────────────────────────────────────────

export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  patientId: text("patient_id").notNull().references(() => users.id),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone").notNull(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  pharmacyName: text("pharmacy_name").notNull(),
  medicationName: text("medication_name").notNull(),
  quantity: integer("quantity").notNull(),
  originalAmount: real("original_amount").notNull(),
  originalCurrency: text("original_currency", { enum: ["KES", "USD", "EUR", "GBP", "BIF", "UGX", "TZS", "RWF"] }).notNull(),
  exchangeRate: real("exchange_rate").notNull(),
  amountInKES: real("amount_in_kes").notNull(),
  platformFee: real("platform_fee").notNull(),
  pharmacyPayout: real("pharmacy_payout").notNull(),
  adminPhone: text("admin_phone").notNull(),
  paymentMethod: text("payment_method", { enum: ["mpesa", "airtel_money", "mobile_money_bi", "card", "paypal"] }).notNull(),
  paymentReference: text("payment_reference").notNull(),
  status: text("status", { enum: ["pending", "completed", "failed", "refunded"] }).notNull().default("pending"),
  paymentMessage: text("payment_message"),
  payoutStatus: text("payout_status", { enum: ["pending", "sent", "failed"] }).notNull().default("pending"),
  payoutReference: text("payout_reference"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Messages (Pharmacy to Admin) ─────────────────────────────────────────────

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  pharmacyName: text("pharmacy_name").notNull(),
  pharmacistName: text("pharmacist_name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  status: text("status", { enum: ["unread", "read", "responded"] }).notNull().default("unread"),
  type: text("type", { enum: ["deletion_request", "general"] }).notNull().default("general"),
  createdAt: text("created_at").notNull(),
});

// ─── Patient Profiles (Extended Info) ─────────────────────────────────────────

export const patientProfiles = sqliteTable("patient_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id),
  dateOfBirth: text("date_of_birth"),
  age: integer("age"),
  gender: text("gender", { enum: ["male", "female", "other"] }),
  address: text("address"),
  city: text("city"),
  country: text("country", { enum: ["kenya", "burundi"] }),
  occupation: text("occupation"),
  educationLevel: text("education_level"),
  profilePicture: text("profile_picture"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  medicalNotes: text("medical_notes"),
  allergies: text("allergies"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Pharmacy Staff ───────────────────────────────────────────────────────────

export const pharmacyStaff = sqliteTable("pharmacy_staff", {
  id: text("id").primaryKey(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  role: text("role", { enum: ["pharmacist", "assistant", "technician", "delivery", "counselor"] }).notNull(),
  qualification: text("qualification"),
  licenseNumber: text("license_number"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull(),
});

// ─── Prescriptions ─────────────────────────────────────────────────────────────

export const prescriptions = sqliteTable("prescriptions", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => users.id),
  patientName: text("patient_name").notNull(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  pharmacyName: text("pharmacy_name").notNull(),
  medicationName: text("medication_name").notNull(),
  dosage: text("dosage").notNull(),
  quantity: integer("quantity").notNull(),
  instructions: text("instructions"),
  prescriberName: text("prescriber_name"),
  prescriberLicense: text("prescriber_license"),
  documentUrl: text("document_url"),
  status: text("status", { enum: ["pending", "verified", "rejected", "filled"] }).notNull().default("pending"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Patient Records (Pharmacy Counseling Records) ───────────────────────────

export const patientRecords = sqliteTable("patient_records", {
  id: text("id").primaryKey(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  patientId: text("patient_id").notNull().references(() => users.id),
  patientName: text("patient_name").notNull(),
  patientSex: text("patient_sex", { enum: ["male", "female", "other"] }),
  patientAge: integer("patient_age"),
  patientLocation: text("patient_location"),
  visitDate: text("visit_date").notNull(),
  reasonForVisit: text("reason_for_visit"),
  symptoms: text("symptoms"),
  diagnosis: text("diagnosis"),
  medicationGiven: text("medication_given"),
  medicationDosage: text("medication_dosage"),
  reasonForMedication: text("reason_for_medication"),
  pharmacistNotes: text("pharmacist_notes"),
  followUpDate: text("follow_up_date"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Family Pharmacist Assignments ─────────────────────────────────────────────

export const familyPharmacists = sqliteTable("family_pharmacists", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => users.id),
  patientName: text("patient_name").notNull(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  pharmacyName: text("pharmacy_name").notNull(),
  pharmacistName: text("pharmacist_name").notNull(),
  status: text("status", { enum: ["active", "inactive", "pending_payment"] }).notNull().default("pending_payment"),
  monthlyFee: real("monthly_fee").notNull(),
  paymentStatus: text("payment_status", { enum: ["pending", "paid", "overdue", "cancelled"] }).notNull().default("pending"),
  paymentMethod: text("payment_method", { enum: ["mpesa", "mobile_money", "card"] }),
  paymentDate: text("payment_date"),
  nextPaymentDate: text("next_payment_date"),
  assignedAt: text("assigned_at").notNull(),
  notes: text("notes"),
});

// ─── Family Doctor Services ─────────────────────────────────────────────────────

export const familyDoctorServices = sqliteTable("family_doctor_services", {
  id: text("id").primaryKey(),
  pharmacyId: text("pharmacy_id").notNull().references(() => pharmacies.id),
  pharmacyName: text("pharmacy_name").notNull(),
  pharmacistName: text("pharmacist_name").notNull(),
  description: text("description"),
  monthlyFee: real("monthly_fee").notNull(),
  servicesIncluded: text("services_included"),
  isAvailable: integer("is_available", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Profile Update Requests ───────────────────────────────────────────────────

export const profileUpdateRequests = sqliteTable("profile_update_requests", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  requestedFields: text("requested_fields"), // JSON string
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  adminNotes: text("admin_notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Type exports for use in queries
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Pharmacy = typeof pharmacies.$inferSelect;
export type NewPharmacy = typeof pharmacies.$inferInsert;
export type Medication = typeof medications.$inferSelect;
export type NewMedication = typeof medications.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type PatientProfile = typeof patientProfiles.$inferSelect;
export type NewPatientProfile = typeof patientProfiles.$inferInsert;
export type PharmacyStaff = typeof pharmacyStaff.$inferSelect;
export type NewPharmacyStaff = typeof pharmacyStaff.$inferInsert;
export type Prescription = typeof prescriptions.$inferSelect;
export type NewPrescription = typeof prescriptions.$inferInsert;
export type PatientRecord = typeof patientRecords.$inferSelect;
export type NewPatientRecord = typeof patientRecords.$inferInsert;
export type FamilyPharmacist = typeof familyPharmacists.$inferSelect;
export type NewFamilyPharmacist = typeof familyPharmacists.$inferInsert;
export type FamilyDoctorService = typeof familyDoctorServices.$inferSelect;
export type NewFamilyDoctorService = typeof familyDoctorServices.$inferInsert;
export type ProfileUpdateRequest = typeof profileUpdateRequests.$inferSelect;
export type NewProfileUpdateRequest = typeof profileUpdateRequests.$inferInsert;
