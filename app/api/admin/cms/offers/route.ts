import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/upload";
import { z } from "zod";

const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  offerType: z.string().optional().default("Cash Discount"),
  isActive: z.coerce.boolean().default(true),
  startDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  endDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
});

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(offers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Parse fields
    const fields = Object.fromEntries(formData.entries());
    const parsed = offerSchema.safeParse(fields);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const file = formData.get("image") as File | null;
    let imageUrl = null;
    
    if (file && file.size > 0) {
      imageUrl = await uploadToCloudinary(file, 'honda-showroom/offers');
    }

    const offer = await prisma.offer.create({
      data: {
        ...parsed.data,
        imageUrl,
      },
    });

    return NextResponse.json(offer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Parse fields
    const fields = Object.fromEntries(formData.entries());
    const parsed = offerSchema.safeParse(fields);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    // Check if updating file
    const file = formData.get("image") as File | null;
    let imageUrl: string | undefined;

    if (file && file.size > 0) {
      // Upload new image
      imageUrl = await uploadToCloudinary(file, 'honda-showroom/offers');
      
      // Delete old image
      const existingOffer = await prisma.offer.findUnique({ where: { id } });
      if (existingOffer && existingOffer.imageUrl) {
        await deleteFromCloudinary(existingOffer.imageUrl);
      }
    }

    const dataToUpdate = { ...parsed.data } as any;
    if (imageUrl !== undefined) {
      dataToUpdate.imageUrl = imageUrl;
    }

    const offer = await prisma.offer.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(offer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existingOffer = await prisma.offer.findUnique({ where: { id } });
    if (!existingOffer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (existingOffer.imageUrl) {
      await deleteFromCloudinary(existingOffer.imageUrl);
    }

    await prisma.offer.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
