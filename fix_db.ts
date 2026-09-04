import { prisma } from './lib/prisma';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const sales = await prisma.salesTransaction.updateMany({
    where: { 
      financePdfUrl: {
        contains: '/image/upload/'
      }
    },
    data: {
      financePdfUrl: null
    }
  });
  console.log('Fixed', sales.count, 'transactions');
}
run().catch(console.error).finally(() => process.exit(0));
