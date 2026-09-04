import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rates = [
    { modelName: "Honda Dio BS6 110 Deluxe (DLX)", insuranceType: "3RD PARTY", maxPrice: 1705.00 },
    { modelName: "Honda Dio BS6 110 Deluxe (DLX)", insuranceType: "FULL PARTY", maxPrice: 6343.00 },
    { modelName: "Honda Dio BS6 110 Standard (STD)", insuranceType: "3RD PARTY", maxPrice: 1705.00 },
    { modelName: "Honda Dio BS6 110 Standard (STD)", insuranceType: "FULL PARTY", maxPrice: 6038.00 },
    
    { modelName: "Honda Dio BS6 125 Deluxe (DLX / H-Smart)", insuranceType: "3RD PARTY", maxPrice: 1705.00 },
    { modelName: "Honda Dio BS6 125 Deluxe (DLX / H-Smart)", insuranceType: "FULL PARTY", maxPrice: 5613.00 },
    { modelName: "Honda Dio BS6 125 Standard (STD)", insuranceType: "3RD PARTY", maxPrice: 1705.00 },
    { modelName: "Honda Dio BS6 125 Standard (STD)", insuranceType: "FULL PARTY", maxPrice: 6755.00 },
    
    { modelName: "CB Hornet 2.0 Standard", insuranceType: "FULL PARTY", maxPrice: 9391.00 },
    { modelName: "CB Hornet 2.0 Standard", insuranceType: "3RD PARTY", maxPrice: 1705.00 },

    { modelName: "Honda CB Shine BS6 125 Drum Brake (DRS)", insuranceType: "3RD PARTY", maxPrice: 1705.00 },
    { modelName: "Honda CB Shine BS6 125 Drum Brake (DRS)", insuranceType: "FULL PARTY", maxPrice: 6313.00 },
    { modelName: "Honda CB Shine BS6 125 Disc Brake (DSS)", insuranceType: "3RD PARTY", maxPrice: 1705.00 },
    { modelName: "Honda CB Shine BS6 125 Disc Brake (DSS)", insuranceType: "FULL PARTY", maxPrice: 6877.00 },

    { modelName: "Honda SP Shine BS6 125 Drum Brake (DRS)", insuranceType: "3RD PARTY", maxPrice: 1705.00 },
    { modelName: "Honda SP Shine BS6 125 Drum Brake (DRS)", insuranceType: "FULL PARTY", maxPrice: 6313.00 },
    { modelName: "Honda SP Shine BS6 125 Disc Brake (DSS)", insuranceType: "3RD PARTY", maxPrice: 1705.00 },
    { modelName: "Honda SP Shine BS6 125 Disc Brake (DSS)", insuranceType: "FULL PARTY", maxPrice: 6877.00 },

    { modelName: "XR-190", insuranceType: "3RD PARTY", maxPrice: 1931.00 }
  ];

  await prisma.insurancePriceList.deleteMany({});
  await prisma.insurancePriceList.createMany({ data: rates });

  return NextResponse.json({ success: true, count: rates.length });
}
