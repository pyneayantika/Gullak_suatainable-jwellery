import React, { Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import MarketingLayout from "@/layouts/MarketingLayout";
import AdminLayout from "@/layouts/AdminLayout";
import AuthCallback from "@/pages/AuthCallback";

import Home from "@/pages/Home";
import CollectionsList from "@/pages/CollectionsList";
import CollectionDetail from "@/pages/CollectionDetail";
import ProductDetail from "@/pages/ProductDetail";
import Journal from "@/pages/Journal";
import JournalDetail from "@/pages/JournalDetail";
import About from "@/pages/About";
import Craftsmanship from "@/pages/Craftsmanship";
import Artisans from "@/pages/Artisans";
import ArtisanDetail from "@/pages/ArtisanDetail";
import Wishlist from "@/pages/Wishlist";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Account from "@/pages/Account";
import Login from "@/pages/Login";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminJournal from "@/pages/admin/AdminJournal";
import AdminCollections from "@/pages/admin/AdminCollections";
import AdminArtisans from "@/pages/admin/AdminArtisans";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminStudioDiary from "@/pages/admin/AdminStudioDiary";
import AdminSiteContent from "@/pages/admin/AdminSiteContent";

function ProtectedCustomer({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center overline">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRouter() {
  const location = useLocation();
  // Detect OAuth callback synchronously (fragment-based)
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<CollectionsList />} />
        <Route path="/collections/:slug" element={<CollectionDetail />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<JournalDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/craftsmanship" element={<Craftsmanship />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisans/:slug" element={<ArtisanDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedCustomer><Checkout /></ProtectedCustomer>} />
        <Route path="/order-confirmation/:orderId" element={<ProtectedCustomer><OrderConfirmation /></ProtectedCustomer>} />
        <Route path="/account" element={<ProtectedCustomer><Account /></ProtectedCustomer>} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/journal" element={<AdminJournal />} />
        <Route path="/admin/collections" element={<AdminCollections />} />
        <Route path="/admin/artisans" element={<AdminArtisans />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/studio-diary" element={<AdminStudioDiary />} />
        <Route path="/admin/site-content" element={<AdminSiteContent />} />
      </Route>
      <Route path="*" element={<div className="mx-auto max-w-md p-20 text-center serif text-3xl">Not found</div>} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <SiteSettingsProvider>
          <WishlistProvider>
            <CartProvider>
              <Suspense fallback={<div className="p-10 text-center overline">Loading…</div>}>
                <AppRouter />
              </Suspense>
              <Toaster position="bottom-right" theme="light" richColors closeButton />
            </CartProvider>
          </WishlistProvider>
          </SiteSettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
