import { prisma } from './lib/prisma';

async function main() {
  const variantsToSeed = [
    {
      masterName: "Honda Dio BS6 110",
      variants: [
        {
          name: "Standard (STD)",
          exShowroomPriceNPR: 264900,
          onRoadPriceNPR: 275000,
          specDifferences: {
            "Console": "Analog",
            "Headlamp": "Halogen",
            "Wheels": "Steel",
            "Key": "Standard"
          }
        },
        {
          name: "Deluxe (DLX)",
          exShowroomPriceNPR: 284900,
          onRoadPriceNPR: 295000,
          specDifferences: {
            "Console": "Digital",
            "Headlamp": "LED",
            "Wheels": "Alloy",
            "Key": "Standard"
          }
        }
      ]
    },
    {
      masterName: "Honda Dio BS6 125",
      variants: [
        {
          name: "Standard (STD)",
          exShowroomPriceNPR: 311900,
          onRoadPriceNPR: 325000,
          specDifferences: {
            "Console": "Digital",
            "Key System": "Standard Key",
            "Wheels": "Steel",
            "Start System": "Self / Kick"
          }
        },
        {
          name: "Deluxe (DLX / H-Smart)",
          exShowroomPriceNPR: 331900,
          onRoadPriceNPR: 345000,
          specDifferences: {
            "Console": "Digital with Smart Features",
            "Key System": "Smart Key System (H-Smart)",
            "Wheels": "Alloy Wheels",
            "Start System": "Keyless Start"
          }
        }
      ]
    },
    {
      masterName: "Honda CB Shine BS6 125",
      variants: [
        {
          name: "Drum Brake (DRS)",
          exShowroomPriceNPR: 294900,
          onRoadPriceNPR: 305000,
          specDifferences: {
            "Front Brake": "Drum 130mm",
            "Weight": "113 kg",
            "Wheels": "Alloy"
          }
        },
        {
          name: "Disc Brake (DSS)",
          exShowroomPriceNPR: 305900,
          onRoadPriceNPR: 316000,
          specDifferences: {
            "Front Brake": "Disc 240mm",
            "Weight": "114 kg",
            "Wheels": "Alloy"
          }
        }
      ]
    },
    {
      masterName: "Honda SP Shine BS6 125",
      variants: [
        {
          name: "Drum Brake (DRS)",
          exShowroomPriceNPR: 306900,
          onRoadPriceNPR: 318000,
          specDifferences: {
            "Front Brake": "Drum 130mm",
            "Styling": "Standard Graphics"
          }
        },
        {
          name: "Disc Brake (DSS)",
          exShowroomPriceNPR: 319900,
          onRoadPriceNPR: 332000,
          specDifferences: {
            "Front Brake": "Disc 240mm",
            "Styling": "Premium Graphics & Accents"
          }
        }
      ]
    }
  ];

  for (const item of variantsToSeed) {
    const master = await prisma.vehicleMaster.findFirst({
      where: {
        name: {
          contains: item.masterName,
          mode: 'insensitive'
        }
      }
    });

    if (master) {
      console.log(`Found master for ${item.masterName}, ID: ${master.id}`);
      
      // Delete old fallback variants
      await prisma.vehicleVariant.deleteMany({
        where: { vehicleMasterId: master.id }
      });

      let minPrice = Infinity;

      for (const v of item.variants) {
        await prisma.vehicleVariant.create({
          data: {
            vehicleMasterId: master.id,
            variantName: v.name,
            exShowroomPriceNPR: v.exShowroomPriceNPR,
            onRoadPriceNPR: v.onRoadPriceNPR,
            specDifferences: v.specDifferences
          }
        });
        if (v.exShowroomPriceNPR < minPrice) minPrice = v.exShowroomPriceNPR;
      }

      // Update base price
      if (minPrice !== Infinity) {
        await prisma.vehicleMaster.update({
          where: { id: master.id },
          data: { basePrice: minPrice }
        });
        console.log(`Updated base price for ${item.masterName} to ${minPrice}`);
      }

    } else {
      console.log(`Could not find master for ${item.masterName}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
