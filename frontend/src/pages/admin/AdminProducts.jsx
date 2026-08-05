import React, { useEffect, useState } from "react";
import { api, formatINR } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { TID } from "@/lib/testIds";

const empty = {
  name: "", slug: "", subtitle: "", price: 0, currency: "INR", collection_slug: "terracotta", material: "Terracotta",
  story: "", material_info: "", care_guide: "", packaging: "", dimensions: "", weight: "",
  images: [], lifestyle_images: [], artisan_id: "", featured: false, in_stock: true,
};

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [p, c, a] = await Promise.all([
      api.get("/admin/products"),
      api.get("/admin/collections"),
      api.get("/admin/artisans"),
    ]);
    setItems(p.data); setCollections(c.data); setArtisans(a.data);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...empty, ...p, images: p.images || [], lifestyle_images: p.lifestyle_images || [] });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price) || 0 };
    try {
      if (editing) await api.put(`/admin/products/${editing.id}`, payload);
      else await api.post("/admin/products", payload);
      toast.success(editing ? "Product updated" : "Product created");
      setOpen(false);
      load();
    } catch (err) { toast.error(err?.response?.data?.detail || "Failed"); }
  };

  const del = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    await api.delete(`/admin/products/${p.id}`);
    toast("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="overline">Catalog</div>
          <h1 className="mt-2 serif text-4xl tracking-[-0.02em]">Products</h1>
        </div>
        <button data-testid={TID.admin.createProduct} onClick={openCreate} className="press-btn inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--brand-2)]">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div data-testid={TID.admin.productsTable} className="mt-8 rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] overflow-hidden">
        <div className="grid grid-cols-[80px_1.5fr_1fr_1fr_100px_100px] gap-4 px-4 py-3 text-xs overline border-b border-[color:var(--border-subtle)]">
          <div>Image</div><div>Name</div><div>Collection</div><div>Material</div><div>Price</div><div className="text-right">Actions</div>
        </div>
        {items.map(p => (
          <div key={p.id} className="grid grid-cols-[80px_1.5fr_1fr_1fr_100px_100px] gap-4 px-4 py-3 items-center border-b border-[color:var(--border-subtle)] last:border-0">
            <img src={p.images?.[0]} alt={p.name} className="h-14 w-14 rounded-lg object-cover bg-[color:var(--surface-2)]" />
            <div>
              <div className="serif text-lg leading-tight">{p.name}</div>
              <div className="text-xs text-[color:var(--ink-3)]">/{p.slug} {p.featured && <span className="ml-2 text-[color:var(--brand)]">★ Featured</span>}</div>
            </div>
            <div className="text-sm">{p.collection_slug}</div>
            <div className="text-sm">{p.material}</div>
            <div className="text-sm">{formatINR(p.price)}</div>
            <div className="flex justify-end gap-2">
              <button onClick={() => openEdit(p)} className="h-8 w-8 rounded-full hover:bg-[color:var(--surface-2)] inline-flex items-center justify-center"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => del(p)} className="h-8 w-8 rounded-full hover:bg-[color:var(--surface-2)] text-[color:var(--brand)] inline-flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="p-8 text-center text-sm text-[color:var(--ink-3)]">No products yet.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="serif text-2xl">{editing ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <Row>
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field label="Slug (optional)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="auto-generated" />
            </Row>
            <Field label="Subtitle" value={form.subtitle || ""} onChange={(v) => setForm({ ...form, subtitle: v })} />
            <Row>
              <Field label="Price (INR)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
              <Select label="Collection" value={form.collection_slug} onChange={(v) => setForm({ ...form, collection_slug: v })} options={collections.map(c => ({ value: c.slug, label: c.name }))} />
            </Row>
            <Row>
              <Field label="Material" value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
              <Select label="Artisan" value={form.artisan_id || ""} onChange={(v) => setForm({ ...form, artisan_id: v })} options={[{ value: "", label: "— none —" }, ...artisans.map(a => ({ value: a.id, label: a.name }))]} />
            </Row>
            <Textarea label="Story" value={form.story} onChange={(v) => setForm({ ...form, story: v })} />
            <Row>
              <Textarea label="Material info" value={form.material_info} onChange={(v) => setForm({ ...form, material_info: v })} />
              <Textarea label="Care guide" value={form.care_guide} onChange={(v) => setForm({ ...form, care_guide: v })} />
            </Row>
            <Row>
              <Field label="Dimensions" value={form.dimensions} onChange={(v) => setForm({ ...form, dimensions: v })} />
              <Field label="Weight" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
            </Row>
            <Textarea label="Packaging" value={form.packaging} onChange={(v) => setForm({ ...form, packaging: v })} />
            <Field label="Images (comma-separated URLs)" value={(form.images || []).join(", ")} onChange={(v) => setForm({ ...form, images: v.split(",").map(s => s.trim()).filter(Boolean) })} />
            <Field label="Lifestyle images (comma-separated URLs)" value={(form.lifestyle_images || []).join(", ")} onChange={(v) => setForm({ ...form, lifestyle_images: v.split(",").map(s => s.trim()).filter(Boolean) })} />
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} /> In stock</label>
            </div>
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

function Row({ children }) { return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>; }
function Field({ label, value, onChange, ...rest }) {
  return (
    <label className="block">
      <span className="overline block mb-1.5">{label}</span>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]" />
    </label>
  );
}
function Textarea({ label, value, onChange, ...rest }) {
  return (
    <label className="block">
      <span className="overline block mb-1.5">{label}</span>
      <textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]" />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="overline block mb-1.5">{label}</span>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
