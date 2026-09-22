"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";
import TrudLauncher from "@/components/trud-launcher";

// Checkout (and any future secure/standalone pages) render without the
// site nav, footer or cart drawer.
function isStandalone(pathname: string | null) {
  return !!pathname && pathname.startsWith("/checkout");
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return <Navbar />;
}

export function SiteChromeFooter() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return (
    <>
      <Footer />
      <CartDrawer />
      <TrudLauncher />
    </>
  );
}
