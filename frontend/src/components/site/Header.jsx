import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { TID } from "@/lib/testIds";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { GullakLogo } from "@/components/site/Logo";
import { useSiteSettings } from "@/context/SiteSettingsContext";

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
  const { settings } = useSiteSettings();
  const logoSize = settings.header_logo_size || 72;

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 80);
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      data-testid={TID.header.root}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-[rgba(250,246,239,0.97)] border-b border-[#E0D5C3] backdrop-blur-[10px] shadow-[0_1px_12px_rgba(80,45,25,0.08)]"
      }`}
    >
      {/* Single row: logo left | nav center | icons right — fixed 72px height */}
      <div className="w-full px-6 sm:px-10 lg:px-16 h-[72px] grid grid-cols-3 items-center">

        {/* LEFT — Logo constrained to header height */}
        <div className="flex items-center">
          <GullakLogo
            testId={TID.header.logo}
            className={`w-auto transition-all duration-500 ${isTransparent ? "brightness-0 invert" : ""}`}
            style={{ height: `${logoSize}px` }}
          />
        </div>

        {/* CENTER — Nav */}
        <nav className="hidden md:flex items-center justify-center gap-9">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              data-testid={item.testid}
              className={({ isActive }) =>
                `relative font-sans text-[11.5px] uppercase tracking-[0.14em] font-semibold transition-colors duration-300
                after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                  isTransparent
                    ? isActive
                      ? "text-white after:bg-white after:scale-x-100"
                      : "text-[rgba(250,246,239,0.75)] hover:text-white after:bg-white"
                    : isActive
                      ? "text-[color:var(--brand)] after:bg-[color:var(--brand)] after:scale-x-100"
                      : "text-[#4A3728] hover:text-[color:var(--brand)] after:bg-[color:var(--brand)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="md:hidden" />

        {/* RIGHT — Icons */}
        <div className="flex items-center justify-end gap-1">
          <Link
            data-testid={TID.header.wishlist}
            to="/wishlist"
            aria-label="Wishlist"
            className={`relative h-9 w-9 rounded-full inline-flex items-center justify-center transition-colors ${
              isTransparent ? "hover:bg-white/15" : "hover:bg-[rgba(179,90,60,0.10)]"
            }`}
          >
            <Heart className={`h-[17px] w-[17px] transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-[color:var(--ink-1)]"
            }`} />
            {ids.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-[color:var(--brand)] text-white text-[9px] font-bold flex items-center justify-center px-1">{ids.length}</span>
            )}
          </Link>

          <button
            data-testid={TID.header.cart}
            onClick={() => setOpen(true)}
            aria-label="Cart"
            className={`relative h-9 w-9 rounded-full inline-flex items-center justify-center transition-colors ${
              isTransparent ? "hover:bg-white/15" : "hover:bg-[rgba(179,90,60,0.10)]"
            }`}
          >
            <ShoppingBag className={`h-[17px] w-[17px] transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-[color:var(--ink-1)]"
            }`} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-[color:var(--brand)] text-white text-[9px] font-bold flex items-center justify-center px-1">{count}</span>
            )}
          </button>

          <button
            data-testid={TID.header.account}
            onClick={() => navigate(user ? "/account" : "/login")}
            aria-label="Account"
            className={`h-9 w-9 rounded-full inline-flex items-center justify-center transition-colors overflow-hidden ${
              isTransparent ? "hover:bg-white/15" : "hover:bg-[rgba(179,90,60,0.10)]"
            }`}
          >
            {user?.picture ? (
              <img src={user.picture} alt={user.name || "Account"} className="h-7 w-7 rounded-full object-cover" />
            ) : user ? (
              <div className="h-7 w-7 rounded-full bg-[color:var(--brand)] flex items-center justify-center">
                <span className="font-serif text-xs font-semibold text-white">
                  {(user.name || user.email || "G")[0].toUpperCase()}
                </span>
              </div>
            ) : (
              <User className={`h-[17px] w-[17px] transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-[color:var(--ink-1)]"
              }`} />
            )}
          </button>

          <button
            data-testid={TID.header.mobileMenu}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
            className={`md:hidden h-9 w-9 rounded-full inline-flex items-center justify-center transition-colors ${
              isTransparent ? "hover:bg-white/15" : "hover:bg-[rgba(179,90,60,0.10)]"
            }`}
          >
            {mobileOpen
              ? <X className={`h-5 w-5 ${isTransparent ? "text-white" : "text-[color:var(--ink-1)]"}`} />
              : <Menu className={`h-5 w-5 ${isTransparent ? "text-white" : "text-[color:var(--ink-1)]"}`} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E0D5C3] bg-[rgba(250,246,239,0.99)] backdrop-blur-sm">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-[12px] uppercase tracking-[0.10em] font-semibold border-b border-[#EDE4D6] last:border-0 ${
                    isActive ? "text-[color:var(--brand)]" : "text-[#4A3728]"
                  }`
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
