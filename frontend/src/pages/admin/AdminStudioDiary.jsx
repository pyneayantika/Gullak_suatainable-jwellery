import React, { useEffect, useState } from "react";
import { api, resolveImg } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import ImageUploader from "@/components/site/ImageUploader";

const empty = { image: "", caption: "", link: "", published: true };

export default function AdminStudioDiary() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try { const r = await api.get("/admin/studio-moments"); setItems(r.data); } catch(_){}
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.image) { toast.error("Please upload an image"); return; }
    try {
      if (editing) await api.put(`/admin/studio-moments/${editing.id}`, form);
      else await api.post("/admin/studio-moments", form);
      toast.success(editing ? "Moment updated" : "Moment posted");
      setOpen(false); load();
    } catch (err) { toast.error(err?.response?.data?.detail || "Failed"); }
  };

  const togglePublish = async (m) => {
    try {
      await api.put(`/admin/studio-moments/${m.id}`, { ...m, published: !m.published });
      toast(m.published ? "Hidden from home" : "Live on home");
      load();
    } catch (err) { toast.error("Could not update"); }
  };

  const del = async (m) => {
    if (!window.confirm("Delete this moment?")) return;
    await api.delete(`/admin/studio-moments/${m.id}`);
    toast("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="overline">Home page</div>
          <h1 className="mt-2 serif text-4xl tracking-[-0.02em]">Studio Diary</h1>
          <p className="mt-2 text-sm text-[color:var(--ink-3)] max-w-md">Small photo moments from the studio — appear in the Studio Diary grid on the home page, newest first.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}
          className="press-btn inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--brand-2)]"
        >
          <Plus className="h-4 w-4" /> New moment
        </button>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-12 text-center">
          <div className="serif text-2xl">Diary is quiet.</div>
          <p className="mt-2 text-sm text-[color:var(--ink-3)]">Post your first photo moment from the studio.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(m => (
            <div key={m.id} className="group rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
              <div className="relative aspect-square overflow-hidden">
                <img src={resolveImg(m.image)} alt={m.caption || "Moment"} className="h-full w-full object-cover" />
                {!m.published && (
                  <div className="absolute inset-0 bg-[rgba(20,17,16,0.55)] flex items-center justify-center">
                    <span className="text-xs uppercase tracking-widest text-white">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                {m.caption ? (
                  <p className="text-xs text-[color:var(--ink-2)] leading-snug line-clamp-2 min-h-[2rem]">{m.caption}</p>
                ) : (
                  <p className="text-xs text-[color:var(--ink-3)] italic">No caption</p>
                )}
                <div className="mt-2 flex items-center justify-between text-[10px] text-[color:var(--ink-3)]">
                  <span>{new Date(m.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => togglePublish(m)} aria-label={m.published ? "Hide" : "Show"} className="h-7 w-7 rounded-full hover:bg-[color:var(--surface-2)] inline-flex items-center justify-center">
                      {m.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => { setEditing(m); setForm({ ...empty, ...m }); setOpen(true); }} aria-label="Edit" className="h-7 w-7 rounded-full hover:bg-[color:var(--surface-2)] inline-flex items-center justify-center">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => del(m)} aria-label="Delete" className="h-7 w-7 rounded-full hover:bg-[color:var(--surface-2)] text-[color:var(--brand)] inline-flex items-center justify-center">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="serif text-2xl">{editing ? "Edit moment" : "New moment"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <ImageUploader label="Photo" value={form.image} onChange={(v) => setForm({ ...form, image: v })} hint="Square works best • JPG/PNG/WEBP • up to 8MB" />
            <label className="block">
              <span className="overline block mb-1.5">Caption (optional)</span>
              <textarea
                value={form.caption || ""}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                rows={2}
                maxLength={140}
                placeholder="A quiet line about the moment…"
                className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]"
              />
              <div className="mt-1 text-[10px] text-[color:var(--ink-3)] text-right">{(form.caption || "").length} / 140</div>
            </label>
            <label className="block">
              <span className="overline block mb-1.5">Link (optional)</span>
              <input
                value={form.link || ""}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                type="url"
                placeholder="https://…"
                className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]"
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Visible on home page
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="press-btn rounded-full border border-[color:var(--border-subtle)] px-5 py-2.5 text-sm hover:bg-[color:var(--surface-2)]">Cancel</button>
              <button type="submit" className="press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--brand-2)]">{editing ? "Save" : "Post moment"}</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
