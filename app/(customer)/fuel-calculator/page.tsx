import { prisma } from '@/lib/prisma'
import FuelCalculatorClient from './FuelCalculatorClient'

export const metadata = { title: 'Fuel Cost Calculator | Society Honda' }

export default async function FuelCalculatorPage() {
  const vehicles = await prisma.productCatalog.findMany({
    where: { category: { in: ['MOTORCYCLES', 'SCOOTERS'] } },
    select: { id: true, name: true, category: true, price: true, imageUrl: true }
  })
  
  return <FuelCalculatorClient vehicles={vehicles} />
}
