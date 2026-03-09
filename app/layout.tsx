import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: {
    default: "Berlin Blockchain Events",
    template: "%s | Berlin Blockchain Events",
  },
  description:
    "The definitive event board for Berlin's blockchain and Web3 ecosystem. Discover conferences, meetups, hackathons, and more.",
  keywords: ["blockchain", "Berlin", "Web3", "crypto", "events", "DeFi", "NFT"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Berlin Blockchain Events",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${geist.variable}`}>
      <body className="min-h-screen bg-bg text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
