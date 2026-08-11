import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import FloatingChatbot from "@/components/FloatingChatbot";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <FloatingActionBar />
      <FloatingChatbot />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
