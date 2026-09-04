import { prisma } from "@/lib/prisma";
import DayBookClient from "./DayBookClient";

export const metadata = {
  title: "Day Book | Accounts | Society Enterprises",
};

export const revalidate = 0;

function toDateRange(dateStr: string) {
  const start = new Date(dateStr + "T00:00:00.000Z");
  // Adjust for NPT (+5:45) — store as UTC boundaries
  const dayStart = new Date(dateStr + "T00:00:00+05:45");
  const dayEnd = new Date(dateStr + "T23:59:59+05:45");
  return { dayStart, dayEnd };
}

export default async function DayBookPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const sp = await searchParams;
  // Default to today in NPT
  const todayNPT = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })
  );
  const defaultDate = todayNPT.toISOString().split("T")[0];
  const selectedDate = sp.date || defaultDate;

  const { dayStart, dayEnd } = toDateRange(selectedDate);

  // Income: All PaymentReceipts on this day
  const receipts = await prisma.paymentReceipt.findMany({
    where: { createdAt: { gte: dayStart, lte: dayEnd } },
    include: {
      transaction: {
        include: {
          customer: true,
          vehicle: {
            include: {
              variant: { include: { vehicleMaster: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Expenses: All DayBookExpense on this day
  const expenses = await prisma.dayBookExpense.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
    },
    orderBy: { createdAt: "asc" },
  });

  // Opening balance = sum of all receipts BEFORE this day - sum of all expenses BEFORE this day
  const [prevReceiptsSum, prevExpensesSum] = await Promise.all([
    prisma.paymentReceipt.aggregate({
      _sum: { amount: true },
      where: { createdAt: { lt: dayStart } },
    }),
    prisma.dayBookExpense.aggregate({
      _sum: { amount: true },
      where: { date: { lt: dayStart } },
    }),
  ]);

  const openingBalance =
    (prevReceiptsSum._sum.amount || 0) - (prevExpensesSum._sum.amount || 0);
  const totalIncome = receipts.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const closingBalance = openingBalance + totalIncome - totalExpenses;

  return (
    <div className="bg-transparent text-gray-900 dark:text-gray-100 p-4 md:p-8 h-full transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Day Book
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-wide">
            Daily income from cash receipts, expenses, and closing balance.
          </p>
        </header>

        <DayBookClient
          selectedDate={selectedDate}
          defaultDate={defaultDate}
          receipts={JSON.parse(JSON.stringify(receipts))}
          expenses={JSON.parse(JSON.stringify(expenses))}
          openingBalance={openingBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          closingBalance={closingBalance}
        />
      </div>
    </div>
  );
}
