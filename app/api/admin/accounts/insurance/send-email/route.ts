import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const f = (n: number | null | undefined) =>
  (n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export async function POST(request: Request) {
  try {
    const { transactionId } = await request.json();

    const tx = await prisma.salesTransaction.findUnique({
      where: { id: transactionId },
      include: {
        customer: {
          include: { documents: true, user: true },
        },
        vehicle: {
          include: {
            variant: { include: { vehicleMaster: true } },
            purchaseInvoice: true,
          },
        },
        receipts: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const c = tx.customer;
    const v = tx.vehicle;
    const vehicleMasterName = v.variant.vehicleMaster.name;
    const variantName = v.variant.variantName || "";

    // Derived fields (matching undertaking logic exactly)
    const isScooter =
      variantName.toLowerCase().includes("scooter") ||
      variantName.toLowerCase().includes("dio") ||
      vehicleMasterName.toLowerCase().includes("dio") ||
      vehicleMasterName.toLowerCase().includes("activa");
    const variantType = isScooter ? "SCOOTER" : "MOTORCYCLE";

    const cc =
      ((v.variant.specDifferences as any)?.cc ||
        (v.variant.vehicleMaster.specifications as any)?.cc ||
        "110") + " CC";

    const insType = tx.insuranceType
      ? tx.insuranceType.toUpperCase()
      : tx.insurance > 0
      ? "YES"
      : "NO";

    const citizenship =
      c.documents?.find((d: any) => d.docType === "CITIZENSHIP")?.docNumber || "";

    const dobAdFormatted = c.user?.dobAd
      ? format(new Date(c.user.dobAd), "MMM dd, yyyy")
      : "";

    const firstReceipt = tx.receipts[0]?.receiptNo || "";

    const purchaseTypeLabel =
      tx.paymentType === "CASH"
        ? "CASH ( पूरा नगद भुक्तानी )"
        : tx.paymentType === "FINANCE"
        ? `CREDIT ( क्रेडिट )`
        : tx.paymentType;

    const saleDateStr = format(new Date(tx.createdAt), "MMMM dd, yyyy");
    const stcInvoiceNo = v.purchaseInvoice?.invoiceNo || "";
    const vatBillDisplay = tx.vatBillNo || "DOCUMENT PENDING";

    // ─── HTML: Exact replica of the undertaking tables ───────────────────────
    const td = (content: string, extra = "") =>
      `<td style="border:1px solid #000;padding:4px 6px;font-size:11px;${extra}">${content}</td>`;

    const tdLabel = (text: string, extra = "") =>
      td(`<strong>${text}</strong>`, `background:#f3f4f6;${extra}`);

    const tdRight = (content: string, bold = false) =>
      td(content, `text-align:right;${bold ? "font-weight:bold;" : ""}`);

    const htmlBody = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; color: #000; margin: 0; padding: 16px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  td, th { border: 1px solid #000; padding: 4px 6px; font-size: 11px; }
  .header-center { text-align: center; border: 2px solid #000; padding: 10px; margin-bottom: 14px; }
  .section-note { font-size: 11px; color: #333; margin-bottom: 10px; border-top: 1px solid #ccc; padding-top: 6px; }
</style>
</head>
<body>

<!-- Company Header -->
<div class="header-center">
  <p style="font-size:16px;font-weight:bold;margin:0;text-transform:uppercase;">Society Enterprises Private Limited</p>
  <p style="margin:2px 0;font-size:10px;">Authorized Honda Dealer — Damak-05, Jhapa, Nepal</p>
  <p style="margin:2px 0;font-size:10px;">Ph: 9801615250 / 9801708936 &nbsp;|&nbsp; societyenterprises2024@gmail.com</p>
  <p style="margin:8px 0 0;font-size:13px;font-weight:bold;text-decoration:underline;letter-spacing:2px;">INSURANCE REGISTRATION REQUEST</p>
  <p style="margin:4px 0 0;font-size:10px;color:#444;">Date: ${saleDateStr} &nbsp;|&nbsp; Invoice No: ${tx.invoiceNo}</p>
</div>

<p style="font-size:11px;margin-bottom:10px;">
  Dear Sir/Madam,<br><br>
  We kindly request you to process the insurance registration for the following vehicle. 
  All required vehicle and customer details are provided below as per our dealership records.
</p>

<!-- TABLE 1: Vehicle Details (exact undertaking structure) -->
<table>
  <colgroup>
    <col style="width:25%">
    <col style="width:35%">
    <col style="width:20%">
    <col style="width:20%">
  </colgroup>
  <tbody>
    <tr>
      ${tdLabel("Index No.")}
      ${td(`<strong>${v.indexNo || ""}</strong>`)}
      ${td("<strong>Varient</strong>", "background:#22c55e;color:#000;")}
      ${td(`<strong>${variantType}</strong>`, "background:#86efac;color:#000;font-weight:bold;")}
    </tr>
    <tr>
      ${tdLabel("Model")}
      ${td(vehicleMasterName.toUpperCase())}
      ${tdLabel("Insurance")}
      ${td(`<strong style="color:${tx.insurance > 0 ? '#15803d' : '#000'}">${insType}</strong>`)}
    </tr>
    <tr>
      ${tdLabel("Displacement (CC)")}
      ${td(cc)}
      ${tdLabel("Service Book No.")}
      ${td(tx.serviceBookNo || "")}
    </tr>
    <tr>
      ${tdLabel("Colour")}
      ${td(v.color.toUpperCase())}
      ${tdLabel("STC Invoice No.")}
      ${td(stcInvoiceNo.toUpperCase())}
    </tr>
    <tr>
      ${tdLabel("VIN No.")}
      ${td(v.vin.toUpperCase())}
      ${tdLabel("Mechi Reg No.")}
      ${td((v.mechiRegistrationNo || "").toUpperCase())}
    </tr>
    <tr>
      ${tdLabel("Engine No.")}
      ${td(v.engineNo.toUpperCase())}
      ${tdLabel("If Scheme #")}
      ${td("")}
    </tr>
    <tr>
      ${tdLabel("Temporary Registration No.")}
      ${td((v.tempRegistrationNo || "").toUpperCase())}
      ${tdLabel("Vat Bill No.")}
      ${td(vatBillDisplay)}
    </tr>
  </tbody>
</table>

<!-- TABLE 2: Customer & Pricing Details (exact undertaking structure) -->
<table>
  <colgroup>
    <col style="width:25%">
    <col style="width:35%">
    <col style="width:20%">
    <col style="width:20%">
  </colgroup>
  <tbody>
    <tr>
      ${tdLabel("Customer's Name")}
      ${td(c.fullName.toUpperCase())}
      ${tdLabel("Price of Vehicle")}
      ${tdRight(f(tx.showroomPrice))}
    </tr>
    <tr>
      ${tdLabel("Address")}
      ${td((c.address || "").toUpperCase())}
      ${tdLabel("Accessories")}
      ${tdRight(f(tx.accessoriesCharge))}
    </tr>
    <tr>
      ${tdLabel("Contact No.")}
      ${td(c.phone)}
      ${td("<strong>Total</strong>", "background:#f3f4f6;")}
      ${tdRight(f(tx.showroomPrice + (tx.accessoriesCharge || 0)), true)}
    </tr>
    <tr>
      ${tdLabel("Date of Birth (AD)")}
      ${td(dobAdFormatted)}
      ${tdLabel("Exchange")}
      ${tdRight(f(tx.exchangeValue))}
    </tr>
    <tr>
      ${tdLabel("Citizenship No.")}
      ${td(citizenship.toUpperCase())}
      ${tdLabel("Discount")}
      ${tdRight(f(tx.discount))}
    </tr>
    <tr>
      ${tdLabel("Purchase Type")}
      ${td(purchaseTypeLabel)}
      ${td("<strong>Payable</strong>", "background:#f3f4f6;")}
      ${tdRight(f(tx.finalAmount), true)}
    </tr>
    <tr>
      ${tdLabel("Cash Receive No.")}
      ${td(firstReceipt.toUpperCase())}
      ${tdLabel("Financed")}
      ${tdRight(f(tx.financeAmount))}
    </tr>
    <tr>
      ${tdLabel("Transactions Remarks", "vertical-align:top;")}
      ${td(tx.remarks || "Due Transaction", "vertical-align:top;")}
      ${tdLabel("Paid")}
      ${tdRight(f(tx.totalAmountPaid))}
    </tr>
    <tr>
      <td style="border:1px solid #000;"></td>
      <td style="border:1px solid #000;"></td>
      ${td("<strong>Due</strong>", "background:#f3f4f6;")}
      ${tdRight(`<strong style="color:${tx.dueAmount > 0 ? '#dc2626' : '#000'}">${f(tx.dueAmount)}</strong>`)}
    </tr>
  </tbody>
</table>

<!-- Insurance Summary Box -->
<table style="width:50%;margin-left:auto;border:2px solid #000;margin-bottom:12px;">
  <tr>
    <td style="padding:5px 8px;font-size:11px;background:#dbeafe;font-weight:bold;">Insurance Company:</td>
    <td style="padding:5px 8px;font-size:11px;font-weight:bold;">${tx.insuranceCompany || "Protective Micro Insurance Limited (PMIL)"}</td>
  </tr>
  <tr>
    <td style="padding:5px 8px;font-size:11px;background:#dbeafe;font-weight:bold;">Insurance Type:</td>
    <td style="padding:5px 8px;font-size:11px;">${insType}</td>
  </tr>
  <tr>
    <td style="padding:5px 8px;font-size:11px;background:#dbeafe;font-weight:bold;">Policy No. (if any):</td>
    <td style="padding:5px 8px;font-size:11px;">${tx.policyNo || "—"}</td>
  </tr>
  <tr>
    <td style="padding:5px 8px;font-size:11px;background:#dbeafe;font-weight:bold;">Insurance Premium:</td>
    <td style="padding:5px 8px;font-size:11px;font-weight:bold;color:#15803d;">NPR ${f(tx.insurance)}</td>
  </tr>
</table>

<p style="font-size:11px;margin-top:10px;">
  Kindly process the insurance policy at the earliest and share the policy documents with us.<br>
  For any clarification, please contact us at <strong>9801615250</strong> or <strong>societyenterprises2024@gmail.com</strong>.
</p>
<p style="font-size:11px;margin-top:6px;">Thank you.</p>

<!-- Signature row -->
<table style="width:100%;border:none;margin-top:32px;">
  <tr>
    <td style="border:none;width:45%;text-align:center;padding-top:40px;border-top:1px solid #000;">
      Customer Signature
    </td>
    <td style="border:none;width:10%;"></td>
    <td style="border:none;width:45%;text-align:center;padding-top:40px;border-top:1px solid #000;">
      Authorized Signatory<br>
      <strong>Society Enterprises Pvt. Ltd.</strong>
    </td>
  </tr>
</table>

<p style="font-size:9px;color:#999;margin-top:20px;border-top:1px solid #eee;padding-top:6px;">
  This email was automatically generated by the Honda Showroom Management System — Society Enterprises Pvt. Ltd.
</p>

</body>
</html>`;

    await transporter.sendMail({
      from: `"Society Enterprises Pvt. Ltd." <${process.env.GMAIL_USER}>`,
      to: "societykarki07@gmail.com",
      subject: `Insurance Registration — ${vehicleMasterName} | ${v.indexNo || v.engineNo} | ${c.fullName} | ${tx.invoiceNo}`,
      html: htmlBody,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent to societykarki07@gmail.com successfully",
    });
  } catch (error: any) {
    console.error("Send insurance email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
