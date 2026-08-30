require('dotenv').config();
const { Client } = require('pg');

const SOURCE_URL = "postgresql://neondb_owner:npg_3ZCKunbpOR8E@ep-sparkling-smoke-az9jms8z-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const TARGET_URL = process.env.DATABASE_URL;

async function run() {
  const source = new Client({ connectionString: SOURCE_URL });
  const target = new Client({ connectionString: TARGET_URL });
  await source.connect();
  await target.connect();

  const missingTables = ["HeroBanner", "Letter", "Delivery"];
  for (const table of missingTables) {
    try {
      const { rows } = await source.query(`SELECT count(*) FROM "${table}"`);
      console.log(`Source ${table}: ${rows[0].count} rows`);
    } catch (e) {
      console.error(`Error counting ${table}:`, e.message);
    }
  }
  
  process.exit(0);
}

run().catch(console.error);
