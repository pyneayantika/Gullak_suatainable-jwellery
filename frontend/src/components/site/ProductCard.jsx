import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { formatINR } from "@/lib/api";
import { useWishlist } from "@/context/WishlistContext";
import { TID } from "@/lib/testIds";

export default function ProductCard({ product, priority = false }) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);

  return (
    <div data-testid={TID.productCard.root} className="group relative rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border-subtle)]">
      <Link data-testid={TID.productCard.open} to={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/5] w-full overflow-hidden bg-[color:var(--surface-2)]">
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="pcard-img h-full w-full object-cover"
          />
        </div>
      </Link>
      <button
        data-testid={TID.productCard.wishlist}
        onClick={(e) => { e.preventDefault(); toggle(product); }}
        aria-label="Toggle wishlist"
        className={`absolute top-3 right-3 h-9 w-9 rounded-full backdrop-blur bg-[rgba(255,252,247,0.75)] inline-flex items-center justify-center transition-colors ${wished ? "text-[color:var(--brand)]" : "text-[color:var(--ink-2)] hover:text-[color:var(--brand)]"}`}
      >
        <Heart className="h-4 w-4" fill={wished ? "currentColor" : "none"} />
      </button>
      <div className="p-4 sm:p-5">
        <div className="overline">{product.material}</div>
        <Link to={`/products/${product.slug}`} className="mt-1 block serif text-lg text-[color:var(--ink-1)]">{product.name}</Link>
        {product.subtitle && (
          <p className="mt-1 text-sm text-[color:var(--ink-3)] line-clamp-1">{product.subtitle}</p>
        )}
        <p data-testid={TID.productCard.price} className="mt-3 text-sm font-medium text-[color:var(--ink-1)]">{formatINR(product.price)}</p>
      </div>
    </div>
  );
}
