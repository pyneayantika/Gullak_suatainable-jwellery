import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Save, RefreshCw, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const MIN = 24;
const MAX = 64;
const DEFAULT = 44;

export default function AdminLogoSize() {
  const [size, setSize] = useState(DEFAULT);
  const [saved, setSaved] = useState(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setSettings } = useSiteSettings();

  useEffect(() => {
    api.get("/site-content")
      .then(r => {
        const s = r.data?.header_logo_size || DEFAULT;
        setSize(s);
        setSaved(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Push live preview to header instantly on drag
  useEffect(() => {
    setSettings(s => ({ ...s, header_logo_size: size }));
  }, [size]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const current = await api.get("/site-content");
      await api.put("/admin/site-content", {
        ...current.data,
        header_logo_size: size,
      });
      setSaved(size);
      toast.success("Logo size saved!");
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const headerHeight = Math.max(size + 28, 64);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <RefreshCw className="h-5 w-5 animate-spin text-[color:var(--ink-3)]" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">

      {/* Page header */}
      <div>
        <h1 className="serif text-3xl text-[color:var(--ink-1)]">Header Logo Size</h1>
        <p className="mt-1 text-sm text-[color:var(--ink-3)]">
          Drag the slider to resize the Gullak logo in the site header. Changes preview live.
        </p>
      </div>

      {/* Live preview card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[color:var(--ink-3)] uppercase tracking-wider">Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Transparent header simulation */}
          <div
            className="w-full bg-[#2B1A0F] flex items-center px-8 justify-between transition-all duration-200"
            style={{ height: `${headerHeight}px` }}
          >
            <img
              src="/logo.png"
              alt="Gullak"
              style={{ height: `${size}px`, width: "auto" }}
              className="object-contain brightness-0 invert transition-all duration-200"
            />
            <div className="flex gap-8">
              {["HOME", "COLLECTION", "ABOUT", "JOURNAL"].map(l => (
                <span key={l} className="text-[11px] font-semibold tracking-[0.14em] text-[rgba(250,246,239,0.75)]">{l}</span>
              ))}
            </div>
            <div className="flex gap-3 opacity-60">
              {["♡", "🛍", "👤"].map((i, k) => (
                <span key={k} className="text-[rgba(250,246,239,0.75)] text-sm">{i}</span>
              ))}
            </div>
          </div>

          {/* Solid header simulation */}
          <div
            className="w-full bg-[rgba(250,246,239,0.97)] border-t border-[#E0D5C3] flex items-center px-8 justify-between transition-all duration-200"
            style={{ height: `${headerHeight}px` }}
          >
            <img
              src="/logo.png"
              alt="Gullak"
              style={{ height: `${size}px`, width: "auto" }}
              className="object-contain transition-all duration-200"
            />
            <div className="flex gap-8">
              {["HOME", "COLLECTION", "ABOUT", "JOURNAL"].map(l => (
                <span key={l} className="text-[11px] font-semibold tracking-[0.14em] text-[#4A3728]">{l}</span>
              ))}
            </div>
            <div className="flex gap-2 opacity-50">
              <div className="w-5 h-5 rounded-full border border-[#4A3728]" />
              <div className="w-5 h-5 rounded-full border border-[#4A3728]" />
              <div className="w-5 h-5 rounded-full border border-[#4A3728]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slider control */}
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[color:var(--ink-1)]">Logo height</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSize(s => Math.max(MIN, s - 2))}
                className="h-7 w-7 rounded-full border border-[color:var(--border-subtle)] flex items-center justify-center hover:bg-[color:var(--surface-2)] transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-16 text-center text-lg font-semibold text-[color:var(--brand)]">
                {size}px
              </span>
              <button
                onClick={() => setSize(s => Math.min(MAX, s + 2))}
                className="h-7 w-7 rounded-full border border-[color:var(--border-subtle)] flex items-center justify-center hover:bg-[color:var(--surface-2)] transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              data-testid="logo-size-slider"
              type="range"
              min={MIN}
              max={MAX}
              step={1}
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[color:var(--brand)]"
              style={{
                background: `linear-gradient(to right, var(--brand) 0%, var(--brand) ${((size - MIN) / (MAX - MIN)) * 100}%, #E0D5C3 ${((size - MIN) / (MAX - MIN)) * 100}%, #E0D5C3 100%)`
              }}
            />
            <div className="flex justify-between mt-1.5 text-[10px] text-[color:var(--ink-3)]">
              <span>{MIN}px — compact</span>
              <span>{DEFAULT}px — balanced</span>
              <span>{MAX}px — prominent</span>
            </div>
          </div>

          {/* Preset buttons */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Compact", val: 28 },
              { label: "Balanced", val: 44 },
              { label: "Prominent", val: 56 },
            ].map(p => (
              <button
                key={p.label}
                onClick={() => setSize(p.val)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide border transition-colors ${
                  size === p.val
                    ? "bg-[color:var(--brand)] text-white border-[color:var(--brand)]"
                    : "border-[color:var(--border-subtle)] text-[color:var(--ink-2)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                }`}
              >
                {p.label} — {p.val}px
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex items-center justify-between pt-1">
        {size !== saved ? (
          <p className="text-xs text-amber-600 font-medium">● Unsaved changes</p>
        ) : (
          <p className="text-xs text-[color:var(--ink-3)]">✓ Saved at {saved}px</p>
        )}
        <Button
          data-testid="save-logo-size-btn"
          onClick={handleSave}
          disabled={saving || size === saved}
          className="gap-2 bg-[color:var(--brand)] hover:bg-[color:var(--brand-2)] text-white"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save size"}
        </Button>
      </div>

    </div>
  );
}
