import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CartDrawer from "@/components/site/CartDrawer";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function MarketingLayout() {
  const { pathname } = useLocation();
  const { settings } = useSiteSettings();
  const isHome = pathname === "/";
  const headerHeight = Math.max((settings.header_logo_size || 44) + 20, 64);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1" style={{ paddingTop: isHome ? 0 : `${headerHeight}px` }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
