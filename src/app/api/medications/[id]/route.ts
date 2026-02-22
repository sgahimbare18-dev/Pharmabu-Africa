import { NextRequest, NextResponse } from "next/server";
import { getMedicationById, updateMedication, deleteMedication } from "@/lib/store";

// GET /api/medications/[id] - Get a single medication
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const medication = getMedicationById(id);
    
    if (!medication) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }
    
    return NextResponse.json(medication);
  } catch (error) {
    console.error("Error fetching medication:", error);
    return NextResponse.json({ error: "Failed to fetch medication" }, { status: 500 });
  }
}

// PUT /api/medications/[id] - Update a medication
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const medication = updateMedication(id, body);
    
    if (!medication) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }
    
    return NextResponse.json(medication);
  } catch (error) {
    console.error("Error updating medication:", error);
    return NextResponse.json({ error: "Failed to update medication" }, { status: 500 });
  }
}

// DELETE /api/medications/[id] - Delete a medication
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteMedication(id);
    
    if (!success) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Medication deleted successfully" });
  } catch (error) {
    console.error("Error deleting medication:", error);
    return NextResponse.json({ error: "Failed to delete medication" }, { status: 500 });
  }
}
