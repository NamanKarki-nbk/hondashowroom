import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/upload";

export async function GET() {
  try {
    const accessories = await prisma.accessory.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(accessories);
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return NextResponse.json({ error: "Failed to fetch accessories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const partNo = formData.get("partNo") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const stockStatus = formData.get("stockStatus") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const compatibilityRaw = formData.get("compatibility") as string;
    const compatibility = compatibilityRaw ? JSON.parse(compatibilityRaw) : [];

    let imageUrl = formData.get("imageUrl") as string || "";
    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToCloudinary(imageFile, 'honda-showroom/accessories');
    }

    const newAccessory = await prisma.accessory.create({
      data: {
        name,
        partNo: partNo || "N/A",
        category,
        price: Number(price),
        imageUrl,
        description,
        stockStatus: stockStatus || "IN_STOCK",
        vehicleType: vehicleType || "Universal",
        compatibility: compatibility || [],
      },
    });

    return NextResponse.json(newAccessory, { status: 201 });
  } catch (error) {
    console.error("Error creating accessory:", error);
    return NextResponse.json({ error: "Failed to create accessory" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const name = formData.get("name") as string;
    const partNo = formData.get("partNo") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const stockStatus = formData.get("stockStatus") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const compatibilityRaw = formData.get("compatibility") as string;
    const compatibility = compatibilityRaw ? JSON.parse(compatibilityRaw) : [];

    let imageUrl = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile && imageFile.size > 0) {
      // Upload new image
      imageUrl = await uploadToCloudinary(imageFile, 'honda-showroom/accessories');
      
      // Delete old image if it's from cloudinary
      const existingAccessory = await prisma.accessory.findUnique({ where: { id } });
      if (existingAccessory && existingAccessory.imageUrl && existingAccessory.imageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(existingAccessory.imageUrl);
      }
    }

    const updatedAccessory = await prisma.accessory.update({
      where: { id },
      data: {
        name,
        partNo: partNo || "N/A",
        category,
        price: Number(price),
        imageUrl,
        description,
        stockStatus,
        vehicleType: vehicleType || "Universal",
        compatibility: compatibility || [],
      },
    });

    return NextResponse.json(updatedAccessory);
  } catch (error) {
    console.error("Error updating accessory:", error);
    return NextResponse.json({ error: "Failed to update accessory" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const existingAccessory = await prisma.accessory.findUnique({ where: { id } });
    if (!existingAccessory) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    if (existingAccessory.imageUrl && existingAccessory.imageUrl.includes('cloudinary.com')) {
      await deleteFromCloudinary(existingAccessory.imageUrl);
    }

    await prisma.accessory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting accessory:", error);
    return NextResponse.json({ error: "Failed to delete accessory" }, { status: 500 });
  }
}
