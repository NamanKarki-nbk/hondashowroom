const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts') || dirFile.endsWith('.js') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = [...walkSync('./app'), ...walkSync('./components')];

let updatedCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  let newContent = content;

  // Background replacements
  newContent = newContent.replace(/dark:bg-zinc-950/g, 'dark:bg-slate-950');
  newContent = newContent.replace(/dark:bg-\[\#0B0B0C\]/g, 'dark:bg-slate-950');
  newContent = newContent.replace(/dark:bg-\[\#111111\]/g, 'dark:bg-slate-950');
  newContent = newContent.replace(/dark:bg-\[\#111\]/g, 'dark:bg-slate-950');
  newContent = newContent.replace(/dark:bg-\[\#0D0D0E\]/g, 'dark:bg-slate-950');

  // Card Background replacements
  newContent = newContent.replace(/dark:bg-zinc-900/g, 'dark:bg-slate-900');
  newContent = newContent.replace(/dark:bg-\[\#1A1A1A\]/g, 'dark:bg-slate-900');
  newContent = newContent.replace(/dark:bg-\[\#141416\]/g, 'dark:bg-slate-900');
  newContent = newContent.replace(/dark:bg-\[\#121212\]/g, 'dark:bg-slate-900');
  newContent = newContent.replace(/dark:bg-\[\#1A1A1E\]/g, 'dark:bg-slate-900');
  newContent = newContent.replace(/dark:bg-\[\#0C0C0E\]/g, 'dark:bg-slate-900');
  newContent = newContent.replace(/dark:bg-\[\#151515\]/g, 'dark:bg-slate-900');
  newContent = newContent.replace(/dark:bg-\[\#0E0E10\]/g, 'dark:bg-slate-900');

  // Border replacements
  newContent = newContent.replace(/dark:border-zinc-800/g, 'dark:border-slate-800');
  newContent = newContent.replace(/dark:border-\[\#2a2a2a\]/g, 'dark:border-slate-800');
  newContent = newContent.replace(/dark:border-\[\#252525\]/g, 'dark:border-slate-800');
  newContent = newContent.replace(/dark:border-gray-800/g, 'dark:border-slate-800');

  // Brand Accents
  newContent = newContent.replace(/bg-\[\#B83227\]/g, 'bg-[#CC0000]');
  newContent = newContent.replace(/text-\[\#B83227\]/g, 'text-[#CC0000]');
  newContent = newContent.replace(/border-\[\#B83227\]/g, 'border-[#CC0000]');
  newContent = newContent.replace(/hover:bg-\[\#B83227\]/g, 'hover:bg-[#CC0000]');
  newContent = newContent.replace(/hover:text-\[\#B83227\]/g, 'hover:text-[#CC0000]');
  newContent = newContent.replace(/focus:ring-\[\#B83227\]/g, 'focus:ring-[#CC0000]');
  newContent = newContent.replace(/ring-\[\#B83227\]/g, 'ring-[#CC0000]');
  newContent = newContent.replace(/from-\[\#B83227\]/g, 'from-[#CC0000]');
  newContent = newContent.replace(/to-\[\#B83227\]/g, 'to-[#CC0000]');
  newContent = newContent.replace(/fill-\[\#B83227\]/g, 'fill-[#CC0000]');
  
  // Specific red-500 that should be primary
  newContent = newContent.replace(/text-red-500/g, 'text-primary');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf-8');
    updatedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Total files updated: ${updatedCount}`);
