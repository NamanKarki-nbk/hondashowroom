import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const branchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  mapUrl: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  isActive: z.coerce.boolean().default(true),
});

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(branches);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const parsed = branchSchema.safeParse(data);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const branch = await prisma.branch.create({
      data: parsed.data,
    });

    return NextResponse.json(branch);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const parsed = branchSchema.safeParse(updateData);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(branch);
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
    
    // Check for related records before deleting
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        _count: {
          select: { testRides: true, vehicles: true }
        }
      }
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    if (branch._count.testRides > 0 || branch._count.vehicles > 0) {
      return NextResponse.json({ 
        error: `Cannot delete branch because it has ${branch._count.testRides} test rides and ${branch._count.vehicles} vehicles linked to it.` 
      }, { status: 400 });
    }

    await prisma.branch.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
