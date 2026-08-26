const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'features', 'dio125');
const jsonPath = path.join(__dirname, 'lib', 'data', 'dio125Features.json');

const files = fs.readdirSync(dir);
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

for (const file of files) {
  if (file.endsWith('.png')) {
    const titleMatch = file.split('\n')[0].replace(' - ', '').trim();
    let simplifiedName = titleMatch.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png';
    // remove trailing dash if any
    simplifiedName = simplifiedName.replace(/-.png$/, '.png');

    console.log(`Renaming "${file}" to "${simplifiedName}"`);
    fs.renameSync(path.join(dir, file), path.join(dir, simplifiedName));

    // Update JSON
    const feature = json.features.find(f => f.title.toLowerCase().includes(titleMatch.toLowerCase().split('(')[0].trim()));
    if (feature) {
      feature.image = simplifiedName;
    } else {
        // try to match using the first few words
        const words = titleMatch.split(' ').slice(0, 2).join(' ').toLowerCase();
        const fallbackFeature = json.features.find(f => f.title.toLowerCase().includes(words));
        if (fallbackFeature) {
            fallbackFeature.image = simplifiedName;
        } else {
            console.log(`WARNING: Could not find feature for ${titleMatch}`);
        }
    }
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
console.log('Updated JSON and renamed files.');
