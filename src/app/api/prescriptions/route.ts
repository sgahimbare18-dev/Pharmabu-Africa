import { NextResponse } from "next/server";
import { 
  getPrescriptions, 
  getPrescriptionById, 
  getPrescriptionsByPatient,
  getPrescriptionsByPharmacy,
  createPrescription, 
  updatePrescription, 
  deletePrescription 
} from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const patientId = searchParams.get("patientId");
    const pharmacyId = searchParams.get("pharmacyId");

    if (id) {
      const prescription = getPrescriptionById(id);
      if (!prescription) {
        return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
      }
      return NextResponse.json(prescription);
    }

    if (patientId) {
      const prescriptions = getPrescriptionsByPatient(patientId);
      return NextResponse.json(prescriptions);
    }

    if (pharmacyId) {
      const prescriptions = getPrescriptionsByPharmacy(pharmacyId);
      return NextResponse.json(prescriptions);
    }

    // Return all prescriptions (admin only)
    const prescriptions = getPrescriptions();
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prescription = createPrescription({
      patientId: body.patientId,
      patientName: body.patientName,
      pharmacyId: body.pharmacyId || "",
      pharmacyName: body.pharmacyName || "",
      medicationName: body.medicationName,
      dosage: body.dosage,
      quantity: body.quantity,
      instructions: body.instructions,
      prescriberName: body.prescriberName,
      prescriberLicense: body.prescriberLicense,
      documentUrl: body.documentUrl || "",
      notes: body.notes || "",
    });

    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Prescription ID required" }, { status: 400 });
    }

    const prescription = updatePrescription(id, data);
    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    return NextResponse.json(prescription);
  } catch (error) {
    console.error("Error updating prescription:", error);
    return NextResponse.json({ error: "Failed to update prescription" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Prescription ID required" }, { status: 400 });
    }

    const deleted = deletePrescription(id);
    if (!deleted) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    return NextResponse.json({ error: "Failed to delete prescription" }, { status: 500 });
  }
}
