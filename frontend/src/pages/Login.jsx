import React from "react";
import { TID } from "@/lib/testIds";
import Overline from "@/components/site/Overline";

const HERO_IMG = "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1200&q=80";

export default function Login() {
  const startGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/account";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-[calc(100vh-72px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left — editorial image panel */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Handcrafted Gullak jewellery"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,17,16,0.75)] via-[rgba(20,17,16,0.25)] to-transparent" />
        {/* Brand copy pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-10 text-[color:var(--paper-white)]">
          <Overline className="text-[rgba(255,252,247,0.65)]">Handcrafted — India</Overline>
          <h2 className="mt-3 font-serif text-4xl font-medium leading-[1.1] tracking-[-0.02em]">
            Wear Nature.<br />
            <span className="italic text-[color:var(--brand-2)]">Wear Stories.</span><br />
            Wear Craft.
          </h2>
          <p className="mt-4 text-sm text-[rgba(255,252,247,0.7)] leading-relaxed max-w-sm">
            Sign in to save pieces, track orders, and receive slow letters from the studio.
          </p>
        </div>
      </div>

      {/* Right — sign-in panel */}
      <div className="flex items-center justify-center px-6 py-16 bg-[color:var(--bg)]">
        <div className="w-full max-w-sm">
          {/* Mobile brand headline */}
          <div className="lg:hidden mb-10 text-center">
            <Overline>Welcome to Gullak</Overline>
            <p className="mt-2 text-sm text-[color:var(--ink-3)]">
              Handcrafted jewellery, slow and sincere.
            </p>
          </div>

          {/* Sign in card */}
          <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-8 shadow-[0_4px_32px_rgba(20,17,16,0.06)]">
            <Overline>Welcome back</Overline>
            <h1 className="mt-3 font-serif text-4xl tracking-[-0.02em] text-[color:var(--ink-1)]">Sign in</h1>
            <p className="mt-3 text-[14px] leading-[1.8] text-[color:var(--ink-3)]">
              Save wishlists, follow your orders, and receive slow letters from the studio.
            </p>

            <button
              data-testid={TID.auth.googleBtn}
              onClick={startGoogleLogin}
              className="press-btn mt-8 w-full rounded-full bg-[color:var(--ink-1)] text-[color:var(--paper-white)] py-3.5 text-sm hover:bg-[color:var(--earth-brown)] inline-flex items-center justify-center gap-3 transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(255,252,247,1)" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,252,247,0.82)" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="rgba(255,252,247,0.62)" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(255,252,247,0.92)" />
              </svg>
              Continue with Google
            </button>

            <div className="mt-6 pt-6 border-t border-[color:var(--border-subtle)] text-center">
              <p className="text-[11px] text-[color:var(--ink-3)] leading-relaxed">
                By signing in you agree to our privacy-first practices.<br />
                We never sell your data.
              </p>
            </div>
          </div>

          {/* Trust markers */}
          <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-[color:var(--ink-3)]">
            <span>🌿 Zero plastic</span>
            <span>✦ Handmade</span>
            <span>🤍 Fair-trade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
