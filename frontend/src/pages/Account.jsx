import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatINR } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { useAuth } from "@/context/AuthContext";
import { TID } from "@/lib/testIds";

export default function Account() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/orders/me").then(r => setOrders(r.data)).catch(() => {}); }, []);

  return (
    <Section wide>
      <div className="flex items-start justify-between flex-wrap gap-6">
        <div>
          <Overline>Your account</Overline>
          <h1 className="mt-3 serif text-5xl tracking-[-0.02em]">Hello, {user?.name?.split(" ")[0] || "friend"}</h1>
          <p className="mt-2 text-sm text-[color:var(--ink-3)]">{user?.email}</p>
        </div>
        <button data-testid={TID.auth.logout} onClick={logout} className="press-btn rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--surface-2)]">Sign out</button>
      </div>

      <div className="mt-10">
        <div className="serif text-2xl">Order history</div>
        {orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-8 text-center">
            <p className="text-sm text-[color:var(--ink-3)]">No orders yet. Your first Gullak piece is waiting.</p>
            <Link to="/collections/terracotta" className="mt-4 inline-block link-underline text-sm text-[color:var(--brand)]">Discover Terracotta →</Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map(o => (
              <div key={o.order_id} className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="serif text-lg">{o.order_id}</div>
                    <div className="text-xs text-[color:var(--ink-3)]">{new Date(o.created_at).toLocaleDateString()} • {o.items.length} items</div>
                  </div>
                  <div className="text-right">
                    <div className="serif text-lg">{formatINR(o.total)}</div>
                    <div className="text-xs uppercase tracking-widest text-[color:var(--brand)]">{o.status}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {o.items.slice(0, 4).map(it => (
                    <img key={it.product_id} src={it.image} alt={it.name} className="h-14 w-12 rounded object-cover flex-shrink-0" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
