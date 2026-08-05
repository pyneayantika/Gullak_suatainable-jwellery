import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, formatINR } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import ProductCard from "@/components/site/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Minus, Plus, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { TID } from "@/lib/testIds";

export default function ProductDetail() {
  const { slug } = useParams();
  const [data, setData] = useState({ product: null, artisan: null, pair_with: [] });
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    api.get(`/products/${slug}`).then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-20 text-center overline">Loading…</div>;
  const p = data.product;
  if (!p) return <div className="p-20 text-center serif text-3xl">Product not found</div>;

  const images = [...(p.images || []), ...(p.lifestyle_images || [])];
  const wished = has(p.id);

  return (
    <div>
      <Section wide>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Gallery */}
          <div data-testid={TID.pdp.gallery} className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
              <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {images.map((img, i) => (
                  <button
                    key={i}
                    data-testid={`${TID.pdp.thumb}-${i}`}
                    onClick={() => setActiveImg(i)}
                    className={`h-20 w-16 md:h-24 md:w-20 rounded-lg overflow-hidden flex-shrink-0 border ${activeImg === i ? "border-[color:var(--brand)]" : "border-[color:var(--border-subtle)]"}`}
                  >
                    <img src={img} alt={`Thumb ${i+1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="order-1 md:order-2 rounded-2xl overflow-hidden bg-[color:var(--surface-2)] aspect-[4/5]">
                <img src={images[activeImg]} alt={p.name} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          {/* Buy Box */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Overline>{p.collection_slug} • {p.material}</Overline>
              <h1 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">{p.name}</h1>
              {p.subtitle && <p className="mt-2 text-lg text-[color:var(--ink-3)]">{p.subtitle}</p>}
              <div data-testid={TID.pdp.price} className="mt-4 serif text-3xl text-[color:var(--ink-1)]">{formatINR(p.price)}</div>
              <p className="mt-1 text-xs text-[color:var(--ink-3)]">Inclusive of all taxes. Free shipping over ₹2,000.</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="inline-flex items-center border border-[color:var(--border-subtle)] rounded-full bg-[color:var(--surface)]">
                  <button aria-label="Decrease" onClick={() => setQty(q => Math.max(1, q - 1))} className="h-11 w-11 inline-flex items-center justify-center hover:bg-[color:var(--surface-2)] rounded-l-full"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button aria-label="Increase" onClick={() => setQty(q => q + 1)} className="h-11 w-11 inline-flex items-center justify-center hover:bg-[color:var(--surface-2)] rounded-r-full"><Plus className="h-4 w-4" /></button>
                </div>
                <button
                  data-testid={TID.pdp.addToCart}
                  onClick={() => addToCart(p, qty)}
                  className="press-btn flex-1 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] py-3.5 text-sm hover:bg-[color:var(--brand-2)]"
                >
                  Add to Cart
                </button>
                <button
                  data-testid={TID.pdp.wishlist}
                  onClick={() => toggle(p)}
                  aria-label="Toggle wishlist"
                  className={`h-12 w-12 rounded-full border border-[color:var(--border-subtle)] inline-flex items-center justify-center bg-[color:var(--surface)] hover:bg-[color:var(--surface-2)] ${wished ? "text-[color:var(--brand)]" : "text-[color:var(--ink-1)]"}`}
                >
                  <Heart className="h-5 w-5" fill={wished ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-3"><Truck className="h-4 w-4 text-[color:var(--brand)]" /><div className="mt-1.5 text-xs">Ships in 5–7 days</div></div>
                <div className="rounded-lg bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-3"><ShieldCheck className="h-4 w-4 text-[color:var(--brand)]" /><div className="mt-1.5 text-xs">30-day exchange</div></div>
                <div className="rounded-lg bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-3"><Sparkles className="h-4 w-4 text-[color:var(--brand)]" /><div className="mt-1.5 text-xs">Gift-ready packaging</div></div>
              </div>

              {p.story && (
                <div className="mt-8">
                  <Overline>The story</Overline>
                  <p className="mt-3 text-[15px] leading-[1.85] text-[color:var(--ink-2)]">{p.story}</p>
                </div>
              )}

              <Accordion type="single" collapsible className="mt-8">
                {p.material_info && (
                  <AccordionItem value="material"><AccordionTrigger>Material</AccordionTrigger><AccordionContent>{p.material_info}</AccordionContent></AccordionItem>
                )}
                {(p.dimensions || p.weight) && (
                  <AccordionItem value="specs"><AccordionTrigger>Dimensions & Weight</AccordionTrigger><AccordionContent>{p.dimensions} — {p.weight}</AccordionContent></AccordionItem>
                )}
                {p.care_guide && (
                  <AccordionItem value="care"><AccordionTrigger>Care guide</AccordionTrigger><AccordionContent>{p.care_guide}</AccordionContent></AccordionItem>
                )}
                {p.packaging && (
                  <AccordionItem value="packaging"><AccordionTrigger>Packaging</AccordionTrigger><AccordionContent>{p.packaging}</AccordionContent></AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </Section>

      {/* Artisan */}
      {data.artisan && (
        <Section wide className="bg-[color:var(--surface-2)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img src={data.artisan.portrait} alt={data.artisan.name} className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="md:col-span-8">
              <Overline>Made by</Overline>
              <h2 className="mt-3 serif text-4xl tracking-[-0.02em]">{data.artisan.name}</h2>
              <div className="text-sm text-[color:var(--ink-3)] mt-1">{data.artisan.craft} — {data.artisan.region}</div>
              <p className="mt-4 text-[15px] leading-[1.85] text-[color:var(--ink-2)] max-w-2xl">{data.artisan.story}</p>
              <Link to={`/artisans/${data.artisan.slug}`} className="mt-5 inline-block link-underline text-sm">Read {data.artisan.name.split(" ")[0]}'s full story →</Link>
            </div>
          </div>
        </Section>
      )}

      {/* Pair with */}
      {data.pair_with?.length > 0 && (
        <Section wide>
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <Overline>Pair with</Overline>
              <h2 className="mt-3 serif text-3xl sm:text-4xl tracking-[-0.02em]">Slow pairings.</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.pair_with.map((pp) => <ProductCard key={pp.id} product={pp} />)}
          </div>
        </Section>
      )}
    </div>
  );
}
