import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';

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

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "CREATE",
      entity: "SystemSetting",
      entityId: staff.id,
      details: {
        name: staff.name,
        role: staff.role,
        phone: staff.phone,
        accountNo: staff.accountNo,
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

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "SystemSetting",
      entityId: staff.id,
      details: {
        name: staff.name,
        role: staff.role,
        phone: staff.phone,
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

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "DELETE",
      entity: "SystemSetting",
      entityId: id,
      details: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete staff error:', error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}
