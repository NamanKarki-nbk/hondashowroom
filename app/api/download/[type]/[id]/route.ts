import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DocType = "manual" | "brochure" | "schedule";

const typeConfig: Record<DocType, { title: string; color: string; subtitle: string; description: string }> = {
  manual: {
    title: "OWNER'S MANUAL",
    color: "0066CC",
    subtitle: "Official Operating & Maintenance Guide",
    description:
      "This owner's manual provides important information on the safe operation, maintenance, and care of your Honda vehicle. Please read it carefully before riding. Keep this manual with your vehicle for reference.",
  },
  brochure: {
    title: "PRODUCT BROCHURE",
    color: "CC0000",
    subtitle: "Features, Specifications & Colours",
    description:
      "Explore the complete features, technical specifications, available colour options, and highlights of your Honda. This brochure covers everything you need to know before making your purchase decision.",
  },
  schedule: {
    title: "MAINTENANCE SCHEDULE",
    color: "1A7A1A",
    subtitle: "Periodic Service & Inspection Chart",
    description:
      "Regular maintenance ensures long life, peak performance, and safe operation of your Honda. This schedule lists all recommended service intervals, inspection points, and replacement timelines.",
  },
};

/**
 * Handles GET requests to dynamically generate and download PDF documents.
 * 
 * This route generates PDFs for product manuals, brochures, and maintenance schedules
 * using PDFKit directly on the server. It fetches product information from the database
 * and dynamically populates the PDF template with product details and specs.
 * 
 * @param request - The Next.js API request object.
 * @param context - Contains the dynamic route parameters.
 * @param context.params.type - The type of document to generate ("manual", "brochure", "schedule").
 * @param context.params.id - The unique identifier of the product.
 * @returns A NextResponse containing the generated PDF as a downloadable attachment, or an error response if invalid.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;

  if (!["manual", "brochure", "schedule"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const docType = type as DocType;

  // Fetch product info
  const product = await prisma.vehicleMaster.findUnique({
    where: { id },
    select: { name: true, category: true, basePrice: true, description: true, specifications: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const config = typeConfig[docType];
  const categoryLabel =
    product.category === ("SCOOTER" as any)
      ? "Scooter"
      : product.category === ("MOTORCYCLE" as any)
      ? "Motorcycle"
      : "Power Product";

  // Build PDF as raw bytes using manual PDF construction (no external lib needed server-side in edge)
  // We use PDFKit via Node.js runtime
  const PDFDocument = (await import("pdfkit")).default;

  const chunks: Buffer[] = [];
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  await new Promise<void>((resolve) => {
    doc.on("end", () => resolve());

    // ── Header bar ──
    doc.rect(0, 0, 595, 90).fill(`#${config.color}`);

    // Honda "H" wordmark area
    doc.fontSize(28).fillColor("#FFFFFF").font("Helvetica-Bold").text("HONDA", 50, 28);
    doc.fontSize(10).fillColor("#FFFFFF").font("Helvetica").text("Society Enterprises Pvt. Ltd.", 50, 60);

    // Document type pill on right
    doc
      .roundedRect(380, 22, 170, 46, 6)
      .fillAndStroke("rgba(255,255,255,0.15)", `#FFFFFF`);
    doc
      .fontSize(9)
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .text(config.title, 390, 32, { width: 150, align: "center" });
    doc
      .fontSize(7)
      .font("Helvetica")
      .text(config.subtitle, 390, 47, { width: 150, align: "center" });

    // ── Model name ──
    doc.moveDown(3);
    doc
      .fontSize(26)
      .fillColor(`#${config.color}`)
      .font("Helvetica-Bold")
      .text(`Honda ${product.name}`, 50, 115);

    doc
      .fontSize(11)
      .fillColor("#555555")
      .font("Helvetica")
      .text(categoryLabel, 50, 148);

    // Divider
    doc.moveTo(50, 168).lineTo(545, 168).strokeColor(`#${config.color}`).lineWidth(2).stroke();

    // ── Description ──
    doc.moveDown(1.5);
    doc
      .fontSize(10)
      .fillColor("#333333")
      .font("Helvetica")
      .text(config.description, 50, 185, { width: 495, align: "justify", lineGap: 4 });

    // ── Product details box ──
    const boxY = 280;
    doc.rect(50, boxY, 495, 34).fill(`#f5f5f5`);
    doc
      .fontSize(9)
      .fillColor("#888888")
      .font("Helvetica-Bold")
      .text("PRODUCT DETAILS", 62, boxY + 12);

    const detailY = boxY + 50;
    const details: [string, string][] = [
      ["Model Name", `Honda ${product.name}`],
      ["Category", categoryLabel],
      ["Starting Price", `NPR ${product.basePrice.toLocaleString("en-IN")}`],
    ];

    if (product.description) {
      details.push(["Description", product.description.slice(0, 200)]);
    }

    details.forEach(([label, value], i) => {
      const y = detailY + i * 28;
      doc.rect(50, y, 495, 26).fill(i % 2 === 0 ? "#ffffff" : "#fafafa");
      doc.fontSize(9).fillColor("#777777").font("Helvetica-Bold").text(label, 62, y + 8);
      doc.fontSize(9).fillColor("#333333").font("Helvetica").text(value, 220, y + 8, { width: 310 });
    });

    // ── Specs table if available ──
    if (product.specifications && typeof product.specifications === "object") {
      const specs = product.specifications as Record<string, unknown>;
      const specEntries = Object.entries(specs).slice(0, 10);

      if (specEntries.length > 0) {
        const specsY = detailY + details.length * 28 + 20;
        doc.rect(50, specsY, 495, 34).fill(`#f5f5f5`);
        doc
          .fontSize(9)
          .fillColor("#888888")
          .font("Helvetica-Bold")
          .text("TECHNICAL SPECIFICATIONS", 62, specsY + 12);

        specEntries.forEach(([key, val], i) => {
          const y = specsY + 50 + i * 26;
          doc.rect(50, y, 495, 24).fill(i % 2 === 0 ? "#ffffff" : "#fafafa");
          doc.fontSize(9).fillColor("#777777").font("Helvetica-Bold").text(key, 62, y + 7);
          doc.fontSize(9).fillColor("#333333").font("Helvetica").text(String(val), 220, y + 7, { width: 310 });
        });
      }
    }

    // ── Footer ──
    doc.rect(0, 780, 595, 62).fill(`#${config.color}`);
    doc
      .fontSize(8)
      .fillColor("#ffffff")
      .font("Helvetica")
      .text(
        `© ${new Date().getFullYear()} Society Enterprises Pvt. Ltd. | All rights reserved | honda.societyenterprises.com.np`,
        50,
        797,
        { width: 495, align: "center" }
      );
    doc
      .fontSize(7)
      .fillColor("rgba(255,255,255,0.7)")
      .text(
        "This document is for informational purposes only. Specifications subject to change without notice.",
        50,
        813,
        { width: 495, align: "center" }
      );

    doc.end();
  });

  const pdfBuffer = Buffer.concat(chunks);
  const filename = `Honda-${product.name.replace(/\s+/g, "-")}-${config.title.replace(/\s+/g, "-")}.pdf`;

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
