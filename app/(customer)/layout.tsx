import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <FloatingActionBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
