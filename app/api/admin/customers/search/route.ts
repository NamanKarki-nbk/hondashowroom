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
          { citizenshipNumber: { contains: query } },
          { licenseNumber: { contains: query } }
        ]
      },
      take: 5,
      select: {
        id: true,
        fullName: true,
        phone: true,
        citizenshipNumber: true,
        licenseNumber: true
      }
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Customer search error:', error);
    return NextResponse.json({ error: 'Failed to search customers' }, { status: 500 });
  }
}
