# plan.md — Gullak (Editorial Ecommerce v1)

## 1) Objectives
- Deliver a premium, calm, editorial storefront for Gullak with a scalable data model (materials/collections).
- Enable core commerce loop (browse → PDP → wishlist/cart → mock checkout → order record) backed by MongoDB.
- Customer auth via **Emergent Google Auth** (implementation present but external provider config/flow may still need real-world verification); admin auth via **email/password + JWT**.
- Provide an Admin panel to manage products/collections/journal/artisans and view orders.
- Seed high-quality placeholder content (products, collections, journal posts, artisans, testimonials).
- Maintain strict brand fidelity: use user-supplied logo assets as-is (no recreation), premium typography (Cormorant Garamond + Manrope), warm earthy palette.
- Add premium *tactile* polish via subtle texture + atmospheric motion + grounded elevation:
  - **Global grain/noise overlay** on key surfaces
  - **Selective dust + warm mist layers** (“mus” interpreted as mist/haze)
  - **Warm terracotta-tinted 3D card shadows** across storefront cards

## 2) Implementation Steps (Phased)

### Phase 1 — Core Integration POC (Isolation): Customer Google Auth session works
**Why:** OAuth-style auth is failure-prone (redirect/session/callback); prove it before building UI flows.
- Websearch best practices for Emergent Google Auth in FastAPI (session cookie, callback, CORS, env vars).
- Implement minimal FastAPI endpoints:
  - `GET /api/auth/login` (start flow / redirect)
  - `GET /api/auth/session` (callback/establish session)
  - `GET /api/auth/me` (returns customer)
  - `POST /api/auth/logout`
- Create a minimal React page with a single “Continue with Google” button + `me` display.
- Verify: login, session persistence, logout, and MongoDB user upsert.

**Phase 1 status:** *Implemented previously; external OAuth/provider configuration and end-to-end browser verification may still be required depending on environment.*

**Phase 1 user stories (POC):**
1. As a user, I can click “Continue with Google” and successfully sign in.
2. As a user, after refresh, I remain logged in.
3. As a user, I can log out and see a logged-out state.
4. As a system, a new Google user is created/upserted in MongoDB.
5. As a developer, I can call `/api/auth/me` and get a stable JSON shape.

### Phase 2 — V1 App Development (MVP end-to-end, minimal auth dependencies)
**Core build (backend + frontend in one go):**
- Backend (FastAPI + Motor + MongoDB)
  - Collections: `products`, `collections`, `journal_posts`, `artisans`, `orders`, `users`, `wishlists`, `carts`, `testimonials`, `newsletter`, **site_content** (homepage + settings).
  - Public read endpoints:
    - `GET /api/home` (home sections data)
    - `GET /api/collections`, `GET /api/collections/{slug}`
    - `GET /api/products`, `GET /api/products/{slug}`
    - `GET /api/journal`, `GET /api/journal/{slug}`
    - `GET /api/artisans`, `GET /api/testimonials`
    - `POST /api/newsletter`
    - `GET /api/site-content` (dynamic homepage content/settings)
  - Cart/Wishlist:
    - Guest: localStorage only (frontend)
    - Authed: `GET/POST/DELETE /api/cart`, `GET/POST/DELETE /api/wishlist`
    - Merge on login (frontend strategy: read local → push to API → clear local)
  - Orders:
    - `POST /api/orders` (requires customer auth; captures address + line items; creates order)
    - `GET /api/orders/me` (order history)
  - Seed script:
    - Admin user placeholder (email/pass hash)
    - 8–12 terracotta products, terracotta collection active + 4 coming-soon collections
    - 4–5 journal posts, 3–4 artisans, 6–8 testimonials

- Frontend (React + Tailwind + shadcn/ui + Framer Motion)
  - Routing + layouts: `MarketingLayout`, `ShopLayout`, `AccountLayout`.
  - Pages:
    - `/` Home (all sections)
    - `/collections`, `/collections/:slug`
    - `/products/:slug` (editorial PDP: story/material/care/packaging/artisan/pair-with)
    - `/journal`, `/journal/:slug`
    - `/about`, `/craftsmanship`, `/artisans`
    - `/wishlist`, `/cart`, `/checkout`, `/order-confirmation/:orderId`, `/account`, `/login`
  - Global UX components:
    - Header (transparent→solid on scroll), footer (newsletter), cards, filters, empty states
    - Cart drawer + wishlist heart, toasts, skeleton loaders
    - Search modal (MVP: local client-side search over fetched products)
  - SEO/accessibility basics: semantic headings, alt text, focus states.
  - **Brand polish shipped (earthy 3D ambience):**
    - Subtle **grain texture overlay** (`.grain-bg`) applied to hero (and available for other large surfaces)
    - **DustParticles component** (hero + section variants) placed selectively “here and there”:
      - Home hero
      - Our Promise section
      - Featured Collections strip
    - Warm **terracotta-tinted 3D card shadows** (`.card-earthy`) applied to key cards:
      - Product cards, collection cards, journal cards, testimonials, “Why Gullak” cards
      - Additional coverage added on `/collections` and `/journal` pages
    - Motion respects `prefers-reduced-motion`

**Conclude Phase 2:** run testing_agent_v3 end-to-end on browse → cart → mock checkout → order confirmation (logged-in).

**Phase 2 user stories (v1):**
1. As a guest, I can browse collections and open a product detail page with rich editorial sections.
2. As a guest, I can add products to cart and see totals update.
3. As a user, I can sign in with Google and my cart/wishlist merges from guest state.
4. As a signed-in user, I can place a mock order by entering address and receive confirmation.
5. As a signed-in user, I can view my order history in Account.

### Phase 3 — Admin Panel + Editorial CMS (JWT admin)
- Admin auth (separate from customer auth):
  - `POST /api/admin/login`, `GET /api/admin/me` (JWT)
- Admin CRUD APIs (JWT-protected):
  - `/api/admin/products` (CRUD; image URL fields)
  - `/api/admin/collections` (CRUD)
  - `/api/admin/journal` (CRUD; markdown/portable text)
  - `/api/admin/artisans` (CRUD)
  - `/api/admin/orders` (list/detail; status updates optional)
  - `/api/admin/site-content` (edit homepage content/settings)
  - `/api/admin/upload` (local uploads) and `/api/uploads/*` serving
- Admin UI:
  - `/admin/login`, `/admin` dashboard, tables + forms (shadcn DataTable)
  - Product editor: slug, pricing, images, material tags, inventory flag, featured, SEO fields
  - Journal editor: cover image, body, tags, publish toggle
  - **Theme-adjacent controls (partial):**
    - Admin Site Content page for homepage hero + Our Promise
    - Admin Logo Size page for header logo sizing
- Polish: role separation (admin-only routes), error handling, optimistic UI.

**Conclude Phase 3:** testing_agent_v3 on admin login → create product → appears in storefront → edit journal → visible.

**Phase 3 user stories (admin):**
1. As an admin, I can log in with email/password and access a protected dashboard.
2. As an admin, I can add a product with images and it appears on the collection page.
3. As an admin, I can edit a product and see updates reflected immediately.
4. As an admin, I can publish a journal post and it appears in the Journal list.
5. As an admin, I can view orders placed by customers.

### Phase 4 — Quality, performance, and brand polish
- Visual refinement per design system: tokens, typography scale, spacing, motion restraint.
- Accessibility pass (WCAG AA basics): keyboard nav, contrast, labels, focus rings.
- Performance/SEO: image sizing, lazy-loading, meta tags, OpenGraph.
- Robustness: API validation (Pydantic), consistent error envelopes, rate-limit newsletter.
- **Atmosphere performance safeguards:**
  - Keep dust/mist layers subtle and selective (avoid clutter)
  - Ensure only `transform`/`opacity` animate; no `transition: all`
  - Ensure reduced-motion mode disables decorative animation layers

**Conclude Phase 4:** testing_agent_v3 full regression (guest + authed + admin) + fix until green.

**Phase 4 user stories (polish):**
1. As a user, I experience fast page loads with graceful skeletons while content loads.
2. As a keyboard user, I can navigate menus, modals, and forms without traps.
3. As a user, I can share a product link with correct title/description preview.
4. As a user, I see consistent empty/error states (no broken layouts).
5. As an admin, I can recover from validation errors with clear inline messages.

## 3) Next Actions (Immediate)
1. Run **testing_agent_v3 regression** focused on:
   - Home (dust/grain layers + readability)
   - Collections grid (card-earthy + hover)
   - Journal listing (card-earthy)
   - Reduced motion behavior
2. Confirm “mus” interpretation with user (currently implemented as **warm mist/haze**, not moss).
3. Ensure dust/grain layers remain selective and do not interfere with CTAs/legibility; tune opacity if requested.
4. Continue hardening admin flows (site-content save/load, logo-size persistence) with end-to-end verification.

## 4) Success Criteria
- Customer Google login works reliably (login → session persists → logout) and user is stored in MongoDB.
- Guests can browse, add to cart; signed-in users can wishlist/cart with DB persistence and merge-on-login.
- Mock checkout creates an `order` record and order confirmation page renders correctly.
- Admin JWT login works; admin can CRUD products/collections/journal/artisans and view orders.
- Site matches editorial, warm, premium brand direction with tactile depth:
  - Grain texture present but subtle
  - Dust/mist ambience selective and non-distracting
  - Card shadows consistent, warm, and premium
  - Mobile-first responsive and accessible
