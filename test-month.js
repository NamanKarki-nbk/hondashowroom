const { format, lastDayOfMonth } = require('date-fns');
const NepaliDate = require('nepali-date-converter');

const input = 'July 2026';
const d = new Date(input);
if (!isNaN(d.getTime())) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = lastDayOfMonth(start);

  const engStart = format(start, 'do MMM. yyyy');
  const engEnd = format(end, 'do MMM. yyyy');

  const nepStart = new NepaliDate(start).format('MMMM D, YYYY', 'np') + ' गते';
  const nepEnd = new NepaliDate(end).format('MMMM D, YYYY', 'np') + ' गते';

  console.log('Eng Start:', engStart);
  console.log('Eng End:', engEnd);
  console.log('Nep Start:', nepStart);
  console.log('Nep End:', nepEnd);
} else {
  console.log('Invalid date string');
}
