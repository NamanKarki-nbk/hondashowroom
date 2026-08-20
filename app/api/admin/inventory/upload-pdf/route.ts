import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// pdf-parse is required dynamically inside POST to prevent build-time errors

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Use pdf2json which is perfectly stable in Next.js Serverless environments
    const PDFParser = require('pdf2json');
    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1); // 1 = text only mode
      
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
      });
      
      pdfParser.parseBuffer(buffer);
    });

    // A robust heuristic parser for Vehicle Invoices
    const lines = text.split(/\r?\n/);
    
    // Extract Metadata
    let invoiceNo = `INV-${Math.floor(Math.random() * 1000000)}`;
    let totalAmount = 0;
    let purchaseType = "Cash";
    let purchaseDateStr = new Date().toISOString().split('T')[0];
    let maxPages = 999;

    const MODELS = [
      { name: "CB Dio BS6 110 STD", category: "SCOOTER" },
      { name: "CB Dio BS6 110 DLX", category: "SCOOTER" },
      { name: "CB Dio BS6 125 STD", category: "SCOOTER" },
      { name: "CB Dio BS6 125 DLX", category: "SCOOTER" },
      { name: "CB Shine BS6 DRS", category: "MOTORCYCLE" },
      { name: "CB Shine BS6 DSS", category: "MOTORCYCLE" },
      { name: "SP Shine BS6 DRS", category: "MOTORCYCLE" },
      { name: "SP Shine BS6 DSS", category: "MOTORCYCLE" },
      { name: "CB Hornet 2.0", category: "MOTORCYCLE" },
      { name: "NX 200", category: "MOTORCYCLE" }
    ];

    const COLORS = [
      "DAZZLE YELLOW METALLIC", "MATTE MARSHAL GREEN METALLIC", "MATTE AXIS GREY METALLIC", "MAT AXIS GREY METALLIC", "MATTE AXIS GRAY METALLIC",
      "PEARL IGNEOUS BLACK", "VIBRANT ORANGE ( STRIPE )", "VIBRANT ORANGE", "SPORTS RED 2", "SPORTS RED", 
      "CANDY JAZZY BLUE ( STRIPE )", "CANDY JAZZY BLUE", "SILVER", "MATTE DARK BLUE", "MAT SANGRIA RED METALLIC", "MATTE SANGRIA RED METALLIC",
      "PEARL NIGHTSTAR BLACK", "PEARL SIREN BLUE", "MATTE MARVEL BLUE METALLIC", "PEARL DEEP GROUND GREY", "GREY",
      "RED METALLIC", "REBEL RED", "RED", "PEARL AMAZING WHITE", "MAPPLE BROWN METALLIC", "BLACK", "GENY GREY METALLIC",
      "ATHLETIC BLUE METALLIC", "DECENT BLUE METALLIC", "IMPERIAL RED METALLIC", "MATTE SELENE SILVER METALLIC"
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Invoice No
      // Includes forward slashes so strings like "BNSRBSPI83/84-00104" are fully captured
      const invMatch = line.match(/Invoice No[\s:]*([A-Za-z0-9-\/]+)/i);
      if (invMatch) invoiceNo = invMatch[1];
      
      // Total Amount
      // Supports "Total Amount: 100,000" or "Total NPR Incl. VAT 3,651,517.11"
      const amtMatch = line.match(/Total(?:.*?)[\s:]*(?:Rs\.?|NPR)?[\s:]*([\d]{1,3}(?:,[\d]{2,3})*(?:\.\d{1,6})?)/i);
      if (amtMatch) {
        totalAmount = parseFloat(amtMatch[1].replace(/,/g, ''));
      }
      
      // Credit Type
      const creditMatch = line.match(/Credit Type[\s:]*(BG|Cash|LC)/i);
      if (creditMatch) purchaseType = creditMatch[1].trim();

      // Purchase Date
      const dateMatch = line.match(/(?:Invoice Date|Transaction Date|Printed On)[\s:]*(\d{2})[-/](\d{2})[-/](\d{4})/i);
      if (dateMatch) {
        // convert DD-MM-YYYY to YYYY-MM-DD
        purchaseDateStr = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
      }

      // Page Limits
      const pageMatch = line.match(/Page\s+\d+\s+of\s+(\d+)/i);
      if (pageMatch) maxPages = parseInt(pageMatch[1], 10);
    }

    // We look for 17-character VINs (Chassis No) starting with 'M' (e.g., ME4...)
    const vinRegex = /\b([M][A-Z0-9]{16})\b/g;
    
    const vehiclesToInsert = [];
    const foundVins = new Set<string>();
    let match;

    while ((match = vinRegex.exec(text)) !== null) {
      const vin = match[1];
      if (foundVins.has(vin)) continue;
      foundVins.add(vin);

      // Extract a massive context window to ensure we don't miss columns that are far from the VIN
      const startIndex = Math.max(0, match.index - 400);
      const endIndex = Math.min(text.length, match.index + 400);
      const context = text.substring(startIndex, endIndex);

      // Find Engine No
      let engineNo = `ENG-${Math.floor(Math.random() * 1000000)}`;
      
      // Look explicitly for "Engine No. : JF98E 5006113" or similar format
      const explicitEngineRegex = /Engine No[\.\s:]*([A-Z0-9]{4,6}\s+\d{5,8})/i;
      const explicitMatch = context.match(explicitEngineRegex);
      
      if (explicitMatch) {
        engineNo = explicitMatch[1];
      } else {
        // Fallback: look for the general Honda format (e.g., JF98E 5006113) near the VIN
        const formatRegex = /\b([A-Z0-9]{4,6}\s+\d{5,8})\b/;
        const formatMatch = context.match(formatRegex);
        if (formatMatch) {
          engineNo = formatMatch[1];
        } else {
           // Extreme Fallback: grab any word immediately after 'Engine No'
           const extremeRegex = /Engine No.*?([A-Z0-9]+[A-Z0-9\s]*\d{4,})/i;
           const extremeMatch = context.match(extremeRegex);
           if (extremeMatch) {
             engineNo = extremeMatch[1].trim();
           }
        }
      }

      // Find Model using Strict Domain Rules (Prevents cross-contamination of terms like 125, DLX, BS6)
      let modelName = "Unknown Model";
      let category = "MOTORCYCLE"; // default
      let cc = 125; // default
      
      const upperContext = context.toUpperCase().replace(/\n/g, ' ');

      if (upperContext.includes("DIO")) {
        category = "SCOOTER";
        if (upperContext.includes("125")) {
          cc = 125;
          modelName = upperContext.includes("DLX") ? "CB Dio BS6 125 DLX" : "CB Dio BS6 125 STD";
        } else {
          cc = 110;
          // Defaults to 110 if 125 isn't explicitly mentioned
          modelName = upperContext.includes("DLX") ? "CB Dio BS6 110 DLX" : "CB Dio BS6 110 STD";
        }
      } else if (upperContext.includes("SHINE")) {
        category = "MOTORCYCLE";
        cc = 125; // Both CB and SP Shine are strictly 125cc
        const isSP = upperContext.includes("SP");
        // Honda often uses DLX (Deluxe) interchangeably with DSS (Disc Self Start) on invoices
        const isDLX = upperContext.includes("DLX") || upperContext.includes("DSS");
        
        if (isSP) {
          modelName = isDLX ? "SP Shine BS6 DSS" : "SP Shine BS6 DRS";
        } else {
          modelName = isDLX ? "CB Shine BS6 DSS" : "CB Shine BS6 DRS";
        }
      } else if (upperContext.includes("HORNET")) {
        category = "MOTORCYCLE";
        cc = 184;
        modelName = "CB Hornet 2.0";
      } else if (upperContext.includes("NX") && upperContext.includes("200")) {
        category = "MOTORCYCLE";
        cc = 184;
        modelName = "NX 200";
      }

      // Find Color dynamically from 'Color : NH1 (BLACK)' or 'COLOUR : BLACK'
      let color = "Unknown Color";
      // Capture the rest of the line after Color: or Colour:
      const colorLineRegex = /Colou?r[\s:]+(.*)/i;
      const colorMatch = context.match(colorLineRegex);
      
      if (colorMatch) {
        // Keep the exact string written (e.g. "NH1 (BLACK)"), don't strip parentheses
        color = colorMatch[1].trim();
      } else {
        // Fallback: loop through known colors if explicit format is missing
        for (const c of COLORS) {
          if (context.toUpperCase().includes(c.toUpperCase())) {
            color = c;
            break;
          }
        }
      }

      // Find Price in context (Supports Nepali/Indian format like 1,50,000.00 or 2,05,500)
      let purchasePrice = 0;
      
      // PDFs often spatially break long numbers across lines (e.g. "268,938.0530 \n 9"). 
      // This heals those breaks specifically for decimals.
      const mergedContext = context.replace(/(\.\d{1,5})[\r\n\s]+(\d{1,3})\b/g, "$1$2");

      // Look for a number with at least one comma that isn't part of a date
      // Supports up to 6 decimal places (e.g., 274,247.78761)
      const priceRegex = /(?:Rs\.?[\s]*)?((?:\d{1,2},)?\d{2,3},\d{3}(?:\.\d{1,6})?)/g;
      let pMatch;
      
      let closestDistance = Infinity;
      let closestPrice = 0;
      
      // We grab the valid price (between 50k and 1M) that is spatially closest to the VIN.
      // The VIN is at the center of our context string (index 400).
      while ((pMatch = priceRegex.exec(mergedContext)) !== null) {
        const val = parseFloat(pMatch[1].replace(/,/g, ''));
        // Ignore massive subtotals/totals (> 1 Million) and tiny irrelevant numbers
        if (val > 50000 && val < 1000000) {
          const distance = Math.abs(pMatch.index - 400); // 400 is the center (where the VIN is)
          if (distance < closestDistance) {
            closestDistance = distance;
            closestPrice = val;
          }
        }
      }
      
      if (closestPrice > 0) {
        // Add 13% VAT
        const priceWithVat = closestPrice * 1.13;
        // Round to the nearest hundred (prevents floating point errors from pushing it up)
        purchasePrice = Math.round(priceWithVat / 100) * 100;
      }

      vehiclesToInsert.push({
        vin,
        engineNo,
        category,
        modelName,
        cc,
        color,
        purchasePrice,
        purchaseDate: new Date(purchaseDateStr),
        purchaseMethod: purchaseType,
      });
    }

    if (vehiclesToInsert.length === 0) {
      return NextResponse.json({ 
        error: 'No valid vehicles (VINs) found in the PDF. Make sure it contains 17-character chassis numbers.' 
      }, { status: 400 });
    }

    const invoice = {
      invoiceNo,
      totalAmount: totalAmount || (vehiclesToInsert.length * 200000), // fallback if not found
      purchaseType,
      invoiceDate: purchaseDateStr
    };

    // Return the parsed vehicles and invoice so the frontend can preview them before saving
    return NextResponse.json({ 
      success: true, 
      message: `Successfully parsed ${vehiclesToInsert.length} vehicles. Please review and confirm.`,
      invoice,
      vehicles: vehiclesToInsert 
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
  }
}
