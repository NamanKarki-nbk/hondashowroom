const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace old red with new Honda red
    content = content.replace(/#E60012/g, '#ed1b2e');

    // Replace hardcoded dark backgrounds with light/dark variants
    // Only if it doesn't already have dark: prefix
    content = content.replace(/(?<!dark:)bg-\[#0B0B0C\]/g, 'bg-white dark:bg-[#0B0B0C]');
    content = content.replace(/(?<!dark:)bg-\[#111\]/g, 'bg-gray-50 dark:bg-[#111]');

    // Replace text-white with text-gray-900 dark:text-white on main headings
    // This is tricky, maybe just leave text-white alone if it's on a dark card
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
}

walk('./app', processFile);
walk('./components', processFile);
