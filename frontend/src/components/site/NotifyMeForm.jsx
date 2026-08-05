import React, { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export default function NotifyMeForm({ slug, name, variant = "card" }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email) return;
    setBusy(true);
    try {
      const res = await api.post(`/collections/${slug}/notify`, { email });
      if (res.data?.already) toast(res.data.message);
      else toast.success(res.data.message || "You're on the list");
      setDone(true);
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Please try again");
    } finally { setBusy(false); }
  };

  if (done) {
    return (
      <div className={variant === "hero" ? "mt-6 rounded-xl bg-[color:var(--surface)] border border-[color:var(--border-subtle)] p-4 text-sm text-[color:var(--ink-2)] flex items-center gap-2" : "mt-3 text-xs text-[color:var(--ink-3)] flex items-center gap-2"}>
        <Bell className="h-4 w-4 text-[color:var(--brand)]" />
        We'll write when {name} launches.
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md">
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]"
        />
        <button type="submit" disabled={busy} className="press-btn inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] text-[color:var(--surface)] px-6 py-3 text-sm hover:bg-[color:var(--brand-2)] disabled:opacity-70">
          <Bell className="h-4 w-4" />
          {busy ? "Adding…" : "Notify me"}
        </button>
      </form>
    );
  }

  return (
    <form onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} onSubmit={submit} className="mt-3 flex gap-1.5">
      <input
        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Notify me"
        className="flex-1 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[color:var(--brand-ring)]"
      />
      <button type="submit" disabled={busy} className="press-btn rounded-full bg-[color:var(--ink-1)] text-[color:var(--surface)] px-3 py-1.5 text-xs hover:bg-[color:var(--brand)] disabled:opacity-70">
        {busy ? "…" : "Alert me"}
      </button>
    </form>
  );
}
