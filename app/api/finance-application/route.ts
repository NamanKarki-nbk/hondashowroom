// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_session")?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifySessionToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

    const data = await req.json();
    
    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { userId: payload.userId }
    });
    
    if (!customer) {
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (user) {
        customer = await prisma.customer.create({
          data: {
            fullName: user.fullName || user.name || 'Unknown',
            phone: user.phone,
            email: user.email,
            userId: user.id
          }
        });
      } else {
         return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    const application = await prisma.financeApplication.create({
      data: {
        customerId: customer.id,
        planId: data.planId,
        loanAmount: data.loanAmount,
        downPayment: data.downPayment,
        tenureMonths: data.tenureMonths,
        monthlyEmi: data.monthlyEmi,
        employmentType: data.employmentType,
        monthlyIncome: data.monthlyIncome,
        status: 'PENDING'
      }
    });

    // Create admin notification
    await prisma.adminNotification.create({
      data: {
        userId: 'ADMIN', // Generic admin notification
        type: 'FINANCE',
        title: 'New Finance Application',
        message: `${customer.fullName} applied for a loan of Rs. ${data.loanAmount.toLocaleString()}`,
        link: '/admin/finance/applications'
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Failed to submit finance application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
