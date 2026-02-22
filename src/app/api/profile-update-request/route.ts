import { NextResponse } from "next/server";
import { 
  getProfileUpdateRequests, 
  getProfileUpdateRequestById, 
  getProfileUpdateRequestsByUser,
  getPendingProfileUpdateRequests,
  createProfileUpdateRequest, 
  updateProfileUpdateRequest 
} from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    const pending = searchParams.get("pending");

    if (id) {
      const request_data = getProfileUpdateRequestById(id);
      if (!request_data) {
        return NextResponse.json({ error: "Profile update request not found" }, { status: 404 });
      }
      return NextResponse.json(request_data);
    }

    if (userId) {
      const requests = getProfileUpdateRequestsByUser(userId);
      return NextResponse.json(requests);
    }

    if (pending === "true") {
      const requests = getPendingProfileUpdateRequests();
      return NextResponse.json(requests);
    }

    // Return all profile update requests (admin only)
    const requests = getProfileUpdateRequests();
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching profile update requests:", error);
    return NextResponse.json({ error: "Failed to fetch profile update requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const profileRequest = createProfileUpdateRequest({
      userId: body.userId,
      userName: body.userName,
      userEmail: body.userEmail,
      requestedFields: body.requestedFields,
    });

    return NextResponse.json(profileRequest, { status: 201 });
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

    const profileRequest = updateProfileUpdateRequest(id, data);
    if (!profileRequest) {
      return NextResponse.json({ error: "Profile update request not found" }, { status: 404 });
    }

    return NextResponse.json(profileRequest);
  } catch (error) {
    console.error("Error updating profile update request:", error);
    return NextResponse.json({ error: "Failed to update profile update request" }, { status: 500 });
  }
}
