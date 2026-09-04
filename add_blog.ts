import { PrismaClient } from './app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `postgresql://neondb_owner:npg_3ZCKunbpOR8E@ep-divine-king-aznw5hiw.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const blog = await prisma.blog.create({
    data: {
      title: "Key Myths Debunked in the Article",
      content: `**Myth 1: "Loud Pipes Save Lives"**\n\nReality: Sound travels backward out of the exhaust. Dynamic visibility, proper positioning, and bright gear protect you much more effectively than noise.\n\n**Myth 2: "Laying the Bike Down is Safer Than Braking"**\n\nReality: Intentionally sliding loses control. Modern tires on asphalt provide far higher deceleration under maximum upright braking than sliding on metal/plastic.\n\n**Myth 3: "Never Use the Front Brake"**\n\nReality: Up to 70%+ of stopping power comes from the front brake. Use progressive squeezing rather than sudden grabbing.\n\n**Myth 4: "You Must Flat-Foot Both Feet at a Stop"**\n\nReality: Sliding slightly off the seat to plant your left foot while keeping your right foot on the rear brake gives complete stability on any size motorcycle.\n\n**Myth 5: "ABS Braking Isn't Safe or Necessary"**\n\nReality: Anti-lock Braking Systems prevent wheel lockup during emergency stops, enabling steerability and stopping distance reduction on wet or dusty roads.`,
      author: "Admin",
      imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    }
  });
  console.log('Blog added:', blog.id);
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
