import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ customers: [] });
    }

    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
          { documents: { some: { docNumber: { contains: query } } } }
        ]
      },
      take: 5,
      select: {
        id: true,
        fullName: true,
        phone: true,
        isVerified: true,
        documents: {
          select: { docType: true, docNumber: true }
        }
      }
    });

    const formattedCustomers = customers.map(c => {
      const citizenship = c.documents.find(d => d.docType === 'CITIZENSHIP')?.docNumber;
      const license = c.documents.find(d => d.docType === 'DRIVING_LICENSE' || d.docType === 'LICENSE')?.docNumber;
      
      return {
        ...c,
        citizenshipNumber: citizenship,
        licenseNumber: license
      };
    });

    return NextResponse.json({ customers: formattedCustomers });
  } catch (error) {
    console.error('Customer search error:', error);
    return NextResponse.json({ error: 'Failed to search customers' }, { status: 500 });
  }
}
