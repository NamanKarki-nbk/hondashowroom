import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';
import { verifySessionToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    const { invoice, vehicles } = await req.json();

    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      return NextResponse.json({ error: 'No vehicles provided to save' }, { status: 400 });
    }

    // 1. Find the highest existing D1-P index number
    const existingInventories = await prisma.vehicleInventory.findMany({
      where: { indexNo: { startsWith: 'D1-P' } },
      select: { indexNo: true }
    });

    let maxIndex = 0;
    for (const item of existingInventories) {
      if (item.indexNo) {
        const numPart = item.indexNo.replace('D1-P', '');
        const num = parseInt(numPart, 10);
        if (!isNaN(num) && num > maxIndex) {
          maxIndex = num;
        }
      }
    }

    // 2. Create the PurchaseInvoice
    let purchaseInvoiceId = null;
    if (invoice && invoice.invoiceNo) {
      // Upsert to handle cases where the invoice might already exist
      const newInvoice = await prisma.purchaseInvoice.upsert({
        where: { invoiceNo: invoice.invoiceNo },
        update: {
          invoiceDate: invoice.invoiceDate || null,
          totalAmount: invoice.totalAmount || 0,
          purchaseType: invoice.purchaseType || 'Standard',
        },
        create: {
          invoiceNo: invoice.invoiceNo,
          invoiceDate: invoice.invoiceDate || null,
          totalAmount: invoice.totalAmount || 0,
          purchaseType: invoice.purchaseType || 'Standard',
        }
      });
      purchaseInvoiceId = newInvoice.id;

      await logActivity({
        userId: session?.userId || session?.id || "system",
        action: "CREATE",
        entity: "VehicleInventory",
        entityId: newInvoice.id,
        details: {
          invoiceNo: newInvoice.invoiceNo,
          totalAmount: newInvoice.totalAmount,
          purchaseType: newInvoice.purchaseType,
        }
      });
    }

    // 3. Insert vehicles sequentially
    let insertedCount = 0;
    let currentIndex = maxIndex + 1;
    
    const damakBranch = await prisma.branch.findFirst({
      where: { name: { contains: 'Damak' } }
    });

    for (const vehicle of vehicles) {
      try {
        let validDate = new Date();
        if (vehicle.purchaseDate) {
          const d = new Date(vehicle.purchaseDate);
          if (!isNaN(d.getTime())) {
            validDate = d;
          }
        }

        const createdVehicle = await prisma.vehicleInventory.create({
          data: {
            ...vehicle,
            purchaseDate: validDate,
            indexNo: `D1-P${currentIndex}`,
            purchaseInvoiceId: purchaseInvoiceId,
            branchId: damakBranch?.id || undefined,
          }
        });

        await logActivity({
          userId: session?.userId || session?.id || "system",
          action: "CREATE",
          entity: "VehicleInventory",
          entityId: createdVehicle.id,
          details: {
            vin: createdVehicle.vin,
            indexNo: createdVehicle.indexNo,
            color: createdVehicle.color,
          }
        });

        currentIndex++;
        insertedCount++;
      } catch (err: any) {
        // Unique constraint violation (P2002) is expected if vehicle VIN already exists
        if (err.code !== 'P2002') {
          console.error('Error inserting vehicle:', err);
        }
      }
    }

    const message = insertedCount > 0 
      ? `Successfully generated sequences D1-P${maxIndex + 1} to D1-P${maxIndex + insertedCount} and saved ${insertedCount} vehicles.`
      : `0 new vehicles saved. They may already exist in the inventory (duplicate VINs) or the data was invalid.`;

    return NextResponse.json({ 
      success: true, 
      message,
      insertedCount 
    });
  } catch (error) {
    console.error('Error saving parsed invoice:', error);
    return NextResponse.json({ error: 'Failed to save parsed invoice and vehicles' }, { status: 500 });
  }
}
