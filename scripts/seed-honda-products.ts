import { PrismaClient } from '../app/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const HONDA_VEHICLE_MODELS = [
  { name: "Honda Dio BS6", cc: 110, price: 230000, baseInsurance: 1500, category: "SCOOTER", colors: ["#ff0000", "#0000ff"] },
  { name: "Honda Grazia BS6", cc: 125, price: 245000, baseInsurance: 1600, category: "SCOOTER", colors: ["#ffcc00", "#000000"] },
  { name: "Honda Shine SP", cc: 125, price: 250000, baseInsurance: 1600, category: "MOTORCYCLE", colors: ["#000000", "#ff0000"] },
  { name: "Honda Hornet 2.0", cc: 184, price: 360000, baseInsurance: 2000, category: "MOTORCYCLE", colors: ["#ff0000", "#0000ff"] },
  { name: "Honda XR 150L", cc: 150, price: 650000, baseInsurance: 2500, category: "MOTORCYCLE", colors: ["#ff0000"] },
  { name: "Honda CRF 300L", cc: 300, price: 1950000, baseInsurance: 4500, category: "MOTORCYCLE", colors: ["#ff0000"] },
];
const bikesAndScooters = HONDA_VEHICLE_MODELS;

const serviceCharges = [
  { pattern: "DEFAULT", downpaymentPct: 40, tenureMonths: 12, amount: 8000 },
  { pattern: "DEFAULT", downpaymentPct: 50, tenureMonths: 12, amount: 7000 },
  { pattern: "DEFAULT", downpaymentPct: 60, tenureMonths: 12, amount: 6000 },
  { pattern: "DEFAULT", downpaymentPct: 40, tenureMonths: 24, amount: 14000 },
  { pattern: "DEFAULT", downpaymentPct: 50, tenureMonths: 24, amount: 12000 },
  { pattern: "DEFAULT", downpaymentPct: 60, tenureMonths: 24, amount: 10000 },
  { pattern: "CRF 300L", downpaymentPct: 50, tenureMonths: 24, amount: 35000 },
];

const spareParts = [
  { partNumber: "HP-001", name: "Brake Pad (Front)", category: "Brakes", price: 1200, stock: 50 },
  { partNumber: "HP-002", name: "Engine Oil 10W30", category: "Fluids", price: 800, stock: 150 },
  { partNumber: "HP-003", name: "Air Filter (Dio)", category: "Filters", price: 450, stock: 80 },
];

const locations = [
  { name: "Society Enterprises Pvt. Ltd. (Main)", address: "Damak-5, Jhapa", phone: "023-580000", isEmergency: true },
  { name: "Society Service Center", address: "Damak-7, Jhapa", phone: "023-580001", isEmergency: false },
];

async function main() {
  console.log("Seeding Database...");

  // 1. Seed Vehicles & Vehicle Inventory
  for (const v of bikesAndScooters) {
    const vehicle = await prisma.vehicle.upsert({
      where: { modelName: v.name },
      update: { price: v.price, cc: v.cc, baseInsurance: v.baseInsurance },
      create: { modelName: v.name, cc: v.cc, price: v.price, baseInsurance: v.baseInsurance },
    });

    for (const color of v.colors) {
      // First find if exists (because there is no unique constraint on (vehicleId, name) in schema yet)
      const existingColor = await prisma.vehicleColor.findFirst({
        where: { vehicleId: vehicle.id, name: color }
      });
      if (!existingColor) {
        await prisma.vehicleColor.create({
          data: {
            vehicleId: vehicle.id,
            name: color,
            hexCode: color,
          }
        });
      }
    }

    // Add some random inventory
    for (let i = 0; i < 3; i++) {
      const vin = `VIN-${v.name.replace(/\s+/g, '')}-${i}`;
      await prisma.vehicleInventory.upsert({
        where: { vin },
        update: {},
        create: {
          vin,
          engineNo: `ENG-${v.name.replace(/\s+/g, '')}-${i}`,
          category: v.category,
          modelName: v.name,
          cc: v.cc,
          color: v.colors[0],
          purchasePrice: v.price * 0.85, // 15% dealer margin approx
          purchaseDate: new Date(),
          purchaseMethod: "COMPANY_DISPATCH",
          status: "IN_STOCK"
        }
      });
    }

    // Also populate ProductCatalog for the catalog page
    const slugId = v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await prisma.productCatalog.upsert({
      where: { id: slugId },
      update: { price: v.price },
      create: {
        id: slugId,
        name: v.name,
        category: v.category,
        price: v.price,
        imageUrl: "/placeholder.png",
      }
    });
  }

  // 2. Seed Service Charges
  for (const sc of serviceCharges) {
    await prisma.serviceCharge.upsert({
      where: {
        modelPattern_downpaymentPct_tenureMonths: {
          modelPattern: sc.pattern,
          downpaymentPct: sc.downpaymentPct,
          tenureMonths: sc.tenureMonths
        }
      },
      update: { amount: sc.amount },
      create: {
        modelPattern: sc.pattern,
        downpaymentPct: sc.downpaymentPct,
        tenureMonths: sc.tenureMonths,
        amount: sc.amount
      }
    });
  }

  // 3. Seed Spare Parts
  for (const sp of spareParts) {
    await prisma.sparePart.upsert({
      where: { partNumber: sp.partNumber },
      update: { price: sp.price, stock: sp.stock },
      create: {
        partNumber: sp.partNumber,
        name: sp.name,
        category: sp.category,
        price: sp.price,
        stock: sp.stock
      }
    });
  }

  // 4. Seed Locations
  for (const loc of locations) {
    const existing = await prisma.outlet.findFirst({ where: { name: loc.name } });
    if (!existing) {
      await prisma.outlet.create({
        data: {
          name: loc.name,
          address: loc.address,
          phone: loc.phone,
          isEmergency: loc.isEmergency
        }
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
