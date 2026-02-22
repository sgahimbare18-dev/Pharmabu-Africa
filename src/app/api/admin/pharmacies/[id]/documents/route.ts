import { NextResponse } from "next/server";
import { clearPharmacyDocuments, getPharmacyById } from "@/lib/store";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const adminSession = request.headers.get("x-admin-session");

    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pharmacy = getPharmacyById(id);
    if (!pharmacy) {
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 });
    }

    const updatedPharmacy = clearPharmacyDocuments(id);

    if (!updatedPharmacy) {
      return NextResponse.json({ error: "Failed to delete documents" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Documents deleted successfully",
      pharmacy: updatedPharmacy
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete documents" }, { status: 500 });
  }
}
