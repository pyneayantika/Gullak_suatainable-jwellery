import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, resolveImg } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";

export default function Journal() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { api.get("/journal").then(r => setPosts(r.data)); }, []);

  if (posts.length === 0) return (
    <Section wide><div className="py-20 text-center"><h1 className="serif text-4xl">Journal</h1><p className="mt-3 text-[color:var(--ink-3)]">Stories arriving soon.</p></div></Section>
  );

  const [featured, ...rest] = posts;

  return (
    <div>
      <Section wide>
        <div className="max-w-2xl">
          <Overline>Journal</Overline>
          <h1 className="mt-3 serif text-5xl sm:text-6xl tracking-[-0.02em]">Slow letters from the studio.</h1>
          <p className="mt-5 text-[15px] leading-[1.85] text-[color:var(--ink-2)]">Essays on craft, care, and living slower.</p>
        </div>

        <Link to={`/journal/${featured.slug}`} className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={resolveImg(featured.cover_image)} alt={featured.title} className="h-full w-full object-cover pcard-img" />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <Overline>{featured.category} • {featured.read_time}</Overline>
            <h2 className="mt-3 serif text-3xl sm:text-4xl tracking-[-0.02em] leading-tight">{featured.title}</h2>
            <p className="mt-4 text-[15px] text-[color:var(--ink-2)] leading-relaxed">{featured.excerpt}</p>
            <div className="mt-6 text-sm link-underline text-[color:var(--brand)]">Read the essay →</div>
          </div>
        </Link>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((p) => (
            <Link key={p.id} to={`/journal/${p.slug}`} className="group rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={resolveImg(p.cover_image)} alt={p.title} className="h-full w-full object-cover pcard-img" />
              </div>
              <div className="p-6">
                <Overline>{p.category}</Overline>
                <div className="mt-2 serif text-2xl leading-tight">{p.title}</div>
                <p className="mt-3 text-sm text-[color:var(--ink-3)] line-clamp-2">{p.excerpt}</p>
                <div className="mt-4 text-xs text-[color:var(--ink-3)]">{p.read_time}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
