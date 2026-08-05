import React from "react";
import { Link } from "react-router-dom";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import ProductCard from "@/components/site/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { DustParticles } from "@/components/site/DustParticles";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const { products } = useWishlist();

  return (
    <div>
      {/* ── Editorial hero — earthy grain + dust atmosphere ── */}
      <section className="grain-bg relative overflow-hidden">
        <DustParticles variant="section" />
        <div className="relative z-[5] mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
          <Overline>Saved</Overline>
          <h1 className="mt-3 serif text-5xl sm:text-6xl tracking-[-0.02em]">Your Wishlist</h1>
          <p className="mt-4 text-sm text-[color:var(--ink-3)] max-w-md">
            Pieces you’ve kept close — for yourself, or for someone who matters.
          </p>
          {products.length > 0 && (
            <div className="mt-3 text-xs text-[color:var(--ink-3)]">
              {products.length} {products.length === 1 ? "piece" : "pieces"} saved
            </div>
          )}
        </div>
      </section>

      {/* ── Wishlist content ── */}
      <Section wide>
        {products.length === 0 ? (
          <div className="mt-4 text-center py-16 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] card-earthy">
            <Heart className="mx-auto mb-4 text-[color:var(--brand)]" size={36} strokeWidth={1.2} />
            <div className="serif text-3xl">Nothing saved yet.</div>
            <p className="mt-3 text-sm text-[color:var(--ink-3)] max-w-md mx-auto">
              Tap the heart on any piece to save it here — for later, or for someone you love.
            </p>
            <Link
              to="/collections/terracotta"
              className="mt-6 inline-block press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-6 py-3 text-sm hover:bg-[color:var(--brand-2)]"
            >
              Discover Terracotta
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </Section>
    </div>
  );
}
