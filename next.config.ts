import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit", "@whiskeysockets/baileys", "pino", "jimp", "sharp", "qrcode"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.honda.com.np',
      }
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
