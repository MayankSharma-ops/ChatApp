# 💬 ChatDApp

A modern, real-time off-chain chat application with friend requests, messaging, and video calls.

| Layer    | Tech                             |
| -------- | -------------------------------- |
| Frontend | Next.js 15, React 19, TypeScript |
| Styling  | Tailwind CSS v3                  |
| Backend  | Node.js, Express, TypeScript     |
| Database | PostgreSQL                       |
| Auth     | JWT (bcrypt password hashing)    |
| Node     | v22+ (via nvm)                   |

---

## ✨ Features

- **Authentication** — Register & login with JWT-based sessions, bcrypt password hashing
- **Friend System** — Send, accept, or reject friend requests; view pending/incoming requests
- **Real-time Messaging** — Chat with friends, emoji picker, auto-polling every 6 seconds
- **Video Calls** — In-app video calling via Jitsi Meet (no account required)
- **User Search** — Search all users by name or email to find and add friends
- **Notifications** — Friend request badge counter in the nav bar
- **Responsive UI** — Works on mobile and desktop with a collapsible sidebar

---

## 🚀 Quick Start

```bash
# 1. Clone or unzip the project
cd chatdapp

# 2. Install all dependencies
bash setup.sh

# 3. Configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env and set DATABASE_URL and JWT_SECRET

# 4. Create database tables
npm run db:init

# 5. Start both servers
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — register an account and start chatting!

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

| Provider | URL                    | Free Tier        |
| -------- | ---------------------- | ---------------- |
| Neon     | https://neon.tech      | 512 MB free      |
| Supabase | https://supabase.com   | 500 MB free      |
| Railway  | https://railway.app    | $5 credit/mo     |
| Local    | `createdb chatapp`     | Requires Postgres |

---

## 📁 Project Structure

```
chatdapp/
├── .nvmrc                          ← Node 22
├── package.json                    ← Root scripts (dev, build, db:init)
├── setup.sh                        ← One-shot install script
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts             ← register, login, /me
│   │   │   ├── users.ts            ← search users by name/email
│   │   │   ├── friends.ts          ← friend requests + list
│   │   │   └── messages.ts         ← send & read messages, unread count
│   │   ├── middleware/
│   │   │   └── auth.ts             ← JWT bearer middleware
│   │   ├── types/index.ts          ← shared TypeScript types + Express augment
│   │   ├── db.ts                   ← PostgreSQL pool (pg)
│   │   └── server.ts               ← Express app, CORS, helmet, rate limiting
│   ├── schema.sql                  ← DB schema (users, friends, messages)
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    └── src/
        ├── app/                    ← Next.js App Router
        │   ├── layout.tsx          ← Root layout + providers
        │   ├── page.tsx            ← Chat home (friends sidebar + chat window)
        │   ├── login/              ← Login page
        │   ├── register/           ← Register page
        │   ├── alluser/            ← Search & add users
        │   └── notification/       ← Friend request notifications
        ├── components/
        │   ├── Auth/AuthForm.tsx   ← Shared login/register form
        │   ├── Chat/ChatWindow.tsx ← Message list, emoji picker, video call
        │   ├── Friend/
        │   │   ├── FriendList.tsx  ← Sidebar friend list
        │   │   └── FriendRequests.tsx ← Accept/reject incoming requests
        │   ├── NavBar/NavBar.tsx   ← Responsive nav with notification badge
        │   ├── UserCard/UserCard.tsx ← Search result card with add-friend button
        │   └── UI/                 ← Avatar, Spinner, Toast
        ├── context/
        │   ├── AuthContext.tsx     ← User session, login, logout
        │   └── ChatContext.tsx     ← Friends, messages, polling logic
        ├── lib/api.ts              ← Typed fetch wrapper
        └── types/index.ts          ← Shared frontend types
```

---

## 🌐 API Reference

All routes except `/api/auth/*` require `Authorization: Bearer <token>`.

### Auth

| Method | Path                  | Body                          |
| ------ | --------------------- | ----------------------------- |
| POST   | `/api/auth/register`  | `{ name, email, password }`   |
| POST   | `/api/auth/login`     | `{ email, password }`         |
| GET    | `/api/auth/me`        | —                             |

### Users

| Method | Path              | Query / Notes                    |
| ------ | ----------------- | -------------------------------- |
| GET    | `/api/users`      | `?q=<search>` — name or email    |
| GET    | `/api/users/:id`  | Single user by UUID              |

### Friends

| Method | Path                      | Body                        |
| ------ | ------------------------- | --------------------------- |
| GET    | `/api/friends`            | My accepted friend list     |
| GET    | `/api/friends/requests`   | Incoming pending requests   |
| GET    | `/api/friends/pending`    | Outgoing pending requests   |
| POST   | `/api/friends/request`    | `{ receiverId }`            |
| POST   | `/api/friends/respond`    | `{ requesterId, accept }`   |

### Messages

| Method | Path                        | Body / Notes                    |
| ------ | --------------------------- | ------------------------------- |
| GET    | `/api/messages/:friendId`   | Conversation history (marks read)|
| POST   | `/api/messages`             | `{ receiverId, content }`       |
| GET    | `/api/messages/unread/count`| Unread count grouped by sender  |

---

## 🗃️ Database Schema

```sql
users              — id (UUID), name, email, password_hash, avatar_color
friend_requests    — requester_id, receiver_id, status (pending/accepted/rejected)
friendships        — user1_id, user2_id (normalised: user1 < user2)
messages           — sender_id, receiver_id, content, sent_at, is_read
```

Run the schema at any time:
```bash
npm run db:init
# or manually:
psql $DATABASE_URL -f backend/schema.sql
```

---

## 🛠️ Available Scripts

From the **root** directory:

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start backend + frontend concurrently    |
| `npm run dev:backend`  | Start backend only                    |
| `npm run dev:frontend` | Start frontend only                   |
| `npm run build`     | Build both backend and frontend          |
| `npm run db:init`   | Run `schema.sql` against `DATABASE_URL`  |
| `npm run install:all` | Install all dependencies in all dirs   |

---

## 🚢 Production Deployment

### Backend → Railway / Render / Fly.io

1. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, `NODE_ENV=production`
2. Build: `npm run build --prefix backend`
3. Start: `node backend/dist/server.js`

### Frontend → Vercel

1. Set `NEXT_PUBLIC_API_URL=https://your-backend-url.com/api`
2. Deploy: `vercel --prod`

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 rounds)
- Routes protected with **JWT bearer tokens** (7-day expiry)
- **Helmet.js** sets secure HTTP headers
- **Rate limiting** — 200 req/15 min globally, 20 req/15 min on auth routes
- **CORS** restricted to `FRONTEND_URL`
- Message sending requires an existing **friendship** (enforced server-side)
- Input validation via **Zod** on all auth endpoints

---

## 🔧 Useful PostgreSQL Commands

```bash
# Connect to your local database
psql -U postgres -d chatappdb

# List all tables
psql -U postgres -d chatappdb -c "\dt"

# View all users
psql -U postgres -d chatappdb -c "SELECT * FROM users;"

# Delete a user by ID
psql -U postgres -d chatappdb -c "DELETE FROM users WHERE id='<user-uuid>';"
```

---

## 📝 Notes

- **Polling** — Messages refresh every 6 s; friend/request lists refresh every 15 s. For a production app, replace with WebSockets.
- **Video Calls** — Powered by [Jit.si Meet](https://meet.jit.si). Rooms are derived from the two users' sorted UUIDs so both sides join the same room automatically.
- **Avatar Colors** — Assigned randomly from a preset palette at registration; stored in the DB.