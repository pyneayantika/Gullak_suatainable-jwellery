# plan.md — Gullak Studio (Editorial Ecommerce v1)

## 1) Objectives
- Deliver a premium, calm, editorial storefront for handcrafted terracotta jewellery with a scalable data model (collections/products/editorial).
- Enable the core commerce loop (browse → PDP → wishlist/cart → mock checkout → order record) backed by MongoDB.
- Customer auth via **Emergent Google Auth** (implementation present; real-world provider flow still needs verification depending on environment); admin auth via **email/password + JWT**.
- Provide an Admin panel to manage Products, Collections, Journal, Artisans, Studio Diary, Orders, and Site Content.
- Maintain strict brand fidelity: use user-supplied logo asset as-is (no recreation), premium typography (Cormorant Garamond + Manrope), warm terracotta/cream palette.
- Ship premium tactile polish via subtle texture + atmospheric motion + grounded elevation:
  - Global grain/noise overlay on key surfaces
  - Selective dust + warm mist (“mus” interpreted as mist/haze)
  - Warm terracotta-tinted card depth shadows

**GOVERNING REQUIREMENT (COMPLETED IN PREVIEW): Admin reliability**
- Ensure **all admin image uploads + text/field edits save reliably on every attempt** and **appear in the storefront**.
- Prevent cross-environment data routing (Production must never write to Preview).
- Ensure uploaded images remain available after redeploys (no broken images due to ephemeral disk).

**Current deployment note (important):**
- Fixes were implemented and verified in **Preview**.
- To apply them to **Production** (`https://gullak-studio.emergent.host`), the user must **redeploy**.

---

## 2) Implementation Steps (Phased)

### Phase 1 — Core Integration POC (Isolation): Customer Google Auth session works
**Why:** OAuth-style auth is failure-prone (redirect/session/callback); prove it before building UI flows.
- Research Emergent Google Auth best practices for FastAPI (session cookie, callback, CORS, env vars).
- Implement minimal FastAPI endpoints:
  - `POST /api/auth/session` (exchange Emergent `session_id` for `session_token` and set cookie)
  - `GET /api/auth/me` (returns customer)
  - `POST /api/auth/logout`
- Create minimal React flow for login and `/me` display.
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
  - Collections: `products`, `collections`, `journal_posts`, `artisans`, `orders`, `users`, `wishlists`, `carts`, `testimonials`, `newsletter`, **site_content**, `studio_moments`.
  - Public read endpoints:
    - `GET /api/home` (home sections data)
    - `GET /api/collections`, `GET /api/collections/{slug}`
    - `GET /api/products`, `GET /api/products/{slug}`
    - `GET /api/journal`, `GET /api/journal/{slug}`
    - `GET /api/artisans`, `GET /api/testimonials`
    - `POST /api/newsletter`
    - `GET /api/site-content`
    - `GET /api/studio-moments`
  - Cart/Wishlist:
    - Guest: localStorage only (frontend)
    - Authed: `GET/POST/DELETE /api/cart`, `GET/POST/DELETE /api/wishlist`
    - Merge on login (frontend strategy: read local → push to API → clear local)
  - Orders:
    - `POST /api/orders` (requires customer auth; captures address + line items)
    - `GET /api/orders/me`
  - Seed script:
    - Admin user placeholder
    - Seed products/collections/journal/artisans/testimonials/studio moments

- Frontend (React + Tailwind + shadcn/ui)
  - Routing + layouts.
  - Pages: Home, collections, PDP, journal, artisans, wishlist/cart/checkout/account.
  - Global UX components: header/footer, cart drawer, toasts, skeleton loaders.
  - Brand polish shipped (earthy 3D ambience):
    - Grain overlay (`.grain-bg`)
    - DustParticles component selective placement
    - Warm `card-earthy` shadows
    - Reduced motion support

**Phase 2 status:** *Implemented previously; visual verification is not screenshot-reliable, but code is present and builds have passed in parts.*

**Conclude Phase 2:** testing_agent regression on browse → cart → mock checkout → order confirmation (logged-in).

**Phase 2 user stories (v1):**
1. As a guest, I can browse collections and open a product detail page with rich editorial sections.
2. As a guest, I can add products to cart and see totals update.
3. As a user, I can sign in with Google and my cart/wishlist merges from guest state.
4. As a signed-in user, I can place a mock order and receive confirmation.
5. As a signed-in user, I can view order history.

### Phase 3 — Admin Panel + Editorial CMS (JWT admin)
- Admin auth:
  - `POST /api/admin/login`, `GET /api/admin/me`, `POST /api/admin/logout`
- Admin CRUD APIs (JWT-protected):
  - `/api/admin/products` (CRUD)
  - `/api/admin/collections` (CRUD)
  - `/api/admin/journal` (CRUD)
  - `/api/admin/artisans` (CRUD)
  - `/api/admin/orders` (list/status updates)
  - `/api/admin/site-content` (edit homepage content/settings)
  - `/api/admin/studio-moments` (Studio Diary)
  - `/api/admin/upload` (uploads) + `/api/uploads/*` (serve)
- Admin UI routes:
  - `/admin/login`, `/admin` dashboard, Products, Collections, Journal, Artisans, Orders, Notifications, Studio Diary, Site Content.

**Phase 3 status:** *Implemented and verified in Preview. Production requires redeploy for fixes to take effect.*

**Conclude Phase 3:** testing_agent regression on admin login → create/edit product/collection/journal/artisan/moment → appears in storefront.

**Phase 3 user stories (admin):**
1. As an admin, I can log in and access protected admin routes.
2. As an admin, I can CRUD products and see changes on the storefront.
3. As an admin, I can CRUD collections (including banner image) and see updates on collection pages.
4. As an admin, I can publish/edit journal posts and see them on the Journal pages.
5. As an admin, I can manage artisans and studio diary moments.

### Phase 3.1 — Admin Persistence & Upload Reliability (HOTFIX / highest priority)
**Why:** Production admin edits were reported as not populating in the frontend UI across all admin sections.

#### Root Causes (confirmed in code)
1. **Cross-environment API routing:** `REACT_APP_BACKEND_URL` was baked into the frontend build; Production could call the Preview backend, causing writes to land in the wrong environment.
2. **Ephemeral uploads:** uploads were stored only on backend local disk (`/app/backend/uploads`), which can be wiped on redeploys.
3. **ImageUploader absolute URL assumption:** `ImageUploader.jsx` used `process.env.REACT_APP_BACKEND_URL` for previewing uploaded images, compounding cross-environment issues.

#### Fix Implementation (COMPLETED in Preview; user redeploy required for Production)
**A) Frontend API base: use relative `/api` in deployed environments**
- Updated `/app/frontend/src/lib/api.js`:
  - Uses a relative API base (`/api`) when hostname is not localhost.
  - Keeps env-based URL for local development only.
  - `resolveImg()` now resolves `/api/...` images against the current origin (or explicit backend base in local dev).

**B) ImageUploader uses shared resolver (no hardcoded backend URL)**
- Updated `/app/frontend/src/components/site/ImageUploader.jsx`:
  - Imports and uses `resolveImg()` from `@/lib/api` for image previews.

**C) Durable uploads: MongoDB-backed storage + disk cache fallback**
- Updated `/app/backend/server.py`:
  - `POST /api/admin/upload` now stores uploads in MongoDB (`uploads` collection) as base64 + writes to disk as a cache.
  - `GET /api/uploads/{filename}` now:
    - serves from disk when present,
    - falls back to MongoDB when disk file is missing,
    - restores disk cache after Mongo fallback.

**D) Verification & regression testing**
- Testing agent verified end-to-end in Preview:
  - Admin CRUD works across Products, Collections, Journal, Artisans, Studio Diary, Site Content.
  - Uploaded images persist after refresh.
  - MongoDB fallback works after deleting disk cache file.
  - Metrics: **97.2% backend**, **100% frontend**, **100% image persistence**.

#### Verification Checklist (must pass repeatedly)
- In Preview (✅ completed):
  1. Admin login works.
  2. Upload image → returned URL works.
  3. Create + edit Product/Collection/Journal/Artisan/Studio Moment.
  4. Refresh admin page → values persist.
  5. Open storefront pages → values appear.
  6. Delete disk upload → image still serves from Mongo, cache restored.
- In Production (⏳ pending):
  - User redeploys after fixes.
  - Repeat same checklist on `https://gullak-studio.emergent.host`.

**Phase 3.1 status:** *COMPLETED in Preview; Production rollout pending redeploy.*

### Phase 4 — Quality, performance, and brand polish
- Visual refinement per design system: tokens, typography scale, spacing, motion restraint.
- Accessibility pass (WCAG AA basics): keyboard nav, contrast, labels, focus rings.
- Performance/SEO: image sizing, lazy-loading, meta tags, OpenGraph.
- Robustness:
  - API validation (Pydantic)
  - Consistent error envelopes
  - **Admin reliability regression suite** (repeat saves, confirm storefront sync)
- Atmosphere performance safeguards:
  - Keep dust/mist layers subtle/selective
  - Animate only transform/opacity
  - Ensure reduced-motion disables decorative layers

**Conclude Phase 4:** full regression (guest + authed + admin) + fix until green.

---

## 3) Next Actions (Immediate)
1. **Production rollout:** Redeploy so Production (`https://gullak-studio.emergent.host`) picks up the Preview fixes.
2. After redeploy, run the Phase 3.1 Production checklist:
   - upload image, edit text, refresh admin, confirm storefront updates.
3. Optional hardening follow-ups (if needed after production validation):
   - Adjust upload traversal response to return `400` for encoded traversal attempts (currently can return 404; low priority).
   - Add extra admin-save safeguards (e.g., verify matched_count for update operations and return 404 if missing).

## 4) Success Criteria
- Customer Google login works reliably (login → session persists → logout) and user is stored in MongoDB.
- Guests can browse and add to cart; signed-in users have DB-persisted cart/wishlist with merge-on-login.
- Mock checkout creates an order record; confirmation page renders correctly.
- Admin JWT login works; admin can CRUD products/collections/journal/artisans/studio diary and view orders.
- **Admin reliability (✅ verified in Preview, pending Production redeploy):**
  - Admin edits save on every attempt and are visible after refresh.
  - Storefront always reflects saved changes.
  - Production frontend talks to Production backend only (no Preview leakage).
  - Uploaded images survive redeploys (served from Mongo fallback).
- Site matches editorial, warm, premium brand direction with tactile depth:
  - Grain subtle
  - Dust/mist selective
  - Card shadows consistent and premium
  - Mobile-first responsive and accessible
