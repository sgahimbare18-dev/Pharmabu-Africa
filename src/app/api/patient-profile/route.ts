import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { patientProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    if (id) {
      const rows = await db.select().from(patientProfiles).where(eq(patientProfiles.id, id)).limit(1);
      const profile = rows[0];
      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      return NextResponse.json(profile);
    }

    if (userId) {
      const rows = await db.select().from(patientProfiles).where(eq(patientProfiles.userId, userId)).limit(1);
      const profile = rows[0];
      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      return NextResponse.json(profile);
    }

    // Return all profiles (admin only)
    const rows = await db.select().from(patientProfiles);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if profile already exists for this user
    const existing = await db
      .select()
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, body.userId))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const profile = {
      id: crypto.randomUUID(),
      userId: body.userId,
      dateOfBirth: body.dateOfBirth || "",
      age: body.age || 0,
      gender: (body.gender || "other") as "male" | "female" | "other",
      address: body.address || "",
      city: body.city || "",
      country: (body.country || "kenya") as "kenya" | "burundi",
      occupation: body.occupation || "",
      educationLevel: body.educationLevel || "",
      profilePicture: body.profilePicture || "",
      emergencyContactName: body.emergencyContactName || "",
      emergencyContactPhone: body.emergencyContactPhone || "",
      medicalNotes: body.medicalNotes || "",
      allergies: body.allergies || "",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(patientProfiles).values(profile);

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

    const existing = await db.select().from(patientProfiles).where(eq(patientProfiles.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await db
      .update(patientProfiles)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(patientProfiles.id, id));

    const rows = await db.select().from(patientProfiles).where(eq(patientProfiles.id, id)).limit(1);

    return NextResponse.json(rows[0]);
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

    const existing = await db.select().from(patientProfiles).where(eq(patientProfiles.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await db.delete(patientProfiles).where(eq(patientProfiles.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting patient profile:", error);
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
