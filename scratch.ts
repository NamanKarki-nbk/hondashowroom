import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS:", users.length);
  const staff = await prisma.staff.findMany();
  console.log("STAFF:", staff.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
