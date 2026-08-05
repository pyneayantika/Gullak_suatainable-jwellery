import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { TID } from "@/lib/testIds";
import ProductCard from "@/components/site/ProductCard";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Hand, Flame, Feather, Sparkles, Heart } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1600&q=80";
const STORY_IMG = "https://images.unsplash.com/photo-1583135989598-8bdd0af59cb0?auto=format&fit=crop&w=1400&q=80";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/home");
        setData(r.data);
      } catch(_) {} finally { setLoading(false); }
    })();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="grain-bg hero-wash relative overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-20 sm:py-24 lg:py-32">
          <div className="lg:col-span-6">
            <Overline>Handcrafted — India</Overline>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 serif text-5xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-[-0.02em] text-[color:var(--ink-1)]"
            >
              Wear Nature.<br />
              <span className="italic text-[color:var(--brand)]">Wear Stories.</span><br />
              Wear Craft.
            </motion.h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.8] text-[color:var(--ink-2)]">
              Gullak is a slow jewellery studio rooted in earth, memory, and the quiet dignity of the maker's hand. Our founding collection is shaped in terracotta — the oldest ornament in the world.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link data-testid={TID.home.heroCta} to="/collections/terracotta" className="press-btn inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-7 py-3.5 text-sm hover:bg-[color:var(--brand-2)]">
                Shop Terracotta <ArrowRight className="h-4 w-4" />
              </Link>
              <Link data-testid={TID.home.heroStoryCta} to="/craftsmanship" className="press-btn inline-flex items-center gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-7 py-3.5 text-sm text-[color:var(--ink-1)] hover:bg-[color:var(--surface-2)]">
                Discover the Craft
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8 text-xs text-[color:var(--ink-3)]">
              <div><span className="serif text-2xl text-[color:var(--ink-1)]">100%</span><br />Handcrafted</div>
              <div><span className="serif text-2xl text-[color:var(--ink-1)]">3</span><br />Artisan families</div>
              <div><span className="serif text-2xl text-[color:var(--ink-1)]">0</span><br />Plastic in packaging</div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(20,17,16,0.12)]"
            >
              <img src={HERO_IMG} alt="Handmade terracotta bangle in natural light" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-[rgba(255,252,247,0.85)] backdrop-blur px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="overline">Made by</div>
                  <div className="serif text-lg text-[color:var(--ink-1)]">Kavita Devi — Molela</div>
                </div>
                <Link to="/artisans/kavita-devi" className="text-xs link-underline">Read her story</Link>
              </div>
            </motion.div>
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
                <img src={c.hero_image} alt={c.name} className="pcard-img h-full w-full object-cover" />
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
          <Overline>The seven quiet steps</Overline>
          <h2 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">From soil to shoulder.</h2>
          <p className="mt-4 text-[15px] text-[color:var(--ink-2)] leading-[1.8]">Every Gullak piece walks the same slow path. No shortcuts. No machines that don't belong.</p>
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
                <img src={a.portrait} alt={a.name} className="pcard-img h-full w-full object-cover" />
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

      {/* INSTAGRAM */}
      <Section wide>
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <Overline>@gullakstudio</Overline>
            <h2 className="mt-3 serif text-3xl sm:text-4xl tracking-[-0.02em]">Small moments from the studio.</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {IG_IMAGES.map((src, i) => (
            <a key={i} href="#" className="group aspect-square overflow-hidden rounded-lg">
              <img src={src} alt="Studio moment" className="h-full w-full object-cover pcard-img" />
            </a>
          ))}
        </div>
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
                  <img src={j.cover_image} alt={j.title} className="h-full w-full object-cover pcard-img" />
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
