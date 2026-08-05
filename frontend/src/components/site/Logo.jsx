import React from "react";
import { Link } from "react-router-dom";

/**
 * GullakLogo — renders "G" + clay-pot SVG + "llak"
 * The pot (gullak/matka) replaces the letter 'u',
 * matching the brand identity in the reference image.
 */

function PotIcon() {
  return (
    <svg
      viewBox="0 0 38 50"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
      style={{
        display: "inline-block",
        height: "0.80em",
        width: "auto",
        // Slight drop so base of pot aligns with text baseline
        verticalAlign: "-0.06em",
        // Tighten spacing on both sides
        margin: "0 0.025em",
      }}
    >
      {/*
        Main pot silhouette
        — narrow neck at top, round belly, slight base narrowing
        — path goes clockwise: top-left rim → top arc → right neck →
          right shoulder → right belly → base → left belly →
          left shoulder → left neck → close
      */}
      <path d="
        M 11,7
        A 8,3.5 0 0 1 27,7
        C 29,9 30,12 29,17
        C 33,21 36,27 36,33
        C 36,41 32,47 25,49
        L 13,49
        C 6,47 2,41 2,33
        C 2,27 5,21 9,17
        C 8,12 9,9 11,7
        Z
      " />

      {/*
        Inner mouth shadow — subtle darker ellipse
        suggests the hollow opening of the clay pot
      */}
      <ellipse
        cx="19"
        cy="8"
        rx="6.5"
        ry="2"
        fill="rgba(20,17,16,0.22)"
      />

      {/*
        Decorative horizontal bands across the belly
        These are the traditional ridges pressed into wet clay.
        Light cream strokes, visible enough on terracotta fill.
      */}
      <path
        d="M 4,34 Q 19,38 34,34"
        fill="none"
        stroke="rgba(250,246,239,0.50)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 5,41 Q 19,45 33,41"
        fill="none"
        stroke="rgba(250,246,239,0.50)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * @param {string}  className  — extra classes (e.g. font-size overrides)
 * @param {string}  testId     — data-testid forwarded to the Link
 */
export function GullakLogo({ className = "", testId = "" }) {
  return (
    <Link
      to="/"
      data-testid={testId}
      aria-label="Gullak — home"
      className={[
        "inline-flex items-end leading-none select-none",
        "font-serif font-semibold tracking-[0.02em]",
        "text-[color:var(--brand)]",
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
