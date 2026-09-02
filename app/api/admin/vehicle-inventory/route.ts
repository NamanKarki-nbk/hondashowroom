import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { differenceInDays } from 'date-fns';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    // Fetch all vehicle inventory items
    const inventoryItems = await prisma.vehicleInventory.findMany({
      include: { variant: { include: { vehicleMaster: true } } }
    });

    // Fetch vehicles to map prices and details
    const vehicles = await prisma.vehicleMaster.findMany({
      select: { name: true, basePrice: true, colors: true, category: true, specifications: true }
    });

    const now = new Date();

    const mappedItems = inventoryItems.map(item => {
      const vehicleDef = vehicles.find(v => v.name === item.variant?.vehicleMaster?.name);
      
      const sellingPrice = vehicleDef ? vehicleDef.basePrice : item.purchasePrice; // fallback
      
      // Calculate days in stock
      const daysInStock = differenceInDays(now, new Date(item.purchaseDate));
      
      // Attempt to find color hex if exists
      const colorDef = vehicleDef?.colors?.find((c: any) => c.name.toLowerCase() === item.color.toLowerCase() || item.color.includes(c.name));
      const hexCode = colorDef ? colorDef.hexCode : "#CCCCCC";

      let cc = 0;
      if (vehicleDef?.specifications && typeof vehicleDef.specifications === 'object') {
        const specs = vehicleDef.specifications as any;
        const engineSpecs = specs.Engine_Performance || [];
        const displacement = engineSpecs.find((s: any) => s.label === 'Displacement');
        if (displacement && displacement.value) {
          cc = parseFloat(displacement.value) || 0;
        }
      }

      return {
        ...item,
        name: vehicleDef?.name || item.variant?.vehicleMaster?.name || "Unknown Model",
        category: vehicleDef?.category || "N/A",
        cc,
        sellingPrice,
        daysInStock: daysInStock >= 0 ? daysInStock : 0,
        hexCode
      };
    });

    // Client-side or basic server-side filtering
    const filteredItems = mappedItems.filter(item => {
      if (!search) return true;
      return (
        (item.variant?.vehicleMaster?.name || '').toLowerCase().includes(search) ||
        item.vin.toLowerCase().includes(search) ||
        item.engineNo.toLowerCase().includes(search) ||
        (item.indexNo && item.indexNo.toLowerCase().includes(search))
      );
    });

    // Custom sort to handle alphanumeric indexNo like 'D1-P1', 'D1-P10', 'D1-P2' correctly
    filteredItems.sort((a, b) => {
      if (!a.indexNo && !b.indexNo) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (!a.indexNo) return 1;
      if (!b.indexNo) return -1;

      const parseIndex = (idx: string) => {
        const match = idx.match(/^([A-Za-z0-9]+)-P(\d+)$/i);
        if (match) {
          return { prefix: match[1], num: parseInt(match[2], 10) };
        }
        return { prefix: idx, num: 0 };
      };

      const parsedA = parseIndex(a.indexNo);
      const parsedB = parseIndex(b.indexNo);

      if (parsedA.prefix === parsedB.prefix) {
        return parsedA.num - parsedB.num; // Ascending order
      }
      return parsedA.prefix.localeCompare(parsedB.prefix); // Ascending order
    });

    return NextResponse.json(filteredItems);
  } catch (error) {
    console.error('Error fetching vehicle inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
    }

    const transactions = await prisma.salesTransaction.findMany({ where: { vehicleId: id }, select: { id: true } });
    const transactionIds = transactions.map(t => t.id);

    await prisma.$transaction([
      prisma.stockTransferLog.deleteMany({ where: { vehicleId: id } }),
      prisma.serviceReminder.deleteMany({ where: { vehicleId: id } }),
      prisma.serviceRecord.deleteMany({ where: { vehicleId: id } }),
      prisma.paymentReceipt.deleteMany({ where: { transactionId: { in: transactionIds } } }),
      prisma.salesTransaction.deleteMany({ where: { vehicleId: id } }),
      prisma.vehicleInventory.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}
