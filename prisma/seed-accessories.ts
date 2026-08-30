import { prisma } from '../lib/prisma';

async function main() {
  console.log("Seeding Accessories...");

  await prisma.accessory.deleteMany({});

  const accessoriesData = [
    {
      name: "KIT,COWL SINGLE SEAT, LEMON ICE YELLOW",
      partNo: "08R01K4FD00ZA",
      category: "Cowl",
      price: 1107,
      imageUrl: "https://images.unsplash.com/photo-1598504780517-57db8fdb1276?w=600&q=80",
      description: "Enhance your ride with premium, high-quality accessories designed perfectly for your Honda motorcycle.",
      stockStatus: "IN_STOCK",
      vehicleType: "motorcycle",
      compatibility: ["CB350", "Hornet 2.0"],
    },
    {
      name: "License Plate Case (100*200)",
      partNo: "08304COMM10",
      category: "Plate Case",
      price: 100,
      imageUrl: "https://images.unsplash.com/photo-1518175510659-45e0f7e1b539?w=600&q=80",
      description: "Premium add-ons and protection solutions for your Honda vehicle.",
      stockStatus: "IN_STOCK",
      vehicleType: "scooter",
      compatibility: ["Activa 6G", "Dio 125", "SP 125", "CB350"],
    },
    {
      name: "FRONT PIPE",
      partNo: "08302K1PA00",
      category: "Pipe",
      price: 902,
      imageUrl: "https://images.unsplash.com/photo-1610416956667-8bf4212ecb72?w=600&q=80",
      description: "Durable metal leg guard to protect against impacts. Essential for everyday riding safety.",
      stockStatus: "IN_STOCK",
      vehicleType: "motorcycle",
      compatibility: ["Hornet 2.0", "SP 125"],
    },
    {
      name: "KIT,COWL SINGLE SEAT, ATHLETIC BLUE METALLIC",
      partNo: "08R01K4FD00ZC",
      category: "Cowl",
      price: 1107,
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
      description: "Aerodynamic full-face helmet meeting high safety standards with superior ventilation.",
      stockStatus: "IN_STOCK",
      vehicleType: "motorcycle",
      compatibility: ["CB350", "Hornet 2.0"],
    },
    {
      name: "BODY COVER SILVER MOTORCYCLE",
      partNo: "08303COMM10ZA",
      category: "Body Cover",
      price: 401,
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
      description: "High-quality, UV-resistant and waterproof cover to keep your bike pristine in any weather.",
      stockStatus: "IN_STOCK",
      vehicleType: "motorcycle",
      compatibility: ["SP 125", "Unicorn", "Shine 100"],
    },
    {
      name: "FRONT PIPE - BLACK",
      partNo: "08302K4FA00ZA",
      category: "Pipe",
      price: 1454,
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
      description: "Durable metal leg guard to protect against impacts. Essential for everyday riding safety.",
      stockStatus: "IN_STOCK",
      vehicleType: "motorcycle",
      compatibility: ["Hornet 2.0", "NX500"],
    }
  ];

  for (const accessory of accessoriesData) {
    await prisma.accessory.create({
      data: accessory as any,
    });
    console.log(`Created accessory: ${accessory.name}`);
  }

  console.log("Accessories seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
