import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import CartDrawer from "@/components/common/CartSlider";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 max-w-7xl mx-auto p-4 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
