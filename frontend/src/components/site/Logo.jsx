import React from "react";
import { Link } from "react-router-dom";

/**
 * PotIcon — hand-traced from the reference brand image.
 *
 * Exact anatomy (matching the attached logo):
 *
 *   ╔══════╗        wide oval mouth with interior shadow
 *   ║ NECK ║        straight cylindrical sides
 *   ╠══════╣  ──    collar ring line 1
 *   ║      ║  ──    collar ring line 2 (ring is wider than neck)
 *   ║      ║
 *   ║ BODY ║  ──    body band 1  (white horizontal stripe)
 *   ║      ║  ──    body band 2  (white horizontal stripe)
 *   ╚══╧══╝        narrow flat base
 */
function PotIcon() {
  return (
    <svg
      viewBox="0 0 50 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
      style={{
        display: "inline-block",
        /* match cap-height of Cormorant Garamond bold */
        height: "0.82em",
        width: "auto",
        /* drop so pot base sits on text baseline */
        verticalAlign: "-0.08em",
        margin: "0 0.04em",
      }}
    >
      {/* ── Main pot silhouette ──────────────────────────────────────────
          Clockwise from mouth top-left:
            arc over mouth → right neck straight down →
            right collar ring expands out → right body → base →
            left body → left collar ring → left neck
            Z closes: draws straight line back to M = left neck ✓
      */}
      <path d="
        M 17,4
        A 8,4 0 0 1 33,4
        L 33,16
        C 34,17 36,17 37,20
        C 39,22 41,24 42,28
        C 44,33 45,39 45,45
        C 45,54 40,60 31,62
        L 19,62
        C 10,60 5,54 5,45
        C 5,39 6,33 8,28
        C 9,24 11,22 13,20
        C 14,17 16,17 17,16
        Z
      " />

      {/* ── Mouth interior shadow ─────────────────────────────────────────
          Dark ellipse shows the hollow opening at the top of the pot
      */}
      <ellipse
        cx="25" cy="5"
        rx="6" ry="2.2"
        fill="rgba(20,17,16,0.28)"
      />

      {/* ── Collar ring ───────────────────────────────────────────────────
          Two horizontal lines at the neck-body junction.
          They extend wider than the neck (17→33) to show the ring flange.
          Line 1 sits at the bottom of the neck (y≈17).
          Line 2 sits at the bottom of the collar ring (y≈26).
      */}
      <line
        x1="13" y1="17.5" x2="37" y2="17.5"
        stroke="rgba(250,246,239,0.70)" strokeWidth="2.2" strokeLinecap="round"
      />
      <line
        x1="11" y1="26.5" x2="39" y2="26.5"
        stroke="rgba(250,246,239,0.70)" strokeWidth="2.2" strokeLinecap="round"
      />

      {/* ── Body bands ────────────────────────────────────────────────────
          Two white curved stripes across the belly, matching the clay-ring
          ridges visible in the reference image.
          Curved with Q (quadratic bezier) to follow the round pot belly.
      */}
      <path
        d="M 7,45 Q 25,50 43,45"
        fill="none"
        stroke="rgba(250,246,239,0.70)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 8,53 Q 25,58 42,53"
        fill="none"
        stroke="rgba(250,246,239,0.70)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * GullakLogo — "G" + clay-pot icon (replacing 'u') + "llak"
 *
 * Font: Cormorant Garamond 700 (bold) — matches the heavy serif in the reference
 *
 * @param {string} className  — e.g. font-size override
 * @param {string} testId     — data-testid attribute
 * @param {object} style      — color override, e.g. { color: '#FAF6EF' } for hero
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
        /* bold weight matches the heavy serif in the reference logo */
        "font-serif font-bold tracking-[0.01em]",
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
