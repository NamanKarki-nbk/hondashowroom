import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const { id, price, inStock, specs } = data;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const existingProduct = await prisma.productCatalog.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Merge new specs with existing specs if specs are provided
    let updatedSpecs = existingProduct.specs;
    if (specs) {
      updatedSpecs = {
        ...(typeof existingProduct.specs === 'object' ? existingProduct.specs : {}),
        ...specs
      };
    }

    const updatedProduct = await prisma.productCatalog.update({
      where: { id },
      data: {
        specs: updatedSpecs ? (updatedSpecs as any) : undefined,
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
