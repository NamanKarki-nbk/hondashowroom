import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit", "@whiskeysockets/baileys", "pino", "jimp", "sharp", "qrcode"],
};

export default nextConfig;
