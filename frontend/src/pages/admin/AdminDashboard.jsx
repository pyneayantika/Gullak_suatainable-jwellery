import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { Package, Layers, BookOpen, Users, ScrollText, Bell, Camera } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, collections: 0, journal: 0, artisans: 0, orders: 0, notifications: 0, moments: 0 });
  useEffect(() => {
    (async () => {
      try {
        const [p, c, j, a, o, n, m] = await Promise.all([
          api.get("/admin/products"),
          api.get("/admin/collections"),
          api.get("/admin/journal"),
          api.get("/admin/artisans"),
          api.get("/admin/orders"),
          api.get("/admin/notifications"),
          api.get("/admin/studio-moments"),
        ]);
        setStats({ products: p.data.length, collections: c.data.length, journal: j.data.length, artisans: a.data.length, orders: o.data.length, notifications: n.data.length, moments: m.data.length });
      } catch(_) {}
    })();
  }, []);

  const cards = [
    { label: "Products", value: stats.products, to: "/admin/products", Icon: Package },
    { label: "Collections", value: stats.collections, to: "/admin/collections", Icon: Layers },
    { label: "Journal posts", value: stats.journal, to: "/admin/journal", Icon: BookOpen },
    { label: "Studio Diary", value: stats.moments, to: "/admin/studio-diary", Icon: Camera },
    { label: "Artisans", value: stats.artisans, to: "/admin/artisans", Icon: Users },
    { label: "Orders", value: stats.orders, to: "/admin/orders", Icon: ScrollText },
    { label: "Notify-me", value: stats.notifications, to: "/admin/notifications", Icon: Bell },
  ];

  return (
    <div>
      <div className="overline">Studio dashboard</div>
      <h1 className="mt-2 serif text-4xl tracking-[-0.02em]">Overview</h1>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-5 hover:bg-[color:var(--surface-2)] transition-colors">
            <c.Icon className="h-5 w-5 text-[color:var(--brand)]" />
            <div className="mt-4 serif text-3xl">{c.value}</div>
            <div className="text-sm text-[color:var(--ink-3)] mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-6">
        <div className="serif text-xl">Quick actions</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/products" className="press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-4 py-2 text-sm hover:bg-[color:var(--brand-2)]">Add product</Link>
          <Link to="/admin/journal" className="press-btn rounded-full border border-[color:var(--border-subtle)] px-4 py-2 text-sm hover:bg-[color:var(--surface-2)]">Write journal</Link>
          <Link to="/admin/orders" className="press-btn rounded-full border border-[color:var(--border-subtle)] px-4 py-2 text-sm hover:bg-[color:var(--surface-2)]">View orders</Link>
        </div>
      </div>
    </div>
  );
}
