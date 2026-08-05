import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Idempotent effect: only run once even under StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    (async () => {
      try {
        const hash = location.hash || "";
        const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
        const sessionId = params.get("session_id");
        if (!sessionId) throw new Error("Missing session_id");
        const res = await api.post("/auth/session", { session_id: sessionId });
        setUser(res.data.user);
        // Clear hash and route to account
        window.history.replaceState({}, document.title, window.location.pathname);
        toast.success("Welcome to Gullak");
        navigate("/account", { replace: true });
      } catch (e) {
        toast.error("Could not complete sign-in");
        navigate("/login", { replace: true });
      }
    })();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="overline">Signing you in</div>
        <div className="mt-3 serif text-3xl">One quiet moment…</div>
      </div>
    </div>
  );
}
