const fs = require('fs');
let code = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

code = code.replace(
  "select: { variant: { select: { vehicleMaster: { select: { name: true } } } }, color: { select: { name: true } }, branch: { select: { name: true } } }",
  "select: { variant: { select: { vehicleMaster: { select: { name: true } } } }, color: true, branch: { select: { name: true } } }"
);

code = code.replace(
  "const colorName = item.color?.name || \"Unknown Color\";",
  ""
);

code = code.replace(/colorName/g, "item.color");
code = code.replace(/matrixMap\[itemName\]\[item.color\]\[branchName\]\+\+;\s*\}\s*matrixMap\[itemName\]\[item.color\]\[branchName\]\+\+;/, "}\n     matrixMap[itemName][item.color][branchName]++;");

fs.writeFileSync('app/admin/dashboard/page.tsx', code);
