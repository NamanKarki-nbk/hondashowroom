import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const staff = await prisma.staff.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { accountNo: { contains: search } },
          { panNo: { contains: search } },
          { phone: { contains: search } },
        ]
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Fetch staff error:', error);
    return NextResponse.json({ error: 'Failed to fetch staff', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, role, accountNo, panNo, lastSalary, order } = body;

    if (!name || !accountNo || !panNo) {
      return NextResponse.json({ error: 'Name, Account No, and PAN No are required' }, { status: 400 });
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        phone,
        role: role || 'STAFF',
        accountNo,
        panNo,
        lastSalary: lastSalary ? parseFloat(lastSalary) : null,
        order: order ? parseInt(order) : 0,
      }
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error('Create staff error:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, phone, role, accountNo, panNo, lastSalary, order } = body;

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(role && { role }),
        ...(accountNo && { accountNo }),
        ...(panNo && { panNo }),
        ...(lastSalary !== undefined && { lastSalary: lastSalary ? parseFloat(lastSalary) : null }),
        ...(order !== undefined && { order: parseInt(order) }),
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Update staff error:', error);
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    await prisma.staff.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete staff error:', error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}
