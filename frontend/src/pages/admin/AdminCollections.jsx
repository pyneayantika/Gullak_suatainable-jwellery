import React, { useEffect, useState } from "react";
import { api, resolveImg } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ImageUploader from "@/components/site/ImageUploader";

const empty = { name: "", slug: "", subtitle: "", description: "", hero_image: "", banner_image: "", material: "", status: "active", order: 10 };

export default function AdminCollections() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => { const r = await api.get("/admin/collections"); setItems(r.data); };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, order: parseInt(form.order, 10) || 10 };
      if (editing) await api.put(`/admin/collections/${editing.id}`, payload);
      else await api.post("/admin/collections", payload);
      toast.success(editing ? "Updated" : "Created");
      setOpen(false); load();
    } catch (err) { toast.error(err?.response?.data?.detail || "Failed"); }
  };

  const del = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    await api.delete(`/admin/collections/${p.id}`);
    toast("Deleted"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><div className="overline">Catalog</div><h1 className="mt-2 serif text-4xl tracking-[-0.02em]">Collections</h1></div>
        <button onClick={() => { setEditing(null); setForm(empty); setOpen(true); }} className="press-btn inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--brand-2)]"><Plus className="h-4 w-4" /> New collection</button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(c => (
          <div key={c.id} className="rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
            <div className="aspect-[4/3] overflow-hidden"><img src={resolveImg(c.hero_image)} alt={c.name} className="h-full w-full object-cover" /></div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="serif text-lg">{c.name}</div>
                  <div className="text-xs text-[color:var(--ink-3)]">/{c.slug} • {c.status}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(c); setForm({ ...empty, ...c }); setOpen(true); }} className="h-8 w-8 rounded-full hover:bg-[color:var(--surface-2)] inline-flex items-center justify-center"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(c)} className="h-8 w-8 rounded-full hover:bg-[color:var(--surface-2)] text-[color:var(--brand)] inline-flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="serif text-2xl">{editing ? "Edit collection" : "New collection"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <F label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <F label="Slug (optional)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="auto-generated" />
            <F label="Subtitle" value={form.subtitle || ""} onChange={(v) => setForm({ ...form, subtitle: v })} />
            <F label="Material" value={form.material} onChange={(v) => setForm({ ...form, material: v })} required />
            <ImageUploader label="Hero image" value={form.hero_image} onChange={(v) => setForm({ ...form, hero_image: v })} />
            <div className="space-y-1">
              <ImageUploader label="Banner image — cinematic full-bleed hero" value={form.banner_image || ""} onChange={(v) => setForm({ ...form, banner_image: v })} />
              <p className="text-[11px] text-[color:var(--ink-3)] pl-1">When uploaded, the collection page shows a full-width atmospheric hero instead of the split layout.</p>
            </div>
            <F label="Order" type="number" value={form.order} onChange={(v) => setForm({ ...form, order: v })} />
            <label className="block"><span className="overline block mb-1.5">Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm">
                <option value="active">Active</option><option value="coming_soon">Coming soon</option>
              </select>
            </label>
            <TA label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="press-btn rounded-full border border-[color:var(--border-subtle)] px-5 py-2.5 text-sm hover:bg-[color:var(--surface-2)]">Cancel</button>
              <button type="submit" className="press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--brand-2)]">{editing ? "Save" : "Create"}</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, value, onChange, ...rest }) { return (<label className="block"><span className="overline block mb-1.5">{label}</span><input value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]" /></label>); }
function TA({ label, value, onChange, ...rest }) { return (<label className="block"><span className="overline block mb-1.5">{label}</span><textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]" /></label>); }
