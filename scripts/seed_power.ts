import { prisma } from '../lib/prisma';

const powerProducts = [
  { modelName: 'EU 30is (Generator)', price: 185000, cc: 196, thirdPartyInsurance: 0, fullInsurance: 0, category: 'POWER_PRODUCT' },
  { modelName: 'WB 30XT (Water Pump)', price: 35000, cc: 163, thirdPartyInsurance: 0, fullInsurance: 0, category: 'POWER_PRODUCT' },
  { modelName: 'UMK 435T (Brush Cutter)', price: 42000, cc: 35, thirdPartyInsurance: 0, fullInsurance: 0, category: 'POWER_PRODUCT' },
  { modelName: 'EU 70is (Generator)', price: 350000, cc: 389, thirdPartyInsurance: 0, fullInsurance: 0, category: 'POWER_PRODUCT' }
];

async function main() {
  console.log('Seeding Power Products...');
  
  for (const item of powerProducts) {
    const upserted = await prisma.vehicle.upsert({
      where: { modelName: item.modelName },
      update: { 
        price: item.price,
        category: item.category
      },
      create: item,
    });
    console.log(`Upserted ${upserted.modelName}`);
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
