import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get("pharmacyId");
    const adminSession = request.headers.get("x-admin-session");

    // If admin session, return all messages
    if (adminSession === "pharmalink-admin") {
      const allMessages = await db.select().from(messages);
      return NextResponse.json({ messages: allMessages });
    }

    // If pharmacy session, return only their messages
    if (pharmacyId) {
      const pharmacyMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.pharmacyId, pharmacyId));
      return NextResponse.json({ messages: pharmacyMessages });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pharmacyId, pharmacyName, pharmacistName, subject, content, type } = body;

    if (!pharmacyId || !pharmacyName || !pharmacistName || !subject || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const message = {
      id: crypto.randomUUID(),
      pharmacyId,
      pharmacyName,
      pharmacistName,
      subject,
      content,
      status: "unread" as const,
      type: (type || "general") as "deletion_request" | "general",
      createdAt: new Date().toISOString(),
    };

    await db.insert(messages).values(message);

    return NextResponse.json({ message, success: "Message sent successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
