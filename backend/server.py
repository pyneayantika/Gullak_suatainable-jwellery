"""
Gullak — Sustainable Jewellery Brand
FastAPI backend with two auth systems:
  1. Customer auth via Emergent Google Auth (session_token cookie)
  2. Admin auth via email/password + JWT (admin_token cookie)

REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
"""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, Cookie, Header, Body, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import hashlib
import hmac
import jwt as pyjwt
import bcrypt
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'gullak-dev-secret')
JWT_ALG = 'HS256'
ADMIN_TOKEN_TTL_HOURS = 24 * 7

app = FastAPI(title="Gullak API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("gullak")

# ---------- Helpers ----------
def now_utc():
    return datetime.now(timezone.utc)

def iso(dt: datetime) -> str:
    if isinstance(dt, str):
        return dt
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()

def clean_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Remove Mongo _id, and convert datetimes to iso strings for JSON safety."""
    if doc is None:
        return None
    out = {}
    for k, v in doc.items():
        if k == "_id":
            continue
        if isinstance(v, datetime):
            out[k] = iso(v)
        elif isinstance(v, list):
            out[k] = [clean_doc(x) if isinstance(x, dict) else (iso(x) if isinstance(x, datetime) else x) for x in v]
        elif isinstance(v, dict):
            out[k] = clean_doc(v)
        else:
            out[k] = v
    return out

def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

def create_admin_jwt(admin_id: str, email: str) -> str:
    payload = {
        "sub": admin_id,
        "email": email,
        "role": "admin",
        "iat": int(now_utc().timestamp()),
        "exp": int((now_utc() + timedelta(hours=ADMIN_TOKEN_TTL_HOURS)).timestamp())
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_admin_jwt(token: str) -> Optional[Dict[str, Any]]:
    try:
        return pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception:
        return None

def slugify(text: str) -> str:
    import re
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

# ---------- Models ----------
class ProductVariant(BaseModel):
    name: str
    price: float

class Product(BaseModel):
    id: str = Field(default_factory=lambda: f"prod_{uuid.uuid4().hex[:10]}")
    slug: str
    name: str
    subtitle: Optional[str] = None
    price: float
    currency: str = "INR"
    collection_slug: str = "terracotta"
    material: str = "Terracotta"
    story: str = ""
    material_info: str = ""
    care_guide: str = ""
    packaging: str = ""
    dimensions: str = ""
    weight: str = ""
    images: List[str] = []
    lifestyle_images: List[str] = []
    artisan_id: Optional[str] = None
    featured: bool = False
    in_stock: bool = True
    created_at: datetime = Field(default_factory=now_utc)

class CollectionModel(BaseModel):
    id: str = Field(default_factory=lambda: f"col_{uuid.uuid4().hex[:10]}")
    slug: str
    name: str
    subtitle: Optional[str] = None
    description: str = ""
    hero_image: str = ""
    accent_image: Optional[str] = None
    material: str
    status: str = "active"  # active | coming_soon
    order: int = 0
    created_at: datetime = Field(default_factory=now_utc)

class JournalPost(BaseModel):
    id: str = Field(default_factory=lambda: f"jour_{uuid.uuid4().hex[:10]}")
    slug: str
    title: str
    subtitle: Optional[str] = None
    category: str = "Journal"
    excerpt: str
    body: str
    cover_image: str
    author: str = "Gullak Studio"
    read_time: str = "4 min read"
    published: bool = True
    created_at: datetime = Field(default_factory=now_utc)

class Artisan(BaseModel):
    id: str = Field(default_factory=lambda: f"art_{uuid.uuid4().hex[:10]}")
    slug: str
    name: str
    craft: str
    region: str
    story: str
    portrait: str
    workshop_images: List[str] = []
    years_of_practice: int = 0
    created_at: datetime = Field(default_factory=now_utc)

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: f"test_{uuid.uuid4().hex[:10]}")
    author: str
    location: str = ""
    quote: str
    product_name: Optional[str] = None

class NewsletterSub(BaseModel):
    email: EmailStr

class CartItem(BaseModel):
    product_id: str
    quantity: int = 1

class WishlistItem(BaseModel):
    product_id: str

class Address(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "India"

class OrderCreate(BaseModel):
    address: Address
    items: List[CartItem]
    notes: Optional[str] = None

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

# ---------- Auth dependencies ----------
async def get_current_customer(
    session_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = Header(None)
) -> Optional[Dict[str, Any]]:
    token = session_token
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    if not token:
        return None
    sess = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not sess:
        return None
    expires_at = sess.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < now_utc():
        return None
    user = await db.users.find_one({"user_id": sess["user_id"]}, {"_id": 0})
    return clean_doc(user) if user else None

async def require_customer(customer = Depends(get_current_customer)) -> Dict[str, Any]:
    if not customer:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return customer

async def get_current_admin(
    admin_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = Header(None)
) -> Optional[Dict[str, Any]]:
    token = admin_token
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    if not token:
        return None
    payload = decode_admin_jwt(token)
    if not payload:
        return None
    admin = await db.admins.find_one({"admin_id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    return clean_doc(admin) if admin else None

async def require_admin(admin = Depends(get_current_admin)) -> Dict[str, Any]:
    if not admin:
        raise HTTPException(status_code=401, detail="Admin authentication required")
    return admin

# ---------- Health ----------
@api.get("/")
async def root():
    return {"service": "gullak-api", "status": "ok"}

# ---------- Customer Auth (Emergent Google Auth) ----------
@api.post("/auth/session")
async def establish_session(payload: Dict[str, str] = Body(...), response: Response = None):
    """Exchange Emergent session_id for a session_token, store user + session in DB, set cookie."""
    session_id = payload.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    async with httpx.AsyncClient(timeout=15.0) as http_client:
        r = await http_client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id},
        )
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")
    data = r.json()
    email = data.get("email")
    name = data.get("name")
    picture = data.get("picture")
    session_token = data.get("session_token")
    if not email or not session_token:
        raise HTTPException(status_code=500, detail="Malformed auth response")

    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one({"user_id": user_id}, {"$set": {"name": name, "picture": picture, "last_login": iso(now_utc())}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": iso(now_utc()),
            "last_login": iso(now_utc())
        })

    expires_at = now_utc() + timedelta(days=7)
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": iso(expires_at),
        "created_at": iso(now_utc())
    })

    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return {"user": clean_doc(user)}

@api.get("/auth/me")
async def auth_me(customer = Depends(get_current_customer)):
    if not customer:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return customer

@api.post("/auth/logout")
async def auth_logout(response: Response, session_token: Optional[str] = Cookie(None)):
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}

# ---------- Public catalog ----------
@api.get("/collections")
async def list_collections():
    docs = await db.collections.find({}, {"_id": 0}).sort("order", 1).to_list(200)
    return [clean_doc(d) for d in docs]

@api.get("/collections/{slug}")
async def get_collection(slug: str):
    doc = await db.collections.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Collection not found")
    products = await db.products.find({"collection_slug": slug}, {"_id": 0}).to_list(500)
    return {"collection": clean_doc(doc), "products": [clean_doc(p) for p in products]}

@api.get("/products")
async def list_products(featured: Optional[bool] = None, collection: Optional[str] = None, limit: int = 100):
    q: Dict[str, Any] = {}
    if featured is not None:
        q["featured"] = featured
    if collection:
        q["collection_slug"] = collection
    docs = await db.products.find(q, {"_id": 0}).limit(limit).to_list(limit)
    return [clean_doc(d) for d in docs]

@api.get("/products/{slug}")
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    artisan = None
    if doc.get("artisan_id"):
        artisan = await db.artisans.find_one({"id": doc["artisan_id"]}, {"_id": 0})
    pair_with = await db.products.find(
        {"slug": {"$ne": slug}, "collection_slug": doc.get("collection_slug", "terracotta")},
        {"_id": 0}
    ).limit(4).to_list(4)
    return {
        "product": clean_doc(doc),
        "artisan": clean_doc(artisan) if artisan else None,
        "pair_with": [clean_doc(p) for p in pair_with]
    }

@api.get("/journal")
async def list_journal():
    docs = await db.journal_posts.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [clean_doc(d) for d in docs]

@api.get("/journal/{slug}")
async def get_journal(slug: str):
    doc = await db.journal_posts.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Article not found")
    related = await db.journal_posts.find(
        {"slug": {"$ne": slug}, "published": True}, {"_id": 0}
    ).limit(3).to_list(3)
    return {"article": clean_doc(doc), "related": [clean_doc(r) for r in related]}

@api.get("/artisans")
async def list_artisans():
    docs = await db.artisans.find({}, {"_id": 0}).to_list(200)
    return [clean_doc(d) for d in docs]

@api.get("/artisans/{slug}")
async def get_artisan(slug: str):
    doc = await db.artisans.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Artisan not found")
    return clean_doc(doc)

@api.get("/testimonials")
async def list_testimonials():
    docs = await db.testimonials.find({}, {"_id": 0}).to_list(200)
    return [clean_doc(d) for d in docs]

@api.get("/home")
async def home_content():
    """Aggregated home page content."""
    featured_products = await db.products.find({"featured": True}, {"_id": 0}).limit(6).to_list(6)
    collections = await db.collections.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    artisans = await db.artisans.find({}, {"_id": 0}).limit(2).to_list(2)
    testimonials = await db.testimonials.find({}, {"_id": 0}).limit(6).to_list(6)
    journal = await db.journal_posts.find({"published": True}, {"_id": 0}).sort("created_at", -1).limit(3).to_list(3)
    return {
        "featured_products": [clean_doc(p) for p in featured_products],
        "collections": [clean_doc(c) for c in collections],
        "artisans": [clean_doc(a) for a in artisans],
        "testimonials": [clean_doc(t) for t in testimonials],
        "journal": [clean_doc(j) for j in journal],
    }

@api.post("/newsletter")
async def newsletter_signup(payload: NewsletterSub):
    email = payload.email.lower()
    existing = await db.newsletter.find_one({"email": email})
    if not existing:
        await db.newsletter.insert_one({"email": email, "subscribed_at": iso(now_utc())})
    return {"ok": True, "message": "Thank you for subscribing to Gullak"}

# ---------- Wishlist / Cart (authed) ----------
@api.get("/wishlist")
async def get_wishlist(customer = Depends(require_customer)):
    docs = await db.wishlists.find({"user_id": customer["user_id"]}, {"_id": 0}).to_list(500)
    product_ids = [d["product_id"] for d in docs]
    products = await db.products.find({"id": {"$in": product_ids}}, {"_id": 0}).to_list(500) if product_ids else []
    return {"items": product_ids, "products": [clean_doc(p) for p in products]}

@api.post("/wishlist")
async def add_to_wishlist(payload: WishlistItem, customer = Depends(require_customer)):
    await db.wishlists.update_one(
        {"user_id": customer["user_id"], "product_id": payload.product_id},
        {"$set": {"user_id": customer["user_id"], "product_id": payload.product_id, "added_at": iso(now_utc())}},
        upsert=True
    )
    return {"ok": True}

@api.delete("/wishlist/{product_id}")
async def remove_from_wishlist(product_id: str, customer = Depends(require_customer)):
    await db.wishlists.delete_one({"user_id": customer["user_id"], "product_id": product_id})
    return {"ok": True}

@api.get("/cart")
async def get_cart(customer = Depends(require_customer)):
    docs = await db.carts.find({"user_id": customer["user_id"]}, {"_id": 0}).to_list(500)
    product_ids = [d["product_id"] for d in docs]
    products = await db.products.find({"id": {"$in": product_ids}}, {"_id": 0}).to_list(500) if product_ids else []
    prod_map = {p["id"]: clean_doc(p) for p in products}
    items = []
    for d in docs:
        p = prod_map.get(d["product_id"])
        if p:
            items.append({"product": p, "quantity": d["quantity"]})
    return {"items": items}

@api.post("/cart")
async def upsert_cart_item(payload: CartItem, customer = Depends(require_customer)):
    if payload.quantity <= 0:
        await db.carts.delete_one({"user_id": customer["user_id"], "product_id": payload.product_id})
        return {"ok": True}
    await db.carts.update_one(
        {"user_id": customer["user_id"], "product_id": payload.product_id},
        {"$set": {"user_id": customer["user_id"], "product_id": payload.product_id, "quantity": payload.quantity, "updated_at": iso(now_utc())}},
        upsert=True
    )
    return {"ok": True}

@api.delete("/cart/{product_id}")
async def remove_cart_item(product_id: str, customer = Depends(require_customer)):
    await db.carts.delete_one({"user_id": customer["user_id"], "product_id": product_id})
    return {"ok": True}

@api.post("/cart/merge")
async def merge_guest_cart(payload: Dict[str, List[CartItem]] = Body(...), customer = Depends(require_customer)):
    items = payload.get("items", [])
    for it in items:
        if isinstance(it, dict):
            pid = it.get("product_id")
            qty = it.get("quantity", 1)
        else:
            pid = it.product_id
            qty = it.quantity
        if not pid:
            continue
        existing = await db.carts.find_one({"user_id": customer["user_id"], "product_id": pid})
        new_qty = qty if not existing else max(existing.get("quantity", 0), qty)
        await db.carts.update_one(
            {"user_id": customer["user_id"], "product_id": pid},
            {"$set": {"user_id": customer["user_id"], "product_id": pid, "quantity": new_qty, "updated_at": iso(now_utc())}},
            upsert=True
        )
    return {"ok": True}

# ---------- Orders ----------
@api.post("/orders")
async def create_order(payload: OrderCreate, customer = Depends(require_customer)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    product_ids = [i.product_id for i in payload.items]
    prods = await db.products.find({"id": {"$in": product_ids}}, {"_id": 0}).to_list(500)
    prod_map = {p["id"]: p for p in prods}
    line_items = []
    subtotal = 0.0
    for it in payload.items:
        p = prod_map.get(it.product_id)
        if not p:
            continue
        line_total = float(p["price"]) * it.quantity
        subtotal += line_total
        line_items.append({
            "product_id": p["id"],
            "slug": p["slug"],
            "name": p["name"],
            "price": float(p["price"]),
            "quantity": it.quantity,
            "line_total": line_total,
            "image": (p.get("images") or [""])[0]
        })
    shipping = 0.0 if subtotal >= 2000 else 150.0
    total = subtotal + shipping
    order_id = f"GK-{uuid.uuid4().hex[:8].upper()}"
    order_doc = {
        "order_id": order_id,
        "user_id": customer["user_id"],
        "customer_email": customer.get("email"),
        "customer_name": customer.get("name"),
        "address": payload.address.model_dump(),
        "items": line_items,
        "subtotal": subtotal,
        "shipping": shipping,
        "total": total,
        "currency": "INR",
        "status": "placed",
        "notes": payload.notes,
        "created_at": iso(now_utc())
    }
    await db.orders.insert_one(order_doc)
    # Clear cart
    await db.carts.delete_many({"user_id": customer["user_id"]})
    return clean_doc(order_doc)

@api.get("/orders/me")
async def my_orders(customer = Depends(require_customer)):
    docs = await db.orders.find({"user_id": customer["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [clean_doc(d) for d in docs]

@api.get("/orders/{order_id}")
async def get_order(order_id: str, customer = Depends(require_customer)):
    doc = await db.orders.find_one({"order_id": order_id, "user_id": customer["user_id"]}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    return clean_doc(doc)

# ---------- Admin auth ----------
@api.post("/admin/login")
async def admin_login(payload: AdminLogin, response: Response):
    admin = await db.admins.find_one({"email": payload.email.lower()})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(payload.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_admin_jwt(admin["admin_id"], admin["email"])
    response.set_cookie(
        key="admin_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=ADMIN_TOKEN_TTL_HOURS*3600
    )
    return {"token": token, "admin": {"email": admin["email"], "name": admin.get("name", "Admin")}}

@api.get("/admin/me")
async def admin_me(admin = Depends(require_admin)):
    return admin

@api.post("/admin/logout")
async def admin_logout(response: Response):
    response.delete_cookie("admin_token", path="/")
    return {"ok": True}

# ---------- Admin CRUD ----------
@api.get("/admin/products")
async def admin_list_products(_admin = Depends(require_admin)):
    docs = await db.products.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [clean_doc(d) for d in docs]

@api.post("/admin/products")
async def admin_create_product(payload: Dict[str, Any] = Body(...), _admin = Depends(require_admin)):
    if "slug" not in payload or not payload["slug"]:
        payload["slug"] = slugify(payload.get("name", ""))
    payload.setdefault("id", f"prod_{uuid.uuid4().hex[:10]}")
    payload["created_at"] = iso(now_utc())
    await db.products.insert_one(payload)
    return clean_doc(payload)

@api.put("/admin/products/{product_id}")
async def admin_update_product(product_id: str, payload: Dict[str, Any] = Body(...), _admin = Depends(require_admin)):
    payload.pop("_id", None)
    payload.pop("id", None)
    await db.products.update_one({"id": product_id}, {"$set": payload})
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    return clean_doc(doc)

@api.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, _admin = Depends(require_admin)):
    await db.products.delete_one({"id": product_id})
    return {"ok": True}

@api.get("/admin/collections")
async def admin_list_collections(_admin = Depends(require_admin)):
    docs = await db.collections.find({}, {"_id": 0}).sort("order", 1).to_list(500)
    return [clean_doc(d) for d in docs]

@api.post("/admin/collections")
async def admin_create_collection(payload: Dict[str, Any] = Body(...), _admin = Depends(require_admin)):
    if "slug" not in payload or not payload["slug"]:
        payload["slug"] = slugify(payload.get("name", ""))
    payload.setdefault("id", f"col_{uuid.uuid4().hex[:10]}")
    payload["created_at"] = iso(now_utc())
    await db.collections.insert_one(payload)
    return clean_doc(payload)

@api.put("/admin/collections/{col_id}")
async def admin_update_collection(col_id: str, payload: Dict[str, Any] = Body(...), _admin = Depends(require_admin)):
    payload.pop("_id", None); payload.pop("id", None)
    await db.collections.update_one({"id": col_id}, {"$set": payload})
    doc = await db.collections.find_one({"id": col_id}, {"_id": 0})
    return clean_doc(doc)

@api.delete("/admin/collections/{col_id}")
async def admin_delete_collection(col_id: str, _admin = Depends(require_admin)):
    await db.collections.delete_one({"id": col_id})
    return {"ok": True}

@api.get("/admin/journal")
async def admin_list_journal(_admin = Depends(require_admin)):
    docs = await db.journal_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [clean_doc(d) for d in docs]

@api.post("/admin/journal")
async def admin_create_journal(payload: Dict[str, Any] = Body(...), _admin = Depends(require_admin)):
    if "slug" not in payload or not payload["slug"]:
        payload["slug"] = slugify(payload.get("title", ""))
    payload.setdefault("id", f"jour_{uuid.uuid4().hex[:10]}")
    payload.setdefault("published", True)
    payload["created_at"] = iso(now_utc())
    await db.journal_posts.insert_one(payload)
    return clean_doc(payload)

@api.put("/admin/journal/{jid}")
async def admin_update_journal(jid: str, payload: Dict[str, Any] = Body(...), _admin = Depends(require_admin)):
    payload.pop("_id", None); payload.pop("id", None)
    await db.journal_posts.update_one({"id": jid}, {"$set": payload})
    doc = await db.journal_posts.find_one({"id": jid}, {"_id": 0})
    return clean_doc(doc)

@api.delete("/admin/journal/{jid}")
async def admin_delete_journal(jid: str, _admin = Depends(require_admin)):
    await db.journal_posts.delete_one({"id": jid})
    return {"ok": True}

@api.get("/admin/artisans")
async def admin_list_artisans(_admin = Depends(require_admin)):
    docs = await db.artisans.find({}, {"_id": 0}).to_list(500)
    return [clean_doc(d) for d in docs]

@api.post("/admin/artisans")
async def admin_create_artisan(payload: Dict[str, Any] = Body(...), _admin = Depends(require_admin)):
    if "slug" not in payload or not payload["slug"]:
        payload["slug"] = slugify(payload.get("name", ""))
    payload.setdefault("id", f"art_{uuid.uuid4().hex[:10]}")
    payload["created_at"] = iso(now_utc())
    await db.artisans.insert_one(payload)
    return clean_doc(payload)

@api.put("/admin/artisans/{aid}")
async def admin_update_artisan(aid: str, payload: Dict[str, Any] = Body(...), _admin = Depends(require_admin)):
    payload.pop("_id", None); payload.pop("id", None)
    await db.artisans.update_one({"id": aid}, {"$set": payload})
    doc = await db.artisans.find_one({"id": aid}, {"_id": 0})
    return clean_doc(doc)

@api.delete("/admin/artisans/{aid}")
async def admin_delete_artisan(aid: str, _admin = Depends(require_admin)):
    await db.artisans.delete_one({"id": aid})
    return {"ok": True}

@api.get("/admin/orders")
async def admin_list_orders(_admin = Depends(require_admin)):
    docs = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [clean_doc(d) for d in docs]

@api.put("/admin/orders/{order_id}/status")
async def admin_update_order_status(order_id: str, payload: Dict[str, str] = Body(...), _admin = Depends(require_admin)):
    status = payload.get("status")
    if status not in ["placed", "crafting", "shipped", "delivered", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    await db.orders.update_one({"order_id": order_id}, {"$set": {"status": status}})
    doc = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    return clean_doc(doc)

# ---------- Seed (idempotent) ----------
from seed_data import SEED

@app.on_event("startup")
async def ensure_seed():
    try:
        # Admin
        admin_email = os.environ.get("ADMIN_EMAIL", "admin@gullak.com").lower()
        admin_pw = os.environ.get("ADMIN_PASSWORD", "gullak@admin2025")
        existing_admin = await db.admins.find_one({"email": admin_email})
        if not existing_admin:
            await db.admins.insert_one({
                "admin_id": f"admin_{uuid.uuid4().hex[:12]}",
                "email": admin_email,
                "name": "Gullak Admin",
                "password_hash": hash_password(admin_pw),
                "created_at": iso(now_utc())
            })
            logger.info(f"Seeded admin: {admin_email}")

        # Collections
        if await db.collections.count_documents({}) == 0:
            for c in SEED["collections"]:
                await db.collections.insert_one({**c, "created_at": iso(now_utc())})
            logger.info(f"Seeded {len(SEED['collections'])} collections")

        # Artisans
        if await db.artisans.count_documents({}) == 0:
            for a in SEED["artisans"]:
                await db.artisans.insert_one({**a, "created_at": iso(now_utc())})
            logger.info(f"Seeded {len(SEED['artisans'])} artisans")

        # Products
        if await db.products.count_documents({}) == 0:
            for p in SEED["products"]:
                await db.products.insert_one({**p, "created_at": iso(now_utc())})
            logger.info(f"Seeded {len(SEED['products'])} products")

        # Journal
        if await db.journal_posts.count_documents({}) == 0:
            for j in SEED["journal_posts"]:
                await db.journal_posts.insert_one({**j, "created_at": iso(now_utc())})
            logger.info(f"Seeded {len(SEED['journal_posts'])} journal posts")

        # Testimonials
        if await db.testimonials.count_documents({}) == 0:
            for t in SEED["testimonials"]:
                await db.testimonials.insert_one(t)
            logger.info(f"Seeded {len(SEED['testimonials'])} testimonials")
    except Exception as e:
        logger.exception(f"Seed failed: {e}")

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
