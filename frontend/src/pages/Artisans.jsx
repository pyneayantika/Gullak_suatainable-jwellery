import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";

export default function Artisans() {
  const [artisans, setArtisans] = useState([]);
  useEffect(() => { api.get("/artisans").then(r => setArtisans(r.data)); }, []);

  return (
    <div>
      <section className="grain-bg">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 py-20 text-center">
          <Overline>The makers</Overline>
          <h1 className="mt-3 serif text-5xl sm:text-6xl tracking-[-0.02em] max-w-3xl mx-auto">Every piece has a first name.</h1>
          <p className="mt-5 text-[15px] leading-[1.85] text-[color:var(--ink-2)] max-w-xl mx-auto">Meet the artisan families whose hands and courtyards make Gullak possible.</p>
        </div>
      </section>

      <Section wide>
        <div className="space-y-20">
          {artisans.map((a, i) => (
            <div key={a.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={a.portrait} alt={a.name} className="h-full w-full object-cover" />
                </div>
              </div>
              <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <Overline>{a.craft}</Overline>
                <h2 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">{a.name}</h2>
                <div className="text-sm text-[color:var(--ink-3)] mt-1">{a.region} • {a.years_of_practice} years of practice</div>
                <p className="mt-5 text-[15px] leading-[1.85] text-[color:var(--ink-2)]">{a.story}</p>
                <Link to={`/artisans/${a.slug}`} className="mt-6 inline-block link-underline text-sm text-[color:var(--brand)]">Read {a.name.split(" ")[0]}'s full story →</Link>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
