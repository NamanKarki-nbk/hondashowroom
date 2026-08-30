import { prisma } from '@/lib/prisma'
import CompareClient from './CompareClient'
import { competitors } from '@/lib/competitors'

export const metadata = { title: 'Compare Bikes & Scooters | Society Honda' }

export default async function ComparePage() {
  const hondaVehiclesRaw = await prisma.vehicleMaster.findMany({
    where: { category: { in: ['MOTORCYCLE', 'SCOOTER'] } },
    select: { id: true, name: true, category: true, basePrice: true, imageUrl: true, specifications: true, description: true }
  })
  
  const hondaVehicles = hondaVehiclesRaw.map(v => ({
    ...v,
    price: v.basePrice
  }))
  
  // Add brand property to Honda vehicles and merge with competitors
  const vehicles = [
    ...hondaVehicles.map(v => ({ ...v, brand: 'Honda' })),
    ...competitors.map(c => ({ ...c, basePrice: c.price }))
  ];

  return <CompareClient vehicles={vehicles} />
}
