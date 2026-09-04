import { prisma } from "@/lib/prisma";
import DayBookClient from "./DayBookClient";

export const metadata = {
  title: "Day Book | Accounts | Society Enterprises",
};

export const revalidate = 0;

function toDateRange(dateStr: string, mode: "day" | "month" | "year") {
  const date = new Date(dateStr + "T00:00:00+05:45");
  const year = date.getFullYear();
  const month = date.getMonth();

  if (mode === "year") {
    return {
      dayStart: new Date(`${year}-01-01T00:00:00+05:45`),
      dayEnd: new Date(`${year}-12-31T23:59:59+05:45`)
    };
  } else if (mode === "month") {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const monthStr = String(month + 1).padStart(2, "0");
    return {
      dayStart: new Date(`${year}-${monthStr}-01T00:00:00+05:45`),
      dayEnd: new Date(`${year}-${monthStr}-${lastDay}T23:59:59+05:45`)
    };
  } else {
    return {
      dayStart: new Date(dateStr + "T00:00:00+05:45"),
      dayEnd: new Date(dateStr + "T23:59:59+05:45")
    };
  }
}

export default async function DayBookPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  const mode = (sp.mode || "day") as "day" | "month" | "year";
  
  // Default to today in NPT
  const todayNPT = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })
  );
  const defaultDate = todayNPT.toISOString().split("T")[0];
  const selectedDate = sp.date || defaultDate;

  const { dayStart, dayEnd } = toDateRange(selectedDate, mode);

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

  // General Income: All DayBookIncome on this day
  const generalIncomes = await prisma.dayBookIncome.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
    },
    orderBy: { createdAt: "asc" },
  });

  // Opening balance = sum of all receipts BEFORE this day - sum of all expenses BEFORE this day
  const [prevReceiptsSum, prevExpensesSum, prevIncomesSum] = await Promise.all([
    prisma.paymentReceipt.aggregate({
      _sum: { amount: true },
      where: { createdAt: { lt: dayStart } },
    }),
    prisma.dayBookExpense.aggregate({
      _sum: { amount: true },
      where: { date: { lt: dayStart } },
    }),
    prisma.dayBookIncome.aggregate({
      _sum: { amount: true },
      where: { date: { lt: dayStart } },
    }),
  ]);

  const openingBalance =
    (prevReceiptsSum._sum.amount || 0) + (prevIncomesSum._sum.amount || 0) - (prevExpensesSum._sum.amount || 0);
  const totalIncome = receipts.reduce((s, r) => s + r.amount, 0) + generalIncomes.reduce((s, i) => s + i.amount, 0);
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
          mode={mode}
          receipts={JSON.parse(JSON.stringify(receipts))}
          generalIncomes={JSON.parse(JSON.stringify(generalIncomes))}
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
