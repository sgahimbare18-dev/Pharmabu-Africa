import { NextResponse } from "next/server";
import { createMessage, getMessagesByPharmacy, getMessages } from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get("pharmacyId");
    const adminSession = request.headers.get("x-admin-session");

    // If admin session, return all messages
    if (adminSession === "pharmalink-admin") {
      const messages = getMessages();
      return NextResponse.json({ messages });
    }

    // If pharmacy session, return only their messages
    if (pharmacyId) {
      const messages = getMessagesByPharmacy(pharmacyId);
      return NextResponse.json({ messages });
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

    const message = createMessage({
      pharmacyId,
      pharmacyName,
      pharmacistName,
      subject,
      content,
      type: type || "general",
    });

    return NextResponse.json({ message, success: "Message sent successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
