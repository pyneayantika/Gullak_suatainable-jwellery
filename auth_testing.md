# Gullak Auth Testing Playbook

## Overview
This app uses TWO independent auth systems:

1. **Customer Auth** — Emergent Google Auth (session_token in httpOnly cookie + user in `users` collection, session in `user_sessions`).
2. **Admin Auth** — Simple email + password with JWT stored in an httpOnly cookie (`admin_token`). Admin record stored in `admins` collection.

Both are isolated: admin endpoints require `admin_token`, customer endpoints require `session_token`.

---

## Customer Auth (Emergent Google Auth)

### Bypass for testing (no real Google needed)

Since testing agents cannot complete a real Google OAuth flow, use this bypass to seed a test session:

```bash
mongosh "$MONGO_URL" --eval "
var db = db.getSiblingDB('gullak');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'testcustomer@example.com',
  name: 'Test Customer',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('SESSION_TOKEN=' + sessionToken);
print('USER_ID=' + userId);
"
```

Then set as cookie in browser:
```
name: session_token
value: <SESSION_TOKEN>
domain: <preview-domain>
path: /
httpOnly: true
secure: true
sameSite: None
```

Or use `Authorization: Bearer <SESSION_TOKEN>` header for API calls.

### Endpoints

- `GET  /api/auth/me` — returns current customer (from cookie or Bearer)
- `POST /api/auth/session` — body: `{session_id}` — establishes session
- `POST /api/auth/logout` — clears cookie + deletes session

### Verify
```bash
curl -H "Authorization: Bearer $SESSION_TOKEN" $BASE/api/auth/me
```

---

## Admin Auth (Email/Password JWT)

### Seed admin
The seed script creates:
- **Email:** `admin@gullak.com`
- **Password:** `gullak@admin2025`

### Endpoints

- `POST /api/admin/login` — body: `{email, password}` — returns `{token}` and sets `admin_token` cookie
- `GET  /api/admin/me` — returns admin profile
- `POST /api/admin/logout` — clears cookie
- All `/api/admin/*` mutation endpoints require the admin token

### Verify
```bash
curl -X POST $BASE/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gullak.com","password":"gullak@admin2025"}'
```

---

## Testing Agent Notes
- Customer auth: use the bypass session token above (do NOT attempt real Google OAuth).
- Admin auth: use the seeded credentials `admin@gullak.com` / `gullak@admin2025`.
- Both cookies use `secure=True`, `samesite="none"`, `httpOnly=True`.
