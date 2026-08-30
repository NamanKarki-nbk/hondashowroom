import { prisma } from '../lib/prisma';

async function main() {
  const products = await prisma.vehicleMaster.findMany();
  console.log('Products:', products);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
