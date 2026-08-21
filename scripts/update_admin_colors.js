const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app/admin', 'components/admin'];
const FILE_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];

const COLOR_MAP = {
  'bg-[#0B0B0C]': 'bg-zinc-950',
  'bg-[#1A1A1A]': 'bg-zinc-900',
  'bg-[#151515]': 'bg-zinc-900',
  'bg-[#1f1f1f]': 'bg-zinc-900',
  'bg-[#222]': 'bg-zinc-800',
  'bg-[#faf9f6]': 'bg-zinc-50',
  'bg-[#f3ebdd]': 'bg-zinc-50',
  'border-white/10': 'border-zinc-800',
  'border-gray-800': 'border-zinc-800',
  'dark:border-white/10': 'dark:border-zinc-800',
  'dark:bg-[#0B0B0C]': 'dark:bg-zinc-950',
  'dark:bg-[#1A1A1A]': 'dark:bg-zinc-900',
  'dark:bg-[#151515]': 'dark:bg-zinc-900',
  'dark:bg-[#1f1f1f]': 'dark:bg-zinc-900',
  'dark:bg-[#222]': 'dark:bg-zinc-800',
  'dark:hover:bg-[#222]': 'dark:hover:bg-zinc-800',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  for (const [key, value] of Object.entries(COLOR_MAP)) {
    // Escape brackets for regex
    const escapedKey = key.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/');
    const regex = new RegExp(escapedKey, 'g');
    content = content.replace(regex, value);
  }
  
  // also replace any generic `#cd302b` or arbitrary red if we want, but let's stick to dark theme tokens first.

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

console.log('Admin color update complete.');
