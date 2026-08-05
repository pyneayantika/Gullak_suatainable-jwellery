import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatINR, resolveImg } from "@/lib/api";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import ProductCard from "@/components/site/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { TID } from "@/lib/testIds";
import { Package, Heart, LogOut } from "lucide-react";

export default function Account() {
  const { user, logout } = useAuth();
  const { products: wishlistProducts } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("orders");
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    api.get("/orders/me")
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, []);

  const initial = (user?.name || user?.email || "G")[0].toUpperCase();

  return (
    <div>
      {/* Profile hero */}
      <div className="bg-[color:var(--surface-2)] border-b border-[color:var(--border-subtle)]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8 lg:px-14 py-10 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-[color:var(--border-subtle)]"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-[color:var(--brand)] flex items-center justify-center">
                <span className="font-serif text-2xl text-[color:var(--paper-white)] font-semibold">{initial}</span>
              </div>
            )}
            <div>
              <Overline>Your account</Overline>
              <h1 className="mt-1 font-serif text-3xl tracking-[-0.02em] text-[color:var(--ink-1)]">
                Hello, {user?.name?.split(" ")[0] || "friend"}
              </h1>
              <p className="text-xs text-[color:var(--ink-3)] mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button
            data-testid={TID.auth.logout}
            onClick={logout}
            className="press-btn inline-flex items-center gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-5 py-2.5 text-sm hover:bg-[color:var(--surface-2)] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      <Section wide>
        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-[color:var(--border-subtle)]">
          <button
            onClick={() => setTab("orders")}
            className={`inline-flex items-center gap-2 px-1 pb-3 text-sm border-b-2 -mb-px transition-colors ${
              tab === "orders"
                ? "border-[color:var(--brand)] text-[color:var(--brand)]"
                : "border-transparent text-[color:var(--ink-3)] hover:text-[color:var(--ink-1)]"
            }`}
          >
            <Package className="h-4 w-4" />
            Orders
            {orders.length > 0 && (
              <span className="text-[10px] rounded-full bg-[color:var(--brand)] text-[color:var(--paper-white)] px-1.5 py-0.5">{orders.length}</span>
            )}
          </button>
          <button
            onClick={() => setTab("wishlist")}
            className={`inline-flex items-center gap-2 px-4 pb-3 text-sm border-b-2 -mb-px transition-colors ${
              tab === "wishlist"
                ? "border-[color:var(--brand)] text-[color:var(--brand)]"
                : "border-transparent text-[color:var(--ink-3)] hover:text-[color:var(--ink-1)]"
            }`}
          >
            <Heart className="h-4 w-4" />
            Wishlist
            {wishlistProducts.length > 0 && (
              <span className="text-[10px] rounded-full bg-[color:var(--brand)] text-[color:var(--paper-white)] px-1.5 py-0.5">{wishlistProducts.length}</span>
            )}
          </button>
        </div>

        {/* Orders tab */}
        {tab === "orders" && (
          <div>
            {loadingOrders ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-[color:var(--surface)] animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-12 text-center">
                <Package className="h-8 w-8 text-[color:var(--ink-3)] mx-auto" />
                <div className="mt-4 font-serif text-2xl">No orders yet.</div>
                <p className="mt-2 text-sm text-[color:var(--ink-3)] max-w-sm mx-auto">
                  Your first Gullak piece is waiting. Each one handmade, slowly and honestly.
                </p>
                <Link
                  to="/collections/terracotta"
                  className="mt-6 inline-block press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--paper-white)] px-6 py-3 text-sm hover:bg-[color:var(--brand-2)]"
                >
                  Discover Terracotta
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(o => (
                  <div
                    key={o.order_id}
                    className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-serif text-lg">{o.order_id}</div>
                        <div className="text-xs text-[color:var(--ink-3)] mt-0.5">
                          {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {o.items.length} item{o.items.length > 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-lg">{formatINR(o.total)}</div>
                        <div className="text-xs uppercase tracking-widest text-[color:var(--brand)] mt-0.5">{o.status}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {o.items.slice(0, 5).map(it => (
                        <img
                          key={it.product_id}
                          src={resolveImg(it.image)}
                          alt={it.name}
                          className="h-14 w-12 rounded-lg object-cover flex-shrink-0 border border-[color:var(--border-subtle)]"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist tab */}
        {tab === "wishlist" && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-12 text-center">
                <Heart className="h-8 w-8 text-[color:var(--ink-3)] mx-auto" />
                <div className="mt-4 font-serif text-2xl">Nothing saved yet.</div>
                <p className="mt-2 text-sm text-[color:var(--ink-3)] max-w-sm mx-auto">
                  Tap the heart on any piece to save it here — for later, or for someone you love.
                </p>
                <Link
                  to="/collections/terracotta"
                  className="mt-6 inline-block press-btn rounded-full bg-[color:var(--brand)] text-[color:var(--paper-white)] px-6 py-3 text-sm hover:bg-[color:var(--brand-2)]"
                >
                  Explore pieces
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}
