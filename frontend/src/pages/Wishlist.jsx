import React from "react";
import { Link } from "react-router-dom";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import ProductCard from "@/components/site/ProductCard";
import { useWishlist } from "@/context/WishlistContext";

export default function Wishlist() {
  const { products } = useWishlist();

  return (
    <Section wide>
      <Overline>Saved</Overline>
      <h1 className="mt-3 serif text-5xl tracking-[-0.02em]">Your Wishlist</h1>
      {products.length === 0 ? (
        <div className="mt-14 text-center py-16 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)]">
          <div className="serif text-3xl">Nothing saved yet.</div>
          <p className="mt-3 text-sm text-[color:var(--ink-3)] max-w-md mx-auto">Tap the heart on any piece to save it here — for later, or for someone you love.</p>
          <Link to="/collections/terracotta" className="mt-6 inline-block press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-6 py-3 text-sm hover:bg-[color:var(--brand-2)]">Discover Terracotta</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </Section>
  );
}
