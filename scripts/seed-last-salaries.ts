import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL?.replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString, host: '127.0.0.1', port: 5432 });

const salaries = [
  { name: 'Bhim Babu Bhattarai', salary: 45000 },
  { name: 'Durga Dhungel', salary: 45000 },
  { name: 'Success Bhattarai', salary: 45000 },
  { name: 'Sakuntala Bhattarai', salary: 43500 },
  { name: 'Durga Prasad Niroula', salary: 22000 },
  { name: 'Society Karki', salary: 15000 },
  { name: 'Pradip Acharya', salary: 20000 },
  { name: 'Yogesh Rai', salary: 15000 },
  { name: 'Dambar Bahadur Karki', salary: 20000 },
  { name: 'Hikmat Bahadur Karki', salary: 18000 },
  { name: 'Januka Thapa', salary: 15000 },
  { name: 'Yohana Bhujel', salary: 8081 },
  { name: 'Tila Maya Karki', salary: 38000 },
  { name: 'Harka Bahadur Limbu', salary: 16000 },
  { name: 'Dipak Mahato', salary: 18000 },
  { name: 'Shreeram Poddar', salary: 22000 },
  { name: 'Sandesh Karki', salary: 42000 },
  { name: 'Bhuban Nepali', salary: 17000 },
];

async function main() {
  console.log('Seeding last salaries...');
  const client = await pool.connect();
  try {
    for (const s of salaries) {
      await client.query('UPDATE "Staff" SET "lastSalary" = $1 WHERE name = $2', [s.salary, s.name]);
      console.log(`Updated ${s.name} with salary ${s.salary}`);
    }
  } finally {
    client.release();
  }
  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
