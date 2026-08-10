import { NextResponse } from "next/server";
import { getWhatsAppQR, isWhatsAppConnected } from "@/lib/whatsapp";
import QRCode from "qrcode";

export async function GET() {
  if (isWhatsAppConnected()) {
    return NextResponse.json({ status: "connected", message: "WhatsApp is already connected." });
  }

  const qrData = await getWhatsAppQR();

  if (!qrData) {
    return NextResponse.json({ status: "pending", message: "QR Code not ready yet or already scanned. Check console." });
  }

  try {
    const qrImageBase64 = await QRCode.toDataURL(qrData);
    
    // Return a simple HTML page showing the QR code
    return new NextResponse(`
      <html>
        <body style="display:flex; justify-content:center; align-items:center; height:100vh; background-color:#f3ebdd; font-family:sans-serif;">
          <div style="text-align:center; background:white; padding:40px; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h1 style="color:#c1291A;">Link WhatsApp Bot</h1>
            <p>Scan this QR code with your WhatsApp app (Linked Devices)</p>
            <img src="${qrImageBase64}" alt="WhatsApp QR Code" style="margin-top: 20px; border: 1px solid #ccc; padding: 10px;" />
          </div>
        </body>
      </html>
    `, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate QR code image" }, { status: 500 });
  }
}
