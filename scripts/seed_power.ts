import { prisma } from '../lib/prisma';

const powerProducts = [
  { name: 'EU 30is (Generator)', price: 185000, cc: 196, thirdPartyInsurance: 0, fullInsurance: 0, category: 'POWER_PRODUCT' },
  { name: 'WB 30XT (Water Pump)', price: 35000, cc: 163, thirdPartyInsurance: 0, fullInsurance: 0, category: 'POWER_PRODUCT' },
  { name: 'UMK 435T (Brush Cutter)', price: 42000, cc: 35, thirdPartyInsurance: 0, fullInsurance: 0, category: 'POWER_PRODUCT' },
  { name: 'EU 70is (Generator)', price: 350000, cc: 389, thirdPartyInsurance: 0, fullInsurance: 0, category: 'POWER_PRODUCT' }
];

async function main() {
  console.log('Seeding Power Products...');
  
  for (const item of powerProducts) {
    const upserted = await prisma.vehicleMaster.upsert({
      where: { name: item.name },
      update: { 
        price: item.price,
        category: item.category
      },
      create: item,
    });
    console.log(`Upserted ${upserted.name}`);
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
