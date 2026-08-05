import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { TID } from "@/lib/testIds";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { GullakLogo } from "@/components/site/Logo";

const navItems = [
  { to: "/", label: "Home", testid: TID.header.navHome },
  { to: "/collections", label: "Collection", testid: TID.header.navShop },
  { to: "/about", label: "About", testid: TID.header.navAbout },
  { to: "/journal", label: "Journal", testid: TID.header.navJournal },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, setOpen } = useCart();
  const { ids } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset scroll state when route changes
  useEffect(() => {
    setScrolled(window.scrollY > 80);
    setMobileOpen(false);
  }, [location.pathname]);

  const iconCls = `h-[17px] w-[17px] transition-colors duration-300 ${
    isTransparent ? "text-[#FAF6EF]" : "text-[color:var(--ink-1)]"
  }`;

  const btnCls = `relative h-9 w-9 rounded-full inline-flex items-center justify-center transition-colors ${
    isTransparent
      ? "hover:bg-[rgba(255,255,255,0.15)]"
      : "hover:bg-[rgba(179,90,60,0.10)]"
  }`;

  return (
    <header
      data-testid={TID.header.root}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-[rgba(250,246,239,0.96)] border-b border-[#E8DCC8] backdrop-blur-[8px] shadow-sm"
      }`}
    >
      {/* 3-column layout: logo left | nav center | icons right */}
      <div className="w-full px-6 sm:px-10 lg:px-16 h-[88px] grid grid-cols-3 items-center">

        {/* LEFT — Logo: always visible, white on transparent hero, dark on solid */}
        <div className="flex items-center">
          <GullakLogo
            testId={TID.header.logo}
            className={`h-20 transition-all duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
          />
        </div>

        {/* CENTER — Nav links */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={item.testid}
              className={({ isActive }) =>
                `font-sans text-[13px] uppercase tracking-[0.12em] font-semibold transition-colors duration-300 ${
                  isTransparent
                    ? isActive
                      ? "text-white"
                      : "text-[rgba(250,246,239,0.80)] hover:text-white"
                    : isActive
                      ? "text-[color:var(--brand)]"
                      : "text-[#3A2E28] hover:text-[color:var(--brand)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="md:hidden" />

        {/* RIGHT — Actions */}
        <div className="flex items-center justify-end gap-0.5">
          <Link
            data-testid={TID.header.wishlist}
            to="/wishlist"
            aria-label="Wishlist"
            className={btnCls}
          >
            <Heart className={iconCls} />
            {ids.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] text-[10px] font-medium px-1 flex items-center justify-center">{ids.length}</span>
            )}
          </Link>
          <button
            data-testid={TID.header.cart}
            onClick={() => setOpen(true)}
            aria-label="Cart"
            className={btnCls}
          >
            <ShoppingBag className={iconCls} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] text-[10px] font-medium px-1 flex items-center justify-center">{count}</span>
            )}
          </button>
          <button
            data-testid={TID.header.account}
            onClick={() => navigate(user ? "/account" : "/login")}
            aria-label="Account"
            className={`${btnCls} overflow-hidden`}
          >
            {user?.picture ? (
              <img src={user.picture} alt={user.name || "Account"} className="h-7 w-7 rounded-full object-cover ring-2 ring-[color:var(--border-subtle)]" />
            ) : user ? (
              <div className="h-7 w-7 rounded-full bg-[color:var(--brand)] flex items-center justify-center">
                <span className="font-serif text-xs font-semibold text-[color:var(--paper-white)]">
                  {(user.name || user.email || "G")[0].toUpperCase()}
                </span>
              </div>
            ) : (
              <User className={iconCls} />
            )}
          </button>
          <button
            data-testid={TID.header.mobileMenu}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
            className={`md:hidden ${btnCls}`}
          >
            {mobileOpen
              ? <X className={`h-5 w-5 ${isTransparent ? "text-white" : ""}`} />
              : <Menu className={`h-5 w-5 ${isTransparent ? "text-white" : ""}`} />}
          </button>
        </div>

      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8DCC8] bg-[rgba(250,246,239,0.98)]">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `py-3 px-2 text-[13px] uppercase tracking-[0.06em] font-semibold ${isActive ? "text-[color:var(--brand)]" : "text-[#5A4433]"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
