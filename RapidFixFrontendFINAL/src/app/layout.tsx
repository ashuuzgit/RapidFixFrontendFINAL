import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocateUs } from "@/components/LocateUs";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { LeadPopup } from "@/components/LeadPopup";
import { GsapScrollWrapper } from "@/components/GsapScrollWrapper";
import { FAQSection } from "@/components/FAQSection";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rapidfixauto.in"), // required for resolving relative image URLs

  title: {
    default: "RapidFix | Car & Bike Service, Repair & Wash Near You",
    template: "%s | RapidFixAuto",
  },

  description:
    "RapidFix offers expert car & bike service, repair, wash, AC repair, tyre & wheel, denting & painting, battery replacement and EV service near you in Delhi NCR.",

  keywords: [
    "car service near me",
    "bike service near me",
    "car repair near me",
    "bike repair near me",
    "car wash near me",
    "bike wash near me",
    "engine repair near me",
    "car AC repair near me",
    "battery replacement near me",
    "tyre and wheel near me",
    "denting and painting near me",
    "EV service near me",
    "puncture repair near me",
    "rapidfix",
    "rapidfixauto",
    "automotive repair Delhi",
    "mechanic near me",
  ],

  authors: [{ name: "RapidFixAuto", url: "https://rapidfixauto.in" }],
  creator: "RapidFixAuto",
  publisher: "RapidFixAuto",

  icons: {
    icon: "/NewLogoSvg.svg",
    apple: "/NewLogoSvg.svg",
  },

  openGraph: {
    title: "RapidFix | Car & Bike Service, Repair & Wash Near You",
    description:
      "Expert car & bike service, repair, wash, AC repair, tyre & wheel, denting & painting, battery and EV service near you.",
    siteName: "RapidFixAuto",
    locale: "en_IN",
    type: "website",
    url: "https://rapidfixauto.in",
    images: [
      {
        url: "/newLogo-Photoroom.png",   // ⚠️ use a real 1200×630 JPG/PNG, SVGs don't render on WhatsApp/Facebook
        width: 1200,
        height: 630,
        alt: "RapidFix – Car & Bike Service Near You",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "RapidFix | Car & Bike Service, Repair & Wash Near You",
    description:
      "Expert car & bike service, repair, wash, AC repair, tyre & wheel, denting & painting, battery and EV service near you.",
    images: ["/newLogo-Photoroom.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://rapidfixauto.in",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <Header />
        <GsapScrollWrapper>
          <main className="flex-1">{children}</main>
          <FAQSection />
          <LocateUs />
          <Footer />
        </GsapScrollWrapper>
        <StickyWhatsApp />
        <LeadPopup />
      </body>
    </html>
  );
}
