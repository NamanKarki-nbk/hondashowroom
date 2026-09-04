const { PrismaClient } = require('./app/generated/prisma');
const prisma = new PrismaClient();

const staffData = [
  { name: 'Bhim Babu Bhattarai', accountNo: '0790258268500017', panNo: '302794076', order: 1, lastSalary: 45000, role: 'STAFF' },
  { name: 'Durga Dhungel', accountNo: '0790125818100013', panNo: '617049397', order: 2, lastSalary: 45000, role: 'STAFF' },
  { name: 'Success Bhattarai', accountNo: '0790046453900011', panNo: '132595687', order: 3, lastSalary: 45000, role: 'STAFF' },
  { name: 'Sakuntala Bhattarai', accountNo: '0790240509100018', panNo: '110931870', order: 4, lastSalary: 43500, role: 'STAFF' },
  { name: 'Durga Prasad Niroula', accountNo: '0790212068800012', panNo: '130840011', order: 5, lastSalary: 22000, role: 'STAFF' },
  { name: 'Society Karki', accountNo: '0790233428300010', panNo: '131529476', order: 6, lastSalary: 15000, role: 'STAFF' },
  { name: 'Pradip Acharya', accountNo: '0790243850300014', panNo: '148723896', order: 7, lastSalary: 20000, role: 'STAFF' },
  { name: 'Yogesh Rai', accountNo: '0790265448200018', panNo: '155379701', order: 8, lastSalary: 15000, role: 'STAFF' },
  { name: 'Dambar Bahadur Karki', accountNo: '0530202383800019', panNo: '142408991', order: 9, lastSalary: 20000, role: 'STAFF' },
  { name: 'Hikmat Bahadur Karki', accountNo: '0790256640100015', panNo: '156887179', order: 10, lastSalary: 18000, role: 'STAFF' },
  { name: 'Januka Thapa', accountNo: '0790246191600010', panNo: '149192796', order: 11, lastSalary: 15000, role: 'STAFF' },
  { name: 'Yohana Bhujel', accountNo: '0790270922200019', panNo: '157893083', order: 12, lastSalary: 10000, role: 'STAFF' },
  { name: 'Tila Maya Karki', accountNo: '0530056625300011', panNo: '129688787', order: 13, lastSalary: 38000, role: 'STAFF' },
  { name: 'Harka Bahadur Limbu', accountNo: '0790251658700011', panNo: '150694391', order: 14, lastSalary: 16000, role: 'STAFF' },
  { name: 'Dipak Mahato', accountNo: '0790248382800018', panNo: '150271101', order: 15, lastSalary: 17500, role: 'STAFF' },
  { name: 'Shreeram Poddar', accountNo: '0790254395500012', panNo: '152221430', order: 16, lastSalary: 22000, role: 'STAFF' },
  { name: 'Sandesh Karki', accountNo: '0530273364500013', panNo: '129787954', order: 17, lastSalary: 42000, role: 'STAFF' },
  { name: 'Bhuban Nepali', accountNo: '0530255937100011', panNo: '152558767', order: 18, lastSalary: 16000, role: 'STAFF' },
  { name: 'Dhiraj Mandal', accountNo: '0530249688800016', panNo: '150753029', order: 19, lastSalary: 16000, role: 'STAFF' },
  { name: 'Prem Prakash Sharma', accountNo: '0790280627200016', panNo: '161885515', order: 20, lastSalary: 15000, role: 'STAFF' }
];

async function seed() {
  for (const staff of staffData) {
    await prisma.staff.create({ data: staff });
  }
  console.log("Seeded!");
}
seed().catch(console.error).finally(() => prisma.$disconnect());
