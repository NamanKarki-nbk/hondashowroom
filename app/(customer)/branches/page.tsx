import React from "react";
import LocationsClient from "./LocationsClient";
import { prisma } from "@/lib/prisma";
import type { LocationData } from "@/components/InteractiveMap";

export const metadata = {
  title: 'Our Locations | Society Enterprises',
  description: 'Find Honda Showrooms and Service Centers near you.',
};

export const revalidate = 60; // Revalidate every minute

export default async function LocationsPage() {
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' }
  });

  let mappedLocations: LocationData[] = branches.map((b) => {
    // Basic defaults
    const isMain = b.name.toLowerCase().includes('damak') || b.name.toLowerCase().includes('headquarter');
    const defaultEmail = 'societyenterprises2024@gmail.com';
    const defaultHours = isMain ? '8:00 AM - 6:30 PM (Friday Close)' : '9:00 AM - 6:00 PM (Saturday Close)';
    
    return {
      name: b.name,
      type: "Showroom & Service Center",
      address: b.address,
      phone: b.phone,
      email: defaultEmail,
      hours: defaultHours,
      isMain,
      coordinates: [b.latitude || 26.6666, b.longitude || 87.6833] as [number, number],
      mapUrl: b.mapUrl || `https://maps.google.com/?q=${b.latitude || 26.6666},${b.longitude || 87.6833}`,
    };
  });

  // Ensure Damak (HQ) appears first
  mappedLocations.sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return 0;
  });

  // Fallback if DB is empty
  if (mappedLocations.length === 0) {
    mappedLocations = [
      {
        name: "Damak Branch",
        type: "Showroom & Service Center",
        address: "Goarkha Department Building, Ganga Nagari, Damak-05, Jhapa",
        phone: "+977-9801615250",
        email: "societyenterprises2024@gmail.com",
        hours: "8:00 AM - 6:30 PM (Friday Close)",
        isMain: true,
        coordinates: [26.6666, 87.6833],
        mapUrl: "https://maps.google.com/?q=26.6666,87.6833",
      },
      {
        name: "Urlabari Branch",
        type: "Showroom & Service Center",
        address: "Hotel grand Building, Urlabari, Morang",
        phone: "+977-9801615250",
        email: "societyenterprises2024@gmail.com",
        hours: "9:00 AM - 6:00 PM (Saturday Close)",
        isMain: false,
        coordinates: [26.6631, 87.6041],
        mapUrl: "https://maps.google.com/?q=26.6631,87.6041",
      }
    ];
  }

  return <LocationsClient initialLocations={mappedLocations} />;
}
