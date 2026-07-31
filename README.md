# Education Era Academy

Coaching-center website for Class 9–12 and government exam preparation —
homepage, notes & video lectures, blog/announcements, and an online mock
test, backed by a real API and an admin panel for managing content.

**Live site:** https://education-era-academy.vercel.app

## Stack

- **Frontend** — React 18 + Vite, React Router. Deployed on Vercel.
- **Backend** — FastAPI + SQLAlchemy + Alembic (PostgreSQL). Deployed on
  Render.
- **Admin panel** — built into the frontend at `/admin`, talks to the
  backend's admin API routes (JWT auth) to manage site content, academics
  (classes/subjects/chapters/notes/videos), quiz questions, and leads —
  no more hand-editing JS files to update the site.

> Note: `src/data/content.js` still exists as a **fallback** — if the
> backend is unreachable (e.g. Render's free tier waking up from sleep
> takes 30–60s), the site renders this static data instead of a blank
> page, then swaps in real data once the API responds.

## Run it locally

### Frontend
```bash
npm install
npm run dev        # http://localhost:5173
```

Point it at your backend with an env var (defaults to the deployed Render
URL if not set):
```bash
# .env
VITE_API_URL=http://localhost:8000
```

To build for deployment:
```bash
npm run build       # outputs static files into dist/
npm run preview     # preview the production build locally
```

### Backend
```bash
cd backend
pip install -r requirements.txt
alembic upgrade head          # run migrations
uvicorn app.main:app --reload # http://localhost:8000
```

## File structure
```
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                -> SPA rewrites for client-side routing
├── public/
│   ├── notes/                 -> downloadable PDF notes
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.jsx                -> app entry, router setup
│   ├── App.jsx                 -> routes: Home, Blog, BlogPost, MockTest, Notes, Admin
│   ├── index.css                -> ALL styling (design tokens at the top)
│   ├── api/
│   │   └── client.js           -> fetch wrapper + calls to the FastAPI backend
│   ├── context/
│   │   └── SiteDataContext.jsx -> fetches site content once, exposes it app-wide,
│   │                              falls back to data/content.js if the API is down
│   ├── data/
│   │   └── content.js          -> fallback/offline data (see note above)
│   ├── components/             -> reusable sections (Hero, Courses, FAQ, Gallery, etc.)
│   ├── pages/
│   │   ├── Home.jsx            -> composes all homepage sections
│   │   ├── Blog.jsx            -> blog/announcements list
│   │   ├── BlogPost.jsx        -> single announcement page (/blog/:postId)
│   │   ├── Notes.jsx           -> notes & video lectures (/notes)
│   │   └── MockTest.jsx        -> the online mock test/quiz
│   ├── admin/                  -> admin panel (login, dashboard, content/academics/quiz/leads editors)
│   └── utils/
│       └── usePageMeta.js      -> sets per-page <title>/description on route change
└── backend/
    ├── app/
    │   ├── main.py              -> FastAPI app, routers, CORS, rate limiting
    │   ├── routers/             -> public + admin API endpoints
    │   ├── models/, schemas/    -> SQLAlchemy models & Pydantic schemas
    │   └── core/                -> config, auth/limiter setup
    ├── alembic/                 -> DB migrations
    └── requirements.txt
```

## Editing content

Almost everything (site info, batches, faculty, results, testimonials,
gallery, FAQs, fee plans, notes/videos by class & subject, quiz questions,
blog posts) is now managed through the **admin panel at `/admin`**, not by
editing code. Log in there to add/update content — changes go straight to
the database and appear on the live site immediately.

`src/data/content.js` should only need editing to update the **offline
fallback** shown while the backend is waking up or unreachable.

## Key routes

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, courses, faculty, results, testimonials, gallery, FAQ, fees, contact |
| `/notes` | Class-wise, subject-wise notes (PDF) and video lectures |
| `/blog` , `/blog/:postId` | Announcements / blog posts |
| `/mock-test` | Short multiple-choice quiz with WhatsApp score-share |
| `/admin` | Admin login + dashboard (content, academics, quiz, leads) |

## Before going live — checklist

1. **`VITE_API_URL`** set correctly in Vercel's Environment Variables to
   point at the production backend.
2. Backend **CORS origins** in `backend/app/core/config.py` include the
   production frontend domain.
3. **`sitemap.xml`** and **`robots.txt`** in `public/` point at the real
   deployed domain (already set to
   `https://education-era-academy.vercel.app`).
4. Admin account created with a strong password; default/test credentials
   removed.
5. Real content entered via the admin panel — site info, faculty photos,
   results (get permission before publishing student names), gallery
   images, fee plans, notes/videos.
6. Images optimized (compressed/WebP) before uploading — large JPGs slow
   the site down.
7. `mapEmbedUrl` — Google Maps "Share → Embed a map" link, set via admin,
   shown on the Contact section.

## Deploying

- **Frontend (Vercel)** — connect the GitHub repo, auto-detects Vite;
  `vercel.json` already has the SPA rewrite so client-side routes
  (`/blog/some-post`, `/notes`, etc.) work on direct load/refresh.
- **Backend (Render)** — connect the repo, set the start command to
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, add a Postgres
  database, set environment variables (DB URL, JWT secret, CORS origins).
  Free tier sleeps after inactivity — first request after idle can take
  30–60s (handled gracefully by the fallback data on the frontend).

## Possible next upsells

- Student login for attendance/marks/personalized study material.
- Real payment gateway for fee payment online (Razorpay/PhonePe etc).
- Email/SMS notifications for new leads from the contact form.