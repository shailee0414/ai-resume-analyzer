# AI Resume Analyzer

A full-stack web app that scores your resume against any job description using Claude.
Upload a PDF + paste a JD, get back: match score (0–100), strong/missing keywords, ATS readiness checklist, and rewrite suggestions.

**Stack:** Vite + React 18 + TypeScript · shadcn/ui · Tailwind · Zustand · TanStack Query · React Hook Form + Zod · Motion · Node + Express + Mongoose · Claude API (`claude-sonnet-4-5`).

Supports **four themes** — Dark, Light, Midnight (OLED), Sepia — swap from the navbar.

---

## Local setup

### 1. Server

```bash
cd server
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY
npm run dev          # → http://localhost:8080
```

Required env vars (`server/.env`):
- `MONGO_URI` — MongoDB Atlas connection string (free M0 cluster is fine)
- `JWT_SECRET` — any long random string
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `CLIENT_ORIGIN` — `http://localhost:5173` for dev

### 2. Client

```bash
cd client
npm install
cp .env.example .env  # VITE_API_URL defaults to http://localhost:8080
npm run dev          # → http://localhost:5173
```

Open http://localhost:5173 — sign up, drop a PDF, paste a JD, hit Analyze.

---

## Project layout

```
ai-resume-analyzer/
├── client/                 # Vite + React + TS frontend
│   └── src/
│       ├── components/     # ui/ (shadcn) + custom components
│       ├── pages/          # Landing, Login, Signup, Analyze, Results, History
│       ├── stores/         # zustand: auth + theme
│       ├── hooks/          # useTheme, useAnalyze, useHistory
│       ├── lib/            # api, queryClient, utils
│       ├── schemas/        # zod schemas
│       ├── styles/themes.css   # 4-theme token sets
│       └── types/
└── server/                 # Express + Mongoose backend
    ├── routes/             # auth, analyze, history
    ├── middleware/         # auth, upload, rate-limit, errors
    ├── services/           # pdfService, claudeService
    ├── prompts/            # analyzerPrompt
    ├── models/             # User, Analysis
    ├── utils/jsonExtract.js
    └── config/db.js
```

## API surface

```
POST   /api/auth/signup    { email, password }              → { token, user }
POST   /api/auth/login     { email, password }              → { token, user }
GET    /api/auth/me        Authorization: Bearer ...        → { user }

POST   /api/analyze        multipart: resume(File) + jd     → AnalysisResult
GET    /api/history                                         → { items: HistoryItem[] }
GET    /api/history/:id                                     → AnalysisResult
GET    /api/health                                          → { ok: true }
```

## Themes

Switch via the palette icon in the navbar. Tokens live in `client/src/styles/themes.css`.
Choice is persisted in `localStorage['app-theme']`. An inline script in `index.html` applies it before React mounts (no flash).

| Theme | Vibe |
|---|---|
| Dark (default) | Slate `#0A0A0B` + electric violet — guide aesthetic |
| Light | White + slightly darker violet for AA contrast |
| Midnight | True black for OLED, brighter violet pop |
| Sepia | Warm cream + amber accent (replaces violet) |

## Rate limit

3 analyses per user per day, enforced server-side in `middleware/rateLimiter.js`. Protects your Anthropic bill.

## Deployment

- **Frontend:** Vercel — import repo, root `/client`, set `VITE_API_URL` to your Render URL.
- **Backend:** Render — new Web Service, root `/server`, build `npm install`, start `node index.js`, set the four env vars above (use the Vercel URL for `CLIENT_ORIGIN`).
- **DB:** MongoDB Atlas — free M0, whitelist `0.0.0.0/0` for dev.

## License

MIT
