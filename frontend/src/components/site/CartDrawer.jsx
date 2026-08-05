import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { formatINR, resolveImg } from "@/lib/api";
import { Minus, Plus, Trash2 } from "lucide-react";
import { TID } from "@/lib/testIds";

export default function CartDrawer() {
  const { open, setOpen, items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" data-testid={TID.cart.drawer} className="w-full sm:max-w-md bg-[color:var(--bg)] border-l border-[color:var(--border-subtle)] flex flex-col">
        <SheetHeader className="border-b border-[color:var(--border-subtle)] pb-4">
          <SheetTitle className="serif text-2xl">Your Cart</SheetTitle>
          <p className="text-xs text-[color:var(--ink-3)]">Free shipping over ₹2,000</p>
        </SheetHeader>

        {items.length === 0 ? (
          <div data-testid={TID.cart.empty} className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="h-20 w-20 rounded-full bg-[color:var(--surface-2)] flex items-center justify-center serif text-3xl text-[color:var(--brand)]">○</div>
            <p className="serif text-xl">Your cart is quiet.</p>
            <p className="text-sm text-[color:var(--ink-2)] max-w-xs">Discover a piece that carries a story.</p>
            <button
              onClick={() => { setOpen(false); navigate("/collections/terracotta"); }}
              className="press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-6 py-3 text-sm"
            >
              Shop Terracotta
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((it) => (
                <div key={it.product.id} className="flex gap-4 items-start">
                  <img src={resolveImg(it.product.images?.[0])} alt={it.product.name} className="h-24 w-20 rounded-lg object-cover bg-[color:var(--surface-2)]" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${it.product.slug}`} onClick={() => setOpen(false)} className="serif text-lg leading-tight link-underline">{it.product.name}</Link>
                    <div className="text-xs text-[color:var(--ink-3)] mt-0.5">{it.product.material}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center border border-[color:var(--border-subtle)] rounded-full">
                        <button aria-label="Decrease" onClick={() => updateQty(it.product.id, it.quantity - 1)} className="h-8 w-8 inline-flex items-center justify-center hover:bg-[color:var(--surface-2)] rounded-l-full"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm">{it.quantity}</span>
                        <button aria-label="Increase" onClick={() => updateQty(it.product.id, it.quantity + 1)} className="h-8 w-8 inline-flex items-center justify-center hover:bg-[color:var(--surface-2)] rounded-r-full"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button
                        data-testid={TID.cart.remove}
                        onClick={() => removeItem(it.product.id)}
                        aria-label="Remove"
                        className="ml-auto h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--surface-2)] text-[color:var(--ink-2)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{formatINR(it.product.price * it.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-[color:var(--border-subtle)] pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[color:var(--ink-2)]">Subtotal</span>
                <span className="font-medium">{formatINR(subtotal)}</span>
              </div>
              <button
                data-testid={TID.cart.checkout}
                onClick={() => { setOpen(false); navigate("/checkout"); }}
                className="press-btn w-full rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] py-3.5 text-sm hover:bg-[color:var(--brand-2)]"
              >
                Proceed to Checkout
              </button>
              <p className="text-[10px] text-[color:var(--ink-3)] text-center">Ships from our studio in India within 5–7 days</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
