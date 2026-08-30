import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://damakhonda.com.np'),
  title: "Society Enterprises | Official Honda Showroom in Damak",
  description: "Explore the latest Honda motorcycles and scooters at Society Enterprises, Goarkha Department Building, Ganga Nagari, Damak-05, Jhapa. Book test rides, get digital quotations, and exchange your old bikes.",
  keywords: "Honda Showroom, Damak, Jhapa, Honda Motorcycles, Scooters, Test Ride, Buy Honda Bike",
  authors: [{ name: "Society Enterprises" }],
  openGraph: {
    title: "Society Enterprises | Official Honda Showroom",
    description: "Explore the latest Honda motorcycles and scooters at Society Enterprises, Goarkha Department Building, Ganga Nagari, Damak-05.",
    url: "https://damakhonda.com.np",
    siteName: "Society Enterprises Honda",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Society Enterprises Honda Showroom",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="honda-theme"
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
