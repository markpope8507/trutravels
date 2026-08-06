import type { Metadata } from "next";
import { Montserrat, Source_Sans_3, Caveat } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteChromeFooter } from "@/components/site-chrome";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { AuthModalProvider } from "@/lib/auth-modal";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TruTravels — Leave Ordinary Behind",
  description:
    "Life changing experiences. Game changing travel. Group adventures for 18-35s across Southeast Asia, Central & South America, and beyond.",
  // Prototype/demo — keep it out of search indexes so it never competes with the
  // live site (trutravels.com) as duplicate content.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${sourceSans.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <AuthModalProvider>
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteChromeFooter />
            </AuthModalProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
