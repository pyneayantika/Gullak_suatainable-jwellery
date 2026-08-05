import React from "react";
import { Link } from "react-router-dom";

/**
 * GullakLogo — renders the brand logo image.
 *
 * Sizing is controlled entirely via the `className` prop (height class):
 *   Header / Footer : className="h-10"   (40 px)
 *   Hero            : className="h-20 sm:h-24 lg:h-32"  (80 → 96 → 128 px)
 *
 * To swap the logo file, replace /app/frontend/public/logo.png
 * and no other code needs changing.
 */
export function GullakLogo({ className = "", testId = "", style = {} }) {
  return (
    <Link
      to="/"
      data-testid={testId}
      aria-label="Gullak — home"
      className="inline-flex items-center select-none hover:opacity-90 transition-opacity duration-200 flex-shrink-0"
    >
      <img
        src="/logo.png"
        alt="Gullak"
        style={style}
        className={["w-auto object-contain", className].filter(Boolean).join(" ")}
        draggable={false}
      />
    </Link>
  );
}
