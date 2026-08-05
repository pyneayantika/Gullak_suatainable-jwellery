import React from "react";
import { Link } from "react-router-dom";

/**
 * LogoPlaceholder — swap this entire component with your own logo.
 *
 * Sizing is em-based so the box scales automatically:
 *   Header  (font 30px)  →  ~156px × ~39px
 *   Footer  (font 28px)  →  ~146px × ~36px
 *   Hero    (font 96px)  →  ~499px × ~125px
 *
 * To replace:
 *   1. Delete this file (or clear its contents)
 *   2. Export a new `GullakLogo` component from this file
 *      that renders your actual logo image / SVG
 */

export function GullakLogo({ className = "", testId = "", style = {} }) {
  return (
    <Link
      to="/"
      data-testid={testId}
      aria-label="Logo — home"
      style={{ color: style.color ?? "var(--brand)", ...style }}
      className={[
        // em-based dimensions scale with the font-size from parent className
        "inline-flex items-center justify-center",
        "w-[5.2em] h-[1.3em]",
        "border border-dashed rounded",
        "opacity-50 hover:opacity-75 transition-opacity duration-200",
        "select-none flex-shrink-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        style={{ fontSize: "11px", letterSpacing: "0.2em" }}
        className="uppercase font-medium"
      >
        your logo
      </span>
    </Link>
  );
}
