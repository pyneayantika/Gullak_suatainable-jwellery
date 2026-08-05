import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, formatINR, resolveImg } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { Check } from "lucide-react";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get(`/orders/${orderId}`).then(r => setOrder(r.data)).catch(() => {}); }, [orderId]);

  if (!order) return <div className="p-20 text-center overline">Loading order…</div>;

  return (
    <Section wide>
      <div className="text-center max-w-2xl mx-auto">
        <div className="h-16 w-16 rounded-full bg-[color:var(--sage-green)] text-white inline-flex items-center justify-center"><Check className="h-7 w-7" /></div>
        <Overline className="mt-6">Order placed</Overline>
        <h1 className="mt-3 serif text-5xl tracking-[-0.02em]">Thank you.</h1>
        <p className="mt-4 text-[15px] text-[color:var(--ink-2)]">Your order <span className="font-medium text-[color:var(--ink-1)]">{order.order_id}</span> has been received. We'll hand-craft, hand-pack, and dispatch it within 5–7 days.</p>
      </div>

      <div className="mt-12 max-w-2xl mx-auto rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-6">
        <div className="space-y-3">
          {order.items.map(it => (
            <div key={it.product_id} className="flex items-center gap-4">
              <img src={resolveImg(it.image)} alt={it.name} className="h-16 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="serif text-lg leading-tight">{it.name}</div>
                <div className="text-xs text-[color:var(--ink-3)]">Qty {it.quantity}</div>
              </div>
              <div className="text-sm">{formatINR(it.line_total)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 divider-line" />
        <div className="mt-4 flex items-center justify-between text-sm"><span className="text-[color:var(--ink-2)]">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
        <div className="mt-1 flex items-center justify-between text-sm"><span className="text-[color:var(--ink-2)]">Shipping</span><span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span></div>
        <div className="mt-3 flex items-center justify-between"><span className="serif text-lg">Total paid</span><span className="serif text-lg">{formatINR(order.total)}</span></div>
      </div>

      <div className="mt-10 text-center">
        <Link to="/collections/terracotta" className="link-underline text-sm">Continue browsing →</Link>
      </div>
    </Section>
  );
}
