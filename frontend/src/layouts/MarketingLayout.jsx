import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CartDrawer from "@/components/site/CartDrawer";

export default function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
