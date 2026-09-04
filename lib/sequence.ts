import { prisma } from './prisma';
import { getNepaliFiscalYear } from './nepaliTranslator';

export async function generateReceiptNo(offset: number = 0, isExchanger: boolean = false): Promise<string> {
  const fiscalYear = getNepaliFiscalYear(new Date());
  
  const prefix = isExchanger ? `EXC-${fiscalYear}-` : `${fiscalYear}-`;
  
  const lastReceipt = isExchanger
    ? await prisma.exchangerPaymentReceipt.findFirst({
        where: {
          receiptNo: {
            startsWith: prefix,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    : await prisma.paymentReceipt.findFirst({
        where: {
          receiptNo: {
            startsWith: prefix,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

  let nextSequence = 1;

  if (lastReceipt && lastReceipt.receiptNo) {
    const parts = lastReceipt.receiptNo.split('-');
    const lastNumStr = parts[parts.length - 1];
    const lastNum = parseInt(lastNumStr, 10);
    if (!isNaN(lastNum)) {
      nextSequence = lastNum + 1;
    }
  }

  nextSequence += offset;

  // Format with leading zeros
  const sequenceStr = nextSequence.toString().padStart(4, '0');
  
  return `${prefix}${sequenceStr}`;
}
