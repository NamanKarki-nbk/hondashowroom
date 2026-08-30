import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  try {
    console.log("Clearing inventory and dependent records...");
    
    await prisma.stockTransferLog.deleteMany({});
    await prisma.serviceRecord.deleteMany({});
    await prisma.salesTransaction.deleteMany({});
    await prisma.serviceReminder.deleteMany({});
    
    const res = await prisma.vehicleInventory.deleteMany({});
    console.log(`Successfully deleted ${res.count} records from VehicleInventory.`);
  } catch (e) {
    console.error("Failed to clear inventory:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
