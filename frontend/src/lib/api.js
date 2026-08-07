import axios from "axios";

/**
 * In deployed environments (Preview + Production), the Kubernetes ingress routes
 * /api/* to the backend on the same origin. We use a relative base URL so each
 * environment (Preview vs Production) always talks to its own backend — not a
 * hardcoded Preview URL baked at build time.
 *
 * In local development (localhost), we use the explicit REACT_APP_BACKEND_URL
 * because frontend (port 3000) and backend (port 8001) are on different ports.
 */
function getBackendBase() {
  if (typeof window === "undefined") return process.env.REACT_APP_BACKEND_URL || "";
  const { hostname } = window.location;
  const isLocalDev = hostname === "localhost" || hostname === "127.0.0.1";
  return isLocalDev ? (process.env.REACT_APP_BACKEND_URL || "http://localhost:8001") : "";
}

export const BACKEND_BASE = getBackendBase();
export const API_BASE = `${BACKEND_BASE}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

/**
 * Resolve an image URL.
 * - Absolute URLs (http/https/data:) returned as-is.
 * - Relative /api/uploads/... paths are prepended with BACKEND_BASE.
 *   In deployed envs BACKEND_BASE is "" so they become same-origin relative URLs.
 */
export const resolveImg = (u) => {
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("data:")) return u;
  if (u.startsWith("/api/") || u.startsWith("/uploads/")) {
    return `${BACKEND_BASE}${u.startsWith("/api/") ? u : "/api" + u}`;
  }
  return u;
};
