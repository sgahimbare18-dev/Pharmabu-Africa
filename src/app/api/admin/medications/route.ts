import { NextResponse } from "next/server";
import { getMedications, getMedicationById, updateMedication, deleteMedication } from "@/lib/store";

// GET /api/admin/medications - List all medications
// PUT /api/admin/medications - Update a medication
// DELETE /api/admin/medications - Delete a medication

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Check admin session
    const adminSession = request.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (id) {
      const medication = getMedicationById(id);
      if (!medication) {
        return NextResponse.json({ error: "Medication not found" }, { status: 404 });
      }
      return NextResponse.json({ medication });
    }

    const medications = getMedications();
    return NextResponse.json({ medications });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check admin session
    const adminSession = request.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Medication ID required" }, { status: 400 });
    }

    const body = await request.json();
    const medication = updateMedication(id, body);

    if (!medication) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }

    return NextResponse.json({ medication, message: "Medication updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check admin session
    const adminSession = request.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Medication ID required" }, { status: 400 });
    }

    const success = deleteMedication(id);

    if (!success) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Medication deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
