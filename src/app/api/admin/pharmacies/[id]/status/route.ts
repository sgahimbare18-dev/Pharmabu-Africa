import { NextRequest, NextResponse } from "next/server";
import { getPharmacyById, updatePharmacyStatus } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session via header
    const adminSession = req.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status: "verified" | "rejected" };

    if (!status || !["verified", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'verified' or 'rejected'." },
        { status: 400 }
      );
    }

    const pharmacy = getPharmacyById(id);
    if (!pharmacy) {
      return NextResponse.json({ error: "Pharmacy not found." }, { status: 404 });
    }

    const updated = updatePharmacyStatus(id, status);
    return NextResponse.json({
      message: `Pharmacy ${status === "verified" ? "approved" : "rejected"} successfully.`,
      pharmacy: updated,
    });
  } catch (err) {
    console.error("Update pharmacy status error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
