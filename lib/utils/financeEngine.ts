import { prisma } from '@/lib/prisma';

export interface FinanceCalculationResult {
  vehicleModel: string;
  vehiclePrice: number;
  downpaymentAmount: number;
  loanAmount: number;
  insuranceAmount: number;
  registrationCharge: number;
  serviceChargeAmount: number;
  totalInitialPayment: number;
  tenureMonths: number;
  emi: number;
  totalPayable: number;
}

export async function calculateHondaFinance(
  modelPattern: string,
  downpaymentPercent: 40 | 50 | 60,
  tenureMonths: 12 | 24
): Promise<FinanceCalculationResult> {
  const REGISTRATION_CHARGE = 2000;

  // 1. Fetch Vehicle Price & Insurance
  // Find a vehicle that matches the pattern closely
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      modelName: {
        contains: modelPattern,
        mode: 'insensitive'
      }
    }
  });

  if (!vehicle) {
    throw new Error(`Vehicle model matching '${modelPattern}' not found.`);
  }

  // 2. Fetch Service Charge
  let serviceChargeRecord = await prisma.serviceCharge.findFirst({
    where: {
      modelPattern: {
        contains: modelPattern,
        mode: 'insensitive'
      },
      downpaymentPct: downpaymentPercent,
      tenureMonths: tenureMonths
    }
  });

  // Fallback to exactly matching standard records if fuzzy fails
  if (!serviceChargeRecord) {
     serviceChargeRecord = await prisma.serviceCharge.findFirst({
      where: {
        modelPattern: vehicle.modelName,
        downpaymentPct: downpaymentPercent,
        tenureMonths: tenureMonths
      }
    });
  }

  const serviceChargeAmount = serviceChargeRecord ? serviceChargeRecord.amount : 5000; // fallback if not found

  // Calculate Insurance
  const insuranceMultiplier = tenureMonths === 12 ? 1 : 2;
  const insuranceAmount = vehicle.baseInsurance * insuranceMultiplier;

  // Calculate Downpayment & Loan Amount
  const downpaymentAmount = Math.round((vehicle.price * downpaymentPercent) / 100);
  const loanAmount = vehicle.price - downpaymentAmount;

  // Calculate EMI (0% Interest, just divide loan by tenure)
  const emi = Math.ceil(loanAmount / tenureMonths);

  // Initial Payment calculation: Downpayment + Insurance + Reg Charge + Service Charge
  const totalInitialPayment = downpaymentAmount + insuranceAmount + REGISTRATION_CHARGE + serviceChargeAmount;

  return {
    vehicleModel: vehicle.modelName,
    vehiclePrice: vehicle.price,
    downpaymentAmount,
    loanAmount,
    insuranceAmount,
    registrationCharge: REGISTRATION_CHARGE,
    serviceChargeAmount,
    totalInitialPayment,
    tenureMonths,
    emi,
    totalPayable: totalInitialPayment + (emi * tenureMonths)
  };
}
