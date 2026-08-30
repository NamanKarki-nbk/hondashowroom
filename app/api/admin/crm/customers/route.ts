import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // Build search query if provided
    const searchFilter = search ? {
      OR: [
        { fullName: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {};

    // Only get customers who have AT LEAST ONE sales transaction (Vehicle Purchasers)
    const customers = await prisma.customer.findMany({
      where: {
        ...searchFilter,
        sales: {
          some: {} // Must have at least one sale
        }
      },
      include: {
        documents: true,
        sales: {
          include: {
            vehicle: {
              include: {
                variant: {
                  include: {
                    vehicleMaster: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the response payload for the frontend directory table
    const formattedData = customers.map(c => {
      // Calculate total spend across all their purchases
      const totalSpend = c.sales.reduce((sum, sale) => sum + sale.finalAmount, 0);

      // Extract vehicles they own
      const vehiclesOwned = c.sales.map(sale => sale.vehicle.variant.vehicleMaster.name);

      return {
        id: c.id,
        fullName: c.fullName,
        phone: c.phone,
        email: c.email || "N/A",
        address: c.address || "N/A",
        
        // KYC Status logic
        kycStatus: {
          citizenship: c.documents?.some(d => d.docType === 'CITIZENSHIP' && d.isVerified) || false,
          license: c.documents?.some(d => d.docType === 'LICENSE' && d.isVerified) || false,
          nationalId: c.documents?.some(d => d.docType === 'NATIONAL_ID' && d.isVerified) || false,
          ocrVerified: c.ocrVerified,
          overallVerified: c.isVerified
        },

        // Sales Info
        vehiclesPurchasedCount: c.sales.length,
        vehiclesOwned,
        totalLifetimeSpend: totalSpend,
        
        createdAt: c.createdAt
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching customer directory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
