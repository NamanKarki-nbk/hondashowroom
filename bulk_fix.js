const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Delete scratch files
const filesToDelete = [
  'scratch.ts',
  'scratch_specs.ts',
  'query-db.ts',
  'query_dio.ts',
  'query_dio110.ts',
  'query_features_all.ts',
  'check_slugs.ts'
];

filesToDelete.forEach(f => {
  const fp = path.join(__dirname, f);
  if (fs.existsSync(fp)) {
    fs.unlinkSync(fp);
    console.log('Deleted', f);
  }
});

// 2. Find all .ts and .tsx files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(__dirname);

// 3. Simple replacements
let changedFiles = 0;
allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replacements
  newContent = newContent.replace(/ProductCatalog/g, 'VehicleMaster');
  newContent = newContent.replace(/productCatalog/g, 'vehicleMaster');
  
  newContent = newContent.replace(/VehiclePrice/g, 'VehicleVariant');
  newContent = newContent.replace(/vehiclePrice/g, 'vehicleVariant');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log('Updated', file);
  }
});

console.log(`Updated ${changedFiles} files with basic renames.`);
