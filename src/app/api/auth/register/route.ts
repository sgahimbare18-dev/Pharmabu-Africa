import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, hashPassword } from "@/lib/store";

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
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const user = createUser({
      name,
      email,
      phone,
      country,
      passwordHash: hashPassword(password),
      role: "patient",
    });

    return NextResponse.json(
      { message: "Account created successfully.", userId: user.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
