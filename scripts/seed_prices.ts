import { prisma } from './lib/prisma';

const variants = [
  { modelName: 'Dio 110 STD', price: 264900, cc: 110, baseInsurance: 1500 },
  { modelName: 'Dio 110 DLX', price: 284900, cc: 110, baseInsurance: 1500 },
  { modelName: 'Dio 125 STD', price: 311900, cc: 125, baseInsurance: 1800 },
  { modelName: 'Dio 125 DLX', price: 331900, cc: 125, baseInsurance: 1800 },
  { modelName: 'CB Shine BS6 DRS', price: 294900, cc: 125, baseInsurance: 1800 },
  { modelName: 'CB Shine BS6 DSS', price: 305900, cc: 125, baseInsurance: 1800 },
  { modelName: 'SP Shine BS6 DRS', price: 306900, cc: 125, baseInsurance: 1800 },
  { modelName: 'SP Shine BS6 DSS', price: 319900, cc: 125, baseInsurance: 1800 },
];

async function main() {
  console.log('Seeding specific variants into the Vehicle table...');
  
  for (const variant of variants) {
    const upserted = await prisma.vehicle.upsert({
      where: { modelName: variant.modelName },
      update: { price: variant.price },
      create: variant,
    });
    console.log(`Upserted ${upserted.modelName}: ${upserted.price}`);
  }
  
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
