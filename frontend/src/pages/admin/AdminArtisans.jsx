import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const empty = { name: "", slug: "", craft: "", region: "", story: "", portrait: "", workshop_images: [], years_of_practice: 0 };

export default function AdminArtisans() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => { const r = await api.get("/admin/artisans"); setItems(r.data); };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, years_of_practice: parseInt(form.years_of_practice, 10) || 0 };
    try {
      if (editing) await api.put(`/admin/artisans/${editing.id}`, payload);
      else await api.post("/admin/artisans", payload);
      toast.success(editing ? "Updated" : "Created");
      setOpen(false); load();
    } catch (err) { toast.error(err?.response?.data?.detail || "Failed"); }
  };

  const del = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    await api.delete(`/admin/artisans/${p.id}`);
    toast("Deleted"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><div className="overline">Community</div><h1 className="mt-2 serif text-4xl tracking-[-0.02em]">Artisans</h1></div>
        <button onClick={() => { setEditing(null); setForm(empty); setOpen(true); }} className="press-btn inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--brand-2)]"><Plus className="h-4 w-4" /> New artisan</button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(a => (
          <div key={a.id} className="rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
            <div className="aspect-[3/4] overflow-hidden"><img src={a.portrait} alt={a.name} className="h-full w-full object-cover" /></div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="serif text-lg">{a.name}</div>
                  <div className="text-xs text-[color:var(--ink-3)]">{a.craft} • {a.region}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(a); setForm({ ...empty, ...a, workshop_images: a.workshop_images || [] }); setOpen(true); }} className="h-8 w-8 rounded-full hover:bg-[color:var(--surface-2)] inline-flex items-center justify-center"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(a)} className="h-8 w-8 rounded-full hover:bg-[color:var(--surface-2)] text-[color:var(--brand)] inline-flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="serif text-2xl">{editing ? "Edit artisan" : "New artisan"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <F label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <F label="Slug (optional)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="auto-generated" />
            <F label="Craft" value={form.craft} onChange={(v) => setForm({ ...form, craft: v })} required />
            <F label="Region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} required />
            <F label="Years of practice" type="number" value={form.years_of_practice} onChange={(v) => setForm({ ...form, years_of_practice: v })} />
            <F label="Portrait URL" value={form.portrait} onChange={(v) => setForm({ ...form, portrait: v })} />
            <F label="Workshop images (comma-separated URLs)" value={(form.workshop_images || []).join(", ")} onChange={(v) => setForm({ ...form, workshop_images: v.split(",").map(s => s.trim()).filter(Boolean) })} />
            <TA label="Story" value={form.story} onChange={(v) => setForm({ ...form, story: v })} rows={5} />
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
