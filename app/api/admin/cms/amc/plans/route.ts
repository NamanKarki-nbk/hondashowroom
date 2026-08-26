import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.amcPlan.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(plans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan = await prisma.amcPlan.create({
      data: {
        title: body.title,
        price: Number(body.price),
        savings: Number(body.savings),
        features: body.features || [],
        isPopular: Boolean(body.isPopular),
        isActive: Boolean(body.isActive),
        order: Number(body.order || 0),
      }
    });
    return NextResponse.json(plan);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const plan = await prisma.amcPlan.update({
      where: { id },
      data: {
        title: data.title,
        price: Number(data.price),
        savings: Number(data.savings),
        features: data.features,
        isPopular: Boolean(data.isPopular),
        isActive: Boolean(data.isActive),
        order: Number(data.order || 0),
      }
    });
    return NextResponse.json(plan);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await prisma.amcPlan.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
