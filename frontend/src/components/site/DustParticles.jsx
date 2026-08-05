import React from "react";

// ── Hero variant: visible on dark backgrounds (cream/ivory tones) ──
const HERO_DUST = [
  { id: 1,  color: "rgba(240,220,190,0.65)", size: 3, x: "6%",  y: "82%", anim: "dustRise1", dur: "8s",    delay: "0s" },
  { id: 2,  color: "rgba(220,195,160,0.58)", size: 2, x: "15%", y: "76%", anim: "dustRise2", dur: "11s",   delay: "1.6s" },
  { id: 3,  color: "rgba(250,235,215,0.55)", size: 4, x: "26%", y: "88%", anim: "dustRise3", dur: "9.5s",  delay: "3.0s" },
  { id: 4,  color: "rgba(210,155,100,0.52)", size: 2, x: "40%", y: "74%", anim: "dustRise1", dur: "12s",   delay: "2.2s" },
  { id: 5,  color: "rgba(240,220,190,0.48)", size: 3, x: "53%", y: "86%", anim: "dustRise2", dur: "10s",   delay: "4.5s" },
  { id: 6,  color: "rgba(220,195,160,0.52)", size: 2, x: "66%", y: "80%", anim: "dustRise3", dur: "9s",    delay: "1.2s" },
  { id: 7,  color: "rgba(250,235,215,0.45)", size: 4, x: "77%", y: "90%", anim: "dustRise1", dur: "13s",   delay: "3.8s" },
  { id: 8,  color: "rgba(200,170,130,0.52)", size: 2, x: "88%", y: "77%", anim: "dustRise2", dur: "10.5s", delay: "6.0s" },
  { id: 9,  color: "rgba(240,220,190,0.48)", size: 2, x: "23%", y: "66%", anim: "dustRise3", dur: "7.5s",  delay: "5.0s" },
  { id: 10, color: "rgba(220,195,160,0.45)", size: 3, x: "48%", y: "62%", anim: "dustRise1", dur: "11.5s", delay: "7.2s" },
];
const HERO_MIST = [
  { id: 1, color: "rgba(240,215,180,0.12)", size: 70, x: "8%",  y: "55%", dur: "16s",   delay: "0s",   blur: 24 },
  { id: 2, color: "rgba(200,155,100,0.09)", size: 90, x: "62%", y: "48%", dur: "21s",   delay: "4.0s", blur: 30 },
  { id: 3, color: "rgba(230,205,170,0.10)", size: 58, x: "36%", y: "60%", dur: "14.5s", delay: "8.0s", blur: 22 },
];

// ── Section variant: visible on light cream/sand backgrounds (clay tones) ──
const SECTION_DUST = [
  { id: 1, color: "rgba(138,63,43,0.22)",   size: 3, x: "8%",  y: "80%", anim: "dustRise1", dur: "9s",   delay: "0s" },
  { id: 2, color: "rgba(176,122,90,0.26)",  size: 2, x: "22%", y: "75%", anim: "dustRise2", dur: "12s",  delay: "2.0s" },
  { id: 3, color: "rgba(168,146,126,0.30)", size: 3, x: "45%", y: "85%", anim: "dustRise3", dur: "10s",  delay: "4.0s" },
  { id: 4, color: "rgba(74,52,46,0.18)",    size: 2, x: "67%", y: "78%", anim: "dustRise1", dur: "11s",  delay: "1.5s" },
  { id: 5, color: "rgba(178,100,60,0.20)",  size: 4, x: "82%", y: "88%", anim: "dustRise2", dur: "8.5s", delay: "3.5s" },
  { id: 6, color: "rgba(138,63,43,0.18)",   size: 2, x: "33%", y: "65%", anim: "dustRise3", dur: "13s",  delay: "6.5s" },
];
const SECTION_MIST = [
  { id: 1, color: "rgba(178,100,60,0.06)",  size: 75, x: "15%", y: "50%", dur: "18s", delay: "0s",   blur: 26 },
  { id: 2, color: "rgba(220,180,130,0.07)", size: 62, x: "70%", y: "45%", dur: "22s", delay: "5.0s", blur: 22 },
];

// ── Product variant: very subtle warm-neutral particles for any image background ──
const PRODUCT_DUST = [
  { id: 1, color: "rgba(200,165,120,0.42)", size: 3, x: "5%",  y: "78%", anim: "dustRise3", dur: "10s",  delay: "0s" },
  { id: 2, color: "rgba(180,140,100,0.36)", size: 2, x: "90%", y: "84%", anim: "dustRise1", dur: "12s",  delay: "2.0s" },
  { id: 3, color: "rgba(220,190,155,0.32)", size: 3, x: "12%", y: "91%", anim: "dustRise2", dur: "9.5s", delay: "4.0s" },
  { id: 4, color: "rgba(155,115,80,0.38)",  size: 2, x: "85%", y: "73%", anim: "dustRise3", dur: "11s",  delay: "1.5s" },
  { id: 5, color: "rgba(230,205,175,0.30)", size: 4, x: "7%",  y: "62%", anim: "dustRise1", dur: "8.5s", delay: "3.0s" },
];
const PRODUCT_MIST = [
  { id: 1, color: "rgba(200,165,120,0.08)", size: 55, x: "3%",  y: "58%", dur: "18s", delay: "0s",   blur: 22 },
  { id: 2, color: "rgba(180,140,100,0.06)", size: 45, x: "74%", y: "64%", dur: "20s", delay: "6.0s", blur: 18 },
];

/**
 * Decorative ambient dust + mist layer.
 * @param {"hero" | "section" | "product"} variant
 *   "hero"    — cream/ivory specks visible on dark hero backgrounds
 *   "section" — clay/terracotta specks visible on light cream sections
 *   "product" — subtle warm-neutral specks for product image overlays
 */
export function DustParticles({ variant = "hero" }) {
  const dustMap = { hero: HERO_DUST, section: SECTION_DUST, product: PRODUCT_DUST };
  const mistMap = { hero: HERO_MIST, section: SECTION_MIST, product: PRODUCT_MIST };
  const dust = dustMap[variant] ?? SECTION_DUST;
  const mist = mistMap[variant] ?? SECTION_MIST;

  return (
    <div
      aria-hidden="true"
      className="dust-layer absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 2 }}
    >
      {/* Floating dust specks */}
      {dust.map((p) => (
        <span
          key={`d${p.id}`}
          className="dust-particle absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.x,
            top: p.y,
            background: p.color,
            animationName: p.anim,
            animationDuration: p.dur,
            animationDelay: p.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationFillMode: "both",
          }}
        />
      ))}
      {/* Drifting mist blobs */}
      {mist.map((m) => (
        <span
          key={`m${m.id}`}
          className="dust-particle absolute rounded-full"
          style={{
            width: `${m.size}px`,
            height: `${m.size}px`,
            left: m.x,
            top: m.y,
            background: m.color,
            filter: `blur(${m.blur}px)`,
            animationName: "mistDrift",
            animationDuration: m.dur,
            animationDelay: m.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationFillMode: "both",
          }}
        />
      ))}
    </div>
  );
}
