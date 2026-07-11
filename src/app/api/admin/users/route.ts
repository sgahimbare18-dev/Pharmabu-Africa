import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

// GET /api/admin/users - List all patients
// POST /api/admin/users - Create a patient
// DELETE /api/admin/users - Delete a patient (admin only)

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
      const userRows = await db.select().from(users).where(eq(users.id, id)).limit(1);
      const user = userRows[0];
      if (!user) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }
      return NextResponse.json({ user });
    }

    const allUsers = await db.select().from(users);
    return NextResponse.json({ users: allUsers });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check admin session
    const adminSession = request.headers.get("x-admin-session");
    if (adminSession !== "pharmalink-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, country, password } = body;

    if (!name || !email || !phone || !country || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db
      .select()
      .from(users)
      .where(like(users.email, email.toLowerCase()))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      name,
      email,
      phone,
      country,
      passwordHash: hashPassword(password),
      role: "patient",
      createdAt: new Date().toISOString(),
    });

    const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    return NextResponse.json({ user: userRows[0], message: "Patient created successfully" });
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
      return NextResponse.json({ error: "Patient ID required" }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
