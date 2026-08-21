import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { differenceInDays } from 'date-fns';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    // Fetch all vehicle inventory items
    const inventoryItems = await prisma.vehicleInventory.findMany({});

    // Fetch vehicles to map prices
    const vehicles = await prisma.vehicle.findMany({
      select: { modelName: true, price: true, colors: true }
    });

    const now = new Date();

    const mappedItems = inventoryItems.map(item => {
      const vehicleDef = vehicles.find(v => v.modelName === item.modelName);
      
      const sellingPrice = vehicleDef ? vehicleDef.price : item.purchasePrice; // fallback
      
      // Calculate days in stock
      const daysInStock = differenceInDays(now, new Date(item.purchaseDate));
      
      // Attempt to find color hex if exists
      const colorDef = vehicleDef?.colors.find(c => c.name.toLowerCase() === item.color.toLowerCase() || item.color.includes(c.name));
      const hexCode = colorDef ? colorDef.hexCode : "#CCCCCC";

      return {
        ...item,
        sellingPrice,
        daysInStock: daysInStock >= 0 ? daysInStock : 0,
        hexCode
      };
    });

    // Client-side or basic server-side filtering
    const filteredItems = mappedItems.filter(item => {
      if (!search) return true;
      return (
        item.modelName.toLowerCase().includes(search) ||
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
        return parsedA.num - parsedB.num;
      }
      return parsedA.prefix.localeCompare(parsedB.prefix);
    });

    return NextResponse.json(filteredItems);
  } catch (error) {
    console.error('Error fetching vehicle inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}
