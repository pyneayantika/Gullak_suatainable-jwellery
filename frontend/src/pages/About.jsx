import React from "react";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div>
      <section className="grain-bg hero-wash">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <Overline>About Gullak</Overline>
            <h1 className="mt-3 serif text-5xl sm:text-6xl leading-[1.05] tracking-[-0.02em]">A small clay pot for slow treasures.</h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-[color:var(--ink-2)]">Gullak is the Hindi word for a small terracotta piggy bank — a quiet vessel where the smallest coins turn, over time, into something meaningful. We took that idea and made it wearable.</p>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1400&q=80" alt="Terracotta pot" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-[72ch] text-[17px] leading-[1.95] text-[color:var(--ink-1)] space-y-6">
          <p><span className="first-letter:font-[var(--font-serif)] first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:text-[color:var(--brand)]">A</span>t Gullak, we believe the future of luxury is quieter, not louder. That the most meaningful thing you can wear is a piece you can trace — back to a pair of hands, a courtyard, a country.</p>
          <p>We began with terracotta because it is the oldest ornament in the world. Long before gold or silver, our ancestors wore the earth itself — shaped, dried, fired, and passed down. There is a quiet dignity in that.</p>
          <p>In the seasons ahead, we will grow slowly into other sustainable materials — wood, bamboo, fabric, wool, cork — always with the same values: made by name, made by hand, made without shortcuts.</p>
          <p>This is not a company. This is a small movement of people who believe that things worth wearing take time.</p>
        </div>
      </Section>

      <Section wide className="bg-[color:var(--surface-2)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { k: "Meaning", v: "Every piece carries a first name and a courtyard." },
            { k: "Sustainability", v: "Zero-plastic packaging, natural fibres, fair pay." },
            { k: "Community", v: "Working directly with artisan families across India." },
            { k: "Longevity", v: "Heirlooms that soften with wear, not fade with fashion." },
          ].map((x) => (
            <div key={x.k} className="rounded-2xl p-6 bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
              <div className="serif text-2xl">{x.k}</div>
              <p className="mt-3 text-sm text-[color:var(--ink-2)] leading-relaxed">{x.v}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Overline>Future vision</Overline>
            <h2 className="mt-3 serif text-4xl tracking-[-0.02em]">A slow lifestyle brand, not a jewellery store.</h2>
            <p className="mt-4 text-[15px] leading-[1.85] text-[color:var(--ink-2)]">Gullak will grow, but only ever slowly. Into materials that respect the earth. Into homes, then wardrobes. Never louder than the pieces themselves.</p>
            <Link to="/collections" className="mt-6 inline-block press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-6 py-3 text-sm hover:bg-[color:var(--brand-2)]">Browse collections</Link>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1571239127359-766e008befa1?auto=format&fit=crop&w=1400&q=80" alt="Botanical" className="h-full w-full object-cover" />
          </div>
        </div>
      </Section>
    </div>
  );
}
