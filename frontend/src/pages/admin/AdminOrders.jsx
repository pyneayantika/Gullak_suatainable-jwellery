import React, { useEffect, useState } from "react";
import { api, formatINR } from "@/lib/api";
import { toast } from "sonner";

const STATUSES = ["placed", "crafting", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const load = async () => { const r = await api.get("/admin/orders"); setOrders(r.data); };
  useEffect(() => { load(); }, []);

  const updateStatus = async (order, status) => {
    try {
      await api.put(`/admin/orders/${order.order_id}/status`, { status });
      toast.success(`Order ${order.order_id} → ${status}`);
      load();
    } catch (err) { toast.error("Could not update"); }
  };

  return (
    <div>
      <div><div className="overline">Fulfilment</div><h1 className="mt-2 serif text-4xl tracking-[-0.02em]">Orders</h1></div>

      <div className="mt-8 rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] overflow-hidden">
        {orders.length === 0 && <div className="p-10 text-center text-sm text-[color:var(--ink-3)]">No orders yet.</div>}
        {orders.map(o => (
          <div key={o.order_id} className="p-5 border-b border-[color:var(--border-subtle)] last:border-0">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="serif text-lg">{o.order_id}</div>
                <div className="text-xs text-[color:var(--ink-3)]">{new Date(o.created_at).toLocaleString()} • {o.customer_name} • {o.customer_email}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="serif text-lg">{formatINR(o.total)}</div>
                <select value={o.status} onChange={(e) => updateStatus(o, e.target.value)} className="rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-3 py-1.5 text-xs">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-xs text-[color:var(--ink-2)]">
                <div className="overline">Ship to</div>
                <div className="mt-1">{o.address.full_name}, {o.address.line1}{o.address.line2 ? ", " + o.address.line2 : ""}, {o.address.city}, {o.address.state} {o.address.postal_code}, {o.address.country} • {o.address.phone}</div>
              </div>
              <div>
                <div className="overline">Items</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {o.items.map(it => (
                    <div key={it.product_id} className="flex items-center gap-2 text-xs bg-[color:var(--bg)] rounded-full pl-1 pr-3 py-1">
                      <img src={it.image} alt="" className="h-6 w-6 rounded-full object-cover" />
                      <span>{it.name} × {it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
