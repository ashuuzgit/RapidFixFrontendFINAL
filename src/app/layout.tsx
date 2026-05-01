import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocateUs } from "@/components/LocateUs";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { LeadPopup } from "@/components/LeadPopup";
import { GsapScrollWrapper } from "@/components/GsapScrollWrapper";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RapidFix | Precision Automotive Engineering",
  description: "High-performance automotive repair and precision engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <GsapScrollWrapper>
          <main className="flex-1">{children}</main>
          <LocateUs />
          <Footer />
        </GsapScrollWrapper>
        <StickyWhatsApp />
        <LeadPopup />
      </body>
    </html>
  );
}
