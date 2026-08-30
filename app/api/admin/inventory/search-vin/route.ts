import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const vin = searchParams.get('vin');

    if (!vin || vin.length < 5) {
      return NextResponse.json({ error: 'VIN search term too short' }, { status: 400 });
    }

    const vehicle = await prisma.vehicleInventory.findFirst({
      where: {
        vin: {
          contains: vin,
          mode: 'insensitive'
        },
        status: 'IN_STOCK'
      },
      include: {
        variant: {
          include: {
            vehicleMaster: true
          }
        }
      }
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found or not in stock' }, { status: 404 });
    }

    const sellingPrice = vehicle.variant.exShowroomPriceNPR || (vehicle.purchasePrice * 1.15); // Fallback to 15% margin if price not set

    return NextResponse.json({ 
      vehicle: {
        id: vehicle.id,
        vin: vehicle.vin,
        engineNo: vehicle.engineNo,
        model: vehicle.variant?.vehicleMaster?.name || 'Unknown',
        color: vehicle.color,
        category: vehicle.variant?.vehicleMaster?.category || 'MOTORCYCLE',
        price: sellingPrice,
        status: 'IN_STOCK'
      } 
    });
  } catch (error) {
    console.error('Error searching vehicle by VIN:', error);
    return NextResponse.json({ error: 'Failed to search vehicle' }, { status: 500 });
  }
}
