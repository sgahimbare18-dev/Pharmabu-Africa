import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { profileUpdateRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ProfileUpdateRequest } from "@/db/schema";

// Map a DB row to the API response shape (requestedFields is stored as a JSON
// string in the database but exposed as an object in the API contract).
function serializeRequest(row: ProfileUpdateRequest) {
  return {
    ...row,
    requestedFields: row.requestedFields ? JSON.parse(row.requestedFields) : {},
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    const pending = searchParams.get("pending");

    if (id) {
      const rows = await db.select().from(profileUpdateRequests).where(eq(profileUpdateRequests.id, id)).limit(1);
      const request_data = rows[0];
      if (!request_data) {
        return NextResponse.json({ error: "Profile update request not found" }, { status: 404 });
      }
      return NextResponse.json(serializeRequest(request_data));
    }

    if (userId) {
      const rows = await db.select().from(profileUpdateRequests).where(eq(profileUpdateRequests.userId, userId));
      return NextResponse.json(rows.map(serializeRequest));
    }

    if (pending === "true") {
      const rows = await db
        .select()
        .from(profileUpdateRequests)
        .where(eq(profileUpdateRequests.status, "pending"));
      return NextResponse.json(rows.map(serializeRequest));
    }

    // Return all profile update requests (admin only)
    const rows = await db.select().from(profileUpdateRequests);
    return NextResponse.json(rows.map(serializeRequest));
  } catch (error) {
    console.error("Error fetching profile update requests:", error);
    return NextResponse.json({ error: "Failed to fetch profile update requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const now = new Date().toISOString();
    const profileRequest = {
      id: crypto.randomUUID(),
      userId: body.userId,
      userName: body.userName,
      userEmail: body.userEmail,
      requestedFields: JSON.stringify(body.requestedFields ?? {}),
      status: "pending" as const,
      adminNotes: "",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(profileUpdateRequests).values(profileRequest);

    return NextResponse.json(serializeRequest(profileRequest), { status: 201 });
  } catch (error) {
    console.error("Error creating profile update request:", error);
    return NextResponse.json({ error: "Failed to create profile update request" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Request ID required" }, { status: 400 });
    }

    const existing = await db.select().from(profileUpdateRequests).where(eq(profileUpdateRequests.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Profile update request not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
    if ("requestedFields" in data && typeof data.requestedFields !== "string") {
      updateData.requestedFields = JSON.stringify(data.requestedFields);
    }

    await db.update(profileUpdateRequests).set(updateData).where(eq(profileUpdateRequests.id, id));

    const rows = await db.select().from(profileUpdateRequests).where(eq(profileUpdateRequests.id, id)).limit(1);

    return NextResponse.json(serializeRequest(rows[0]));
  } catch (error) {
    console.error("Error updating profile update request:", error);
    return NextResponse.json({ error: "Failed to update profile update request" }, { status: 500 });
  }
}
