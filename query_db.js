const { PrismaClient } = require('./app/generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'VehicleInventory';`;
  console.log("VehicleInventory columns:", result.map(r => r.column_name));
  
  const staff = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Staff';`;
  console.log("Staff columns:", staff.map(r => r.column_name));
}

main().catch(console.error).finally(() => prisma.$disconnect());
