import { prisma } from './lib/prisma';

async function main() {
  const branches = await prisma.branch.findMany();
  console.log(JSON.stringify(branches, null, 2));
}

main().finally(() => prisma.$disconnect());
