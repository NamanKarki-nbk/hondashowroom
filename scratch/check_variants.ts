import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const variants = await prisma.vehicleVariant.findMany({
    select: { variantName: true, vehicleMasterId: true }
  });
  console.log(variants);
}

main().catch(console.error).finally(() => prisma.$disconnect());
