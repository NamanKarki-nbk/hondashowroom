import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const dio = await prisma.productCatalog.findFirst({
    where: { name: { contains: 'Dio' } }
  })
  console.log(JSON.stringify(dio, null, 2))
}
main()
