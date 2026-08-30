require('dotenv').config();
const { Client } = require('pg');

const SOURCE_URL = "postgresql://neondb_owner:npg_3ZCKunbpOR8E@ep-sparkling-smoke-az9jms8z-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const TARGET_URL = process.env.DATABASE_URL;

async function run() {
  const source = new Client({ connectionString: SOURCE_URL });
  const target = new Client({ connectionString: TARGET_URL });
  await source.connect();
  await target.connect();

  console.log("Connected to both databases.");

  const transformRow = (table, row) => {
    if (table === "User" || table === "Staff") {
      if (row.role === "SUPERADMIN") row.role = "ADMIN";
    }
    if (table === "AdminNotification") {
      if (row.type === "DIGITAL_QUOTATION" || row.type === "SYSTEM_ALERT" || row.type === "LOW_STOCK" || row.type === "PAYMENT_RECEIVED") row.type = "QUOTATION";
    }
    return row;
  };

  const directTables = [
    "User", "Customer", "SystemSetting", "Blog", "Offer", "Branch", "SalesTarget", 
    "AmcPlan", "ServiceCharge", "SparePart", "Accessory", "AdminNotification", 
    "ActivityLog", "OtpVerification", "PasswordResetToken", 
    "CustomerDocument", "Lead", "PurchaseInvoice"
  ];

  for (const table of directTables) {
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
          const row = transformRow(table, rawRow);
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
    } catch (err) {
      console.error(`Error copying ${table}:`, err.message);
    }
  }

  console.log("Copying Staff...");
  try {
    const { rows } = await source.query(`SELECT * FROM "Staff" WHERE "userId" IS NOT NULL`);
    if (rows.length > 0) {
      const { rows: tCols } = await target.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Staff' AND table_schema = 'public'`);
      const targetColsMap = {};
      for (const c of tCols) targetColsMap[c.column_name] = c.data_type;
      
      const cols = Object.keys(rows[0]).filter(c => targetColsMap[c] !== undefined);
      for (let i = 0; i < rows.length; i += 100) {
        const batch = rows.slice(i, i + 100);
        let valuesStr = [];
        let params = [];
        let pIdx = 1;
        for (const rawRow of batch) {
          const row = transformRow('Staff', rawRow);
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
        const q = `INSERT INTO "Staff" ("${cols.join('","')}") VALUES ${valuesStr.join(',')} ON CONFLICT DO NOTHING`;
        await target.query(q, params);
      }
      console.log(`  Copied ${rows.length} rows for Staff`);
    }
  } catch (err) {
    console.error(`Error copying Staff:`, err.message);
  }

  console.log("Copying VehicleMaster...");
  const { rows: catalogs } = await source.query(`SELECT * FROM "ProductCatalog"`);
  for (const cat of catalogs) {
    try {
      if (cat.category === "MOTORCYCLES" || cat.category === "Motorcycle") cat.category = "MOTORCYCLE";
      if (cat.category === "SCOOTERS" || cat.category === "Scooter") cat.category = "SCOOTER";
      if (cat.category === "POWER_PRODUCTS" || cat.category === "Power Products") cat.category = "POWER_PRODUCT";
      const q = `INSERT INTO "VehicleMaster" (id, name, category, "basePrice", "imageUrl", description, features, specifications, "createdAt", "updatedAt") 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING`;
      await target.query(q, [cat.id, cat.name, cat.category, cat.price, cat.imageUrl, cat.description, JSON.stringify(cat.features || []), JSON.stringify(cat.specifications || {}), cat.createdAt, cat.updatedAt]);
    } catch(err) {
      console.error(`Error copying VehicleMaster ${cat.name}:`, err.message);
    }
  }
  
  console.log("Copying VehicleVariant...");
  const { rows: prices } = await source.query(`SELECT * FROM "VehiclePrice"`);
  let modelNameToVariantId = {};
  for (const p of prices) {
    try {
      const { rows: masters } = await target.query(`SELECT id FROM "VehicleMaster" WHERE name = $1 LIMIT 1`, [p.modelName]);
      if (masters.length > 0) {
        const masterId = masters[0].id;
        const variantName = p.variant || 'Standard';
        const q = `INSERT INTO "VehicleVariant" (id, "vehicleMasterId", "variantName", "exShowroomPriceNPR", "onRoadPriceNPR", "createdAt", "updatedAt") 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`;
        await target.query(q, [p.id, masterId, variantName, p.exShowroomPriceNPR, p.onRoadPriceNPR, p.createdAt, p.updatedAt]);
        modelNameToVariantId[p.modelName] = p.id;
      }
    } catch(err) {
      console.error(`Error copying VehicleVariant ${p.modelName}:`, err.message);
    }
  }

  const { rows: allMasters } = await target.query(`SELECT id, name FROM "VehicleMaster"`);
  let fallbackVariantId = null;
  for (const m of allMasters) {
    if (!modelNameToVariantId[m.name]) {
       const newVarId = require('crypto').randomUUID();
       const q = `INSERT INTO "VehicleVariant" (id, "vehicleMasterId", "variantName", "exShowroomPriceNPR", "onRoadPriceNPR", "createdAt", "updatedAt") 
                  VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) ON CONFLICT DO NOTHING`;
       await target.query(q, [newVarId, m.id, 'Standard', 0, 0]);
       modelNameToVariantId[m.name] = newVarId;
       if (!fallbackVariantId) fallbackVariantId = newVarId;
    } else {
       if (!fallbackVariantId) fallbackVariantId = modelNameToVariantId[m.name];
    }
  }

  console.log("Copying VehicleColor...");
  const { rows: colors } = await source.query(`SELECT * FROM "VehicleColor"`);
  for (const c of colors) {
    try {
      const q = `INSERT INTO "VehicleColor" (id, "vehicleMasterId", name, "hexCode", "createdAt", "updatedAt") 
                 VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`;
      await target.query(q, [c.id, c.vehicleId, c.name, c.hexCode, c.createdAt, c.updatedAt]);
    } catch(err) {
      console.error(`Error copying VehicleColor ${c.name}:`, err.message);
    }
  }

  console.log("Copying FinancePlan...");
  const { rows: plans } = await source.query(`SELECT * FROM "FinancePlan"`);
  for (const p of plans) {
    try {
      const variantId = modelNameToVariantId[p.modelName] || fallbackVariantId;
      if (!variantId) continue;
      const q = `INSERT INTO "FinancePlan" (id, "variantId", "tenureMonths", "downPaymentPct", "interestRate", "downPayment", "loanAmount", emi, "totalInterest", registration, insurance, "insuranceTotal", "totalCost", "createdAt", "updatedAt") 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT DO NOTHING`;
      await target.query(q, [p.id, variantId, p.tenureMonths, p.downPaymentPct, p.interestRate, p.downPayment, p.loanAmount, p.emi, p.totalInterest, p.registration, p.insurance, p.insuranceTotal, p.totalCost, p.createdAt, p.updatedAt]);
    } catch(err) {
      console.error(`Error copying FinancePlan ${p.id}:`, err.message);
    }
  }

  console.log("Copying VehicleInventory...");
  const { rows: invs } = await source.query(`SELECT * FROM "VehicleInventory"`);
  for (const i of invs) {
    try {
      const variantId = modelNameToVariantId[i.modelName] || fallbackVariantId;
      if (!variantId) continue;
      let rtoStatus = i.rtoStatus;
      if (rtoStatus === "PENDING" || rtoStatus === "IN_TRANSIT" || rtoStatus === "COMPLETED") rtoStatus = rtoStatus; else rtoStatus = "PENDING"; 
      
      const q = `INSERT INTO "VehicleInventory" (id, vin, "engineNo", color, "purchasePrice", "purchaseDate", "purchaseMethod", "rtoStatus", status, "createdAt", "updatedAt", "indexNo", "purchaseInvoiceId", "branchId", "variantId") 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT DO NOTHING`;
      await target.query(q, [i.id, i.vin, i.engineNo, i.color, i.purchasePrice, i.purchaseDate, i.purchaseMethod, rtoStatus, i.status, i.createdAt, i.updatedAt, i.indexNo, i.purchaseInvoiceId, i.branchId, variantId]);
    } catch(err) {
      console.error(`Error copying VehicleInventory ${i.vin}:`, err.message);
    }
  }

  const postTables = [
    "SalesTransaction", "PaymentReceipt", "ServiceRecord", "ServiceReminder", 
    "StockTransferLog", "ServiceBooking", "TestRideBooking", "AmcBooking", "ValuationLog"
  ];
  for (const table of postTables) {
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
          const row = transformRow(table, rawRow);
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

  console.log("Data migration complete!");
  process.exit(0);
}

run().catch(console.error);
