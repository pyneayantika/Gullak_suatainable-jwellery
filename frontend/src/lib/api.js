import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

/** Resolve an image URL — if it's a relative /api/... path, prepend REACT_APP_BACKEND_URL */
export const resolveImg = (u) => {
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("data:")) return u;
  if (u.startsWith("/api/") || u.startsWith("/uploads/")) {
    const base = process.env.REACT_APP_BACKEND_URL || "";
    return `${base}${u.startsWith("/api/") ? u : "/api" + u}`;
  }
  return u;
};
