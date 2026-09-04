import { PrismaClient } from './app/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  // Find all customers who have at least one verified document but Customer.isVerified is false
  const customers = await prisma.customer.findMany({
    where: {
      isVerified: false,
      documents: {
        some: {
          isVerified: true
        }
      }
    },
    include: { documents: true }
  });

  console.log(`Found ${customers.length} customers with verified documents but Customer.isVerified = false`);

  for (const c of customers) {
    await prisma.customer.update({
      where: { id: c.id },
      data: { isVerified: true }
    });
    console.log(`  ✅ Fixed: ${c.fullName} (${c.id})`);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
