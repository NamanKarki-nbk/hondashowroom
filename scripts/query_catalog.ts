import { prisma } from '../lib/prisma';

async function main() {
  const products = await prisma.productCatalog.findMany();
  console.log('Products:', products);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
