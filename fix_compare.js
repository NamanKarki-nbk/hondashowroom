const fs = require('fs');
let code = fs.readFileSync('app/(customer)/compare/CompareClient.tsx', 'utf8');

code = code.replace(
  "const isExpanded = openAccordions.includes(brand);\n                    const brandVehicles = vehicles.filter(v => v.brand === brand);\n                    \n                    const brandLower = brand.toLowerCase();\n                    const logoSrc = `/images/brands/${brandLower}.svg`;",
  "const isExpanded = openAccordions.includes(brand);\n                    const brandVehicles = vehicles.filter(v => v.brand === brand);\n                    \n                    const brandLower = brand.toLowerCase();\n                    let brandLogo = `/brands/${brandLower.replace(/\\s+/g, '')}.svg`;\n                    if (brandLower === 'honda') brandLogo = '/honda-logo.svg';"
);

code = code.replace(
  "src={logoSrc}",
  "src={brandLogo}"
);

fs.writeFileSync('app/(customer)/compare/CompareClient.tsx', code);
