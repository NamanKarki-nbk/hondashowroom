import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductPageClient from "./ProductPageClient";
import BigWingProductPageClient from "./BigWingProductPageClient";

// Helper function to generate realistic mock data based on the scraped vehicle
function generateMockData(vehicle: any) {
  const isScooter = vehicle.category === "SCOOTER";
  const isPower = vehicle.category === "POWER_PRODUCT";

  // Generic colors for all models
  const colors = [
    { name: "Matte Black", hex: "#222222" },
    { name: "Pearl White", hex: "#EAEAEA" },
    { name: "Sports Red", hex: "#c1291A" },
    { name: "Metallic Blue", hex: "#1A365D" },
  ];

  // Highlights based on category
  const highlights = isPower ? [
    { label: "Power Output", value: "3.0 kVA", icon: "Zap" },
    { label: "Fuel Type", value: "Petrol", icon: "Settings" },
    { label: "Tank Capacity", value: "15 L", icon: "Wind" }
  ] : [
    { label: "Displacement", value: "124.9 cc", icon: "Settings" },
    { label: "Mileage", value: "50 kmpl", icon: "Wind" },
    { label: "Max Power", value: "6.0 kW", icon: "Zap" }
  ];

  // Features
  const features = isPower ? [] : [
    {
      title: "First in segment - Largest underseat storage",
      description: "More storage & more safety. Built to accommodate all your family's essentials and also room for two helmets.",
      image: "/models/hero-1.png"
    },
    {
      title: "Smart Digital Console",
      description: "Stay connected with Bluetooth enabled digital console featuring turn-by-turn navigation, call alerts, and real-time mileage indicators.",
      image: "/models/hero-2.png"
    },
    {
      title: "Assist/Slipper Clutch",
      description: "Enables quick shifting and prevents rear wheel hopping.",
      image: "/models/hero-1.png" // placeholder
    }
  ];

  // Specs
  const specs = isPower ? {} : {
    Body_Dimensions: [
      { label: "Length", value: "1830 mm" },
      { label: "Width", value: "707 mm" },
      { label: "Height", value: "1172 mm" },
      { label: "Wheelbase", value: "1260 mm" },
      { label: "Ground Clearance", value: "171 mm" },
      { label: "Seat Length", value: "708 mm" },
      { label: "Kerb Weight", value: "105 kg" },
      { label: "Fuel Tank Capacity", value: "5.3 L" }
    ],
    Engine_Performance: [
      { label: "Type", value: "Single Cylinder, 4 - Stroke, CVTi, fuel injection" },
      { label: "Displacement", value: "124.8 cc" },
      { label: "Maximum Power", value: "6.0 kW @ 6500 rpm" },
      { label: "Max. Torque", value: "10.5 Nm @ 5000 rpm" },
      { label: "Starting", value: "Electric & Kick Start" }
    ],
    Electricals: [
      { label: "Ignition", value: "ECU-controlled ignition" },
      { label: "Battery", value: "12V, 5Ah Maintenance Free" },
      { label: "Headlamp", value: "LED with DRL" },
      { label: "Tail Lamp", value: "LED" }
    ],
    Chassis_Suspension: [
      { label: "Frame Type", value: "High Rigidity Underbone Type" },
      { label: "Front Suspension", value: "Telescopic hydraulic" },
      { label: "Rear Suspension", value: "Twin tube emulsion type with 3-step adj." },
      { label: "Ground Clearance", value: "163 mm" }
    ],
    Brakes_Tyres: [
      { label: "Front Brake", value: "220mm Disc with CBS" },
      { label: "Rear Brake", value: "130mm Drum with CBS" },
      { label: "Front Tyre", value: "90/90-12 54J (Tubeless)" },
      { label: "Rear Tyre", value: "90/90-12 54J (Tubeless)" }
    ]
  };

  const variants = isPower ? [
    { name: "Standard", imageUrl: vehicle.imageUrl }
  ] : [
    { name: "Dio BS6 110 STD", imageUrl: "/models/dio-std.png" },
    { name: "Dio BS6 110 DLX", imageUrl: "/models/dio-dlx.png" }
  ];

  let threeSixty = null;
  const nameLower = vehicle.name.toLowerCase();
  
  if (nameLower.includes("dio 125")) {
    threeSixty = {
      localPath: "/360/dio-125",
      totalFrames: 24
    };
  } else if (nameLower.includes("dio bs6") || nameLower.includes("dio 110")) {
    threeSixty = {
      localPath: "/360/dio-bs6",
      totalFrames: 24
    };
  } else if (nameLower.includes("sp 125") || nameLower === "sp shine bs6") {
    threeSixty = {
      localPath: "/360/sp-125",
      totalFrames: 24
    };
  } else if (nameLower.includes("nx 200")) {
    threeSixty = {
      localPath: "/360/nx200",
      totalFrames: 24
    };
  } else if (nameLower.includes("hornet")) {
    threeSixty = {
      localPath: "/360/hornet-2",
      totalFrames: 24
    };
  } else if (nameLower === "honda shine bs6" || nameLower.includes("cb shine")) {
    threeSixty = {
      localPath: "/360/shine-125",
      totalFrames: 24
    };
  }

  let sections = undefined;
  if (nameLower.includes("nx 200")) {
    sections = [
      {
        title: "Technology",
        features: [
          {
            title: "TFT Display",
            description: "Perfectly positioned to constantly show you all the information you need.",
            image: "/nx200/technology/tft-display-big.png"
          },
          {
            title: "Honda RoadSync",
            description: "Enables hands-free operation and displays information.",
            image: "/nx200/technology/honda-roadsync.png"
          },
          {
            title: "Assist/Slipper Clutch",
            description: "Enables quick shifting and prevents rear wheel hopping.",
            image: "/nx200/technology/assist-slipper-clutch.png"
          }
        ]
      },
      {
        title: "Design",
        features: [
          {
            title: "Tall Wind Visor",
            description: "The Tall Wind Visor ensures optimal aerodynamics and adds to the urban-explorer design.",
            image: "/nx200/design/tall-wind-visor-big.png"
          },
          {
            title: "Upswept Exhaust",
            description: "The exhaust of NX200 is designed to add to the lean mean machine look.",
            image: "/nx200/design/upswept-exhaust.png"
          },
          {
            title: "LED Winkers",
            description: "TFT display, LED lights, and a sturdy frame make every ride premium.",
            image: "/nx200/design/led-winkers-big.png"
          },
          {
            title: "All-LED Lighting",
            description: "Stylish & High-Tech!",
            image: "/nx200/design/all-led-lighting.png"
          }
        ]
      }
    ];
  }

  return {
    ...vehicle,
    tagline: isPower ? "Power You Can Trust" : "The Power of Dreams",
    highlights,
    features,
    sections,
    colors,
    specs,
    variants,
    threeSixty
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch product from DB based on slug (which is the product ID)
  const product = await prisma.productCatalog.findUnique({
    where: {
      id: slug
    }
  });

  if (!product) {
    notFound();
  }

  const enrichedProduct = generateMockData(product);

  // Define if the vehicle should use the premium BigWing dark layout
  const isBigWing = enrichedProduct.name.toLowerCase().includes("nx 200") || enrichedProduct.name.toLowerCase().includes("hornet");

  return isBigWing ? (
    <BigWingProductPageClient vehicle={enrichedProduct} />
  ) : (
    <ProductPageClient vehicle={enrichedProduct} />
  );
}
