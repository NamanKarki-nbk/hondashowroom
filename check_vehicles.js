const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const models = await prisma.vehicleMaster.findMany({ select: { name: true } });
  console.log("Vehicle Masters:", models.map(m => m.name));
}

main().finally(() => prisma.$disconnect());
