import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CartDrawer from "@/components/site/CartDrawer";

export default function MarketingLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* On homepage the header is fixed+transparent so no top padding needed;
          all other pages need padding to push content below the fixed header */}
      <main className={`flex-1 ${isHome ? "" : "pt-[220px]"}`}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
