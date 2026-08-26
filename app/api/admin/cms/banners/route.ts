import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/upload";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  isActive: z.coerce.boolean().default(true),
  order: z.coerce.number().default(0),
});

export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(banners);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Parse fields
    const fields = Object.fromEntries(formData.entries());
    const parsed = bannerSchema.safeParse(fields);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(file, 'honda-showroom/banners');

    const banner = await prisma.heroBanner.create({
      data: {
        ...parsed.data,
        imageUrl,
      },
    });

    return NextResponse.json(banner);
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
    const parsed = bannerSchema.safeParse(fields);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    // Check if updating file
    const file = formData.get("image") as File | null;
    let imageUrl: string | undefined;

    if (file && file.size > 0) {
      // Upload new image
      imageUrl = await uploadToCloudinary(file, 'honda-showroom/banners');
      
      // Delete old image
      const existingBanner = await prisma.heroBanner.findUnique({ where: { id } });
      if (existingBanner && existingBanner.imageUrl) {
        await deleteFromCloudinary(existingBanner.imageUrl);
      }
    }

    const dataToUpdate = { ...parsed.data } as any;
    if (imageUrl) {
      dataToUpdate.imageUrl = imageUrl;
    }

    const banner = await prisma.heroBanner.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(banner);
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

    const existingBanner = await prisma.heroBanner.findUnique({ where: { id } });
    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (existingBanner.imageUrl) {
      await deleteFromCloudinary(existingBanner.imageUrl);
    }

    await prisma.heroBanner.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
