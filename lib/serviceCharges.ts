export function calculateServiceCharge(modelName: string, downpaymentPercent: number, tenureMonths: number): number | null {
  if (!modelName) return null;
  const normalizedModel = modelName.toUpperCase().trim();
  
  let dpTier = '40';
  if (downpaymentPercent >= 60) dpTier = '60';
  else if (downpaymentPercent >= 50) dpTier = '50';
  else dpTier = '40';

  let tenureTier = '24';
  if (tenureMonths <= 12) tenureTier = '12';
  else tenureTier = '24'; 

  // [60%-12m, 60%-24m, 50%-12m, 50%-24m, 40%-12m, 40%-24m]
  const matrix: Record<string, number[]> = {
    'DIO LED DLX A3': [4520, 4520, 5650, 5650, 5650, 6780],
    'DIO BS6 STD': [4520, 5650, 5650, 6780, 6780, 8475],
    'SHINE 125 STD BS6': [4520, 5650, 5650, 6780, 6780, 8475],
    'DIO BS6 DLX': [4520, 5650, 5650, 6780, 6780, 8475],
    'SP 125 STD BS6': [4520, 5650, 5650, 6780, 6780, 8475],
    'SHINE 125 DLX BS6': [4520, 5650, 5650, 6780, 6780, 8475],
    'SP 125 DLX BS6': [4520, 5650, 5650, 6780, 6780, 8475],
    'DIO 125 STD': [4520, 5650, 5650, 6780, 6780, 8475],
    'DIO 125 DLX SMART': [5650, 6780, 6780, 8475, 8475, 9040],
    'NX 200 DLX': [7910, 8475, 8475, 9040, 9040, 9605],
    'HORNET 2.0 BS VI': [7910, 8475, 8475, 9040, 9040, 9605],
    'XR 190LP': [8475, 9605, 9605, 10735, 10735, 13560],
    'XR 190LS DK': [8475, 9605, 9605, 10735, 10735, 13560],
    'CB 350': [9040, 10735, 10735, 13560, 13560, 15820],
    'HINESS CB350 RS': [9040, 10735, 10735, 13560, 13560, 15820],
    'CRF 300 LAP': [19775, 25425, 25425, 28250, 28250, 33900],
    'CRF 300 RLAP': [19775, 25425, 25425, 28250, 28250, 33900],
  };

  const match = Object.keys(matrix).find(k => normalizedModel.includes(k) || k.includes(normalizedModel));
  if (!match) return null;

  const prices = matrix[match];
  if (dpTier === '60' && tenureTier === '12') return prices[0];
  if (dpTier === '60' && tenureTier === '24') return prices[1];
  if (dpTier === '50' && tenureTier === '12') return prices[2];
  if (dpTier === '50' && tenureTier === '24') return prices[3];
  if (dpTier === '40' && tenureTier === '12') return prices[4];
  if (dpTier === '40' && tenureTier === '24') return prices[5];

  return null;
}
