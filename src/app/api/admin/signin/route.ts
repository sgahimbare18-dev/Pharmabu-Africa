import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (
      email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
      hashPassword(password) !== ADMIN_PASSWORD_HASH
    ) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    return NextResponse.json({
      message: "Admin sign in successful.",
      user: {
        email: ADMIN_EMAIL,
        role: "admin",
        name: "PharmaBu Admin",
      },
    });
  } catch (err) {
    console.error("Admin sign in error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
