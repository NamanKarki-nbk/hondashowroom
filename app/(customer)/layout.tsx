import React from "react";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import FloatingChatbot from "@/components/FloatingChatbot";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("auth_session");

  return (
    <>
      <Header initialIsLoggedIn={hasSession} />
      <FloatingActionBar />
      <FloatingChatbot />
      <main className="flex-1 pb-[72px] md:pb-0">
        {children}
      </main>
      <Footer />
    </>
  );
}
