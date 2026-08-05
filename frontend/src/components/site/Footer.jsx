import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { TID } from "@/lib/testIds";
import { GullakLogo } from "@/components/site/Logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      await api.post("/newsletter", { email });
      toast.success("Welcome to the Gullak circle", { description: "Slow letters. Rare pieces. Never spam." });
      setEmail("");
    } catch (err) {
      toast.error("Please try again");
    } finally { setBusy(false); }
  };

  return (
    <footer className="mt-24 bg-[color:var(--surface-2)] border-t border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <GullakLogo className="h-10" />
          <p className="mt-3 max-w-md text-sm text-[color:var(--ink-2)] leading-relaxed">
            Wear Nature. Wear Stories. Wear Craft. Handcrafted terracotta jewellery, made slowly in India, meant to be treasured for years.
          </p>
          <form data-testid={TID.home.newsletter} onSubmit={subscribe} className="mt-6 flex max-w-md gap-2">
            <input
              data-testid={TID.home.newsletterInput}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]"
            />
            <button
              data-testid={TID.home.newsletterSubmit}
              type="submit" disabled={busy}
              className="press-btn rounded-xl bg-[color:var(--brand)] px-5 py-3 text-sm text-[color:var(--surface)] hover:bg-[color:var(--brand-2)]"
            >
              {busy ? "…" : "Subscribe"}
            </button>
          </form>
        </div>
        <div>
          <div className="overline mb-4">Shop</div>
          <ul className="space-y-2 text-sm">
            <li><Link className="link-underline" to="/collections">All Collections</Link></li>
            <li><Link className="link-underline" to="/collections/terracotta">Terracotta</Link></li>
            <li><Link className="link-underline" to="/wishlist">Wishlist</Link></li>
            <li><Link className="link-underline" to="/cart">Cart</Link></li>
          </ul>
        </div>
        <div>
          <div className="overline mb-4">Studio</div>
          <ul className="space-y-2 text-sm">
            <li><Link className="link-underline" to="/about">About Gullak</Link></li>
            <li><Link className="link-underline" to="/craftsmanship">The Craft</Link></li>
            <li><Link className="link-underline" to="/artisans">Artisans</Link></li>
            <li><Link className="link-underline" to="/journal">Journal</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--border-subtle)]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[color:var(--ink-3)]">© {new Date().getFullYear()} Gullak Studio. Handmade with quiet devotion.</p>
          <div className="flex items-center gap-4 text-[color:var(--ink-2)]">
            <a aria-label="Instagram" href="#" className="hover:text-[color:var(--brand)]"><Instagram className="h-4 w-4" /></a>
            <a aria-label="Facebook" href="#" className="hover:text-[color:var(--brand)]"><Facebook className="h-4 w-4" /></a>
            <a aria-label="Twitter" href="#" className="hover:text-[color:var(--brand)]"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
