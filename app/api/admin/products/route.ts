import { NextResponse } from 'next/server';
import { VehicleCategory } from '@/app/generated/prisma';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/upload';
import { z } from 'zod';
import { logActivity } from "@/lib/activityLogger";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

export async function GET() {
  try {
    const products = await prisma.vehicleMaster.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}



const productSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  basePrice: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const fields = Object.fromEntries(formData.entries());
    const parsed = productSchema.safeParse(fields);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const imageUrl = await uploadToCloudinary(file, 'honda-showroom/products');

    const product = await prisma.vehicleMaster.create({
      data: {
        id: parsed.data.id,
        name: parsed.data.name,
        category: parsed.data.category as VehicleCategory,
        basePrice: parsed.data.basePrice,
        description: parsed.data.description || null,
        imageUrl,
      }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "CREATE",
      entity: "Product",
      entityId: product.id,
      details: {
        name: product.name,
        category: product.category,
        basePrice: product.basePrice,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const fields = Object.fromEntries(formData.entries());
    const parsed = productSchema.safeParse(fields);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const file = formData.get("image") as File | null;
    let imageUrl: string | undefined;

    if (file && file.size > 0) {
      imageUrl = await uploadToCloudinary(file, 'honda-showroom/products');
      
      const existing = await prisma.vehicleMaster.findUnique({ where: { id: parsed.data.id } });
      if (existing && existing.imageUrl) {
        await deleteFromCloudinary(existing.imageUrl);
      }
    }

    const dataToUpdate: any = {
      name: parsed.data.name,
      category: parsed.data.category as VehicleCategory,
      basePrice: parsed.data.basePrice,
      description: parsed.data.description || null,
    };
    
    if (imageUrl) {
      dataToUpdate.imageUrl = imageUrl;
    }

    const product = await prisma.vehicleMaster.update({
      where: { id: parsed.data.id },
      data: dataToUpdate
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "Product",
      entityId: product.id,
      details: {
        name: product.name,
        category: product.category,
        basePrice: product.basePrice,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.vehicleMaster.delete({
      where: { id }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "DELETE",
      entity: "Product",
      entityId: id,
      details: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
