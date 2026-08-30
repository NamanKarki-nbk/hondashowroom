const fs = require('fs');
let code = fs.readFileSync('app/admin/prices/PricesAdminClient.tsx', 'utf8');

code = code.replace(
  "import { VehicleVariant } from \"@/app/generated/prisma\";",
  "// import { VehicleVariant } from \"@/app/generated/prisma\";\ntype VehicleVariant = any;"
);

code = code.replace("const [prices, setPrices] = useState<VehicleVariant[]>(initialPrices);", "const [prices, setPrices] = useState<any[]>(initialPrices);");
code = code.replace("const handleOpenModal = (price?: VehicleVariant)", "const handleOpenModal = (price?: any)");

fs.writeFileSync('app/admin/prices/PricesAdminClient.tsx', code);
