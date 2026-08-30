require('dotenv').config();
const { Client } = require('pg');

const SOURCE_URL = "postgresql://neondb_owner:npg_3ZCKunbpOR8E@ep-sparkling-smoke-az9jms8z-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const TARGET_URL = process.env.DATABASE_URL;

async function run() {
  const source = new Client({ connectionString: SOURCE_URL });
  const target = new Client({ connectionString: TARGET_URL });
  await source.connect();
  await target.connect();

  const missingTables = ["HeroBanner", "Letter"];
  for (const table of missingTables) {
    console.log(`Copying ${table}...`);
    try {
      const { rows } = await source.query(`SELECT * FROM "${table}"`);
      if (rows.length === 0) continue;
      
      const { rows: tCols } = await target.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 AND table_schema = 'public'`, [table]);
      const targetColsMap = {};
      for (const c of tCols) targetColsMap[c.column_name] = c.data_type;
      
      const cols = Object.keys(rows[0]).filter(c => targetColsMap[c] !== undefined);
      if (cols.length === 0) continue;

      for (let i = 0; i < rows.length; i += 100) {
        const batch = rows.slice(i, i + 100);
        let valuesStr = [];
        let params = [];
        let pIdx = 1;
        for (const rawRow of batch) {
          const row = rawRow;
          let rStr = [];
          for (const col of cols) {
            rStr.push(`$${pIdx++}`);
            let val = row[col];
            const dt = targetColsMap[col];
            if ((dt === 'json' || dt === 'jsonb') && typeof val === 'object' && val !== null && !(val instanceof Date)) {
               val = JSON.stringify(val);
            }
            params.push(val);
          }
          valuesStr.push(`(${rStr.join(',')})`);
        }
        const q = `INSERT INTO "${table}" ("${cols.join('","')}") VALUES ${valuesStr.join(',')} ON CONFLICT DO NOTHING`;
        await target.query(q, params);
      }
      console.log(`  Copied ${rows.length} rows for ${table}`);
    } catch(err) {
      console.error(`Error copying ${table}:`, err.message);
    }
  }

  process.exit(0);
}

run().catch(console.error);
