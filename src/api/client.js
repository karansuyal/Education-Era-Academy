// ============================================================
// Backend API client.
//
// Reads the backend URL from an env var so you never hardcode it:
//   VITE_API_URL=https://education-era-academy.onrender.com
// Set this in a `.env` file locally (see .env.example) and in your
// Vercel project's Environment Variables for production.
//
// Falls back to the known Render URL if the env var isn't set, so
// the site still works even if someone forgets to configure it.
// ============================================================

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL || 'https://education-era-academy.onrender.com').replace(/\/+$/, '')

async function request(path, { method = 'GET', body, timeoutMs = 15000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    if (!res.ok) {
      let detail = ''
      try {
        const errJson = await res.json()
        detail = errJson.detail || JSON.stringify(errJson)
      } catch {
        detail = res.statusText
      }
      throw new Error(`API ${method} ${path} failed (${res.status}): ${detail}`)
    }

    if (res.status === 204) return null
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

const apiGet = (path) => request(path)
const apiPost = (path, body) => request(path, { method: 'POST', body })

// ------------------------------------------------------------
// Homepage bundle (GET /public/site-content)
// Normalized back into the exact same shape src/data/content.js
// used to export, so components barely have to change.
// ------------------------------------------------------------
export function normalizeSiteContent(bundle) {
  const s = bundle.site_info

  return {
    siteInfo: {
      name: s.name,
      nameSuffix: s.name_suffix,
      tagline: s.tagline,
      phone: s.phone,
      whatsappNumber: s.whatsapp_number,
      email: s.email,
      address: s.address,
      mapEmbedUrl: s.map_embed_url,
    },
    youtubeChannel: {
      name: s.youtube_name,
      handle: s.youtube_handle,
      url: s.youtube_url,
      channelId: s.youtube_channel_id,
      description: s.youtube_description,
    },
    stats: bundle.stats,
    whyPoints: bundle.why_points,
    batches: bundle.batches,
    faculty: bundle.faculty,
    results: bundle.results,
    testimonials: bundle.testimonials,
    gallery: bundle.gallery.map((g) => ({
      type: g.type,
      label: g.label,
      caption: g.caption,
      src: g.src,
      youtubeId: g.youtube_id,
      poster: g.poster,
    })),
    faqs: bundle.faqs,
    feePlans: bundle.fee_plans.map((f) => ({
      name: f.name,
      priceFull: f.price_full,
      priceEmi: f.price_emi,
      includes: f.includes,
      featured: f.featured,
    })),
    liveClasses: bundle.live_classes.map((c) => ({
      title: c.title,
      batchLabel: c.batch_label,
      platform: c.platform,
      meetingLink: c.meeting_link,
      scheduledAt: c.scheduled_at,
      durationMinutes: c.duration_minutes,
    })),
  }
}

export function getSiteContent() {
  return apiGet('/public/site-content').then(normalizeSiteContent)
}

// ------------------------------------------------------------
// Blog
// ------------------------------------------------------------
export function getBlogPosts() {
  return apiGet('/public/blog')
}

export function getBlogPost(slug) {
  return apiGet(`/public/blog/${encodeURIComponent(slug)}`)
}

// ------------------------------------------------------------
// Academics / Notes (GET /academics/classes)
// ------------------------------------------------------------
function normalizeAcademics(classLevels) {
  return classLevels.map((cls) => ({
    id: cls.id,
    slug: cls.slug,
    label: cls.label,
    subjects: cls.subjects.map((sub) => ({
      id: sub.id,
      slug: sub.slug,
      name: sub.name,
      youtubeId: sub.youtube_id,
      chapters: sub.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        youtubeId: ch.youtube_id,
        notes: ch.notes.map((n) => ({ id: n.id, title: n.title, link: n.link })),
      })),
    })),
  }))
}

export function getAcademics() {
  return apiGet('/academics/classes').then(normalizeAcademics)
}

// ------------------------------------------------------------
// Quiz / Mock tests
// ------------------------------------------------------------
export function getMockTests({ classLabel, subjectLabel } = {}) {
  const params = new URLSearchParams()
  if (classLabel) params.set('class_label', classLabel)
  if (subjectLabel) params.set('subject_label', subjectLabel)
  const qs = params.toString()
  return apiGet(`/quiz/mock-tests${qs ? `?${qs}` : ''}`)
}

export function getMockTest(id) {
  return apiGet(`/quiz/mock-tests/${id}`)
}

export function submitMockTestAttempt(id, { studentName, studentPhone, timeTakenSeconds, answers }) {
  return apiPost(`/quiz/mock-tests/${id}/submit`, {
    student_name: studentName,
    student_phone: studentPhone,
    time_taken_seconds: timeTakenSeconds,
    answers: answers.map((a) => ({ question_id: a.questionId, selected_index: a.selectedIndex })),
  }).then((out) => ({
    attemptId: out.attempt_id,
    score: out.score,
    totalQuestions: out.total_questions,
    correctQuestionIds: out.correct_question_ids,
    incorrectQuestionIds: out.incorrect_question_ids,
  }))
}

export function getLeaderboard(id, limit = 20) {
  return apiGet(`/quiz/mock-tests/${id}/leaderboard?limit=${limit}`)
}

// ------------------------------------------------------------
// Contact leads
// ------------------------------------------------------------
export function submitContactLead({ name, phone, courseInterested, message }) {
  return apiPost('/contact', {
    name,
    phone,
    course_interested: courseInterested,
    message: message || '',
  })
}
