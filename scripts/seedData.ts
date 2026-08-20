import { prisma } from './lib/prisma';

const vehicles = [
  // Scooters
  { modelName: 'Dio STD BS6', cc: 110, price: 264900, baseInsurance: 1500 },
  { modelName: 'Dio DLX BS6', cc: 110, price: 284900, baseInsurance: 1500 },
  { modelName: 'Dio 125 STD', cc: 125, price: 311900, baseInsurance: 1800 },
  { modelName: 'Dio 125 DLX Smart', cc: 125, price: 331900, baseInsurance: 1800 },
  
  // Motorcycles
  { modelName: 'SP 125 DRS BS6', cc: 125, price: 306900, baseInsurance: 1800 },
  { modelName: 'SP 125 DSS BS6', cc: 125, price: 319900, baseInsurance: 1800 },
  { modelName: 'Shine 125 DRS BS6', cc: 125, price: 294900, baseInsurance: 1800 },
  { modelName: 'Shine 125 DSS BS6', cc: 125, price: 305900, baseInsurance: 1800 },
  { modelName: 'NX 200 DLX', cc: 200, price: 489900, baseInsurance: 2500 },
  { modelName: 'HORNET 2.0 BS VI', cc: 200, price: 469900, baseInsurance: 2500 },
  { modelName: 'XR 190LP', cc: 190, price: 769900, baseInsurance: 3000 },
  { modelName: 'XR190LS DK', cc: 190, price: 798900, baseInsurance: 3000 },
  { modelName: 'CB 350', cc: 350, price: 925900, baseInsurance: 4000 },
  { modelName: 'HINESS CB350 RS', cc: 350, price: 975000, baseInsurance: 4000 },
  { modelName: 'CRF 300 LAP', cc: 300, price: 2075000, baseInsurance: 6000 },
  { modelName: 'CRF 300 RLAP', cc: 300, price: 2350000, baseInsurance: 6000 },
];

const serviceCharges = [
  // Format: [modelPattern, 60%, 50%, 40% (for 12 and 24 months)]
  // 60% Downpayment
  { modelPattern: 'DIO LED DLX A3', downpaymentPct: 60, tenureMonths: 12, amount: 4520 },
  { modelPattern: 'DIO LED DLX A3', downpaymentPct: 60, tenureMonths: 24, amount: 4520 },
  { modelPattern: 'DIO BS6 STD', downpaymentPct: 60, tenureMonths: 12, amount: 4520 },
  { modelPattern: 'DIO BS6 STD', downpaymentPct: 60, tenureMonths: 24, amount: 5650 },
  { modelPattern: 'SHINE 125 STD BS6', downpaymentPct: 60, tenureMonths: 12, amount: 4520 },
  { modelPattern: 'SHINE 125 STD BS6', downpaymentPct: 60, tenureMonths: 24, amount: 5650 },
  { modelPattern: 'DIO BS6 DLX', downpaymentPct: 60, tenureMonths: 12, amount: 4520 },
  { modelPattern: 'DIO BS6 DLX', downpaymentPct: 60, tenureMonths: 24, amount: 5650 },
  { modelPattern: 'SP 125 STD BS6', downpaymentPct: 60, tenureMonths: 12, amount: 4520 },
  { modelPattern: 'SP 125 STD BS6', downpaymentPct: 60, tenureMonths: 24, amount: 5650 },
  { modelPattern: 'SHINE 125 DLX BS6', downpaymentPct: 60, tenureMonths: 12, amount: 4520 },
  { modelPattern: 'SHINE 125 DLX BS6', downpaymentPct: 60, tenureMonths: 24, amount: 5650 },
  { modelPattern: 'SP 125 DLX BS6', downpaymentPct: 60, tenureMonths: 12, amount: 4520 },
  { modelPattern: 'SP 125 DLX BS6', downpaymentPct: 60, tenureMonths: 24, amount: 5650 },
  { modelPattern: 'DIO 125 STD', downpaymentPct: 60, tenureMonths: 12, amount: 4520 },
  { modelPattern: 'DIO 125 STD', downpaymentPct: 60, tenureMonths: 24, amount: 5650 },
  { modelPattern: 'DIO 125 DLX SMART', downpaymentPct: 60, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'DIO 125 DLX SMART', downpaymentPct: 60, tenureMonths: 24, amount: 6780 },
  { modelPattern: 'NX 200 DLX', downpaymentPct: 60, tenureMonths: 12, amount: 7910 },
  { modelPattern: 'NX 200 DLX', downpaymentPct: 60, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'HORNET 2.0 BS VI', downpaymentPct: 60, tenureMonths: 12, amount: 7910 },
  { modelPattern: 'HORNET 2.0 BS VI', downpaymentPct: 60, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'XR 190LP', downpaymentPct: 60, tenureMonths: 12, amount: 8475 },
  { modelPattern: 'XR 190LP', downpaymentPct: 60, tenureMonths: 24, amount: 9605 },
  { modelPattern: 'XR190LS DK', downpaymentPct: 60, tenureMonths: 12, amount: 8475 },
  { modelPattern: 'XR190LS DK', downpaymentPct: 60, tenureMonths: 24, amount: 9605 },
  { modelPattern: 'CB 350', downpaymentPct: 60, tenureMonths: 12, amount: 9040 },
  { modelPattern: 'CB 350', downpaymentPct: 60, tenureMonths: 24, amount: 10735 },
  { modelPattern: 'HINESS CB350 RS', downpaymentPct: 60, tenureMonths: 12, amount: 9040 },
  { modelPattern: 'HINESS CB350 RS', downpaymentPct: 60, tenureMonths: 24, amount: 10735 },
  { modelPattern: 'CRF 300 LAP', downpaymentPct: 60, tenureMonths: 12, amount: 19775 },
  { modelPattern: 'CRF 300 LAP', downpaymentPct: 60, tenureMonths: 24, amount: 25425 },
  { modelPattern: 'CRF 300 RLAP', downpaymentPct: 60, tenureMonths: 12, amount: 19775 },
  { modelPattern: 'CRF 300 RLAP', downpaymentPct: 60, tenureMonths: 24, amount: 25425 },

  // 50% Downpayment
  { modelPattern: 'DIO LED DLX A3', downpaymentPct: 50, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'DIO LED DLX A3', downpaymentPct: 50, tenureMonths: 24, amount: 5650 },
  { modelPattern: 'DIO BS6 STD', downpaymentPct: 50, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'DIO BS6 STD', downpaymentPct: 50, tenureMonths: 24, amount: 6780 },
  { modelPattern: 'SHINE 125 STD BS6', downpaymentPct: 50, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'SHINE 125 STD BS6', downpaymentPct: 50, tenureMonths: 24, amount: 6780 },
  { modelPattern: 'DIO BS6 DLX', downpaymentPct: 50, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'DIO BS6 DLX', downpaymentPct: 50, tenureMonths: 24, amount: 6780 },
  { modelPattern: 'SP 125 STD BS6', downpaymentPct: 50, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'SP 125 STD BS6', downpaymentPct: 50, tenureMonths: 24, amount: 6780 },
  { modelPattern: 'SHINE 125 DLX BS6', downpaymentPct: 50, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'SHINE 125 DLX BS6', downpaymentPct: 50, tenureMonths: 24, amount: 6780 },
  { modelPattern: 'SP 125 DLX BS6', downpaymentPct: 50, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'SP 125 DLX BS6', downpaymentPct: 50, tenureMonths: 24, amount: 6780 },
  { modelPattern: 'DIO 125 STD', downpaymentPct: 50, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'DIO 125 STD', downpaymentPct: 50, tenureMonths: 24, amount: 6780 },
  { modelPattern: 'DIO 125 DLX SMART', downpaymentPct: 50, tenureMonths: 12, amount: 6780 },
  { modelPattern: 'DIO 125 DLX SMART', downpaymentPct: 50, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'NX 200 DLX', downpaymentPct: 50, tenureMonths: 12, amount: 8475 },
  { modelPattern: 'NX 200 DLX', downpaymentPct: 50, tenureMonths: 24, amount: 9040 },
  { modelPattern: 'HORNET 2.0 BS VI', downpaymentPct: 50, tenureMonths: 12, amount: 8475 },
  { modelPattern: 'HORNET 2.0 BS VI', downpaymentPct: 50, tenureMonths: 24, amount: 9040 },
  { modelPattern: 'XR 190LP', downpaymentPct: 50, tenureMonths: 12, amount: 9605 },
  { modelPattern: 'XR 190LP', downpaymentPct: 50, tenureMonths: 24, amount: 10735 },
  { modelPattern: 'XR190LS DK', downpaymentPct: 50, tenureMonths: 12, amount: 9605 },
  { modelPattern: 'XR190LS DK', downpaymentPct: 50, tenureMonths: 24, amount: 10735 },
  { modelPattern: 'CB 350', downpaymentPct: 50, tenureMonths: 12, amount: 10735 },
  { modelPattern: 'CB 350', downpaymentPct: 50, tenureMonths: 24, amount: 13560 },
  { modelPattern: 'HINESS CB350 RS', downpaymentPct: 50, tenureMonths: 12, amount: 10735 },
  { modelPattern: 'HINESS CB350 RS', downpaymentPct: 50, tenureMonths: 24, amount: 13560 },
  { modelPattern: 'CRF 300 LAP', downpaymentPct: 50, tenureMonths: 12, amount: 25425 },
  { modelPattern: 'CRF 300 LAP', downpaymentPct: 50, tenureMonths: 24, amount: 28250 },
  { modelPattern: 'CRF 300 RLAP', downpaymentPct: 50, tenureMonths: 12, amount: 25425 },
  { modelPattern: 'CRF 300 RLAP', downpaymentPct: 50, tenureMonths: 24, amount: 28250 },

  // 40% Downpayment
  { modelPattern: 'DIO LED DLX A3', downpaymentPct: 40, tenureMonths: 12, amount: 5650 },
  { modelPattern: 'DIO LED DLX A3', downpaymentPct: 40, tenureMonths: 24, amount: 6780 },
  { modelPattern: 'DIO BS6 STD', downpaymentPct: 40, tenureMonths: 12, amount: 6780 },
  { modelPattern: 'DIO BS6 STD', downpaymentPct: 40, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'SHINE 125 STD BS6', downpaymentPct: 40, tenureMonths: 12, amount: 6780 },
  { modelPattern: 'SHINE 125 STD BS6', downpaymentPct: 40, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'DIO BS6 DLX', downpaymentPct: 40, tenureMonths: 12, amount: 6780 },
  { modelPattern: 'DIO BS6 DLX', downpaymentPct: 40, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'SP 125 STD BS6', downpaymentPct: 40, tenureMonths: 12, amount: 6780 },
  { modelPattern: 'SP 125 STD BS6', downpaymentPct: 40, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'SHINE 125 DLX BS6', downpaymentPct: 40, tenureMonths: 12, amount: 6780 },
  { modelPattern: 'SHINE 125 DLX BS6', downpaymentPct: 40, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'SP 125 DLX BS6', downpaymentPct: 40, tenureMonths: 12, amount: 6780 },
  { modelPattern: 'SP 125 DLX BS6', downpaymentPct: 40, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'DIO 125 STD', downpaymentPct: 40, tenureMonths: 12, amount: 6780 },
  { modelPattern: 'DIO 125 STD', downpaymentPct: 40, tenureMonths: 24, amount: 8475 },
  { modelPattern: 'DIO 125 DLX SMART', downpaymentPct: 40, tenureMonths: 12, amount: 8475 },
  { modelPattern: 'DIO 125 DLX SMART', downpaymentPct: 40, tenureMonths: 24, amount: 9040 },
  { modelPattern: 'NX 200 DLX', downpaymentPct: 40, tenureMonths: 12, amount: 9040 },
  { modelPattern: 'NX 200 DLX', downpaymentPct: 40, tenureMonths: 24, amount: 9605 },
  { modelPattern: 'HORNET 2.0 BS VI', downpaymentPct: 40, tenureMonths: 12, amount: 9040 },
  { modelPattern: 'HORNET 2.0 BS VI', downpaymentPct: 40, tenureMonths: 24, amount: 9605 },
  { modelPattern: 'XR 190LP', downpaymentPct: 40, tenureMonths: 12, amount: 10735 },
  { modelPattern: 'XR 190LP', downpaymentPct: 40, tenureMonths: 24, amount: 13560 },
  { modelPattern: 'XR190LS DK', downpaymentPct: 40, tenureMonths: 12, amount: 10735 },
  { modelPattern: 'XR190LS DK', downpaymentPct: 40, tenureMonths: 24, amount: 13560 },
  { modelPattern: 'CB 350', downpaymentPct: 40, tenureMonths: 12, amount: 13560 },
  { modelPattern: 'CB 350', downpaymentPct: 40, tenureMonths: 24, amount: 15820 },
  { modelPattern: 'HINESS CB350 RS', downpaymentPct: 40, tenureMonths: 12, amount: 13560 },
  { modelPattern: 'HINESS CB350 RS', downpaymentPct: 40, tenureMonths: 24, amount: 15820 },
  { modelPattern: 'CRF 300 LAP', downpaymentPct: 40, tenureMonths: 12, amount: 28250 },
  { modelPattern: 'CRF 300 LAP', downpaymentPct: 40, tenureMonths: 24, amount: 33900 },
  { modelPattern: 'CRF 300 RLAP', downpaymentPct: 40, tenureMonths: 12, amount: 28250 },
  { modelPattern: 'CRF 300 RLAP', downpaymentPct: 40, tenureMonths: 24, amount: 33900 },
];

async function main() {
  console.log('Seeding Vehicle database...');
  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { modelName: v.modelName },
      update: { price: v.price, cc: v.cc, baseInsurance: v.baseInsurance },
      create: {
        modelName: v.modelName,
        price: v.price,
        cc: v.cc,
        baseInsurance: v.baseInsurance,
      },
    });
  }

  console.log('Seeding ServiceCharges database...');
  for (const sc of serviceCharges) {
    await prisma.serviceCharge.upsert({
      where: {
        modelPattern_downpaymentPct_tenureMonths: {
          modelPattern: sc.modelPattern,
          downpaymentPct: sc.downpaymentPct,
          tenureMonths: sc.tenureMonths,
        },
      },
      update: { amount: sc.amount },
      create: sc,
    });
  }
  
  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
