import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const CartContext = createContext(null);
const LS_KEY = "gullak_cart_v1";

const readLocal = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
};
const writeLocal = (items) => localStorage.setItem(LS_KEY, JSON.stringify(items));

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // [{product, quantity}]
  const [open, setOpen] = useState(false);

  const hydrateFromServer = useCallback(async () => {
    try {
      const res = await api.get("/cart");
      setItems(res.data.items || []);
    } catch { /* not authed */ }
  }, []);

  const hydrateFromLocal = useCallback(async () => {
    const local = readLocal(); // [{product_id, quantity}]
    if (!local.length) return setItems([]);
    // fetch product info
    try {
      const res = await api.get("/products");
      const map = Object.fromEntries((res.data || []).map(p => [p.id, p]));
      const rich = local.filter(l => map[l.product_id]).map(l => ({ product: map[l.product_id], quantity: l.quantity }));
      setItems(rich);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        // Merge local into server
        const local = readLocal();
        if (local.length) {
          try {
            await api.post("/cart/merge", { items: local });
          } catch (_) {}
          writeLocal([]);
        }
        hydrateFromServer();
      })();
    } else {
      hydrateFromLocal();
    }
  }, [user, hydrateFromServer, hydrateFromLocal]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      const existing = items.find(i => i.product.id === product.id);
      const newQty = (existing?.quantity || 0) + quantity;
      await api.post("/cart", { product_id: product.id, quantity: newQty });
      hydrateFromServer();
    } else {
      const local = readLocal();
      const found = local.find(l => l.product_id === product.id);
      if (found) found.quantity += quantity;
      else local.push({ product_id: product.id, quantity });
      writeLocal(local);
      hydrateFromLocal();
    }
    toast.success("Added to cart", { description: product.name });
    setOpen(true);
  };

  const updateQty = async (productId, quantity) => {
    if (user) {
      await api.post("/cart", { product_id: productId, quantity });
      hydrateFromServer();
    } else {
      let local = readLocal();
      if (quantity <= 0) local = local.filter(l => l.product_id !== productId);
      else {
        const f = local.find(l => l.product_id === productId);
        if (f) f.quantity = quantity;
      }
      writeLocal(local);
      hydrateFromLocal();
    }
  };

  const removeItem = async (productId) => {
    if (user) {
      await api.delete(`/cart/${productId}`);
      hydrateFromServer();
    } else {
      const local = readLocal().filter(l => l.product_id !== productId);
      writeLocal(local);
      hydrateFromLocal();
    }
  };

  const clear = async () => {
    if (user) {
      for (const it of items) { try { await api.delete(`/cart/${it.product.id}`); } catch(_){} }
      hydrateFromServer();
    } else {
      writeLocal([]);
      setItems([]);
    }
  };

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, open, setOpen, addToCart, updateQty, removeItem, clear, subtotal, count, refresh: user ? hydrateFromServer : hydrateFromLocal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
