import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: Request) {
  try {
    const { vehicleId, targetBranchId, fromBranchId, notes } = await request.json();

    if (!vehicleId || !targetBranchId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Wrap in transaction
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
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Transfer vehicle error:', error);
    return NextResponse.json({ error: 'Failed to transfer vehicle' }, { status: 500 });
  }
}
