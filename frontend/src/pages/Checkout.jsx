import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatINR, resolveImg } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { TID } from "@/lib/testIds";

export default function Checkout() {
  const { items, subtotal, clear, refresh } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: user?.name || "",
    email: user?.email || "",
    phone: "", line1: "", line2: "", city: "", state: "", postal_code: "", country: "India"
  });
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const shipping = subtotal >= 2000 ? 0 : 150;

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const place = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    setBusy(true);
    try {
      const res = await api.post("/orders", {
        address: form,
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
        notes,
      });
      await clear();
      await refresh();
      toast.success("Order placed — thank you");
      navigate(`/order-confirmation/${res.data.order_id}`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not place order");
    } finally { setBusy(false); }
  };

  if (items.length === 0) {
    return (
      <Section wide>
        <div className="py-20 text-center">
          <h1 className="serif text-4xl">Your cart is empty</h1>
          <p className="mt-3 text-[color:var(--ink-3)]">Please add pieces to your cart before checkout.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section wide>
      <Overline>Checkout</Overline>
      <h1 className="mt-3 serif text-5xl tracking-[-0.02em]">Almost yours.</h1>

      <form data-testid={TID.checkout.form} onSubmit={place} className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-6">
            <div className="serif text-2xl">Shipping address</div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full name" value={form.full_name} onChange={onChange("full_name")} required data-testid="checkout-full-name" />
              <Field label="Email" type="email" value={form.email} onChange={onChange("email")} required data-testid="checkout-email" />
              <Field label="Phone" value={form.phone} onChange={onChange("phone")} required data-testid="checkout-phone" />
              <Field label="Country" value={form.country} onChange={onChange("country")} required />
              <Field className="sm:col-span-2" label="Address line 1" value={form.line1} onChange={onChange("line1")} required data-testid="checkout-line1" />
              <Field className="sm:col-span-2" label="Address line 2 (optional)" value={form.line2} onChange={onChange("line2")} />
              <Field label="City" value={form.city} onChange={onChange("city")} required data-testid="checkout-city" />
              <Field label="State" value={form.state} onChange={onChange("state")} required />
              <Field label="Postal code" value={form.postal_code} onChange={onChange("postal_code")} required data-testid="checkout-postal" />
            </div>
          </div>

          <div className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-6">
            <div className="serif text-2xl">A note for the studio (optional)</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="E.g. A gift note, a delivery preference…" className="mt-3 w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]" />
          </div>

          <div className="rounded-2xl bg-[color:var(--surface-2)] border border-[color:var(--border-subtle)] p-6">
            <div className="serif text-xl">Payment</div>
            <p className="mt-2 text-sm text-[color:var(--ink-2)]">This is a demonstration checkout — your card will not be charged. Real payment integration will be added in a future release.</p>
          </div>
        </div>

        <aside data-testid={TID.checkout.summary} className="lg:sticky lg:top-24 h-fit rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-6">
          <div className="serif text-2xl">Your order</div>
          <div className="mt-4 divider-line" />
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map(it => (
              <div key={it.product.id} className="flex items-center gap-3 text-sm">
                <img src={resolveImg(it.product.images?.[0])} alt={it.product.name} className="h-14 w-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="serif text-base leading-tight">{it.product.name}</div>
                  <div className="text-xs text-[color:var(--ink-3)]">Qty {it.quantity}</div>
                </div>
                <div>{formatINR(it.product.price * it.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 divider-line" />
          <div className="mt-4 flex items-center justify-between text-sm"><span className="text-[color:var(--ink-2)]">Subtotal</span><span>{formatINR(subtotal)}</span></div>
          <div className="mt-2 flex items-center justify-between text-sm"><span className="text-[color:var(--ink-2)]">Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
          <div className="mt-4 divider-line" />
          <div className="mt-4 flex items-center justify-between"><span className="serif text-lg">Total</span><span className="serif text-lg">{formatINR(subtotal + shipping)}</span></div>
          <button data-testid={TID.checkout.place} disabled={busy} type="submit" className="press-btn mt-6 w-full rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] py-3.5 text-sm hover:bg-[color:var(--brand-2)] disabled:opacity-70">
            {busy ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </Section>
  );
}

function Field({ label, className = "", ...rest }) {
  return (
    <label className={`block ${className}`}>
      <span className="overline block mb-1.5">{label}</span>
      <input {...rest} className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]" />
    </label>
  );
}
