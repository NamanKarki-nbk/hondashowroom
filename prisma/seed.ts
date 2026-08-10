import { PrismaClient } from '../app/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import fs from 'fs'
import path from 'path'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const rawData = fs.readFileSync(path.join(__dirname, 'scraped_data.json'), 'utf-8');
  const products = JSON.parse(rawData);

  console.log("Clearing existing products...");
  await prisma.productCatalog.deleteMany();

  console.log(`Seeding ${products.length} products...`);
  
  for (const product of products) {
    await prisma.productCatalog.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        specs: product.specs || {}
      },
      create: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        specs: product.specs || {}
      }
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
