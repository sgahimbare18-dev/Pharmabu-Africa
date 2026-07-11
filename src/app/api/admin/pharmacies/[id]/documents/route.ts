import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/db";
import { pharmacies } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const adminSession = request.headers.get("x-admin-session");

    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.select().from(pharmacies).where(eq(pharmacies.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 });
    }

    const pharmacy = existing[0];

    // Delete the actual files
    const deleteDocumentFile = (filePath: string) => {
      try {
        const fullPath = filePath.startsWith("/")
          ? path.join(process.cwd(), "public", filePath)
          : path.join(process.cwd(), "public", "uploads", filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch {
        // ignore file deletion errors
      }
    };

    if (pharmacy.licenseDocument) deleteDocumentFile(pharmacy.licenseDocument);
    if (pharmacy.qualificationDocument) deleteDocumentFile(pharmacy.qualificationDocument);
    if (pharmacy.pharmacyRegDocument) deleteDocumentFile(pharmacy.pharmacyRegDocument);

    // Clear the document paths in the database
    await db
      .update(pharmacies)
      .set({
        licenseDocument: "",
        qualificationDocument: "",
        pharmacyRegDocument: "",
      })
      .where(eq(pharmacies.id, id));

    const updatedRows = await db.select().from(pharmacies).where(eq(pharmacies.id, id)).limit(1);
    if (updatedRows.length === 0) {
      return NextResponse.json({ error: "Failed to delete documents" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Documents deleted successfully",
      pharmacy: updatedRows[0],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete documents" }, { status: 500 });
  }
}
