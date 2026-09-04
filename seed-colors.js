const { PrismaClient } = require('./app/generated/prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const inventory = await prisma.vehicleInventory.findMany({
    include: { variant: { include: { vehicleMaster: true } } }
  });

  const colorMap = new Map();

  for (const inv of inventory) {
    if (!inv.color) continue;
    
    const masterId = inv.variant.vehicleMaster.id;
    const key = `${masterId}-${inv.color}`;
    
    if (!colorMap.has(key)) {
      colorMap.set(key, {
        vehicleMasterId: masterId,
        name: inv.color,
        hexCode: '#000000',
      });
    }
  }

  const newColors = Array.from(colorMap.values());
  let added = 0;

  for (const c of newColors) {
    const exists = await prisma.vehicleColor.findFirst({
      where: { vehicleMasterId: c.vehicleMasterId, name: c.name }
    });
    if (!exists) {
      await prisma.vehicleColor.create({ data: c });
      added++;
    }
  }

  console.log(`Added ${added} colors from inventory.`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
