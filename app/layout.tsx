import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "next-auth";
import PathTracker from "@/components/PathTracker";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat App",
  description: "Chat App made by Bipin Bhandari",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <SessionProvider session={session}>
            <PathTracker>
              <Navbar />
              {children}
              <Toaster position="bottom-right" />
            </PathTracker>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
