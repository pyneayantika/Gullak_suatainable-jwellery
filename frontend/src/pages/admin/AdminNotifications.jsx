import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Trash2, Mail, Download } from "lucide-react";

export default function AdminNotifications() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    try { const r = await api.get("/admin/notifications"); setItems(r.data); } catch(_){}
  };
  useEffect(() => { load(); }, []);

  const del = async (nid) => {
    if (!window.confirm("Remove this signup?")) return;
    await api.delete(`/admin/notifications/${nid}`);
    toast("Removed");
    load();
  };

  const bySlug = items.reduce((acc, it) => {
    (acc[it.collection_slug] ||= { name: it.collection_name, slug: it.collection_slug, items: [] }).items.push(it);
    return acc;
  }, {});
  const groups = Object.values(bySlug).sort((a, b) => b.items.length - a.items.length);
  const filtered = filter === "all" ? groups : groups.filter(g => g.slug === filter);

  const exportCSV = () => {
    const rows = [["Collection", "Email", "Signed up at"]];
    items.forEach(it => rows.push([it.collection_name, it.email, it.created_at]));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "gullak-notify-signups.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="overline">Launch signups</div>
          <h1 className="mt-2 serif text-4xl tracking-[-0.02em]">Notify-me List</h1>
          <p className="mt-2 text-sm text-[color:var(--ink-3)]">Emails waiting quietly for each coming-soon collection.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-2 text-sm">
            <option value="all">All collections</option>
            {groups.map(g => <option key={g.slug} value={g.slug}>{g.name} ({g.items.length})</option>)}
          </select>
          <button onClick={exportCSV} disabled={items.length === 0} className="press-btn inline-flex items-center gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-2 text-sm hover:bg-[color:var(--surface-2)] disabled:opacity-50">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="mt-10 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-12 text-center">
          <Mail className="h-6 w-6 mx-auto text-[color:var(--brand)]" />
          <div className="mt-3 serif text-2xl">No signups yet.</div>
          <p className="mt-2 text-sm text-[color:var(--ink-3)]">When someone taps "Notify me" on a coming-soon collection, they'll appear here.</p>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {filtered.map(g => (
          <div key={g.slug} className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[color:var(--border-subtle)] flex items-center justify-between">
              <div>
                <div className="serif text-xl">{g.name}</div>
                <div className="text-xs text-[color:var(--ink-3)]">/collections/{g.slug}</div>
              </div>
              <div className="serif text-2xl text-[color:var(--brand)]">{g.items.length}</div>
            </div>
            <div>
              {g.items.map(it => (
                <div key={it.id} className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 items-center border-b border-[color:var(--border-subtle)] last:border-0 text-sm">
                  <div>
                    <div className="text-[color:var(--ink-1)]">{it.email}</div>
                    <div className="text-xs text-[color:var(--ink-3)]">Signed up {new Date(it.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--ink-3)]">{it.notified ? "Notified" : "Waiting"}</div>
                  <button onClick={() => del(it.id)} aria-label="Remove" className="h-8 w-8 rounded-full hover:bg-[color:var(--surface-2)] text-[color:var(--brand)] inline-flex items-center justify-center">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
