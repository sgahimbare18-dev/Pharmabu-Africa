import { db } from "./index";
import { users, pharmacies, pharmacyStaff } from "./schema";
import { hashPassword } from "../lib/auth";
import { randomUUID } from "crypto";

async function seed() {
  console.log("Seeding database...");

  const patientEmail = "patient@test.com";
  const patientPasswordHash = hashPassword("patient123");

  const pharmacyEmail = "pharmacy@test.com";
  const pharmacyPasswordHash = hashPassword("pharmacy123");

  const staffEmail = "staff@test.com";
  const staffPasswordHash = hashPassword("staff123");

  const patientId = randomUUID();
  const pharmacyId = randomUUID();
  const staffId = randomUUID();

  await db.insert(users).values({
    id: patientId,
    name: "Test Patient",
    email: patientEmail,
    phone: "+254700000000",
    country: "kenya",
    passwordHash: patientPasswordHash,
    role: "patient",
    createdAt: new Date().toISOString(),
  });

  await db.insert(pharmacies).values({
    id: pharmacyId,
    pharmacyName: "Test Pharmacy",
    pharmacistName: "Test Pharmacist",
    email: pharmacyEmail,
    phone: "+254711111111",
    licenseNumber: "PPB-12345",
    pharmacistQualification: "B.Pharm",
    pharmacistUniversity: "University of Nairobi",
    pharmacistGraduationYear: "2020",
    pharmacyRegNumber: "PHARM-67890",
    pharmacyRegAuthority: "PPB",
    pharmacyRegExpiry: "2025-12-31",
    country: "kenya",
    city: "Nairobi",
    address: "123 Test Street",
    operatingHours: "8:00-22:00",
    servicesOffered: "Consultation, Delivery",
    passwordHash: pharmacyPasswordHash,
    role: "pharmacy",
    status: "verified",
    createdAt: new Date().toISOString(),
  });

  await db.insert(pharmacyStaff).values({
    id: staffId,
    pharmacyId,
    name: "Test Staff",
    email: staffEmail,
    phone: "+254722222222",
    role: "assistant",
    qualification: "Pharmacy Technician",
    licenseNumber: "PT-12345",
    isActive: true,
    passwordHash: staffPasswordHash,
    createdAt: new Date().toISOString(),
  });

  console.log("Seeding completed successfully!");
  console.log("\nTest accounts created:");
  console.log(`  Patient: ${patientEmail} / patient123`);
  console.log(`  Pharmacy: ${pharmacyEmail} / pharmacy123`);
  console.log(`  Staff: ${staffEmail} / staff123`);
  console.log(`  Admin: admin@pharmalink.africa / PharmaAdmin2024!`);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
