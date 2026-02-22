import { NextResponse } from "next/server";
import { getPharmacyById, deletePharmacy } from "@/lib/store";

// DELETE /api/admin/pharmacies/[id] - Delete a pharmacy

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin session
    const adminSession = request.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Pharmacy ID required" }, { status: 400 });
    }

    const pharmacy = getPharmacyById(id);
    if (!pharmacy) {
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 });
    }

    const success = deletePharmacy(id);

    if (!success) {
      return NextResponse.json({ error: "Failed to delete pharmacy" }, { status: 500 });
    }

    return NextResponse.json({ message: "Pharmacy deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
