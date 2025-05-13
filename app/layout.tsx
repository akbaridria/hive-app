import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Web3Provider } from "../components/web3-provider";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Loading from "@/components/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hive",
  description: "Decentralized Order Book",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <Suspense fallback={<Loading />}>
          <Web3Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col h-screen">
                <Header />
                <main className="container mx-auto border-x border-dashed flex-1 flex flex-col">
                  {children}
                </main>
              </div>
            </ThemeProvider>
          </Web3Provider>
        </Suspense>
      </body>
    </html>
  );
}
