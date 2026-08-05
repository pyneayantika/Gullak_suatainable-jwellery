import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, resolveImg } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import NotifyMeForm from "@/components/site/NotifyMeForm";

export default function CollectionsList() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    api.get("/collections").then(r => setCollections(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <Section wide>
        <div className="max-w-2xl">
          <Overline>Collections</Overline>
          <h1 className="mt-3 serif text-5xl sm:text-6xl tracking-[-0.02em]">Rooted in material.</h1>
          <p className="mt-5 text-[15px] leading-[1.85] text-[color:var(--ink-2)]">
            Gullak begins with terracotta and grows, one material at a time, into a slow lifestyle of sustainable adornment.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((c) => {
            const isComingSoon = c.status !== "active";
            const CardTag = isComingSoon ? "div" : Link;
            const cardProps = isComingSoon ? {} : { to: `/collections/${c.slug}` };
            return (
              <CardTag
                key={c.id}
                {...cardProps}
                className={`group rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)] block ${isComingSoon ? "" : ""}`}
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={resolveImg(c.hero_image)} alt={c.name} className="pcard-img h-full w-full object-cover" />
                  {isComingSoon && <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,17,16,0.35)] to-transparent" />}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Overline>{c.material}</Overline>
                    <span className={`text-[10px] px-2 py-1 rounded-full ${c.status === "active" ? "bg-[color:var(--brand)] text-[color:var(--surface)]" : "bg-[color:var(--surface-2)] text-[color:var(--ink-2)]"}`}>
                      {c.status === "active" ? "Available" : "Coming soon"}
                    </span>
                  </div>
                  <div className="mt-2 serif text-2xl leading-tight">{c.name}</div>
                  <p className="mt-2 text-sm text-[color:var(--ink-3)]">{c.subtitle}</p>
                  {isComingSoon && <NotifyMeForm slug={c.slug} name={c.name} />}
                </div>
              </CardTag>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
