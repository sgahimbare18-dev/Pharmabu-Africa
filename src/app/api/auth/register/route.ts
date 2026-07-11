import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, country, password } = body as {
      name: string;
      email: string;
      phone: string;
      country: "kenya" | "burundi";
      password: string;
    };

    // Validation
    if (!name || !email || !phone || !country || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Check duplicate
    const existing = await db
      .select()
      .from(users)
      .where(like(users.email, email.toLowerCase()))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
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

    return NextResponse.json(
      { message: "Account created successfully.", userId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
