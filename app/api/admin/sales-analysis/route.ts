import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');
    const startYear = parseInt(searchParams.get('startYear') || '2026');

    // Fetch targets
    const targets = await prisma.salesTarget.findMany({
      where: {
        OR: [
          { year: startYear, month: { gte: 4 } }, // April to Dec of startYear
          { year: startYear + 1, month: { lte: 3 } } // Jan to March of nextYear
        ]
      },
      orderBy: [
        { year: 'asc' },
        { month: 'asc' }
      ]
    });

    // Calculate actual sales (for real data)
    const startDate = new Date(startYear, 3, 1); // April 1st
    const endDate = new Date(startYear + 1, 3, 1); // March 1st next year (exclusive)

    // Fetch actual sales counts
    const salesData = await prisma.salesTransaction.groupBy({
      by: ['createdAt'], // Grouping by exact timestamp then filtering in JS since Prisma doesn't natively group by month out of the box in a simple way for all SQL dialects. Or we can just count.
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        }
      }
    });

    // Alternatively, just pull all relevant transactions and group in JS to avoid complex raw queries
    const transactions = await prisma.salesTransaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        }
      },
      select: { createdAt: true }
    });

    const realSales = transactions.reduce((acc, t) => {
      const month = t.createdAt.getMonth() + 1; // 1-12
      const year = t.createdAt.getFullYear();
      const key = `${year}-${month}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Build the data structure
    const months = [
      { name: "April", year: startYear, month: 4 },
      { name: "May", year: startYear, month: 5 },
      { name: "June", year: startYear, month: 6 },
      { name: "July", year: startYear, month: 7 },
      { name: "August", year: startYear, month: 8 },
      { name: "September", year: startYear, month: 9 },
      { name: "October", year: startYear, month: 10 },
      { name: "November", year: startYear, month: 11 },
      { name: "December", year: startYear, month: 12 },
      { name: "January", year: startYear + 1, month: 1 },
      { name: "February", year: startYear + 1, month: 2 },
      { name: "March", year: startYear + 1, month: 3 }
    ];

    let tillDateTarget = 0;
    let tillDateSales = 0;

    const data = months.map(m => {
      const targetObj = targets.find(t => t.year === m.year && t.month === m.month);
      const target = targetObj ? targetObj.target : 0;
      const sales = realSales[`${m.year}-${m.month}`] || 0;

      const isCurrentOrPastMonth = sales > 0 || (new Date().getFullYear() > m.year || (new Date().getFullYear() === m.year && (new Date().getMonth() + 1) >= m.month));
      
      // Calculate till date cumulative
      if (sales > 0) {
        tillDateTarget += target;
        tillDateSales += sales;
      }

      return {
        monthName: m.name,
        year: m.year,
        month: m.month,
        target,
        sales,
        achPercent: target > 0 ? Math.round((sales / target) * 100) : 0,
        // Only show till date if we have sales
        tillDateTarget: sales > 0 ? tillDateTarget : null,
        tillDateSales: sales > 0 ? tillDateSales : null,
        tillDateAchPercent: (sales > 0 && tillDateTarget > 0) ? Math.round((tillDateSales / tillDateTarget) * 100) : null
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Sales analysis error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
