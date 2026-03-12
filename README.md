# 💬 ChatDApp

Modern off-chain real-time chat application.

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | Next.js 15, React 19, TypeScript  |
| Styling   | Tailwind CSS v3                   |
| Backend   | Node.js, Express, TypeScript      |
| Database  | PostgreSQL                        |
| Auth      | JWT (bcrypt password hashing)     |
| Node      | v22+ (via nvm)                    |

---

## 🚀 Quick Start

```bash
# 1. Clone / unzip
cd chatdapp

# 2. Install everything (reads .nvmrc for nvm users)
bash setup.sh

# 3. Edit backend/.env
DATABASE_URL=postgres://user:password@localhost:5432/chatapp
JWT_SECRET=any-long-random-string

# 4. Create database tables
npm run db:init

# 5. Start both servers
npm run dev
```

Open http://localhost:3000 — register an account and start chatting!

---

## ⚙️ Environment Variables

### `backend/.env`
```env
DATABASE_URL=postgres://user:password@localhost:5432/chatapp
JWT_SECRET=your-super-secret-32-char-minimum-string
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🗄️ Free PostgreSQL Options

| Provider  | URL                        | Notes             |
|-----------|----------------------------|-------------------|
| Neon      | https://neon.tech          | 512 MB free       |
| Supabase  | https://supabase.com       | 500 MB free       |
| Railway   | https://railway.app        | $5 credit/mo free |
| Local     | `createdb chatapp`         | Requires Postgres  |

---

## 📁 Project Structure

```
chatdapp/
├── .nvmrc                     ← Node 22
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts        ← register, login, /me
│   │   │   ├── users.ts       ← list all users
│   │   │   ├── friends.ts     ← friend requests + list
│   │   │   └── messages.ts    ← send & read messages
│   │   ├── middleware/
│   │   │   └── auth.ts        ← JWT middleware
│   │   ├── types/index.ts
│   │   ├── db.ts              ← PostgreSQL pool
│   │   └── server.ts          ← Express app
│   ├── schema.sql
│   └── package.json
├── frontend/
│   └── src/
│       ├── app/               ← Next.js App Router pages
│       │   ├── layout.tsx
│       │   ├── page.tsx       ← Chat home
│       │   ├── login/
│       │   ├── register/
│       │   ├── alluser/
│       │   └── notification/
│       ├── components/
│       │   ├── Auth/AuthForm.tsx
│       │   ├── Chat/ChatWindow.tsx
│       │   ├── Friend/FriendList.tsx
│       │   ├── Friend/FriendRequests.tsx
│       │   ├── NavBar/NavBar.tsx
│       │   ├── UserCard/UserCard.tsx
│       │   └── UI/             ← Avatar, Spinner, Toast
│       ├── context/
│       │   ├── AuthContext.tsx
│       │   └── ChatContext.tsx
│       ├── lib/api.ts          ← typed fetch wrapper
│       └── types/index.ts
└── setup.sh
```

---

## 🌐 API Reference

All routes except `/auth/*` require `Authorization: Bearer <token>`.

### Auth
| Method | Path | Body |
|--------|------|------|
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET  | `/api/auth/me` | — |

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | All users (except self) |
| GET | `/api/users/:id` | Single user |

### Friends
| Method | Path | Body |
|--------|------|------|
| GET  | `/api/friends` | My friend list |
| GET  | `/api/friends/requests` | Incoming requests |
| GET  | `/api/friends/pending` | Outgoing requests |
| POST | `/api/friends/request` | `{ receiverId }` |
| POST | `/api/friends/respond` | `{ requesterId, accept }` |

### Messages
| Method | Path | Body |
|--------|------|------|
| GET  | `/api/messages/:friendId` | Conversation history |
| POST | `/api/messages` | `{ receiverId, content }` |

---

## 🚢 Production Deployment

### Backend → Railway / Render / Fly.io
1. Set env vars: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, `NODE_ENV=production`
2. Build: `npm run build --prefix backend`
3. Start: `node backend/dist/server.js`

### Frontend → Vercel
1. Set `NEXT_PUBLIC_API_URL=https://your-backend-url.com/api`
2. `vercel --prod`
