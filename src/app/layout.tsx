import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ChatWidget";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { hero, contact } from "@/lib/content";
import "./globals.css";

const SITE_URL = `https://${contact.website}`;
const SITE_TITLE = `${hero.eyebrow} — ${hero.headline}`;

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: hero.positioning,
  keywords: hero.disciplines,
  alternates: { canonical: "/" },
  // og:image / twitter:image are supplied automatically by app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    siteName: hero.eyebrow,
    title: SITE_TITLE,
    description: hero.positioning,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: hero.positioning,
    site: contact.social.handle,
    creator: contact.social.handle,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
