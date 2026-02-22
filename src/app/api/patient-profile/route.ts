import { NextResponse } from "next/server";
import { 
  getPatientProfileByUserId, 
  getPatientProfileById, 
  createPatientProfile, 
  updatePatientProfile, 
  deletePatientProfile,
  getPatientProfiles 
} from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    if (id) {
      const profile = getPatientProfileById(id);
      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      return NextResponse.json(profile);
    }

    if (userId) {
      const profile = getPatientProfileByUserId(userId);
      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      return NextResponse.json(profile);
    }

    // Return all profiles (admin only)
    const profiles = getPatientProfiles();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if profile already exists for this user
    const existing = getPatientProfileByUserId(body.userId);
    if (existing) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 });
    }

    const profile = createPatientProfile({
      userId: body.userId,
      dateOfBirth: body.dateOfBirth || "",
      age: body.age || 0,
      gender: body.gender || "other",
      address: body.address || "",
      city: body.city || "",
      country: body.country || "kenya",
      occupation: body.occupation || "",
      educationLevel: body.educationLevel || "",
      profilePicture: body.profilePicture || "",
      emergencyContactName: body.emergencyContactName || "",
      emergencyContactPhone: body.emergencyContactPhone || "",
      medicalNotes: body.medicalNotes || "",
      allergies: body.allergies || "",
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Error creating patient profile:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Profile ID required" }, { status: 400 });
    }

    const profile = updatePatientProfile(id, data);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating patient profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Profile ID required" }, { status: 400 });
    }

    const deleted = deletePatientProfile(id);
    if (!deleted) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting patient profile:", error);
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
