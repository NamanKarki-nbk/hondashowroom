import { prisma } from './lib/prisma';

async function main() {
  await prisma.heroBanner.createMany({
    data: [
      {
        title: "DIO 125",
        subtitle: "Honda scooter",
        imageUrl: "/inventory/honda-dio-bs6-125.png",
        linkUrl: "/vehicles/honda-84",
        order: 1,
        isActive: true,
      },
      {
        title: "DIO BS6",
        subtitle: "Honda scooter",
        imageUrl: "/inventory/honda-dio-bs6-110.png",
        linkUrl: "/vehicles/honda-87",
        order: 2,
        isActive: true,
      },
      {
        title: "HORNET 2.0",
        subtitle: "Honda motorcycle",
        imageUrl: "/inventory/cb-hornet-20.png",
        linkUrl: "/vehicles/honda-75",
        order: 3,
        isActive: true,
      }
    ]
  });
  console.log("Seeded banners!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
