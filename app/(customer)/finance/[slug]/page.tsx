import { prisma } from "@/lib/prisma";
import FinanceDetailClient from "./FinanceDetailClient";
import { notFound } from "next/navigation";

export default async function FinanceDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.productCatalog.findUnique({
    where: { id: params.slug }
  });

  if (!product) {
    notFound();
  }

  // Fetch or mock some specs
  const specs = {
    cc: product.name.includes("125") ? "124 cc" : product.name.includes("200") ? "184.4 cc" : "109.5 cc",
    power: product.name.includes("125") ? "8.0 kW" : product.name.includes("200") ? "12.7 kW" : "5.7 kW",
    weight: product.name.includes("125") ? "116 kg" : product.name.includes("200") ? "147 kg" : "105 kg"
  };

  return <FinanceDetailClient product={product} specs={specs} />;
}
