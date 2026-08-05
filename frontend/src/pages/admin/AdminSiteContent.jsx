import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Layout, Heart, RefreshCw, Eye } from "lucide-react";

const DEFAULTS = {
  hero: {
    tagline: "Natural  ·  Ethical  ·  Timeless",
    headline_line1: "Wear Nature.",
    headline_line2: "Wear Stories.",
    headline_line3: "Wear Craft.",
    cta_primary_text: "Shop Now",
    cta_primary_link: "/collections/terracotta",
    cta_secondary_text: "Discover the Craft",
    cta_secondary_link: "/craftsmanship",
    stat1_value: "100%",
    stat1_label: "Handcrafted",
    stat2_value: "3",
    stat2_label: "Artisan families",
    stat3_value: "7",
    stat3_label: "Steps per piece",
  },
  promise: {
    overline: "Our promise",
    heading: "A quieter kind of luxury.",
    body1: "At Gullak, luxury is not measured in metals or excess. It's measured in the hours a craftsman held a piece, in the seasons its clay dried, in the story it will carry from one wrist to another.",
    body2: "Every piece is handmade, packaged in seed paper and cotton, and shipped in kraft — zero plastic, from earth to earlobe.",
    promise1_key: "Handmade",
    promise1_value: "By artisan families",
    promise2_key: "Zero-plastic",
    promise2_value: "Seed paper + cotton",
    promise3_key: "Fair-trade",
    promise3_value: "Direct to makers",
  },
};

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-[color:var(--ink-1)]">{label}</Label>
      {hint && <p className="text-xs text-[color:var(--ink-3)]">{hint}</p>}
      {children}
    </div>
  );
}

export default function AdminSiteContent() {
  const [content, setContent] = useState({ ...DEFAULTS, header_logo_size: 72 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const { setSettings } = useSiteSettings();

  useEffect(() => {
    api.get("/site-content")
      .then(r => {
        const data = r.data;
        setContent({
          hero: { ...DEFAULTS.hero, ...data.hero },
          promise: { ...DEFAULTS.promise, ...data.promise },
          header_logo_size: data.header_logo_size || 72,
        });
        if (data.updated_at) setLastSaved(new Date(data.updated_at).toLocaleString());
      })
      .catch(() => toast.error("Could not load site content"))
      .finally(() => setLoading(false));
  }, []);

  const setHero = (key, val) => setContent(c => ({ ...c, hero: { ...c.hero, [key]: val } }));
  const setPromise = (key, val) => setContent(c => ({ ...c, promise: { ...c.promise, [key]: val } }));
  const setLogoSize = (val) => setContent(c => ({ ...c, header_logo_size: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await api.put("/admin/site-content", content);
      if (r.data.updated_at) setLastSaved(new Date(r.data.updated_at).toLocaleString());
      // Push logo size live to the header without page reload
      setSettings(s => ({ ...s, header_logo_size: content.header_logo_size || 72 }));
      toast.success("Site content saved! Changes are live.");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setContent(DEFAULTS);
    toast.info("Reset to defaults — click Save to apply.");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <RefreshCw className="h-6 w-6 animate-spin text-[color:var(--ink-3)]" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="serif text-3xl">Site Content</h1>
          <p className="mt-1 text-sm text-[color:var(--ink-3)]">
            Edit the homepage hero banner and Our Promise section. Changes go live instantly on save.
          </p>
          {lastSaved && (
            <p className="mt-1 text-xs text-[color:var(--ink-3)]">Last saved: {lastSaved}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("/", "_blank")}
            className="gap-1.5"
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-[color:var(--ink-3)]"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </Button>
          <Button
            data-testid="save-site-content-btn"
            onClick={handleSave}
            disabled={saving}
            className="gap-1.5 bg-[color:var(--brand)] hover:bg-[color:var(--brand-2)] text-white"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="mb-6">
          <TabsTrigger value="hero" className="gap-2">
            <Layout className="h-4 w-4" /> Hero Banner
          </TabsTrigger>
          <TabsTrigger value="promise" className="gap-2">
            <Heart className="h-4 w-4" /> Our Promise
          </TabsTrigger>
        </TabsList>

        {/* ── HERO BANNER TAB ── */}
        <TabsContent value="hero" className="space-y-6">

          {/* Logo Size */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Header Logo Size</CardTitle>
              <CardDescription>Drag to resize the Gullak logo in the header bar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  data-testid="logo-size-slider"
                  type="range"
                  min={36}
                  max={140}
                  step={2}
                  value={content.header_logo_size || 72}
                  onChange={e => setLogoSize(Number(e.target.value))}
                  className="flex-1 accent-[color:var(--brand)] h-2 cursor-pointer"
                />
                <div className="w-16 text-center rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface)] py-1.5 text-sm font-semibold text-[color:var(--ink-1)]">
                  {content.header_logo_size || 72}px
                </div>
              </div>
              {/* Live preview */}
              <div className="rounded-xl bg-[#FAF6EF] border border-[color:var(--border-subtle)] px-6 flex items-center gap-6"
                style={{ height: `${Math.max((content.header_logo_size || 72) + 28, 72)}px` }}>
                <img
                  src="/logo.png"
                  alt="Gullak"
                  style={{ height: `${content.header_logo_size || 72}px`, width: "auto" }}
                  className="object-contain"
                />
                <div className="flex gap-7">
                  {["Home","Collection","About","Journal"].map(l => (
                    <span key={l} className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#4A3728]">{l}</span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[color:var(--ink-3)]">Tip: 44–80px looks best for most screens. Save to apply across the site.</p>
            </CardContent>
          </Card>

          {/* Tagline + Headline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Headline & Tagline</CardTitle>
              <CardDescription>The main text displayed over the cinematic hero image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field label="Tagline" hint='Displayed below the logo (e.g. "Natural · Ethical · Timeless")'>
                <Input
                  data-testid="hero-tagline-input"
                  value={content.hero.tagline}
                  onChange={e => setHero("tagline", e.target.value)}
                  placeholder="Natural · Ethical · Timeless"
                />
              </Field>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Headline Line 1">
                  <Input
                    data-testid="hero-line1-input"
                    value={content.hero.headline_line1}
                    onChange={e => setHero("headline_line1", e.target.value)}
                    placeholder="Wear Nature."
                  />
                </Field>
                <Field label="Headline Line 2 (accent)">
                  <Input
                    data-testid="hero-line2-input"
                    value={content.hero.headline_line2}
                    onChange={e => setHero("headline_line2", e.target.value)}
                    placeholder="Wear Stories."
                  />
                </Field>
                <Field label="Headline Line 3">
                  <Input
                    data-testid="hero-line3-input"
                    value={content.hero.headline_line3}
                    onChange={e => setHero("headline_line3", e.target.value)}
                    placeholder="Wear Craft."
                  />
                </Field>
              </div>
              {/* Live preview */}
              <div className="rounded-xl bg-[#2B2420] px-6 py-5 text-center space-y-1">
                <p className="text-[11px] tracking-[0.25em] uppercase text-[#EFE3D0] opacity-80">{content.hero.tagline}</p>
                <p className="font-serif text-2xl text-[#FAF6EF]">{content.hero.headline_line1}</p>
                <p className="font-serif text-2xl italic" style={{ color: "#D49570" }}>{content.hero.headline_line2}</p>
                <p className="font-serif text-2xl text-[#FAF6EF]">{content.hero.headline_line3}</p>
              </div>
            </CardContent>
          </Card>

          {/* CTAs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Call-to-Action Buttons</CardTitle>
              <CardDescription>Two buttons displayed below the headline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Primary button text">
                  <Input
                    data-testid="hero-cta-primary-text"
                    value={content.hero.cta_primary_text}
                    onChange={e => setHero("cta_primary_text", e.target.value)}
                    placeholder="Shop Now"
                  />
                </Field>
                <Field label="Primary button link">
                  <Input
                    data-testid="hero-cta-primary-link"
                    value={content.hero.cta_primary_link}
                    onChange={e => setHero("cta_primary_link", e.target.value)}
                    placeholder="/collections/terracotta"
                  />
                </Field>
                <Field label="Secondary button text">
                  <Input
                    data-testid="hero-cta-secondary-text"
                    value={content.hero.cta_secondary_text}
                    onChange={e => setHero("cta_secondary_text", e.target.value)}
                    placeholder="Discover the Craft"
                  />
                </Field>
                <Field label="Secondary button link">
                  <Input
                    data-testid="hero-cta-secondary-link"
                    value={content.hero.cta_secondary_link}
                    onChange={e => setHero("cta_secondary_link", e.target.value)}
                    placeholder="/craftsmanship"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Stats strip */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stats Strip</CardTitle>
              <CardDescription>Three numbers displayed at the bottom of the hero.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map(n => (
                  <div key={n} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--ink-3)]">Stat {n}</p>
                    <Field label="Value">
                      <Input
                        data-testid={`hero-stat${n}-value`}
                        value={content.hero[`stat${n}_value`]}
                        onChange={e => setHero(`stat${n}_value`, e.target.value)}
                        placeholder="100%"
                      />
                    </Field>
                    <Field label="Label">
                      <Input
                        data-testid={`hero-stat${n}-label`}
                        value={content.hero[`stat${n}_label`]}
                        onChange={e => setHero(`stat${n}_label`, e.target.value)}
                        placeholder="Handcrafted"
                      />
                    </Field>
                  </div>
                ))}
              </div>
              {/* Stats preview */}
              <div className="mt-5 rounded-xl bg-[#1A1110] px-6 py-4 flex items-center justify-center gap-8 sm:gap-14">
                {[1, 2, 3].map((n, i) => (
                  <React.Fragment key={n}>
                    {i > 0 && <div className="w-px h-8 bg-[rgba(250,246,239,0.15)]" />}
                    <div className="text-center">
                      <div className="font-serif text-xl text-[#FAF6EF]">{content.hero[`stat${n}_value`]}</div>
                      <div className="mt-0.5 text-[10px] tracking-[0.12em] uppercase text-[rgba(239,227,208,0.65)]">{content.hero[`stat${n}_label`]}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── OUR PROMISE TAB ── */}
        <TabsContent value="promise" className="space-y-6">

          {/* Heading */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Section Heading</CardTitle>
              <CardDescription>The overline label and main heading of the Our Promise section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Overline (small label)">
                <Input
                  data-testid="promise-overline-input"
                  value={content.promise.overline}
                  onChange={e => setPromise("overline", e.target.value)}
                  placeholder="Our promise"
                />
              </Field>
              <Field label="Section heading">
                <Input
                  data-testid="promise-heading-input"
                  value={content.promise.heading}
                  onChange={e => setPromise("heading", e.target.value)}
                  placeholder="A quieter kind of luxury."
                />
              </Field>
              {/* Preview */}
              <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-5 py-4">
                <p className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--brand)] font-medium">{content.promise.overline}</p>
                <p className="mt-2 font-serif text-2xl text-[color:var(--ink-1)]">{content.promise.heading}</p>
              </div>
            </CardContent>
          </Card>

          {/* Body copy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Body Copy</CardTitle>
              <CardDescription>Two paragraphs displayed next to the jewellery image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Paragraph 1">
                <Textarea
                  data-testid="promise-body1-input"
                  value={content.promise.body1}
                  onChange={e => setPromise("body1", e.target.value)}
                  rows={3}
                  placeholder="At Gullak, luxury is not measured in metals or excess…"
                />
              </Field>
              <Field label="Paragraph 2">
                <Textarea
                  data-testid="promise-body2-input"
                  value={content.promise.body2}
                  onChange={e => setPromise("body2", e.target.value)}
                  rows={3}
                  placeholder="Every piece is handmade, packaged in seed paper…"
                />
              </Field>
            </CardContent>
          </Card>

          {/* Promise cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Promise Cards</CardTitle>
              <CardDescription>Three small cards shown below the body copy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--ink-3)]">Card {n}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Card title">
                      <Input
                        data-testid={`promise-card${n}-key`}
                        value={content.promise[`promise${n}_key`]}
                        onChange={e => setPromise(`promise${n}_key`, e.target.value)}
                        placeholder="Handmade"
                      />
                    </Field>
                    <Field label="Card subtitle">
                      <Input
                        data-testid={`promise-card${n}-value`}
                        value={content.promise[`promise${n}_value`]}
                        onChange={e => setPromise(`promise${n}_value`, e.target.value)}
                        placeholder="By artisan families"
                      />
                    </Field>
                  </div>
                </div>
              ))}
              {/* Cards preview */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[1, 2, 3].map(n => (
                  <div key={n} className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-4">
                    <div className="font-serif text-base text-[color:var(--ink-1)]">{content.promise[`promise${n}_key`]}</div>
                    <div className="text-xs text-[color:var(--ink-3)] mt-1">{content.promise[`promise${n}_value`]}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating save bar */}
      <div className="sticky bottom-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 shadow-lg bg-[color:var(--brand)] hover:bg-[color:var(--brand-2)] text-white px-6"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save all changes"}
        </Button>
      </div>

    </div>
  );
}
