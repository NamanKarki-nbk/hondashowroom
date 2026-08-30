import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';
import { verifySessionToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { vehicleId, targetBranchId, fromBranchId, notes } = await request.json();

    if (!vehicleId || !targetBranchId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Wrap in transaction with increased timeout to prevent P2028 errors
    await prisma.$transaction(async (tx) => {
      await tx.vehicleInventory.update({
        where: { id: vehicleId },
        data: { branchId: targetBranchId }
      });

      await tx.stockTransferLog.create({
        data: {
          vehicle: { connect: { id: vehicleId } },
          toBranch: { connect: { id: targetBranchId } },
          ...(fromBranchId ? { fromBranch: { connect: { id: fromBranchId } } } : {}),
          status: 'COMPLETED',
          remarks: notes
        }
      });
    }, {
      maxWait: 5000, // default is 2000
      timeout: 15000 // default is 5000
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "VehicleInventory",
      entityId: vehicleId,
      details: {
        vehicleId,
        targetBranchId,
        fromBranchId: fromBranchId || null,
        notes: notes || null,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Transfer vehicle error:', error);
    return NextResponse.json({ error: 'Failed to transfer vehicle' }, { status: 500 });
  }
}
