import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { useCart } from "@/context/CartContext";
import { formatINR, resolveImg } from "@/lib/api";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 150;

  return (
    <Section wide>
      <Overline>Your bag</Overline>
      <h1 className="mt-3 serif text-5xl tracking-[-0.02em]">Cart</h1>

      {items.length === 0 ? (
        <div className="mt-14 text-center py-20 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)]">
          <div className="serif text-3xl">Your cart is quiet.</div>
          <p className="mt-3 text-sm text-[color:var(--ink-3)] max-w-md mx-auto">Discover a handcrafted piece that carries a story.</p>
          <Link to="/collections/terracotta" className="mt-6 inline-block press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-6 py-3 text-sm hover:bg-[color:var(--brand-2)]">Shop Terracotta</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map(it => (
              <div key={it.product.id} className="grid grid-cols-[100px_1fr_auto] gap-4 items-center rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-4">
                <Link to={`/products/${it.product.slug}`} className="block">
                  <img src={resolveImg(it.product.images?.[0])} alt={it.product.name} className="h-28 w-24 rounded-lg object-cover" />
                </Link>
                <div className="min-w-0">
                  <Link to={`/products/${it.product.slug}`} className="serif text-xl link-underline">{it.product.name}</Link>
                  <div className="text-xs text-[color:var(--ink-3)] mt-1">{it.product.material}</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center border border-[color:var(--border-subtle)] rounded-full">
                      <button onClick={() => updateQty(it.product.id, it.quantity - 1)} className="h-9 w-9 hover:bg-[color:var(--surface-2)] rounded-l-full inline-flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{it.quantity}</span>
                      <button onClick={() => updateQty(it.product.id, it.quantity + 1)} className="h-9 w-9 hover:bg-[color:var(--surface-2)] rounded-r-full inline-flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => removeItem(it.product.id)} className="text-sm text-[color:var(--ink-2)] hover:text-[color:var(--brand)] inline-flex items-center gap-1"><Trash2 className="h-4 w-4" /> Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="serif text-lg">{formatINR(it.product.price * it.quantity)}</div>
                  <div className="text-xs text-[color:var(--ink-3)]">{formatINR(it.product.price)} each</div>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-6">
            <div className="serif text-2xl">Order summary</div>
            <div className="mt-4 divider-line" />
            <div className="mt-4 flex items-center justify-between text-sm"><span className="text-[color:var(--ink-2)]">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="mt-2 flex items-center justify-between text-sm"><span className="text-[color:var(--ink-2)]">Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
            <div className="mt-2 text-xs text-[color:var(--ink-3)]">Free shipping on orders over ₹2,000</div>
            <div className="mt-4 divider-line" />
            <div className="mt-4 flex items-center justify-between"><span className="serif text-lg">Total</span><span className="serif text-lg">{formatINR(subtotal + shipping)}</span></div>
            <button onClick={() => navigate("/checkout")} className="press-btn mt-6 w-full rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] py-3.5 text-sm hover:bg-[color:var(--brand-2)]">Proceed to Checkout</button>
          </aside>
        </div>
      )}
    </Section>
  );
}
