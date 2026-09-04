import 'dotenv/config';
import { PrismaClient } from './app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `postgresql://neondb_owner:npg_3ZCKunbpOR8E@ep-divine-king-aznw5hiw.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$executeRaw`
    INSERT INTO "Blog" (
      "id",
      "title",
      "author",
      "imageUrl",
      "content",
      "createdAt",
      "updatedAt"
    ) VALUES (
      'disk-brakes-guide-2026',
      'Disk Brakes: Everything You Need To Know',
      'Astha Basnet',
      '',
      '{"summary":"Stopping power is the most important aspect of vehicle safety. Learn how disc brakes work, mechanical vs hydraulic setups, CBS integration on the Honda Dio, and warning signs for rotor replacement.","postType":"MAINTENANCE_GUIDE","readingTime":8,"category":"Riding Safety & Maintenance","sections":[{"title":"Mechanical vs. Hydraulic","description":"Mechanical brakes use steel cables and are easy to repair on long trips. Hydraulic systems use fluid to provide effortless single-finger stopping power and better modulation."},{"title":"Honda Combi-Brake System (CBS)","description":"In models like the Honda Dio BS6, pulling the left lever automatically balances braking power between the front disc and rear drum to stabilize handling and prevent skids."},{"title":"Warning Sign: Lever Vibration","description":"A rhythmic fluttering or pulsing feeling in your brake lever indicates the metal rotor has warped out of true alignment due to severe overheating."}]}',
      NOW(),
      NOW()
    ) ON CONFLICT ("id") DO UPDATE SET "content" = EXCLUDED."content";
  `;
  console.log('Query executed successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
