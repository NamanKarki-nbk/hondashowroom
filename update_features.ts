import { prisma } from './lib/prisma';

async function main() {
  const vehicleId = 'honda-87';
  
  const features = [
  {
    "id": "acg-starter",
    "title": "ACG STARTER",
    "subtitle": "Silent Start",
    "description": "Honda’s unique ACG starter motor removes gear meshing noise and helps start the engine without a jolt.",
    "image": "/images/features/acg-starter.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "start-stop-switch",
    "title": "Engine Start/Stop Switch",
    "subtitle": "Convenience",
    "description": "Start and stop the engine with just a flick of a switch.",
    "image": "/images/features/start-stop-switch.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "digital-meter",
    "title": "Fully Digital Meter",
    "subtitle": "Smart Console",
    "description": "The advanced fully digital meter provides precise information including real-time mileage, average mileage, and distance to empty.",
    "image": "/images/features/digital-meter.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "led-headlamp",
    "title": "LED Headlamp",
    "subtitle": "Aggressive Look",
    "description": "The stylish LED Headlamp adds to the sporty character and ensures clear visibility.",
    "image": "/images/features/led-headlamp.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "split-grab-rail",
    "title": "Split Grab Rail",
    "subtitle": "Sporty Touch",
    "description": "The edgy split grab rail makes it easy for the pillion rider to hold on while adding a sporty touch to the scooter.",
    "image": "/images/features/split-grab-rail.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "bs-vi-engine",
    "title": "BS-VI Engine",
    "subtitle": "eSP Technology",
    "description": "The latest innovation in the engine, eSP technology brings together a new dimension of riding.",
    "image": "/images/features/bs-vi-engine.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "telescopic-suspension",
    "title": "Telescopic Suspension",
    "subtitle": "Superior Comfort",
    "description": "The telescopic suspension brings more stability while taking the scooter through uneven and rough roads.",
    "image": "/images/features/telescopic-suspension.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "external-fuel-fill",
    "title": "External Fuel Fill",
    "subtitle": "Easy Refueling",
    "description": "Now no need to lift your seat anymore for refuelling as Dio comes with an external fuel fill.",
    "image": "/images/features/external-fuel-fill.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "retractable-pillion-foot-step",
    "title": "Retractable Pillion Foot Step",
    "subtitle": "Passenger Comfort",
    "description": "Ensure pillion rider comfort with a retractable foot step.",
    "image": "/images/features/retractable-pillion-foot-step.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "pgm-fi",
    "title": "PGM-FI",
    "subtitle": "Efficient Combustion",
    "description": "Sensor-based PGM-FI system constantly injects optimum fuel and air mixture resulting in efficient combustion.",
    "image": "/images/features/pgm-fi.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "front-pocket",
    "title": "Front Pocket",
    "subtitle": "Extra Storage",
    "description": "A front pocket to keep your water bottle, mobile phone or other essentials while you ride.",
    "image": "/images/features/front-pocket.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  },
  {
    "id": "passing-switch",
    "title": "Passing Switch",
    "subtitle": "Safety First",
    "description": "The passing switch makes it easy to signal the oncoming vehicles.",
    "image": "/images/features/passing-switch.png",
    "fallbackImage": "/inventory/honda-dio-bs6.png"
  }
];

  const catalogItem = await prisma.productCatalog.findFirst({
    where: { name: 'Honda Dio BS6 110' }
  });
  
  if (catalogItem) {
    const specs = (catalogItem.specs as any) || {};
    specs.features = features;
    
    await prisma.productCatalog.update({
      where: { id: catalogItem.id },
      data: {
        specs: specs
      }
    });
    console.log(`Updated product catalog specs with features for ${catalogItem.name}!`);
  } else {
    console.log("ProductCatalog item not found!");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
