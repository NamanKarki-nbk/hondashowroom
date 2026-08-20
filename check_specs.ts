import { prisma } from './lib/prisma';

async function main() {
  const products = await prisma.productCatalog.findMany({
    where: {
      name: { contains: "dio", mode: "insensitive" }
    },
    select: {
      id: true,
      name: true,
      specs: true
    }
  });

  for (const p of products) {
    console.log(`Product: ${p.name} (ID: ${p.id})`);
    console.log(`Specs type: ${typeof p.specs}`);
    console.log(`Is Array? ${Array.isArray(p.specs)}`);
    console.log(`Specifications: ${JSON.stringify((p.specs as any)?.specifications)}`);
    console.log('---');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
