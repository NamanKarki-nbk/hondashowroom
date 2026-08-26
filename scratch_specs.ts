import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.productCatalog.findMany({
    select: { specifications: true }
  });
  
  const cats = new Set<string>();
  
  products.forEach(p => {
    let rawSpecs = p.specifications;
    if (rawSpecs && (rawSpecs as any).specifications) {
       rawSpecs = (rawSpecs as any).specifications;
    }
    
    if (Array.isArray(rawSpecs)) {
      rawSpecs.forEach((g: any) => {
        if (g && g.category) cats.add(g.category);
      });
    } else if (rawSpecs && typeof rawSpecs === 'object') {
      Object.keys(rawSpecs).forEach(k => cats.add(k));
    }
  });
  
  console.log("Unique DB Categories:", Array.from(cats));
}
main().catch(console.error).finally(() => prisma.$disconnect());
