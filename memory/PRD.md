# Gullak — PRD (v1 shipped)

**Gullak** is a premium editorial ecommerce website for a sustainable jewellery brand rooted in handcrafted terracotta jewellery, designed to scale into wood, bamboo, fabric, wool, cork, and other natural materials.

## v1 scope (shipped)
- Full editorial marketing storefront (Home, Collections list & detail, PDP, Journal list & detail, About, Craftsmanship, Artisans list & detail)
- Wishlist + Cart (guest via localStorage, authed via DB, guest→authed merge on login)
- Checkout with address collection + mock order placement (no real payments)
- Order confirmation + Account page with order history
- Newsletter signup
- **Customer auth**: Emergent Google Auth (cookie-based session)
- **Admin panel**: separate email+password (JWT) — full CRUD on Products, Collections, Journal, Artisans + Orders view + status update
- 5 collections (1 active Terracotta + 4 coming soon), 10 seeded terracotta products, 3 artisans, 5 journal articles, 6 testimonials

## Tech stack
- Backend: FastAPI + Motor (MongoDB), JWT (admin), bcrypt, httpx (Emergent Google Auth)
- Frontend: React + Tailwind + shadcn/ui + Framer Motion + Cormorant Garamond + Manrope
- DB: MongoDB (db name: `gullak`)

## Auth
- Customer: Google OAuth via Emergent, session_token cookie (httpOnly, secure, sameSite=none)
- Admin: email `admin@gullak.com` / password `gullak@admin2025` (JWT via `admin_token` cookie)
- Testing bypass documented in `/app/auth_testing.md`

## Testing status
Backend: 100% (19/19). Frontend public/admin/cart-wishlist: 100%.

## Not in v1
- Real payments (Stripe/Razorpay) — marked as demo in checkout
- Real Google OAuth in tests — bypass provided
