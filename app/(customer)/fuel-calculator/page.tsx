import { prisma } from '@/lib/prisma'
import FuelCalculatorClient from './FuelCalculatorClient'

export const metadata = { title: 'Fuel Cost Calculator | Society Honda' }

export default async function FuelCalculatorPage() {
  const vehiclesRaw = await prisma.vehicleMaster.findMany({
    where: { category: { in: ['MOTORCYCLE', 'SCOOTER'] } },
    select: { id: true, name: true, category: true, basePrice: true, imageUrl: true }
  })
  
  const vehicles = vehiclesRaw.map(v => ({
    ...v,
    price: v.basePrice
  }))
  
  return <FuelCalculatorClient vehicles={vehicles} />
}
