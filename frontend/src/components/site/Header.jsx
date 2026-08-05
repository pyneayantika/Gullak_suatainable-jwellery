import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { TID } from "@/lib/testIds";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid={TID.header.root}
      className={`sticky top-0 z-40 backdrop-blur transition-colors ${
        scrolled ? "bg-[rgba(247,241,230,0.92)] border-b border-[color:var(--border-subtle)]" : "bg-[rgba(247,241,230,0.72)]"
      }`}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        <Link data-testid={TID.header.logo} to="/" className="serif text-2xl tracking-tight text-[color:var(--ink-1)]">Gullak</Link>
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={item.testid}
              className={({ isActive }) =>
                `link-underline text-sm ${isActive ? "text-[color:var(--brand)]" : "text-[color:var(--ink-2)] hover:text-[color:var(--ink-1)]"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link
            data-testid={TID.header.wishlist}
            to="/wishlist"
            aria-label="Wishlist"
            className="relative h-10 w-10 rounded-full inline-flex items-center justify-center hover:bg-[rgba(179,90,60,0.10)] transition-colors"
          >
            <Heart className="h-[18px] w-[18px] text-[color:var(--ink-1)]" />
            {ids.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] text-[10px] font-medium px-1 flex items-center justify-center">{ids.length}</span>
            )}
          </Link>
          <button
            data-testid={TID.header.cart}
            onClick={() => setOpen(true)}
            aria-label="Cart"
            className="relative h-10 w-10 rounded-full inline-flex items-center justify-center hover:bg-[rgba(179,90,60,0.10)] transition-colors"
          >
            <ShoppingBag className="h-[18px] w-[18px] text-[color:var(--ink-1)]" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] text-[10px] font-medium px-1 flex items-center justify-center">{count}</span>
            )}
          </button>
          <button
            data-testid={TID.header.account}
            onClick={() => navigate(user ? "/account" : "/login")}
            aria-label="Account"
            className="h-10 w-10 rounded-full inline-flex items-center justify-center hover:bg-[rgba(179,90,60,0.10)] transition-colors"
          >
            <User className="h-[18px] w-[18px] text-[color:var(--ink-1)]" />
          </button>
          <button
            data-testid={TID.header.mobileMenu}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
            className="md:hidden h-10 w-10 rounded-full inline-flex items-center justify-center hover:bg-[rgba(179,90,60,0.10)] transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-[color:var(--border-subtle)] bg-[color:var(--bg)]">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `py-3 px-2 text-base ${isActive ? "text-[color:var(--brand)]" : "text-[color:var(--ink-1)]"}`}
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
