import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, resolveImg } from "@/lib/api";
import { TID } from "@/lib/testIds";
import ProductCard from "@/components/site/ProductCard";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { GullakLogo } from "@/components/site/Logo";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Hand, Flame, Feather, Sparkles, Heart } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1771573391500-64cc1cbb3e7b?auto=format&fit=crop&w=2400&q=85";
const STORY_IMG = "https://customer-assets-0z36b82j.emergentagent.net/job_gullak-studio/artifacts/29q6zbc0_Screenshot%202026-08-06%20003310.png";
const MATERIAL_IMG = {
  terracotta: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
  wood: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80",
  bamboo: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80",
  fabric: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=1200&q=80",
  wool: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
  cork: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
};
const IG_IMAGES = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1594736797933-d0d3a4a1e40d?auto=format&fit=crop&w=800&q=80",
];

const PROCESS_STEPS = [
  { title: "Clay Selection", desc: "River clay, hand-gathered from small kilns across Rajasthan.", Icon: Leaf },
  { title: "Hand Sculpting", desc: "Each piece coaxed into form on a slow wheel or by fingertips.", Icon: Hand },
  { title: "Drying", desc: "Days of patient shade drying, letting the piece hold its shape.", Icon: Feather },
  { title: "Baking", desc: "Wood-fired kilns at 900°C — read by the smoke, not by clocks.", Icon: Flame },
  { title: "Painting", desc: "Ochre, indigo, river silt — pigments mixed by our painters.", Icon: Sparkles },
  { title: "Finishing", desc: "Sealed with beeswax; brass and cotton added by hand.", Icon: Hand },
  { title: "Ready to Wear", desc: "Boxed in kraft and cotton with a handwritten note.", Icon: Heart },
];

export default function Home() {
  const [data, setData] = useState({ featured_products: [], collections: [], testimonials: [], artisans: [], journal: [] });
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [r, m] = await Promise.all([api.get("/home"), api.get("/studio-moments?limit=12")]);
        setData(r.data);
        setMoments(m.data || []);
      } catch(_) {} finally { setLoading(false); }
    })();
  }, []);

  return (
    <div>
      {/* ── HERO — full-bleed cinematic ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Background image */}
        <img
          src={HERO_IMG}
          alt="Artisan hands crafting jewellery in a warm studio"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />

        {/* Dark gradient overlay — lighter top → darker base */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(43,36,32,0.18) 0%, rgba(43,36,32,0.72) 100%)" }}
        />

        {/* ── Main content — fills space, vertically centered ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-16 w-full max-w-[960px] mx-auto">

          {/* Large brand logo — the statement piece */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <GullakLogo
              testId="hero-brand-logo"
              className="h-32 sm:h-44 lg:h-60 brightness-0 invert"
            />
          </motion.div>

          {/* Thin vertical separator */}
          <div className="mt-5 sm:mt-7 w-px h-10 bg-[rgba(250,246,239,0.25)]" />

          {/* Overline */}
          <p className="mt-4 sm:mt-5 text-[13px] sm:text-[15px] tracking-[0.32em] uppercase text-[#EFE3D0] font-medium drop-shadow-md">
            Natural&nbsp;&nbsp;·&nbsp;&nbsp;Ethical&nbsp;&nbsp;·&nbsp;&nbsp;Timeless
          </p>

          {/* Hero headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 sm:mt-5 font-serif font-medium text-[44px] sm:text-[62px] lg:text-[82px] leading-[1.04] tracking-[-0.02em] text-[#FAF6EF]"
          >
            Wear Nature.<br />
            <em style={{ color: "#D49570" }}>Wear Stories.</em><br />
            Wear Craft.
          </motion.h1>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center"
          >
            <Link
              data-testid={TID.home.heroCta}
              to="/collections/terracotta"
              className="press-btn inline-flex items-center gap-2 rounded-full bg-[#B5502D] text-[#FAF6EF] px-7 py-3.5 text-[12px] sm:text-[13px] tracking-[0.08em] uppercase hover:bg-[#9B3D20] transition-colors duration-200"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              data-testid={TID.home.heroStoryCta}
              to="/craftsmanship"
              className="press-btn inline-flex items-center gap-2 rounded-full border border-[rgba(250,246,239,0.40)] text-[#FAF6EF] px-7 py-3.5 text-[12px] sm:text-[13px] tracking-[0.08em] uppercase hover:bg-[rgba(250,246,239,0.10)] transition-colors duration-200 backdrop-blur-sm"
            >
              Discover the Craft
            </Link>
          </motion.div>

        </div>

        {/* ── Stats strip — sits naturally below content, no overlap ── */}
        <div className="relative z-10 border-t border-[rgba(250,246,239,0.12)] bg-[rgba(20,17,16,0.40)] backdrop-blur-sm">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-10 py-6 flex items-center justify-center gap-12 sm:gap-20">
            <div className="text-center">
              <div className="font-serif text-2xl sm:text-3xl text-[#FAF6EF]">100%</div>
              <div className="mt-1 text-[10px] tracking-[0.15em] uppercase text-[rgba(239,227,208,0.70)]">Handcrafted</div>
            </div>
            <div className="w-px h-10 bg-[rgba(250,246,239,0.15)]" />
            <div className="text-center">
              <div className="font-serif text-2xl sm:text-3xl text-[#FAF6EF]">3</div>
              <div className="mt-1 text-[10px] tracking-[0.15em] uppercase text-[rgba(239,227,208,0.70)]">Artisan families</div>
            </div>
            <div className="w-px h-10 bg-[rgba(250,246,239,0.15)]" />
            <div className="text-center">
              <div className="font-serif text-2xl sm:text-3xl text-[#FAF6EF]">7</div>
              <div className="mt-1 text-[10px] tracking-[0.15em] uppercase text-[rgba(239,227,208,0.70)]">Steps per piece</div>
            </div>
          </div>
        </div>

      </section>

      {/* SUSTAINABILITY STORY */}
      <Section wide>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img src={STORY_IMG} alt="Studio still life" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Overline>Our promise</Overline>
            <h2 className="mt-4 serif text-4xl sm:text-5xl leading-[1.06] tracking-[-0.02em]">A quieter kind of luxury.</h2>
            <p className="mt-6 text-[15px] leading-[1.85] text-[color:var(--ink-2)]">
              At Gullak, luxury is not measured in metals or excess. It's measured in the hours a craftsman held a piece, in the seasons its clay dried, in the story it will carry from one wrist to another.
            </p>
            <p className="mt-4 text-[15px] leading-[1.85] text-[color:var(--ink-2)]">
              Every piece is handmade, packaged in seed paper and cotton, and shipped in kraft — zero plastic, from earth to earlobe.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { k: "Handmade", v: "By artisan families" },
                { k: "Zero-plastic", v: "Seed paper + cotton" },
                { k: "Fair-trade", v: "Direct to makers" },
              ].map(x => (
                <div key={x.k} className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-4">
                  <div className="serif text-lg">{x.k}</div>
                  <div className="text-xs text-[color:var(--ink-3)] mt-1">{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FEATURED COLLECTIONS */}
      <Section wide className="bg-[color:var(--surface-2)]">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <Overline>Collections</Overline>
            <h2 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">Rooted in material.</h2>
          </div>
          <Link to="/collections" className="link-underline text-sm text-[color:var(--ink-1)] hidden sm:inline">View all →</Link>
        </div>
        <div data-testid={TID.home.collectionsGrid} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data.collections || []).slice(0, 3).map((c) => (
            <Link key={c.id} to={c.status === "active" ? `/collections/${c.slug}` : "/collections"} className="group block rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={resolveImg(c.hero_image)} alt={c.name} className="pcard-img h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="overline">{c.status === "coming_soon" ? "Coming soon" : "Available now"}</div>
                  {c.status === "coming_soon" && <span className="text-[10px] rounded-full bg-[color:var(--surface-2)] px-2 py-1 text-[color:var(--ink-2)]">Soon</span>}
                </div>
                <div className="mt-2 serif text-2xl">{c.name}</div>
                <p className="mt-2 text-sm text-[color:var(--ink-3)] line-clamp-2">{c.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* CRAFTSMANSHIP JOURNEY */}
      <Section wide>
        <div className="max-w-2xl">
          <Overline>The making</Overline>
          <h2 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">The unread story behind every statement.</h2>
          <p className="mt-4 text-[15px] text-[color:var(--ink-2)] leading-[1.8]">Each Gullak piece travels a slow, deliberate path — seven steps, no shortcuts, no machines that don't belong.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {PROCESS_STEPS.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-4">
              <div className="flex items-center gap-2">
                <span className="serif text-2xl text-[color:var(--brand)]">0{i + 1}</span>
                <s.Icon className="h-4 w-4 text-[color:var(--ink-2)]" />
              </div>
              <div className="mt-3 serif text-lg leading-tight">{s.title}</div>
              <p className="mt-2 text-xs text-[color:var(--ink-3)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/craftsmanship" className="link-underline text-sm">Walk the full journey →</Link>
        </div>
      </Section>

      {/* FEATURED PRODUCTS */}
      <Section wide className="bg-[color:var(--surface-2)]">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <Overline>Featured</Overline>
            <h2 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">Quiet pieces to begin with.</h2>
          </div>
          <Link to="/collections/terracotta" className="link-underline text-sm hidden sm:inline">Shop all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[4/5] rounded-2xl bg-[color:var(--surface)] animate-pulse" />)}
          </div>
        ) : (
          <div data-testid={TID.home.featuredGrid} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(data.featured_products || []).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </Section>

      {/* ARTISAN STORIES */}
      <Section wide>
        <div className="max-w-2xl">
          <Overline>The makers</Overline>
          <h2 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">Every piece has a first name.</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {(data.artisans || []).slice(0, 2).map((a) => (
            <Link key={a.id} to={`/artisans/${a.slug}`} className="group grid grid-cols-2 gap-6 rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={resolveImg(a.portrait)} alt={a.name} className="pcard-img h-full w-full object-cover" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <Overline>{a.craft}</Overline>
                <div className="mt-2 serif text-2xl leading-tight">{a.name}</div>
                <div className="text-xs text-[color:var(--ink-3)] mt-1">{a.region}</div>
                <p className="mt-3 text-sm text-[color:var(--ink-2)] leading-relaxed line-clamp-4">{a.story}</p>
                <div className="mt-4 text-sm link-underline text-[color:var(--brand)]">Read her story →</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* MATERIAL LIBRARY */}
      <Section wide className="bg-[color:var(--surface-2)]">
        <div className="max-w-2xl">
          <Overline>Material library</Overline>
          <h2 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">Six earths. One promise.</h2>
          <p className="mt-4 text-[15px] text-[color:var(--ink-2)] leading-[1.8]">Gullak began with terracotta. In the seasons ahead, we'll grow into other sustainable materials — each one chosen for how it lives on skin.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { key: "terracotta", label: "Terracotta", active: true },
            { key: "wood", label: "Wood" },
            { key: "bamboo", label: "Bamboo" },
            { key: "fabric", label: "Fabric" },
            { key: "wool", label: "Wool" },
            { key: "cork", label: "Cork" },
          ].map((m) => (
            <div key={m.key} className="rounded-xl overflow-hidden border border-[color:var(--border-subtle)] bg-[color:var(--surface)]">
              <div className="aspect-square overflow-hidden">
                <img src={MATERIAL_IMG[m.key]} alt={m.label} className="h-full w-full object-cover pcard-img" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="serif text-base">{m.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${m.active ? "bg-[color:var(--brand)] text-[color:var(--surface)]" : "bg-[color:var(--surface-2)] text-[color:var(--ink-2)]"}`}>{m.active ? "Available" : "Soon"}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* WHY GULLAK */}
      <Section wide>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Made by first names", body: "Every piece is signed by the artisan who made it — Kavita, Rajesh, Meera." },
            { title: "Slow by design", body: "We don't do seasonal drops. We do heirlooms that grow slower and softer with time." },
            { title: "Earth, honestly", body: "River clay. Cotton cord. Beeswax finish. Nothing hidden, nothing shortcut." },
          ].map((w) => (
            <div key={w.title} className="rounded-2xl p-8 border border-[color:var(--border-subtle)] bg-[color:var(--surface)]">
              <div className="serif text-2xl leading-tight">{w.title}</div>
              <p className="mt-3 text-sm text-[color:var(--ink-2)] leading-relaxed">{w.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section wide className="bg-[color:var(--surface-2)]">
        <div className="max-w-2xl">
          <Overline>What people say</Overline>
          <h2 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">Small words. Long lives.</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data.testimonials || []).slice(0, 6).map((t) => (
            <blockquote key={t.id} className="rounded-2xl p-6 bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
              <p className="serif text-lg leading-snug italic text-[color:var(--ink-1)]">“{t.quote}”</p>
              <footer className="mt-4 text-xs overline">— {t.author}, {t.location}</footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* STUDIO DIARY */}
      <Section wide>
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <Overline>Studio Diary</Overline>
            <h2 className="mt-3 serif text-3xl sm:text-4xl tracking-[-0.02em]">Small moments from the studio.</h2>
            <p className="mt-3 text-sm text-[color:var(--ink-3)] max-w-md">Kiln fires, hands at work, and the light that visits Molela each afternoon.</p>
          </div>
        </div>
        {moments.length === 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {IG_IMAGES.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg bg-[color:var(--surface-2)]">
                <img src={src} alt="Studio moment" className="h-full w-full object-cover pcard-img" />
              </div>
            ))}
          </div>
        ) : (
          <div data-testid="studio-diary-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {moments.map((m, i) => {
              const CardEl = m.link ? "a" : "div";
              const props = m.link ? { href: m.link, target: "_blank", rel: "noreferrer" } : {};
              return (
                <CardEl key={m.id || i} {...props} className="group relative aspect-square overflow-hidden rounded-lg bg-[color:var(--surface-2)]">
                  <img src={resolveImg(m.image)} alt={m.caption || "Studio moment"} className="h-full w-full object-cover pcard-img" loading="lazy" />
                  {m.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(20,17,16,0.7)] to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white leading-snug line-clamp-2">{m.caption}</p>
                    </div>
                  )}
                </CardEl>
              );
            })}
          </div>
        )}
      </Section>

      {/* JOURNAL TEASER */}
      {(data.journal || []).length > 0 && (
        <Section wide className="bg-[color:var(--surface-2)]">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <Overline>Journal</Overline>
              <h2 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">Slow letters from the studio.</h2>
            </div>
            <Link to="/journal" className="link-underline text-sm hidden sm:inline">Read the journal →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data.journal || []).slice(0, 3).map((j) => (
              <Link key={j.id} to={`/journal/${j.slug}`} className="group block rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={resolveImg(j.cover_image)} alt={j.title} className="h-full w-full object-cover pcard-img" />
                </div>
                <div className="p-6">
                  <div className="overline">{j.category}</div>
                  <div className="mt-2 serif text-xl leading-tight">{j.title}</div>
                  <p className="mt-2 text-sm text-[color:var(--ink-3)] line-clamp-2">{j.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
