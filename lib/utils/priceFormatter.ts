export function formatNPRPrice(price: number): string {
  // Formats numbers into Indian/Nepali Numbering System (1,00,000)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  });
  
  // Intl.NumberFormat adds 'NPR' but it might add 'NPR ' or just 'NPR'. Let's ensure it's "NPR X,XX,XXX"
  // Actually en-IN for NPR produces something like "NPR 3,50,000"
  return formatter.format(price);
}
