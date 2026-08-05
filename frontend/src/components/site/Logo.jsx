import React from "react";
import { Link } from "react-router-dom";

/**
 * PotIcon — SVG of a traditional Indian gullak/lota
 *
 * Shape (matching the reference image exactly):
 *  ┌─────────┐  ← small oval mouth
 *  │  NECK   │  ← straight cylindrical, clearly defined
 *  │─────────│  ← collar band (2 horizontal lines)
 *  │         │  \
 *  │  BODY   │   round, 2.5× neck width
 *  │─────────│  ← body band 1
 *  │─────────│  ← body band 2
 *  └─────────┘  ← base
 */
function PotIcon() {
  return (
    <svg
      viewBox="0 0 46 66"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
      style={{
        display: "inline-block",
        height: "0.85em",
        width: "auto",
        // drop so pot base aligns with text baseline
        verticalAlign: "-0.10em",
        margin: "0 0.03em",
      }}
    >
      {/* ── Main pot silhouette ──
          Clockwise path:
            top arc (mouth) → straight right neck down →
            collar expands → round body → base →
            left body → collar narrows → Z closes left neck straight up
      */}
      <path d="
        M 17,5
        A 6,2.5 0 0 1 29,5
        L 29,22
        C 32,23 36,26 39,30
        C 42,35 43,41 43,46
        C 43,55 38,61 30,63
        L 16,63
        C 8,61 3,55 3,46
        C 3,41 4,35 7,30
        C 10,26 14,23 17,22
        Z
      " />

      {/* ── Mouth opening — hollow shadow at top ── */}
      <ellipse
        cx="23" cy="6"
        rx="4.5" ry="1.8"
        fill="rgba(250,246,239,0.30)"
      />

      {/* ── Collar ring — 2 horizontal lines at base of neck ──
          Extends slightly wider than neck (17→29) to hint at the ring protrusion
      */}
      <line
        x1="14" y1="22.5" x2="32" y2="22.5"
        stroke="rgba(250,246,239,0.60)" strokeWidth="1.8" strokeLinecap="round"
      />
      <line
        x1="12" y1="27" x2="34" y2="27"
        stroke="rgba(250,246,239,0.60)" strokeWidth="1.8" strokeLinecap="round"
      />

      {/* ── Body decorative bands — two curved ridges on the belly ── */}
      <path
        d="M 5,46 Q 23,50 41,46"
        fill="none"
        stroke="rgba(250,246,239,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 6,54 Q 23,58 40,54"
        fill="none"
        stroke="rgba(250,246,239,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * GullakLogo — "G" + clay-pot icon + "llak"
 *
 * @param {string}  className  — extra Tailwind classes (e.g. font-size)
 * @param {string}  testId     — data-testid attribute
 * @param {object}  style      — inline style overrides
 *                               e.g. { color: '#FAF6EF' } for light-on-dark
 */
export function GullakLogo({ className = "", testId = "", style = {} }) {
  return (
    <Link
      to="/"
      data-testid={testId}
      aria-label="Gullak — home"
      style={{ color: "var(--brand)", ...style }}
      className={[
        "inline-flex items-end leading-none select-none",
        "font-serif font-semibold tracking-[0.01em]",
        "hover:opacity-90 transition-opacity duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>G</span>
      <PotIcon />
      <span>llak</span>
    </Link>
  );
}
