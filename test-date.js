const NepaliDate = require('nepali-date-converter');

const nd = new NepaliDate('2083-08-04');
console.log('AD Date:', nd.toJsDate().toISOString());
console.log('Formatted NP:', nd.format('MMMM D, YYYY', 'np'));

const ad = new NepaliDate(new Date('2026-11-20'));
console.log('Parsed AD as NP:', ad.format('YYYY-MM-DD'));
console.log('Formatted NP from AD:', ad.format('MMMM D, YYYY', 'np'));
