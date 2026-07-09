import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: {
    default : "LUXEURE — Luxury Fragrances",
    template: "%s | LUXEURE",
  },
  description:
    "Discover the world's finest luxury fragrances. Shop exclusive perfumes from Dior, Tom Ford, Creed, Chanel, and 500+ premium brands. Free shipping above ₹1,999.",
  keywords: [
    "luxury perfume","designer fragrance","eau de parfum","eau de toilette",
    "Dior perfume","Tom Ford fragrance","Creed cologne","niche perfume India",
    "buy perfume online India","luxury fragrance store",
  ],
  authors: [{ name: "LUXEURE" }],
  robots: { index: true, follow: true },
  openGraph: {
    type       : "website",
    locale     : "en_IN",
    siteName   : "LUXEURE",
    title      : "LUXEURE — Luxury Fragrances",
    description: "Shop 500+ luxury fragrances. Free shipping above ₹1,999.",
  },
  twitter: {
    card       : "summary_large_image",
    title      : "LUXEURE — Luxury Fragrances",
    description: "Shop 500+ luxury fragrances. Free shipping above ₹1,999.",
  },
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} dark`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
