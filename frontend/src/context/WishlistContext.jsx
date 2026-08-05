import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const WishlistContext = createContext(null);
const LS_KEY = "gullak_wishlist_v1";
const readLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; } };
const writeLocal = (ids) => localStorage.setItem(LS_KEY, JSON.stringify(ids));

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState([]);
  const [products, setProducts] = useState([]);

  const hydrateServer = useCallback(async () => {
    try {
      const res = await api.get("/wishlist");
      setIds(res.data.items || []);
      setProducts(res.data.products || []);
    } catch { /* not authed */ }
  }, []);

  const hydrateLocal = useCallback(async () => {
    const localIds = readLocal();
    setIds(localIds);
    if (!localIds.length) return setProducts([]);
    try {
      const res = await api.get("/products");
      const map = Object.fromEntries((res.data || []).map(p => [p.id, p]));
      setProducts(localIds.map(id => map[id]).filter(Boolean));
    } catch { setProducts([]); }
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        const localIds = readLocal();
        for (const pid of localIds) { try { await api.post("/wishlist", { product_id: pid }); } catch(_){} }
        writeLocal([]);
        hydrateServer();
      })();
    } else {
      hydrateLocal();
    }
  }, [user, hydrateServer, hydrateLocal]);

  const toggle = async (product) => {
    const has = ids.includes(product.id);
    if (user) {
      if (has) { await api.delete(`/wishlist/${product.id}`); toast("Removed from wishlist"); }
      else { await api.post("/wishlist", { product_id: product.id }); toast.success("Saved to wishlist", { description: product.name }); }
      hydrateServer();
    } else {
      let local = readLocal();
      if (has) { local = local.filter(x => x !== product.id); toast("Removed from wishlist"); }
      else { local.push(product.id); toast.success("Saved to wishlist", { description: product.name }); }
      writeLocal(local);
      hydrateLocal();
    }
  };

  const has = (id) => ids.includes(id);

  return (
    <WishlistContext.Provider value={{ ids, products, toggle, has, refresh: user ? hydrateServer : hydrateLocal }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
