import { PrismaClient } from "./app/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@honda.com";
  const password = "admin123";
  
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
    },
    create: {
      email: adminEmail,
      fullName: "System Admin",
      passwordHash,
      phone: "0000000000",
      citizenshipVerified: true,
      licenseVerified: true,
      nationalIdVerified: true,
    },
  });

  console.log(`Admin user created/updated: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
