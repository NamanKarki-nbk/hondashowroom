import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL?.replace(/['"]/g, '');
const pool = new Pool({ connectionString });

const staffData = [
  { name: 'Bhim Babu Bhattarai', accountNo: '0790258268500017', panNo: '302794076', order: 1 },
  { name: 'Durga Dhungel', accountNo: '0790125818100013', panNo: '617049397', order: 2 },
  { name: 'Success Bhattarai', accountNo: '0790046453900011', panNo: '132595687', order: 3 },
  { name: 'Sakuntala Bhattarai', accountNo: '0790240509100018', panNo: '110931870', order: 4 },
  { name: 'Durga Prasad Niroula', accountNo: '0790212068800012', panNo: '130840011', order: 5 },
  { name: 'Society Karki', accountNo: '0790233428300010', panNo: '131529476', order: 6 },
  { name: 'Pradip Acharya', accountNo: '0790243850300014', panNo: '148723896', order: 7 },
  { name: 'Yogesh Rai', accountNo: '0790265448200018', panNo: '155379701', order: 8 },
  { name: 'Dambar Bahadur Karki', accountNo: '0530202383800019', panNo: '142408991', order: 9 },
  { name: 'Hikmat Bahadur Karki', accountNo: '0790256640100015', panNo: '156887179', order: 10 },
  { name: 'Januka Thapa', accountNo: '0790246191600010', panNo: '149192796', order: 11 },
  { name: 'Yohana Bhujel', accountNo: '0790270922200019', panNo: '157893083', order: 12 },
  { name: 'Tila Maya Karki', accountNo: '0530056625300011', panNo: '129688787', order: 13 },
  { name: 'Harka Bahadur Limbu', accountNo: '0790251658700011', panNo: '150694391', order: 14 },
  { name: 'Dipak Mahato', accountNo: '0790248382800018', panNo: '150271101', order: 15 },
  { name: 'Shreeram Poddar', accountNo: '0790254395500012', panNo: '152221430', order: 16 },
  { name: 'Sandesh Karki', accountNo: '0530273364500013', panNo: '129787954', order: 17 },
  { name: 'Bhuban Nepali', accountNo: '0530255937100011', panNo: '152558767', order: 18 },
];

async function main() {
  console.log('Clearing Staff table...');
  await pool.query('DELETE FROM "Staff"');
  
  console.log('Seeding Staff table...');
  for (const staff of staffData) {
    await pool.query(
      `INSERT INTO "Staff" (id, name, "accountNo", "panNo", "order", "createdAt", "updatedAt") 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
      [staff.name, staff.accountNo, staff.panNo, staff.order]
    );
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => pool.end());
