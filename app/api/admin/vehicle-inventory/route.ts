import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { differenceInDays } from 'date-fns';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    // Fetch all vehicle inventory items
    const inventoryItems = await prisma.vehicleInventory.findMany({
      orderBy: { createdAt: 'desc' }
    });

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

    return NextResponse.json(filteredItems);
  } catch (error) {
    console.error('Error fetching vehicle inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}
