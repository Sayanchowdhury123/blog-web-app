# 🌐 BlogCollab — AI-Powered, Real-Time Collaborative Blogging Platform
A modern, full-stack blogging platform where writers, editors, and readers collaborate in real time — powered by AI, built for scale.

https://blog-app-frontend-beta-nine.vercel.app

---

## ✨ Key Features

### 🤖 AI-Powered Writing
- **GPT-4 Blog Generator**: Create draft blogs from prompts
- Editable AI output — perfect starting point for human refinement
- Supports prompt engineering + custom tone

### 👥 Role-Based Collaboration
| Role | Permissions |
|------|-------------|
| **Reader** | Read, like, comment, bookmark, follow |
| **Writer** | All reader + create/edit blogs, AI drafts, tag posts |
| **Editor** | All writer + approve/reject submissions, manage content |

### 📝 Rich Blog Management
- Cloudinary-powered cover image uploads
- Draft ↔ Published workflow
- Tags, reading time, SEO-friendly content
- Markdown/HTML support via Tiptap

### 🌐 Real-Time Co-Editing
- Live collaborative editing (like Google Docs)
- Multi-user cursor tracking & presence
- Conflict-free sync with **Yjs CRDT** + WebSocket

### 🔍 Smart Discovery
- Full-text search (title, content, author)
- Filter by tags, popularity, author
- “Related Blogs” recommendations

### 📊 Personal Dashboard
- Your blogs, saved posts, followers
- Engagement analytics (views, likes, comments)
- Notifications (comments, approvals, follows)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + daisyUI
- **Routing**: React Router DOM v7
- **State**: Zustand + Context API
- **Editor**: Tiptap (collaboration via `@tiptap/extension-collaboration`)
- **Realtime**: `y-websocket` + `socket.io-client`
- **Deployment**: Vercel (Free Tier)

### Backend
- **Runtime**: Node.js + Express 5
- **Database**: MongoDB (Atlas)
- **Auth**: JWT + bcrypt.js
- **Rate Limiting**: `express-rate-limit`
- **Media**: Cloudinary
- **Realtime Server**: Dedicated Yjs WebSocket server
- **Deployment**: Render (Free Tier — 2 services: HTTP + Yjs)

### DevOps
- GitHub Actions (CI/CD ready)
- Environment-based config (`.env`)
- Structured logging (`winston`)
- CORS & security hardened

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account
- Cloudinary account
- OpenAI API key (for AI features)
- Render & Vercel accounts (free)

### Local Setup

#### 1. Clone & Install
```bash
git clone https://github.com/yourname/blog-app.git
cd blog-app

# Install frontend
cd frontend && npm install

# Install backend
cd ../backend && npm install
```

#### 2. Configure Environment

**`backend/.env`**
```env
PORT=5000
PORT_YJS=5001
MONGODB_URI=your_atlas_uri
JWT_SECRET=your_strong_secret
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_key
CLOUD_API_SECRET=your_secret
OPENAI_API_KEY=sk-...
```

**`frontend/.env.local`**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_YJS_WS_URL=ws://localhost:5001
```

#### 3. Run Dev Servers
```bash
# Terminal 1: Backend (HTTP + Socket.io)
cd backend && npm run dev:http

# Terminal 2: Yjs WebSocket
cd backend && npm run dev:yjs

# Terminal 3: Frontend
cd frontend && npm run dev
```

→ Visit `http://localhost:5173`

---

## 🌍 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com/new)
3. Set env vars:
   ```
   VITE_API_BASE_URL = https://blog-api.onrender.com
   VITE_YJS_WS_URL = wss://yjs-server.onrender.com
   ```

### Backend (Render)
- **Service 1**: `blog-api` → `npm run start:http`
- **Service 2**: `yjs-server` → `npm run start:yjs`
- Set `JWT_SECRET`, `MONGODB_URI`, etc.

✅ **100% free tier compatible**

---

## 📂 Project Structure

```
/blog-app
├── frontend/          # Vite + React 19
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── pages/       # Blog, Editor, Dashboard
│   │   ├── lib/         # Tiptap, Yjs, API clients
│   │   └── store/       # Zustand stores
│   └── ...
│
└── backend/           # Express + Yjs
    ├── index.js       # HTTP + Socket.io server
    ├── yjs.js         # Dedicated Yjs WebSocket
    ├── app.js         # Express app + middleware
    ├── routes/        # Auth, blogs, editor, etc.
    ├── controller/    # Business logic
    ├── models/        # Mongoose schemas
    └── ...
```

---

## 🤝 Contributing

Contributions are welcome!  
1. Fork the repo  
2. Create your feature branch (`git checkout -b feat/your-feature`)  
3. Commit your changes (`git commit -m 'feat: add xyz'`)  
4. Push to the branch (`git push origin feat/your-feature`)  
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙌 Acknowledgements

- [Yjs](https://yjs.dev) — for conflict-free real-time sync  
- [Tiptap](https://tiptap.dev) — headless rich text editor  
- [Render](https://render.com) & [Vercel](https://vercel.com) — free, scalable hosting  
- [Cloudinary](https://cloudinary.com) — media optimization

---

> 💡 **Built for writers, by engineers** — where collaboration meets creativity.  
> ✨ Open-source. Self-hostable. Production-ready.

--- 

## 📸 Screenshots
Here’s a **complete, professional screenshot section** for your `README.md` — covering all key pages with consistent formatting, descriptive captions, and responsive sizing:

---


### 🏠 Home Page
<a href="docs/screenshots/Screenshot 2026-01-06 192852.png">
  <img src="docs/screenshots/Screenshot 2026-01-06 192852.png" alt="BlogApp Home Page - Discover trending blogs" width="700" />
</a>
<p><em>Discover curated blogs, trending topics, and personalized recommendations.</em></p>

---

### 🔍 Search & Filter Page
<a href="docs/screenshots/Screenshot 2026-01-06 193407.png">
  <img src="docs/screenshots/Screenshot 2026-01-06 193407.png" alt="Search Blogs by Title, Author, or Tag" width="700" />
</a>
<p><em>Full-text search + tag filtering for quick content discovery.</em></p>

---

### 👥 Collaboration Dashboard
<a href="docs/screenshots/Screenshot 2026-01-06 193239.png">
  <img src="docs/screenshots/Screenshot 2026-01-06 193239.png" alt="Collaboration Dashboard - Join or Start Sessions" width="700" />
</a>
<p><em>See active collaborations, join existing sessions, or start new ones.</em></p>

---

### ✍️ Real-Time Collaborative Editor
<a href="docs/screenshots/Screenshot 2026-01-06 193203.png">
  <img src="docs/screenshots/Screenshot 2026-01-06 193203.png" alt="Tiptap + Yjs Real-Time Editor with Cursor Tracking" width="700" />
</a>
<p><em>Live collaborative editing with user cursors, presence indicators, and conflict-free sync.</em></p>

---

### 👤 User Profile Page
<a href="docs/screenshots/Screenshot 2026-01-06 193028.png">
  <img src="docs/screenshots/Screenshot 2026-01-06 193028.png" alt="User Profile - Bio, Stats, Followers" width="700" />
</a>
<p><em>Profile view with follower count, bio, activity stats, and saved blogs.</em></p>

---

### 📋 Blog Approval Page (Editor View)
<a href="docs/screenshots/Screenshot 2026-01-06 193430.png">
  <img src="docs/screenshots/Screenshot 2026-01-06 193430.png" alt="Editor Approval Queue - Accept or Reject Submissions" width="700" />
</a>
<p><em>Editors review drafts, approve/reject posts, and leave feedback.</em></p>

---

### 📊 Analytics Dashboard
<a href="docs/screenshots/Screenshot 2026-01-06 193331.png">
  <img src="docs/screenshots/Screenshot 2026-01-06 193331.png" alt="Blog Analytics - Views, Likes, Engagement Metrics" width="700" />
</a>
<p><em>Track blog performance: views, likes, comments, and follower growth over time.</em></p>

---


### ✨ Create New Blog (AI-Assisted)
<a href="docs/screenshots/Screenshot 2026-01-06 193058.png">
  <img src="docs/screenshots/Screenshot 2026-01-06 193058.png" alt="Create Blog with AI Prompt Generator" width="700" />
</a>
<p><em>Generate drafts using GPT-4 prompts — then refine manually with rich editor.</em></p>



