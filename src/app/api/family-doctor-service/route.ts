import { NextResponse } from "next/server";
import { 
  getFamilyDoctorServices, 
  getFamilyDoctorServiceById, 
  getFamilyDoctorServicesByPharmacy,
  getAvailableFamilyDoctorServices,
  createFamilyDoctorService, 
  updateFamilyDoctorService, 
  deleteFamilyDoctorService 
} from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const pharmacyId = searchParams.get("pharmacyId");
    const available = searchParams.get("available");

    if (id) {
      const service = getFamilyDoctorServiceById(id);
      if (!service) {
        return NextResponse.json({ error: "Family doctor service not found" }, { status: 404 });
      }
      return NextResponse.json(service);
    }

    if (pharmacyId) {
      const services = getFamilyDoctorServicesByPharmacy(pharmacyId);
      return NextResponse.json(services);
    }

    if (available === "true") {
      const services = getAvailableFamilyDoctorServices();
      return NextResponse.json(services);
    }

    // Return all family doctor services (admin only)
    const services = getFamilyDoctorServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching family doctor services:", error);
    return NextResponse.json({ error: "Failed to fetch family doctor services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const service = createFamilyDoctorService({
      pharmacyId: body.pharmacyId,
      pharmacyName: body.pharmacyName,
      pharmacistName: body.pharmacistName,
      description: body.description || "",
      monthlyFee: body.monthlyFee || 0,
      servicesIncluded: body.servicesIncluded || "",
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating family doctor service:", error);
    return NextResponse.json({ error: "Failed to create family doctor service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    const service = updateFamilyDoctorService(id, data);
    if (!service) {
      return NextResponse.json({ error: "Family doctor service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating family doctor service:", error);
    return NextResponse.json({ error: "Failed to update family doctor service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    const deleted = deleteFamilyDoctorService(id);
    if (!deleted) {
      return NextResponse.json({ error: "Family doctor service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting family doctor service:", error);
    return NextResponse.json({ error: "Failed to delete family doctor service" }, { status: 500 });
  }
}
