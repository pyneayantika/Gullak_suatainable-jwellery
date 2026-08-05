import React from "react";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";

const STEPS = [
  { title: "Clay Selection", desc: "River clay is hand-gathered from small, sustainable sources. The purest tones — warm rust, ochre, deep terracotta — begin here.", img: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?auto=format&fit=crop&w=1400&q=80" },
  { title: "Hand Sculpting", desc: "Every piece is coaxed into form on a slow wheel or shaped by fingertips — no two are ever exactly alike.", img: "https://images.unsplash.com/photo-1525004482414-ef6d156fde79?auto=format&fit=crop&w=1400&q=80" },
  { title: "Drying", desc: "The pieces rest in shade for days, letting the clay find its shape without cracking.", img: "https://images.unsplash.com/photo-1610375461369-d1859369b19b?auto=format&fit=crop&w=1400&q=80" },
  { title: "Baking", desc: "Wood-fired kilns at 900°C. Rajesh reads the smoke like a book. The kiln takes its own time.", img: "https://images.unsplash.com/photo-1516146544193-b54a65682f16?auto=format&fit=crop&w=1400&q=80" },
  { title: "Painting", desc: "Natural pigments — ochre, indigo, river silt — hand-mixed and applied stroke by patient stroke.", img: "https://images.unsplash.com/photo-1594736797933-d0d3a4a1e40d?auto=format&fit=crop&w=1400&q=80" },
  { title: "Finishing", desc: "Sealed with beeswax; strung on cotton; hooked on nickel-free brass — all by hand.", img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1400&q=80" },
  { title: "Ready to Wear", desc: "Boxed in kraft, tied with cotton, blessed with a handwritten note. Ready to become part of your story.", img: "https://images.unsplash.com/photo-1608083950849-53f24e59d70e?auto=format&fit=crop&w=1400&q=80" },
];

export default function Craftsmanship() {
  return (
    <div>
      <section className="grain-bg hero-wash">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10 py-24 text-center">
          <Overline>Craftsmanship</Overline>
          <h1 className="mt-3 serif text-5xl sm:text-6xl leading-[1.05] tracking-[-0.02em] max-w-3xl mx-auto">Seven quiet steps. Nothing skipped.</h1>
          <p className="mt-6 text-[15px] leading-[1.85] text-[color:var(--ink-2)] max-w-xl mx-auto">From soil to shoulder, every Gullak piece walks the same slow path — one that has been walked for thousands of years across the courtyards of India.</p>
        </div>
      </section>

      <Section wide>
        <div className="space-y-24">
          {STEPS.map((s, i) => (
            <div key={s.title} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src={s.img} alt={s.title} className="h-full w-full object-cover" />
                </div>
              </div>
              <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1 lg:col-start-2" : "lg:col-start-8"}`}>
                <div className="serif text-6xl text-[color:var(--brand)]">0{i + 1}</div>
                <h2 className="mt-3 serif text-4xl tracking-[-0.02em]">{s.title}</h2>
                <p className="mt-4 text-[15px] leading-[1.85] text-[color:var(--ink-2)]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
