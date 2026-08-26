import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductPageClient from "./ProductPageClient";
import BigWingProductPageClient from "./BigWingProductPageClient";
import HondaDio110Page from "@/app/(customer)/scooter/dio-110/page";
import HondaDio125Page from "@/app/(customer)/scooter/dio-125/page";
// Feature and Spec JSON imports have been removed. Data is now fetched from the database.

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

  // Features - raw from DB
  let featuresRaw = vehicle.features || (isPower ? [] : [
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
      image: "/models/hero-1.png"
    }
  ]);

  // Determine the public image folder for this product's features
  const nameLower = vehicle.name.toLowerCase();
  let featureImageFolder = "";
  if (nameLower.includes("cb shine") || nameLower.includes("shine bs6")) {
    featureImageFolder = "cbshine125";
  } else if (nameLower.includes("sp shine") || nameLower.includes("sp 125")) {
    featureImageFolder = "spshinebs6";
  } else if (nameLower.includes("dio") && nameLower.includes("110")) {
    featureImageFolder = "dio110";
  } else if (nameLower.includes("dio") && nameLower.includes("125")) {
    featureImageFolder = "dio125";
  }

  // Prefix bare filenames with the correct public path
  const features = Array.isArray(featuresRaw) ? featuresRaw.map((f: any) => ({
    ...f,
    image: f.image && !f.image.startsWith("/") && featureImageFolder
      ? `/images/features/${featureImageFolder}/${f.image}`
      : f.image || "/models/hero-1.png"
  })) : featuresRaw;


  // Specs
  let rawSpecs = (vehicle.specifications as any)?.specifications || vehicle.specifications;
  let normalizedSpecs: Record<string, {label: string, value: string}[]> | null = null;
  
  if (Array.isArray(rawSpecs)) {
    normalizedSpecs = {};
    rawSpecs.forEach((group: any) => {
      if (group && group.category && Array.isArray(group.data)) {
        const keyName = group.category.replace(/ /g, "_");
        normalizedSpecs![keyName] = group.data;
      }
    });
  } else if (rawSpecs && typeof rawSpecs === 'object') {
    normalizedSpecs = {};
    for (const [category, dataObj] of Object.entries(rawSpecs)) {
      if (dataObj && typeof dataObj === 'object' && !Array.isArray(dataObj)) {
        const specsArray = [];
        for (const [key, value] of Object.entries(dataObj)) {
          if (value && value !== "NA" && value !== "") {
            const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            specsArray.push({ label, value: String(value) });
          }
        }
        if (specsArray.length > 0) {
          const categoryName = category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_');
          normalizedSpecs[categoryName] = specsArray;
        }
      } else if (Array.isArray(dataObj) && dataObj.length > 0 && typeof dataObj[0] === 'object' && 'label' in dataObj[0]) {
        // Fallback for some weird structures
        const categoryName = category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_');
        normalizedSpecs[categoryName] = dataObj as {label: string, value: string}[];
      }
    }
  }

  let specifications = normalizedSpecs && Object.keys(normalizedSpecs).length > 0 ? normalizedSpecs : null;

  if (!specifications) {
    if (isPower) {
      specifications = {
        "Dimensions": [
          { label: "Length", value: "500 mm" },
          { label: "Width", value: "300 mm" }
        ],
        "Engine": [
          { label: "Type", value: "4-stroke" },
          { label: "Displacement", value: "196cc" }
        ]
      };
    } else {
      specifications = {
        Body_Dimensions: [
          { label: "Height", value: "1150 mm" },
          { label: "Wheelbase", value: "1260 mm" },
          { label: "Ground Clearance", value: "160 mm" },
          { label: "Seat Length", value: "690 mm" },
          { label: "Kerb Weight", value: "103 kg" },
          { label: "Fuel Tank Capacity", value: "5.3 L" }
        ],
        Engine_Performance: [
          { label: "Type", value: "4 Stroke, SI Engine, PGM-FI eSP" },
          { label: "Displacement", value: "109.51 cc" },
          { label: "Maximum Power", value: "5.71 kW (7.76 PS) @ 8000 rpm" },
          { label: "Max. Torque", value: "9.03 N.m @ 5250 rpm" },
          { label: "Starting", value: "Self Start / Smart Key Start & Kick Start" }
        ],
        Electricals: [
          { label: "Ignition", value: "Full Transistorized ECU Controlled" },
          { label: "Battery", value: "12V, 3.0 Ah" },
          { label: "Headlamp", value: "LED Headlamp with DRL" },
          { label: "Tail Lamp", value: "Aggressive Multi-reflector" }
        ],
        Chassis_Suspension: [
          { label: "Frame Type", value: "High Rigidity Underbone Type" },
          { label: "Front Suspension", value: "Telescopic Hydraulic Fork" },
          { label: "Rear Suspension", value: "3-Step Adjustable Spring Loaded Hydraulic" },
          { label: "Ground Clearance", value: "160 mm" }
        ],
        Brakes_Tyres: [
          { label: "Front Brake", value: "Drum 130 mm" },
          { label: "Rear Brake", value: "Drum 130 mm with Equalizer CBS" },
          { label: "Front Tyre", value: "90/90-12 54J (Tubeless)" },
          { label: "Rear Tyre", value: "90/100-10 53J (Tubeless)" }
        ]
      };
    }
  }

  const variants = isPower ? [
    { name: "Standard", imageUrl: vehicle.imageUrl }
  ] : [
    { name: "Dio BS6 110 STD", imageUrl: "/models/dio-std.png" },
    { name: "Dio BS6 110 DLX", imageUrl: "/models/dio-dlx.png" }
  ];

  let threeSixty = null;
  // nameLower already declared above for feature image folder resolution
  
  if (nameLower.includes("dio 125") || nameLower.includes("dio bs6 125")) {
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
    imageUrl: vehicle.imageUrl?.replace('/product-catalog/', '/inventory/') || "/placeholder.png",
    tagline: isPower ? "Power You Can Trust" : "The Power of Dreams",
    highlights,
    features,
    sections,
    colors,
    specifications: vehicle.specifications ? { ...specifications, ...(typeof vehicle.specifications === 'object' ? vehicle.specifications : {}) } : specifications,
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

  const nameLower = enrichedProduct.name.toLowerCase();
  
  // Define if the vehicle should use the specialized Honda Dio 125 layout
  const isDio125 = (nameLower.includes("dio") && nameLower.includes("125")) || slug === "dio-125";
  
  // Define if the vehicle should use the specialized Honda Dio 110 layout
  // Prevent Dio 125 from bleeding into Dio 110
  const isDio110 = ((nameLower.includes("dio") && !isDio125)) || slug === "dio-110";

  if (isDio110) {
    let dio110StdPrice = "NPR 2,64,900";
    let dio110DlxPrice = "NPR 2,84,900";

    try {
      const stdVariant = await prisma.vehicle.findFirst({
        where: { modelName: { contains: "Dio 110 STD", mode: "insensitive" } }
      });
      if (stdVariant && stdVariant.price) {
        dio110StdPrice = `NPR ${stdVariant.price.toLocaleString('en-IN')}`;
      }

      const dlxVariant = await prisma.vehicle.findFirst({
        where: { modelName: { contains: "Dio 110 DLX", mode: "insensitive" } }
      });
      if (dlxVariant && dlxVariant.price) {
        dio110DlxPrice = `NPR ${dlxVariant.price.toLocaleString('en-IN')}`;
      }
    } catch (error) {
      console.error("Failed to fetch Dio 110 variant prices from DB:", error);
    }

    return <HondaDio110Page vehicle={enrichedProduct} stdPrice={dio110StdPrice} dlxPrice={dio110DlxPrice} />;
  }


  if (isDio125) {
    let dio125StdPrice = "NPR 3,11,900";
    let dio125DlxPrice = "NPR 3,31,900";

    try {
      const stdVariant = await prisma.vehicle.findFirst({
        where: { modelName: { contains: "Dio 125 STD", mode: "insensitive" } }
      });
      if (stdVariant && stdVariant.price) {
        dio125StdPrice = `NPR ${stdVariant.price.toLocaleString('en-IN')}`;
      }

      const dlxVariant = await prisma.vehicle.findFirst({
        where: { modelName: { contains: "Dio 125 DLX", mode: "insensitive" } }
      });
      if (dlxVariant && dlxVariant.price) {
        dio125DlxPrice = `NPR ${dlxVariant.price.toLocaleString('en-IN')}`;
      }
    } catch (error) {
      console.error("Failed to fetch Dio 125 variant prices from DB:", error);
    }

    return <HondaDio125Page vehicle={enrichedProduct} stdPrice={dio125StdPrice} dlxPrice={dio125DlxPrice} />;
  }

  // Define if the vehicle should use the premium BigWing dark layout
  const isBigWing = enrichedProduct.name.toLowerCase().includes("nx 200") || enrichedProduct.name.toLowerCase().includes("hornet");

  // Fetch variant prices for Shine models if applicable
  const isShine = enrichedProduct.name.toLowerCase().includes("shine");
  if (isShine) {
    let drsPrice = "NPR 3,06,900";
    let dssPrice = "NPR 3,19,900";
    let modelPrefix = enrichedProduct.name.toLowerCase().includes("sp shine") ? "SP Shine BS6" : "CB Shine BS6";

    try {
      const drsVariant = await prisma.vehicle.findFirst({
        where: { modelName: { contains: `${modelPrefix} DRS`, mode: "insensitive" } }
      });
      if (drsVariant && drsVariant.price) {
        drsPrice = `NPR ${drsVariant.price.toLocaleString('en-IN')}`;
      }

      const dssVariant = await prisma.vehicle.findFirst({
        where: { modelName: { contains: `${modelPrefix} DSS`, mode: "insensitive" } }
      });
      if (dssVariant && dssVariant.price) {
        dssPrice = `NPR ${dssVariant.price.toLocaleString('en-IN')}`;
      }
    } catch (error) {
      console.error(`Failed to fetch ${modelPrefix} variant prices from DB:`, error);
    }

    enrichedProduct.variants = [
      { name: `${modelPrefix} DRS`, price: drsPrice, imageUrl: "/models/dio-std.png" },
      { name: `${modelPrefix} DSS`, price: dssPrice, imageUrl: "/models/dio-dlx.png" }
    ];
  }

  return isBigWing ? (
    <BigWingProductPageClient vehicle={enrichedProduct} />
  ) : (
    <ProductPageClient vehicle={enrichedProduct} />
  );
}
