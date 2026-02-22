import { NextResponse } from "next/server";
import { 
  getPatientRecords, 
  getPatientRecordById, 
  getPatientRecordsByPharmacy,
  getPatientRecordsByPatient,
  createPatientRecord, 
  updatePatientRecord, 
  deletePatientRecord 
} from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const pharmacyId = searchParams.get("pharmacyId");
    const patientId = searchParams.get("patientId");

    if (id) {
      const record = getPatientRecordById(id);
      if (!record) {
        return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
      }
      return NextResponse.json(record);
    }

    if (pharmacyId) {
      const records = getPatientRecordsByPharmacy(pharmacyId);
      return NextResponse.json(records);
    }

    if (patientId) {
      const records = getPatientRecordsByPatient(patientId);
      return NextResponse.json(records);
    }

    // Return all records (admin only)
    const records = getPatientRecords();
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching patient records:", error);
    return NextResponse.json({ error: "Failed to fetch patient records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const record = createPatientRecord({
      pharmacyId: body.pharmacyId,
      patientId: body.patientId,
      patientName: body.patientName,
      patientSex: body.patientSex,
      patientAge: body.patientAge,
      patientLocation: body.patientLocation,
      visitDate: body.visitDate || new Date().toISOString().split("T")[0],
      reasonForVisit: body.reasonForVisit,
      symptoms: body.symptoms,
      diagnosis: body.diagnosis,
      medicationGiven: body.medicationGiven,
      medicationDosage: body.medicationDosage,
      reasonForMedication: body.reasonForMedication,
      pharmacistNotes: body.pharmacistNotes || "",
      followUpDate: body.followUpDate || "",
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating patient record:", error);
    return NextResponse.json({ error: "Failed to create patient record" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Patient record ID required" }, { status: 400 });
    }

    const record = updatePatientRecord(id, data);
    if (!record) {
      return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error updating patient record:", error);
    return NextResponse.json({ error: "Failed to update patient record" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Patient record ID required" }, { status: 400 });
    }

    const deleted = deletePatientRecord(id);
    if (!deleted) {
      return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting patient record:", error);
    return NextResponse.json({ error: "Failed to delete patient record" }, { status: 500 });
  }
}
