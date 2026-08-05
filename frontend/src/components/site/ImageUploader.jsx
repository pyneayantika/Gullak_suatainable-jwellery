import React, { useRef, useState } from "react";
import { api, API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Upload, X, Loader2, GripVertical } from "lucide-react";

/**
 * ImageUploader
 * - multi: single URL string or array of URL strings
 * - onChange(value): called with updated value
 * - label / hint / max
 * The stored URLs are relative like "/api/uploads/<hash>.jpg" which the browser can hit via same-origin,
 * but we also support absolute Unsplash URLs for legacy content.
 */
export default function ImageUploader({ label, value, onChange, multi = false, max = 8, hint }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const images = multi ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

  const handleFiles = async (files) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    setBusy(true);
    const uploaded = [];
    try {
      for (const file of list) {
        if (multi && images.length + uploaded.length >= max) break;
        const fd = new FormData();
        fd.append("file", file);
        try {
          const res = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
          uploaded.push(res.data.url);
        } catch (err) {
          toast.error(err?.response?.data?.detail || `Upload failed for ${file.name}`);
        }
      }
      if (uploaded.length > 0) {
        toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
        if (multi) onChange([...(images || []), ...uploaded].slice(0, max));
        else onChange(uploaded[0]);
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (i) => {
    if (multi) {
      const next = images.filter((_, idx) => idx !== i);
      onChange(next);
    } else {
      onChange("");
    }
  };

  const addByUrl = () => {
    const url = window.prompt("Paste image URL");
    if (!url) return;
    if (multi) onChange([...(images || []), url.trim()].slice(0, max));
    else onChange(url.trim());
  };

  const resolveSrc = (u) => {
    if (!u) return "";
    if (u.startsWith("http")) return u;
    // Convert relative /api/uploads/... to absolute using REACT_APP_BACKEND_URL
    return `${process.env.REACT_APP_BACKEND_URL}${u}`;
  };

  // Drag reorder (multi only)
  const dragIdx = useRef(null);
  const onDragStart = (i) => (e) => { dragIdx.current = i; e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (i) => (e) => {
    e.preventDefault();
    const from = dragIdx.current;
    if (from == null || from === i) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(i, 0, item);
    onChange(next);
    dragIdx.current = null;
  };

  return (
    <div>
      {label && <div className="overline mb-1.5">{label}</div>}
      <div className="rounded-xl border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--bg)] p-3">
        {images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${multi ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"}`}>
            {images.map((u, i) => (
              <div
                key={i}
                draggable={multi}
                onDragStart={onDragStart(i)}
                onDragOver={onDragOver}
                onDrop={onDrop(i)}
                className="relative group aspect-square rounded-lg overflow-hidden bg-[color:var(--surface-2)]"
              >
                <img src={resolveSrc(u)} alt={`Uploaded ${i + 1}`} className="h-full w-full object-cover" />
                {multi && (
                  <div className="absolute top-1 left-1 h-6 w-6 rounded-full bg-[rgba(255,252,247,0.9)] inline-flex items-center justify-center text-[10px] font-medium">{i + 1}</div>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="Remove"
                  className="absolute top-1 right-1 h-7 w-7 rounded-full bg-[rgba(20,17,16,0.75)] text-white inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {multi && (
                  <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-[rgba(255,252,247,0.85)] inline-flex items-center justify-center cursor-move">
                    <GripVertical className="h-3 w-3 text-[color:var(--ink-2)]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            className={`press-btn inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-4 py-2 text-xs cursor-pointer hover:bg-[color:var(--brand-2)] ${busy ? "opacity-70 pointer-events-none" : ""}`}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {busy ? "Uploading…" : (multi ? "Upload images" : (images.length ? "Replace image" : "Upload image"))}
            <input ref={inputRef} type="file" accept="image/*" multiple={multi} onChange={(e) => handleFiles(e.target.files)} className="hidden" />
          </label>
          <button type="button" onClick={addByUrl} className="press-btn rounded-full border border-[color:var(--border-subtle)] px-4 py-2 text-xs hover:bg-[color:var(--surface-2)]">
            Add by URL
          </button>
          <span className="text-[11px] text-[color:var(--ink-3)]">{hint || (multi ? `Drag to reorder • up to ${max} images • 8MB each` : "JPG, PNG, WEBP • up to 8MB")}</span>
        </div>
      </div>
    </div>
  );
}
