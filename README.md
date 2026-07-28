# Shikhar Academy — React Version

Same coaching-center site as before, rebuilt in **React + Vite**, with five
new features added: photo/video gallery, FAQ accordion, fee structure with
EMI info, blog/announcements section, and a basic online mock test.

Still **no backend, no database** — all data lives in one file
(`src/data/content.js`) and the enquiry form + sticky WhatsApp button work
exactly like before, just opening WhatsApp with a pre-filled message.

## Run it

```bash
npm install
npm run dev        # starts local dev server, usually http://localhost:5173
```

To build for deployment:
```bash
npm run build       # outputs static files into dist/
npm run preview     # preview the production build locally
```

## File structure
```
shikhar-react/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              -> app entry, router setup
│   ├── App.jsx                -> routes: Home, Blog, BlogPost, MockTest
│   ├── index.css              -> ALL styling (design tokens at the top)
│   ├── data/
│   │   └── content.js         -> ⭐ EDIT THIS FILE for all text/data changes
│   ├── components/            -> reusable sections (Hero, Courses, FAQ, etc.)
│   └── pages/
│       ├── Home.jsx           -> composes all homepage sections
│       ├── Blog.jsx           -> blog/announcements list
│       ├── BlogPost.jsx       -> single announcement page (/blog/:postId)
│       └── MockTest.jsx       -> the online mock test/quiz
```

## The one file you'll edit most: `src/data/content.js`
Everything text-based — name, phone, batches, faculty, results, FAQs, fee
plans, blog posts, quiz questions — lives here as plain JavaScript arrays
and objects. Change the data here and it updates everywhere on the site
automatically, no need to touch component files.

## Before going live — checklist

1. **`siteInfo`** in `content.js` — real name, phone, WhatsApp number
   (format `91XXXXXXXXXX`, no + or spaces), email, address.
2. **`stats`** — real numbers for students mentored / selection rate / years.
3. **`faculty`** — real names + qualifications. To use real photos instead
   of initials, replace the `.faculty-photo` div in
   `components/Faculty.jsx` with an `<img>` tag.
4. **`results`** — real student names and scores. **Get permission from the
   student/parent before publishing any name.**
5. **`galleryItems`** — currently placeholder tiles. Add real photos by
   putting images in `public/images/` and rendering an `<img>` inside the
   `.gallery-tile` button in `components/Gallery.jsx`.

   **For the teaching video**: drop your video file (e.g.
   `teaching-demo.mp4`) into `public/videos/` and make sure `src` in the
   video's `galleryItems` entry in `content.js` points to it, e.g.
   `src: "/videos/teaching-demo.mp4"`. It plays directly on the site with
   a normal video player — no YouTube account or upload needed. Keep the
   file reasonably small (compress it — under ~30-50MB is a good target)
   so the site stays fast to load; a phone-recorded clip usually needs
   compressing first (HandBrake app, or any free online video compressor).
6. **`faqs`** and **`feePlans`** — replace placeholder fee amounts with your
   actual fee structure.
7. **`blogPosts`** — replace with real announcements as they happen; each
   post automatically gets its own page at `/blog/<id>`.
8. **`quizQuestions`** — replace with real subject-specific questions.
9. **`mapEmbedUrl`** in `siteInfo` — optional. Get an embed link from Google
   Maps ("Share" → "Embed a map") and paste the `src` URL here to show a map
   on the Contact section.

## New features explained

- **Gallery** (`/#gallery`) — grid of photo/video tiles that open in a
  lightbox popup on click. Currently gradient placeholders with labels;
  swap in real images as described above.
- **FAQ accordion** (`/#faq`) — click a question to expand/collapse the
  answer. First question is open by default.
- **Fees** (`/#fees`) — three pricing cards with full-payment and EMI
  amounts side by side, plus what's included in each plan.
- **Blog/Announcements** (`/blog`) — a list page and individual post pages,
  useful for admission announcements, result highlights, or notices.
- **Mock Test** (`/mock-test`) — a short multiple-choice quiz. Shows the
  correct answer after each question, then a final score with a button to
  share the score via WhatsApp (which naturally becomes a lead for you).
- **Sticky WhatsApp button** — floating button, bottom-right, on every page.

## Deploying

This is a Vite React app (Single Page App with routing), so unlike the
plain HTML version it needs a host that supports SPA routing:
- **Vercel** (recommended) — `vercel` CLI or connect the GitHub repo,
  auto-detects Vite, handles routing automatically.
- **Netlify** — connect repo or drag the `dist/` folder after
  `npm run build`; add a `_redirects` file with `/* /index.html 200` in
  `public/` so routes like `/blog/some-post` work on refresh.

## If you want more later (bigger upsells)
- Admin panel to edit content.js data through a UI instead of code —
  needs a backend + database, similar to how LocalKart's admin flows work.
- Student login for attendance/marks/study material — needs backend + auth.
- Real payment gateway for fee payment online — needs backend + gateway
  integration (Razorpay/PhonePe etc).
