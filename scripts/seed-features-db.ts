import { PrismaClient } from '../app/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding features and specifications to VehicleMaster...");

  const products = await prisma.vehicleMaster.findMany();
  let updatedCount = 0;

  for (const product of products) {
    const id = product.id; 
    const nameLower = product.name.toLowerCase();
    
    // Determine the JSON prefix based on the product name (same logic as page.tsx)
    let jsonPrefix = "";
    if (nameLower.includes("eu70is")) jsonPrefix = "eu70is";
    else if (nameLower.includes("eg1000")) jsonPrefix = "eg1000";
    else if (nameLower.includes("ep1000") || nameLower.includes("ep 1000")) jsonPrefix = "ep1000";
    else if (nameLower.includes("ep1800cx") || nameLower.includes("ep 1800cx")) jsonPrefix = "ep1800cx";
    else if (nameLower.includes("eu10i")) jsonPrefix = "eu10i";
    else if (nameLower.includes("eu22i")) jsonPrefix = "eu22i";
    else if (nameLower.includes("eu30is")) jsonPrefix = "eu30is";
    else if (nameLower.includes("hhh25d")) jsonPrefix = "hhh25d75ut";
    else if (nameLower.includes("hru196") || nameLower.includes("hru 196")) jsonPrefix = "hru196";
    else if (nameLower.includes("hru216") || nameLower.includes("hru")) jsonPrefix = "hru216";
    else if (nameLower.includes("wv30d")) jsonPrefix = "wv30d";
    else if (nameLower.includes("wb30xd")) jsonPrefix = "wb30xd";
    else if (nameLower.includes("umr")) jsonPrefix = "umr435t";
    else if (nameLower.includes("umk") || nameLower.includes("435")) jsonPrefix = "umk435t";
    else if (nameLower.includes("fq650")) jsonPrefix = "fq650";
    else if (nameLower.includes("f300")) jsonPrefix = "f300";
    else if (nameLower.includes("wjr") && nameLower.includes("4025")) jsonPrefix = "wjr4025t";
    else if (nameLower.includes("wjr")) jsonPrefix = "wjr2525t1";
    else if (nameLower.includes("cb shine") || nameLower === "honda shine bs6") jsonPrefix = "cbShineBs6";
    else if (nameLower.includes("sp 125") || nameLower === "sp shine bs6" || nameLower.includes("sp shine")) jsonPrefix = "sp125";
    else if (nameLower.includes("ez3000cx")) jsonPrefix = "ez3000cx";
    else if (nameLower.includes("ez6500cxs")) jsonPrefix = "ez6500cxs";
    else if (nameLower.includes("dio") && nameLower.includes("110")) jsonPrefix = "dio110";
    else if (nameLower.includes("dio") && nameLower.includes("125")) jsonPrefix = "dio125";


    if (!jsonPrefix) continue;

    console.log(`Matching product ${product.name} to prefix ${jsonPrefix}`);

    const featuresPath = path.join(__dirname, `../lib/data/${jsonPrefix}Features.json`);
    const specsPath = path.join(__dirname, `../lib/data/${jsonPrefix}Specs.json`);
    
    let featuresData = null;
    let specsData = null;

    if (fs.existsSync(featuresPath)) {
      try {
        const fileContent = fs.readFileSync(featuresPath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        featuresData = parsed.features || parsed;
      } catch (e) {
        console.error(`Error reading ${featuresPath}:`, e);
      }
    }

    if (fs.existsSync(specsPath)) {
      try {
        const fileContent = fs.readFileSync(specsPath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        specsData = parsed.specifications || parsed.specs || parsed;
      } catch (e) {
        console.error(`Error reading ${specsPath}:`, e);
      }
    }

    if (featuresData || specsData) {
      await prisma.vehicleMaster.update({
        where: { id: product.id },
        data: {
          ...(featuresData && { features: featuresData }),
          ...(specsData && { specifications: specsData })
        }
      });
      console.log(`Updated ${product.name}`);
      updatedCount++;
    }
  }

  console.log(`Successfully updated ${updatedCount} products.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
