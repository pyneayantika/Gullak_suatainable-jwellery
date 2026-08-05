import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { TID } from "@/lib/testIds";
import { LayoutDashboard, Package, BookOpen, Layers, Users, ScrollText, Bell, LogOut } from "lucide-react";

export default function AdminLayout() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/admin/me");
        setAdmin(r.data);
      } catch {
        navigate("/admin/login", { replace: true });
      } finally { setLoading(false); }
    })();
  }, [navigate]);

  const logout = async () => {
    try { await api.post("/admin/logout"); } catch(_){}
    navigate("/admin/login", { replace: true });
  };

  if (loading) return <div className="p-20 text-center overline">Loading admin…</div>;
  if (!admin) return null;

  const links = [
    { to: "/admin", label: "Overview", Icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", Icon: Package },
    { to: "/admin/collections", label: "Collections", Icon: Layers },
    { to: "/admin/journal", label: "Journal", Icon: BookOpen },
    { to: "/admin/artisans", label: "Artisans", Icon: Users },
    { to: "/admin/orders", label: "Orders", Icon: ScrollText },
    { to: "/admin/notifications", label: "Notify-me", Icon: Bell },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[240px_1fr] bg-[color:var(--bg)]">
      <aside data-testid={TID.admin.nav} className="lg:border-r border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-6 flex flex-col gap-6">
        <div>
          <Link to="/" className="serif text-2xl block">Gullak</Link>
          <div className="overline mt-1">Studio Admin</div>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, Icon }) => {
            const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
            return (
              <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${active ? "bg-[color:var(--surface-2)] text-[color:var(--ink-1)]" : "text-[color:var(--ink-2)] hover:bg-[color:var(--surface-2)]"}`}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">
          <div className="text-xs text-[color:var(--ink-3)] mb-2">{admin.email}</div>
          <button onClick={logout} className="text-sm inline-flex items-center gap-2 text-[color:var(--ink-2)] hover:text-[color:var(--brand)]">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
