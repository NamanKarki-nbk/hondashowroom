import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const includeVariant = {
  variant: {
    include: {
      vehicleMaster: true
    }
  }
};

const mapPlan = (p: any) => ({
  ...p,
  name: p.variant?.vehicleMaster?.name || 'Unknown',
  category: p.variant?.vehicleMaster?.category || 'Unknown',
  cc: p.variant?.variantName || '',
  vehicleVariant: p.variant?.exShowroomPriceNPR || 0,
});

export async function GET(req: Request) {
  try {
    const plans = await prisma.financePlan.findMany({
      orderBy: { createdAt: 'desc' },
      include: includeVariant
    });
    return NextResponse.json(plans.map(mapPlan));
  } catch (error) {
    console.error('Failed to fetch finance plans:', error);
    return NextResponse.json({ error: 'Failed to fetch finance plans' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const plan = await prisma.financePlan.create({
      data: {
        variantId: body.variantId,
        tenureMonths: Number(body.tenureMonths),
        downPaymentPct: Number(body.downPaymentPct),
        interestRate: Number(body.interestRate),
        downPayment: Number(body.downPayment),
        loanAmount: Number(body.loanAmount),
        emi: Number(body.emi),
        totalInterest: Number(body.totalInterest),
        registration: Number(body.registration),
        serviceCharge: Number(body.serviceCharge || 0),
        insurance: Number(body.insurance),
        insuranceTotal: body.insuranceTotal ? Number(body.insuranceTotal) : null,
        totalCost: Number(body.totalCost),
      },
      include: includeVariant
    });
    return NextResponse.json(mapPlan(plan));
  } catch (error) {
    console.error('Failed to create finance plan:', error);
    return NextResponse.json({ error: 'Failed to create finance plan' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const plan = await prisma.financePlan.update({
      where: { id },
      data: {
        variantId: data.variantId,
        tenureMonths: Number(data.tenureMonths),
        downPaymentPct: Number(data.downPaymentPct),
        interestRate: Number(data.interestRate),
        downPayment: Number(data.downPayment),
        loanAmount: Number(data.loanAmount),
        emi: Number(data.emi),
        totalInterest: Number(data.totalInterest),
        registration: Number(data.registration),
        serviceCharge: Number(data.serviceCharge || 0),
        insurance: Number(data.insurance),
        insuranceTotal: data.insuranceTotal ? Number(data.insuranceTotal) : null,
        totalCost: Number(data.totalCost),
      },
      include: includeVariant
    });
    return NextResponse.json(mapPlan(plan));
  } catch (error) {
    console.error('Failed to update finance plan:', error);
    return NextResponse.json({ error: 'Failed to update finance plan' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.financePlan.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete finance plan:', error);
    return NextResponse.json({ error: 'Failed to delete finance plan' }, { status: 500 });
  }
}
