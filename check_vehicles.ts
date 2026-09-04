import { PrismaClient } from './app/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  const models = await prisma.vehicleMaster.findMany({ select: { name: true } });
  console.log("Vehicle Masters:", models.map(m => m.name));
  
  const variants = await prisma.vehicleVariant.findMany({ select: { variantName: true, vehicleMaster: { select: { name: true } } } });
  console.log("Variants:", variants.map(v => `${v.vehicleMaster.name} ${v.variantName}`));
}

main().finally(() => prisma.$disconnect());
