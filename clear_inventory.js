const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Delete dependent tables first if needed, or just try to delete VehicleInventory
    // Let's first just try VehicleInventory
    const res = await prisma.vehicleInventory.deleteMany({});
    console.log(`Deleted ${res.count} records from VehicleInventory.`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
