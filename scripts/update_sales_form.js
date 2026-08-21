const fs = require('fs');
const filePath = '/mnt/data/Naman/honda-showroom/app/admin/sales/SalesForm.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the input/select class string
const oldClass1 = /className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-\[#B83227\]"/g;
const newClass = 'className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"';

content = content.replace(oldClass1, newClass);

// There's a smaller input for Advance Paid:
const oldClass2 = /className="w-32 bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-\[#B83227\]"/g;
const newClass2 = 'className="w-32 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"';

content = content.replace(oldClass2, newClass2);

// Replace bg-[#B83227]
content = content.replace(/#B83227/g, 'primary');
content = content.replace(/bg-\[#B83227\]/g, 'bg-primary');
content = content.replace(/text-\[#B83227\]/g, 'text-primary');

// Make sure select tags have a custom arrow if they have appearance-none
content = content.replace(/<select /g, '<select style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }} ');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Updated SalesForm.tsx');
