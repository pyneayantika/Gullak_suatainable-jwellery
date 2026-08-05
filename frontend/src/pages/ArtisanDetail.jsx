import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, resolveImg } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { DustParticles } from "@/components/site/DustParticles";

export default function ArtisanDetail() {
  const { slug } = useParams();
  const [a, setA] = useState(null);
  useEffect(() => { api.get(`/artisans/${slug}`).then(r => setA(r.data)).catch(() => {}); }, [slug]);
  if (!a) return <div className="p-20 text-center overline">Loading…</div>;

  return (
    <div>
      <section className="grain-bg hero-wash relative overflow-hidden">
          {/* Earthy dust atmosphere */}
          <DustParticles variant="section" />
          <div className="relative z-[5] mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <Overline>{a.craft}</Overline>
            <h1 className="mt-3 serif text-5xl sm:text-6xl tracking-[-0.02em]">{a.name}</h1>
            <div className="text-sm text-[color:var(--ink-3)] mt-1">{a.region} • {a.years_of_practice} years of practice</div>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-[color:var(--ink-2)]">{a.story}</p>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
              <img src={a.portrait} alt={a.name} className="h-full w-full object-cover" />
              {/* Grain overlay gives the portrait a tactile studio-photo feel */}
              <div className="grain-img-overlay" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
      {a.workshop_images?.length > 0 && (
        <Section wide>
          <Overline>The workshop</Overline>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {a.workshop_images.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img src={resolveImg(img)} alt={`Workshop ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </Section>
      )}
      <div className="text-center pb-16">
        <Link to="/artisans" className="link-underline text-sm">← All artisans</Link>
      </div>
    </div>
  );
}
