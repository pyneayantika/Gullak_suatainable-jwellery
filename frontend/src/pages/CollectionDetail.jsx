import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import ProductCard from "@/components/site/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TID } from "@/lib/testIds";

export default function CollectionDetail() {
  const { slug } = useParams();
  const [data, setData] = useState({ collection: null, products: [] });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setLoading(true);
    api.get(`/collections/${slug}`).then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const sorted = useMemo(() => {
    const arr = [...(data.products || [])];
    if (sort === "price_asc") arr.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") arr.sort((a, b) => b.price - a.price);
    if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return arr;
  }, [data.products, sort]);

  const c = data.collection;

  return (
    <div>
      {c && (
        <section className="relative overflow-hidden grain-bg">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <Overline>Collection</Overline>
              <h1 className="mt-3 serif text-5xl sm:text-6xl tracking-[-0.02em]">{c.name}</h1>
              <p className="mt-4 text-lg text-[color:var(--ink-2)] max-w-xl">{c.subtitle}</p>
              <p className="mt-4 text-[15px] leading-[1.85] text-[color:var(--ink-2)] max-w-xl">{c.description}</p>
            </div>
            <div className="lg:col-span-6">
              <div className="aspect-[5/4] rounded-2xl overflow-hidden">
                <img src={c.hero_image} alt={c.name} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      )}

      <Section wide>
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="text-sm text-[color:var(--ink-3)]">{sorted.length} {sorted.length === 1 ? "piece" : "pieces"}</div>
          <div className="flex items-center gap-3">
            <span className="overline">Sort</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger data-testid={TID.collections.sortSelect} className="w-44 bg-[color:var(--surface)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price_asc">Price: low to high</SelectItem>
                <SelectItem value="price_desc">Price: high to low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] rounded-2xl bg-[color:var(--surface-2)] animate-pulse" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-20 text-center">
            <div className="serif text-3xl">This collection is being handcrafted.</div>
            <p className="mt-3 text-sm text-[color:var(--ink-3)]">Please check back soon — or subscribe to be the first to hear.</p>
            <Link to="/collections" className="mt-6 inline-block link-underline">Browse all collections →</Link>
          </div>
        ) : (
          <div data-testid={TID.collections.grid} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </Section>
    </div>
  );
}
