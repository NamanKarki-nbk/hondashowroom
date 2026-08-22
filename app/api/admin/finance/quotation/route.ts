import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.customerName || !data.phone || !data.bikeModel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const quotation = await prisma.digitalQuotation.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        bikeModel: data.bikeModel,
        basePrice: data.basePrice,
        downPayment: data.downPayment,
        loanAmount: data.loanAmount,
        emiAmount: data.emiAmount,
        tenureMonths: data.tenureMonths,
        interestRate: data.interestRate,
        validUntil: new Date(data.validUntil)
      }
    });

    return NextResponse.json({ success: true, quotation });
  } catch (error) {
    console.error('Save quotation error:', error);
    return NextResponse.json({ error: 'Failed to save quotation' }, { status: 500 });
  }
}
