import { prisma } from '../lib/prisma';
import { calculateServiceCharge } from '../lib/serviceCharges';

async function main() {
  const plans = await prisma.financePlan.findMany({
    include: { variant: { include: { vehicleMaster: true } } }
  });
  
  const matrix: Record<string, number[]> = {
    'DIO LED DLX A3': [4520, 4520, 5650, 5650, 5650, 6780],
    'DIO BS6': [4520, 5650, 5650, 6780, 6780, 8475],
    'SHINE 125': [4520, 5650, 5650, 6780, 6780, 8475],
    'SP 125': [4520, 5650, 5650, 6780, 6780, 8475],
    'DIO 125': [4520, 5650, 5650, 6780, 6780, 8475],
    'HORNET': [7910, 8475, 8475, 9040, 9040, 9605],
    'XR': [8475, 9605, 9605, 10735, 10735, 13560],
    'CB350': [9040, 10735, 10735, 13560, 13560, 15820],
    'CRF': [19775, 25425, 25425, 28250, 28250, 33900],
  };

  let updatedCount = 0;
  for (const plan of plans) {
    const modelName = (plan.variant.vehicleMaster?.name || plan.variant.variantName).toUpperCase();
    let match = Object.keys(matrix).find(k => modelName.includes(k));
    
    // special fallbacks
    if (!match && modelName.includes('CB SHINE')) match = 'SHINE 125';
    if (!match && modelName.includes('SP SHINE')) match = 'SP 125';

    if (match) {
      let dpTier = '40';
      if (plan.downPaymentPct >= 60) dpTier = '60';
      else if (plan.downPaymentPct >= 50) dpTier = '50';

      let tenureTier = '24';
      if (plan.tenureMonths <= 12) tenureTier = '12';
      
      const prices = matrix[match];
      let sc = 0;
      if (dpTier === '60' && tenureTier === '12') sc = prices[0];
      if (dpTier === '60' && tenureTier === '24') sc = prices[1];
      if (dpTier === '50' && tenureTier === '12') sc = prices[2];
      if (dpTier === '50' && tenureTier === '24') sc = prices[3];
      if (dpTier === '40' && tenureTier === '12') sc = prices[4];
      if (dpTier === '40' && tenureTier === '24') sc = prices[5];
      
      if (sc > 0) {
        await prisma.financePlan.update({
          where: { id: plan.id },
          data: { serviceCharge: sc }
        });
        updatedCount++;
      }
    } else {
      console.log(`No match for ${modelName}`);
    }
  }
  console.log(`Updated ${updatedCount} plans.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
