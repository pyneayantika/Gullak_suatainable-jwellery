import React from "react";
import Section from "@/components/site/Section";
import Overline from "@/components/site/Overline";
import { TID } from "@/lib/testIds";

export default function Login() {
  const startGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/account";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <Section>
      <div className="max-w-md mx-auto text-center">
        <Overline>Welcome to Gullak</Overline>
        <h1 className="mt-3 serif text-4xl sm:text-5xl tracking-[-0.02em]">Sign in</h1>
        <p className="mt-4 text-[15px] leading-[1.85] text-[color:var(--ink-2)]">Save wishlists, follow your orders, and receive slow letters from the studio.</p>
        <button
          data-testid={TID.auth.googleBtn}
          onClick={startGoogleLogin}
          className="press-btn mt-8 w-full rounded-full bg-[color:var(--ink-1)] text-white py-3.5 text-sm hover:bg-[color:var(--earth-brown)] inline-flex items-center justify-center gap-3"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity=".82"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" opacity=".62"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" opacity=".92"/></svg>
          Continue with Google
        </button>
        <p className="mt-4 text-[11px] text-[color:var(--ink-3)]">By signing in you agree to our privacy-first practices. We never sell your data.</p>
      </div>
    </Section>
  );
}
