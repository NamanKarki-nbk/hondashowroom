import { prisma } from '@/lib/prisma'
import CompareClient from './CompareClient'
import { competitors } from '@/lib/competitors'

export const metadata = { title: 'Compare Bikes & Scooters | Society Honda' }

export default async function ComparePage() {
  const hondaVehicles = await prisma.productCatalog.findMany({
    where: { category: { in: ['MOTORCYCLES', 'SCOOTERS'] } },
    select: { id: true, name: true, category: true, price: true, imageUrl: true, specs: true, description: true }
  })
  
  // Add brand property to Honda vehicles and merge with competitors
  const vehicles = [
    ...hondaVehicles.map(v => ({ ...v, brand: 'Honda' })),
    ...competitors
  ];

  return <CompareClient vehicles={vehicles} />
}
