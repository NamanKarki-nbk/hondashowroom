import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";
import { uploadToCloudinary } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Upload PDF to Cloudinary
    let pdfUrl = "";
    try {
      pdfUrl = await uploadToCloudinary(file, 'honda-showroom/finance-pdfs');
    } catch (uploadErr) {
      console.error("Cloudinary upload error:", uploadErr);
      // We can continue even if upload fails
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve) => {
      const pdfParser = new PDFParser(null, 1);
      
      pdfParser.on("pdfParser_dataError", (errData) => {
        console.error("PDF Parsing Error:", errData.parserError);
        resolve(NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 }));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        // Extract plain text from pdf2json's raw text content
        const rawText = pdfParser.getRawTextContent();
        
        let managerDiscount = 0;
        let downPayment = 0;
        let financeAmount = 0;
        let insuranceFee = 0;
        let installments = 0;
        let interestRate = 0;
        let monthlyInstallment = 0;
        let totalInterest = 0;

        // Parse "Less: Manager Discount X,XXX.XX"
        const discountMatch = rawText.match(/Less:\s*Manager\s*Discount\s*([\d,]+(?:\.\d+)?)/i);
        if (discountMatch) {
          managerDiscount = parseFloat(discountMatch[1].replace(/,/g, ''));
        }

        // Parse "Down Payment (X%) X,XXX.XX" or similar
        const downPaymentMatch = rawText.match(/Down\s*Payment\s*(?:\(\d+%\))?\s*([\d,]+(?:\.\d+)?)/i);
        if (downPaymentMatch) {
          downPayment = parseFloat(downPaymentMatch[1].replace(/,/g, ''));
        }

        // Parse "Finance Amount X,XXX.XX"
        const financeMatch = rawText.match(/Finance\s*Amount\s*([\d,]+(?:\.\d+)?)/i);
        if (financeMatch) {
          financeAmount = parseFloat(financeMatch[1].replace(/,/g, ''));
        }

        // Parse "Insurance Fee X,XXX.XX"
        const insuranceMatch = rawText.match(/Insurance\s*Fee\s*([\d,]+(?:\.\d+)?)/i);
        if (insuranceMatch) {
          insuranceFee = parseFloat(insuranceMatch[1].replace(/,/g, ''));
        }

        // Parse "Installments 12"
        const installmentsMatch = rawText.match(/Installments\s*(\d+)/i);
        if (installmentsMatch) {
          installments = parseInt(installmentsMatch[1], 10);
        }

        // Parse "Interest Rate 10"
        const interestRateMatch = rawText.match(/Interest\s*Rate\s*([\d,]+(?:\.\d+)?)/i);
        if (interestRateMatch) {
          interestRate = parseFloat(interestRateMatch[1].replace(/,/g, ''));
        }

        // Parse "Monthly Installment 9,315.57"
        const monthlyInstallmentMatch = rawText.match(/Monthly\s*Installment\s*([\d,]+(?:\.\d+)?)/i);
        if (monthlyInstallmentMatch) {
          monthlyInstallment = parseFloat(monthlyInstallmentMatch[1].replace(/,/g, ''));
        }

        // Parse "Total Interest 5,826.81"
        const totalInterestMatch = rawText.match(/Total\s*Interest\s*([\d,]+(?:\.\d+)?)/i);
        if (totalInterestMatch) {
          totalInterest = parseFloat(totalInterestMatch[1].replace(/,/g, ''));
        }

        resolve(NextResponse.json({
          financeCompany: "Syakar Hire Purchase Pvt. Ltd.",
          managerDiscount,
          downPayment,
          financeAmount,
          insuranceFee,
          pdfUrl
        }));
      });

      pdfParser.parseBuffer(buffer);
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Server error during file processing" }, { status: 500 });
  }
}
