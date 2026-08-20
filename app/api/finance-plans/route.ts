import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model');
    const tenure = searchParams.get('tenure');
    const downPayment = searchParams.get('downPayment');

    const whereClause: any = {};
    if (model) whereClause.modelName = model;
    if (tenure) whereClause.tenureMonths = parseInt(tenure, 10);
    if (downPayment) whereClause.downPaymentPct = parseInt(downPayment, 10);

    const plans = await prisma.financePlan.findMany({
      where: whereClause,
      orderBy: [
        { modelName: 'asc' },
        { tenureMonths: 'asc' },
        { downPaymentPct: 'desc' }
      ]
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching finance plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finance plans' },
      { status: 500 }
    );
  }
}
