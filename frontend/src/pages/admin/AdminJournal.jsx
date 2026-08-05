import React, { useEffect, useState } from "react";
import { api, resolveImg } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ImageUploader from "@/components/site/ImageUploader";

const empty = { title: "", slug: "", subtitle: "", category: "Journal", excerpt: "", body: "", cover_image: "", author: "Gullak Studio", read_time: "4 min read", published: true };

export default function AdminJournal() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => { const r = await api.get("/admin/journal"); setItems(r.data); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...empty, ...p }); setOpen(true); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/admin/journal/${editing.id}`, form);
      else await api.post("/admin/journal", form);
      toast.success(editing ? "Updated" : "Published");
      setOpen(false); load();
    } catch (err) { toast.error(err?.response?.data?.detail || "Failed"); }
  };

  const del = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    await api.delete(`/admin/journal/${p.id}`);
    toast("Deleted"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><div className="overline">Editorial</div><h1 className="mt-2 serif text-4xl tracking-[-0.02em]">Journal</h1></div>
        <button onClick={openCreate} className="press-btn inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--brand-2)]"><Plus className="h-4 w-4" /> New article</button>
      </div>

      <div className="mt-8 rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] overflow-hidden">
        {items.map(p => (
          <div key={p.id} className="grid grid-cols-[80px_1.5fr_1fr_100px_100px] gap-4 px-4 py-3 items-center border-b border-[color:var(--border-subtle)] last:border-0">
            <img src={resolveImg(p.cover_image)} alt={p.title} className="h-14 w-14 rounded-lg object-cover bg-[color:var(--surface-2)]" />
            <div>
              <div className="serif text-lg leading-tight">{p.title}</div>
              <div className="text-xs text-[color:var(--ink-3)]">/{p.slug}</div>
            </div>
            <div className="text-sm">{p.category}</div>
            <div className="text-xs">{p.published ? "Published" : "Draft"}</div>
            <div className="flex justify-end gap-2">
              <button onClick={() => openEdit(p)} className="h-8 w-8 rounded-full hover:bg-[color:var(--surface-2)] inline-flex items-center justify-center"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => del(p)} className="h-8 w-8 rounded-full hover:bg-[color:var(--surface-2)] text-[color:var(--brand)] inline-flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="p-8 text-center text-sm text-[color:var(--ink-3)]">No articles yet.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="serif text-2xl">{editing ? "Edit article" : "New article"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <F label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <F label="Slug (optional)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="auto-generated" />
            <F label="Subtitle" value={form.subtitle || ""} onChange={(v) => setForm({ ...form, subtitle: v })} />
            <F label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            <ImageUploader label="Cover image" value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} />
            <F label="Read time" value={form.read_time} onChange={(v) => setForm({ ...form, read_time: v })} />
            <TA label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} rows={2} />
            <TA label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} rows={8} />
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="press-btn rounded-full border border-[color:var(--border-subtle)] px-5 py-2.5 text-sm hover:bg-[color:var(--surface-2)]">Cancel</button>
              <button type="submit" className="press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--brand-2)]">{editing ? "Save" : "Publish"}</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, value, onChange, ...rest }) {
  return (
    <label className="block">
      <span className="overline block mb-1.5">{label}</span>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]" />
    </label>
  );
}
function TA({ label, value, onChange, ...rest }) {
  return (
    <label className="block">
      <span className="overline block mb-1.5">{label}</span>
      <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]" />
    </label>
  );
}
