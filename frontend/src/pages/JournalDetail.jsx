import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, resolveImg } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { TID } from "@/lib/testIds";

export default function JournalDetail() {
  const { slug } = useParams();
  const [data, setData] = useState({ article: null, related: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/journal/${slug}`).then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-20 text-center overline">Loading…</div>;
  const a = data.article;
  if (!a) return <div className="p-20 text-center serif text-3xl">Article not found</div>;

  return (
    <article>
      <section className="grain-bg">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
          <Overline>{a.category} • {a.read_time}</Overline>
          <h1 data-testid="journal-article-title" className="mt-4 serif text-4xl sm:text-6xl leading-[1.05] tracking-[-0.02em]">{a.title}</h1>
          {a.subtitle && <p className="mt-5 text-lg text-[color:var(--ink-2)]">{a.subtitle}</p>}
          <div className="mt-6 text-xs text-[color:var(--ink-3)]">By {a.author}</div>
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden">
            <img src={resolveImg(a.cover_image)} alt={a.title} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-[70ch]">
          {a.body.split("\n\n").map((para, i) => (
            <p key={i} className={`text-[17px] leading-[1.9] text-[color:var(--ink-1)] ${i === 0 ? "first-letter:font-[var(--font-serif)] first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:text-[color:var(--brand)]" : "mt-6"}`}>
              {para}
            </p>
          ))}
        </div>
      </Section>

      {data.related?.length > 0 && (
        <Section wide className="bg-[color:var(--surface-2)]">
          <Overline>Continue reading</Overline>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.related.map((p) => (
              <Link key={p.id} to={`/journal/${p.slug}`} className="group rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={resolveImg(p.cover_image)} alt={p.title} className="h-full w-full object-cover pcard-img" />
                </div>
                <div className="p-6">
                  <Overline>{p.category}</Overline>
                  <div className="mt-2 serif text-xl leading-tight">{p.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}
