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
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace old reds with new theme red
    content = content.replace(/#ed1b2e/gi, '#c1291A');
    content = content.replace(/#E60012/gi, '#c1291A');
    content = content.replace(/#cc0010/gi, '#a02014'); // darker red for hovers
    
    // In CSS we will manually update variables, but the above covers arbitrary classes
    
    // Replace hardcoded white/gray backgrounds to the new light theme color #f3ebdd
    content = content.replace(/\bbg-white\b/g, 'bg-[#f3ebdd]');
    content = content.replace(/\bbg-gray-50\b/g, 'bg-[#f3ebdd]');
    
    // Replace text-white to text-[#f3ebdd] to keep the theme
    content = content.replace(/\btext-white\b/g, 'text-[#f3ebdd]');
    
    // Replace borders
    content = content.replace(/\bborder-white/g, 'border-[#f3ebdd]');
    
    // Same for gray-100, etc if it's used as background 
    content = content.replace(/\bbg-gray-100\b/g, 'bg-[#e8dfd1]'); // a bit darker beige for contrast

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
}

walk('./app', processFile);
walk('./components', processFile);
