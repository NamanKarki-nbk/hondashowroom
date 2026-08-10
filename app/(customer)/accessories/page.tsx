import React from "react";
import AccessoriesClient from "./AccessoriesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle Accessories | Honda Showroom",
  description: "Browse genuine Honda accessories for your motorcycle or scooter.",
};

export default function AccessoriesPage() {
  return (
    <div className="pt-[80px] min-h-screen bg-[#f3ebdd] dark:bg-background">
      <AccessoriesClient />
    </div>
  );
}
