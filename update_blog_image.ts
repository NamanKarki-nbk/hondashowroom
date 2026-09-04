import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from './app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectionString = `postgresql://neondb_owner:npg_3ZCKunbpOR8E@ep-divine-king-aznw5hiw.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Uploading image to Cloudinary...');
  const result = await cloudinary.uploader.upload(
    '/home/max1ie/.gemini/antigravity/brain/67129b6a-55c7-4b71-88f9-351e61c5bf39/media__1788164884596.jpg',
    { folder: 'honda-showroom/blogs' }
  );
  
  const imageUrl = result.secure_url;
  console.log('Uploaded! URL:', imageUrl);

  // Find the latest blog
  const latestBlog = await prisma.blog.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!latestBlog) {
    console.error('No blogs found');
    return;
  }

  await prisma.blog.update({
    where: { id: latestBlog.id },
    data: { imageUrl }
  });

  console.log(`Updated blog ${latestBlog.id} with new image`);
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
