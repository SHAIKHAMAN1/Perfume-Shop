import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchOverlay from "@/components/ui/SearchOverlay";
import ToastContainer from "@/components/ui/ToastContainer";

/**
 * Customer-facing store layout.
 * Wraps all public pages with Navbar, Footer, and global UI overlays
 * (cart drawer, search overlay, toast notifications).
 */
export default function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      {/* Offset for fixed navbar (h-16 on mobile, h-20 on desktop) */}
      <main className="pt-16 lg:pt-20 min-h-screen">
        {children}
      </main>
      <Footer />

      {/* Global UI overlays — rendered at root so they sit above everything */}
      <CartDrawer />
      <SearchOverlay />
      <ToastContainer />
    </>
  );
}
