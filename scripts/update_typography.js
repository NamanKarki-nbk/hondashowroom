const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components'];
const FILE_EXTENSIONS = ['.tsx', '.jsx'];

const TYPOGRAPHY_MAP = {
  'text-6xl': 'text-4xl md:text-6xl font-bold tracking-tight',
  'text-5xl': 'text-4xl md:text-6xl font-bold tracking-tight',
  'text-4xl': 'text-3xl md:text-4xl font-bold',
  'text-3xl': 'text-2xl md:text-4xl font-bold',
  'text-2xl': 'text-2xl md:text-3xl font-semibold',
  'text-xl': 'text-xl md:text-2xl font-semibold',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  for (const [key, value] of Object.entries(TYPOGRAPHY_MAP)) {
    const regex = new RegExp(`(?<!:)\\b${key}\\b`, 'g');
    
    content = content.replace(regex, (match, offset, fullString) => {
      const contextStart = Math.max(0, offset - 100);
      const contextEnd = Math.min(fullString.length, offset + 100);
      const context = fullString.slice(contextStart, contextEnd);
      
      if (context.includes(`md:${key}`) || context.includes(`lg:${key}`)) {
        return match;
      }
      
      return value;
    });
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (FILE_EXTENSIONS.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  }
}

DIRECTORIES.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir);
  }
});

console.log('Typography update complete.');
