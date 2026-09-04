import { PrismaClient } from './app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3ZCKunbpOR8E@ep-divine-king-aznw5hiw.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$executeRaw`
    INSERT INTO "Blog" ("id", "title", "author", "imageUrl", "content", "createdAt", "updatedAt")
    VALUES 
    (
      'motorcycle-myths-2026',
      '15 Unbelievable Motorcycle Myths & Misconceptions Debunked',
      'Astha Basnet',
      '',
      '{"slug":"motorcycle-myths-and-misconceptions","summary":"Debunking common riding myths with safety facts, physics, and practical advice for road conditions.","postType":"MYTH_BUSTING","category":"Riding Tips & Safety","readingTime":6,"sections":[{"title":"Loud Pipes Save Lives","description":"Sound travels backward out of the exhaust. Dynamic visibility, proper positioning, and bright gear protect you much more effectively than noise."},{"title":"Laying the Bike Down is Safer Than Braking","description":"Intentionally sliding loses control. Modern tires on asphalt provide far higher deceleration under maximum upright braking than sliding on metal/plastic."},{"title":"Never Use the Front Brake","description":"Up to 70%+ of stopping power comes from the front brake. Use progressive squeezing rather than sudden grabbing."},{"title":"You Must Flat-Foot Both Feet at a Stop","description":"Sliding slightly off the seat to plant your left foot while keeping your right foot on the rear brake gives complete stability on any size motorcycle."},{"title":"ABS Braking Isn''t Safe or Necessary","description":"Anti-lock Braking Systems prevent wheel lockup during emergency stops, enabling steerability and stopping distance reduction on wet or dusty roads."}]}',
      NOW(),
      NOW()
    ),
    (
      'disk-brakes-guide-2026',
      'Disk Brakes: Everything You Need To Know',
      'Astha Basnet',
      '',
      '{"slug":"disk-brakes-everything-you-need-to-know","summary":"Stopping power is the most important aspect of vehicle safety. Learn how disc brakes work, mechanical vs hydraulic setups, CBS integration on the Honda Dio, and warning signs for rotor replacement.","postType":"MAINTENANCE_GUIDE","category":"Riding Safety & Maintenance","readingTime":8,"sections":[{"title":"Mechanical vs. Hydraulic","description":"Mechanical brakes use steel cables and are easy to repair on long trips. Hydraulic systems use fluid to provide effortless single-finger stopping power and better modulation."},{"title":"Honda Combi-Brake System (CBS)","description":"In models like the Honda Dio BS6, pulling the left lever automatically balances braking power between the front disc and rear drum to stabilize handling and prevent skids."},{"title":"Warning Sign: Lever Vibration","description":"A rhythmic fluttering or pulsing feeling in your brake lever indicates the metal rotor has warped out of true alignment due to severe overheating."}]}',
      NOW(),
      NOW()
    ),
    (
      'chain-lubrication-guide-2026',
      'Why Lubricating Your Motorcycle Chain is Essential',
      'Astha Basnet',
      '',
      '{"slug":"why-lubricating-your-motorcycle-chain-is-essential","summary":"Essential chain maintenance advice explaining how proper lubrication extends drive kit life, prevents snapping, and improves power delivery.","postType":"MAINTENANCE_GUIDE","category":"Riding Safety & Maintenance","readingTime":5,"sections":[{"title":"Friction & Wear Reduction","description":"A well-lubricated chain reduces friction between the links and sprockets, extending the life of the entire drive chain kit."},{"title":"Proper Application Technique","description":"Apply lube to the inner side of a warm chain while rotating the wheel manually with the engine off so centrifugal force pushes lube deep into rollers."},{"title":"Avoid Over-Lubrication","description":"Excess lubricant attracts dirt, sand, and grit, creating an abrasive paste that accelerates chain wear. Wipe off excess lube with a clean cloth."}]}',
      NOW(),
      NOW()
    ),
    (
      'improve-bike-mileage-2026',
      'How to Improve Bike Mileage & Performance',
      'Astha Basnet',
      '',
      '{"slug":"improve-bike-mileage-performance","summary":"Practical riding tips, tire pressure guidelines, and maintenance habits to maximize fuel efficiency and engine longevity on your Honda motorcycle or scooter.","postType":"MILEAGE_TIPS","category":"Riding Tips & Performance","readingTime":7,"sections":[{"title":"Maintain Optimal Tire Pressure","description":"Under-inflated tires increase rolling resistance and cause the engine to burn extra fuel. Check pressure weekly."},{"title":"Smooth Throttle Control","description":"Aggressive throttle twists dump excess fuel into the combustion chamber. Riding at a smooth, steady pace dramatically increases fuel efficiency."},{"title":"Switch Off Engine at Traffic Signals","description":"Idling for over 30 seconds wastes fuel. Switch off at long stops or utilize Honda Idling Stop System technology."},{"title":"Use Recommended Engine Oil","description":"Using the company-recommended engine oil grade minimizes internal engine friction and keeps performance at its peak."}]}',
      NOW(),
      NOW()
    )
    ON CONFLICT ("id") DO UPDATE SET
      "title" = EXCLUDED."title",
      "author" = EXCLUDED."author",
      "imageUrl" = EXCLUDED."imageUrl",
      "content" = EXCLUDED."content",
      "updatedAt" = NOW();
  `;
  console.log('Seed executed successfully');
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
