import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';
import { verifySessionToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const products = await prisma.productCatalog.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, price, inStock, specifications } = data;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const existingProduct = await prisma.productCatalog.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Merge new specifications with existing specifications if specifications are provided
    let updatedSpecs = existingProduct.specifications;
    if (specifications) {
      updatedSpecs = {
        ...(typeof existingProduct.specifications === 'object' ? existingProduct.specifications : {}),
        ...specifications
      };
    }

    const updatedProduct = await prisma.productCatalog.update({
      where: { id },
      data: {
        specifications: updatedSpecs ? (updatedSpecs as any) : undefined,
      }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "VehicleInventory",
      entityId: updatedProduct.id,
      details: {
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price,
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
