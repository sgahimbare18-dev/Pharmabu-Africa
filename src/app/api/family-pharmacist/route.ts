import { NextResponse } from "next/server";
import { 
  getFamilyPharmacists, 
  getFamilyPharmacistById, 
  getFamilyPharmacistsByPatient,
  getFamilyPharmacistsByPharmacy,
  getActiveFamilyPharmacistByPatient,
  createFamilyPharmacist, 
  updateFamilyPharmacist, 
  deleteFamilyPharmacist 
} from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const patientId = searchParams.get("patientId");
    const pharmacyId = searchParams.get("pharmacyId");
    const active = searchParams.get("active");

    if (id) {
      const familyPharm = getFamilyPharmacistById(id);
      if (!familyPharm) {
        return NextResponse.json({ error: "Family pharmacist not found" }, { status: 404 });
      }
      return NextResponse.json(familyPharm);
    }

    if (patientId && active === "true") {
      const familyPharm = getActiveFamilyPharmacistByPatient(patientId);
      return NextResponse.json(familyPharm || null);
    }

    if (patientId) {
      const familyPharms = getFamilyPharmacistsByPatient(patientId);
      return NextResponse.json(familyPharms);
    }

    if (pharmacyId) {
      const familyPharms = getFamilyPharmacistsByPharmacy(pharmacyId);
      return NextResponse.json(familyPharms);
    }

    // Return all family pharmacists (admin only)
    const familyPharms = getFamilyPharmacists();
    return NextResponse.json(familyPharms);
  } catch (error) {
    console.error("Error fetching family pharmacists:", error);
    return NextResponse.json({ error: "Failed to fetch family pharmacists" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const familyPharm = createFamilyPharmacist({
      patientId: body.patientId,
      patientName: body.patientName,
      pharmacyId: body.pharmacyId,
      pharmacyName: body.pharmacyName,
      pharmacistName: body.pharmacistName,
      notes: body.notes || "",
    });

    return NextResponse.json(familyPharm, { status: 201 });
  } catch (error) {
    console.error("Error creating family pharmacist:", error);
    return NextResponse.json({ error: "Failed to create family pharmacist" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Family pharmacist ID required" }, { status: 400 });
    }

    const familyPharm = updateFamilyPharmacist(id, data);
    if (!familyPharm) {
      return NextResponse.json({ error: "Family pharmacist not found" }, { status: 404 });
    }

    return NextResponse.json(familyPharm);
  } catch (error) {
    console.error("Error updating family pharmacist:", error);
    return NextResponse.json({ error: "Failed to update family pharmacist" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Family pharmacist ID required" }, { status: 400 });
    }

    const deleted = deleteFamilyPharmacist(id);
    if (!deleted) {
      return NextResponse.json({ error: "Family pharmacist not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting family pharmacist:", error);
    return NextResponse.json({ error: "Failed to delete family pharmacist" }, { status: 500 });
  }
}
