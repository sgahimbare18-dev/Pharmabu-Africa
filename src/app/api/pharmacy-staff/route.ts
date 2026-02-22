import { NextResponse } from "next/server";
import { 
  getPharmacyStaffByPharmacy, 
  getPharmacyStaffById, 
  getPharmacyStaffByEmail,
  createPharmacyStaff, 
  updatePharmacyStaff, 
  deletePharmacyStaff,
  getPharmacyStaff,
  hashPassword
} from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get("pharmacyId");
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {
      const staff = getPharmacyStaffById(id);
      if (!staff) {
        return NextResponse.json({ error: "Staff not found" }, { status: 404 });
      }
      return NextResponse.json(staff);
    }

    if (email) {
      const staff = getPharmacyStaffByEmail(email);
      if (!staff) {
        return NextResponse.json({ error: "Staff not found" }, { status: 404 });
      }
      return NextResponse.json(staff);
    }

    if (pharmacyId) {
      const staff = getPharmacyStaffByPharmacy(pharmacyId);
      return NextResponse.json(staff);
    }

    // Return all staff (admin only)
    const staff = getPharmacyStaff();
    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching pharmacy staff:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if email already exists
    const existing = getPharmacyStaffByEmail(body.email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const staff = createPharmacyStaff({
      pharmacyId: body.pharmacyId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role || "assistant",
      qualification: body.qualification || "",
      licenseNumber: body.licenseNumber || "",
      passwordHash: hashPassword(body.password || "changeme123"),
    });

    // Don't return password hash
    const { passwordHash, ...safeStaff } = staff;
    return NextResponse.json(safeStaff, { status: 201 });
  } catch (error) {
    console.error("Error creating pharmacy staff:", error);
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, password, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Staff ID required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { ...data };
    if (password) {
      updateData.passwordHash = hashPassword(password);
    }

    const staff = updatePharmacyStaff(id, updateData);
    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    // Don't return password hash
    const { passwordHash, ...safeStaff } = staff;
    return NextResponse.json(safeStaff);
  } catch (error) {
    console.error("Error updating pharmacy staff:", error);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Staff ID required" }, { status: 400 });
    }

    const deleted = deletePharmacyStaff(id);
    if (!deleted) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pharmacy staff:", error);
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}
