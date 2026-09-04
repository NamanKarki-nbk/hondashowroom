import { prisma } from '../lib/prisma';
async function main() {
  const v = await prisma.vehicleMaster.findFirst({ where: { name: 'Honda Dio BS6 110' }});
  console.log(JSON.stringify(v?.features?.slice(0, 3), null, 2));
}
main();
