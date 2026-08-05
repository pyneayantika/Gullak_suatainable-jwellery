import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { TID } from "@/lib/testIds";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@gullak.com");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/admin/login", { email, password });
      toast.success("Welcome back");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Invalid credentials");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[color:var(--bg)] p-6">
      <form data-testid={TID.admin.loginForm} onSubmit={submit} className="w-full max-w-md rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-8 shadow-[0_20px_60px_rgba(20,17,16,0.08)]">
        <div className="text-center">
          <div className="serif text-3xl">Gullak</div>
          <div className="overline mt-1">Studio Admin</div>
        </div>
        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="overline block mb-1.5">Email</span>
            <input
              data-testid={TID.admin.loginEmail}
              value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" required autoComplete="email"
              className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]"
            />
          </label>
          <label className="block">
            <span className="overline block mb-1.5">Password</span>
            <input
              data-testid={TID.admin.loginPassword}
              value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" required autoComplete="current-password"
              className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]"
            />
          </label>
        </div>
        <button data-testid={TID.admin.loginSubmit} disabled={busy} type="submit" className="press-btn mt-6 w-full rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] py-3.5 text-sm hover:bg-[color:var(--brand-2)] disabled:opacity-70">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
