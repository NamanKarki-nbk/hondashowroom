import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const rawLeads = await prisma.lead.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    const testRides = await prisma.testRideBooking.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    const combinedLeads = [
      ...rawLeads.map(lead => ({
        id: `lead_${lead.id}`,
        name: lead.name,
        phone: lead.phone,
        source: lead.source,
        status: lead.status,
        interestedIn: lead.interestedIn,
        remarks: lead.remarks,
        createdAt: lead.createdAt
      })),
      ...testRides.map(tr => ({
        id: `testride_${tr.id}`,
        name: tr.name,
        phone: tr.phone,
        source: 'TEST RIDE',
        status: tr.status === 'PENDING' ? 'NEW' : tr.status, // Map PENDING to NEW for UI consistency
        interestedIn: tr.modelName,
        remarks: `Preferred Date: ${new Date(tr.preferredDate).toLocaleDateString()} | Slot: ${tr.timeSlot || 'N/A'} | Notes: ${tr.notes || 'None'}`,
        createdAt: tr.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(combinedLeads);
  } catch (error) {
    console.error('Fetch leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, remarks } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    let updated;
    
    if (id.startsWith('testride_')) {
      const realId = id.replace('testride_', '');
      updated = await prisma.testRideBooking.update({
        where: { id: realId },
        data: {
          ...(status && { status }),
          ...(remarks !== undefined && { notes: remarks }),
        }
      });
    } else {
      const realId = id.startsWith('lead_') ? id.replace('lead_', '') : id;
      updated = await prisma.lead.update({
        where: { id: realId },
        data: {
          ...(status && { status }),
          ...(remarks !== undefined && { remarks }),
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
