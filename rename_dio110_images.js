const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'features', 'dio110');
const jsonPath = path.join(__dirname, 'lib', 'data', 'dio110Features.json');

const files = fs.readdirSync(dir);
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

for (const file of files) {
  if (file.endsWith('.png')) {
    // If the file is already clean, skip it unless it's in the json
    if (!file.includes('\n')) continue;
    
    let titleMatch = file.split('\n')[0].replace(' - ', '').replace('- ', '').trim();
    if (!titleMatch) titleMatch = file.split('\n')[0];

    let simplifiedName = titleMatch.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png';
    // remove trailing dash if any
    simplifiedName = simplifiedName.replace(/-.png$/, '.png');

    console.log(`Renaming "${file}" to "${simplifiedName}"`);
    fs.renameSync(path.join(dir, file), path.join(dir, simplifiedName));

    // Update JSON
    const feature = json.features.find(f => f.image === file);
    if (feature) {
      feature.image = simplifiedName;
    } else {
      console.log(`WARNING: Could not find feature for ${file}`);
    }
  }
}

// Clean up any stray spaces in the JSON image fields just in case they didn't get caught
json.features.forEach(f => {
    if (f.image.includes('\n')) {
        let titleMatch = f.image.split('\n')[0].replace(' - ', '').replace('- ', '').trim();
        let simplifiedName = titleMatch.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png';
        simplifiedName = simplifiedName.replace(/-.png$/, '.png');
        f.image = simplifiedName;
    }
});

fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
console.log('Updated JSON and renamed files.');
