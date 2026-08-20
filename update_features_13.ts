import { prisma } from './lib/prisma';

async function main() {
  const catalogItem = await prisma.productCatalog.findFirst({
    where: { name: 'Honda Dio BS6 110' }
  });
  
  if (!catalogItem) {
    console.error("Not found");
    return;
  }
  
  const specs = (catalogItem.specs as any) || {};
  let features = specs.features || [];
  
  // Add side stand engine cut off if it doesn't exist
  if (!features.find((f: any) => f.id === 'side-stand-engine-cut-off')) {
    features.push({
      "id": "side-stand-engine-cut-off",
      "image": "/images/features/side-stand-engine-cut-off.png",
      "title": "Side Stand Engine Cut-off",
      "subtitle": "Safety First",
      "description": "A sensor-based side stand ensures safety by cutting off the engine when the side stand is engaged.",
      "fallbackImage": "/inventory/honda-dio-bs6.png"
    });
  }
  
  specs.features = features;
  
  await prisma.productCatalog.update({
    where: { id: catalogItem.id },
    data: { specs }
  });
  
  console.log("Updated features list length: ", features.length);
}

main().catch(console.error);
