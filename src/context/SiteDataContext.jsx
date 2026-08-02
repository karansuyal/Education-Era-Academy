import { createContext, useContext, useEffect, useState } from 'react'
import { getSiteContent } from '../api/client'
import * as fallback from '../data/content'

// ============================================================
// SiteDataContext
//
// Fetches the whole homepage bundle from the backend
// (GET /public/site-content) once, and exposes it in EXACTLY the
// same shape src/data/content.js used to export (siteInfo, stats,
// whyPoints, batches, faculty, results, testimonials, gallery,
// faqs, feePlans, youtubeChannel). That means every component only
// has to change its import — the JSX stays the same.
//
// While the fetch is in flight (or if it fails — e.g. Render's free
// tier can take 30-60s to wake up from sleep), components render
// the static content.js values instead of a blank page. Once the
// real data arrives it swaps in automatically.
// ============================================================

const FALLBACK_DATA = {
  siteInfo: fallback.siteInfo,
  youtubeChannel: fallback.youtubeChannel,
  stats: fallback.stats,
  whyPoints: fallback.whyPoints,
  batches: fallback.batches,
  faculty: fallback.faculty,
  results: fallback.results,
  testimonials: fallback.testimonials,
  gallery: fallback.galleryItems,
  faqs: fallback.faqs,
  feePlans: fallback.feePlans,
  liveClasses: [],
}

const SiteDataContext = createContext({
  ...FALLBACK_DATA,
  loading: true,
  error: null,
  isLive: false, // true once real backend data has loaded
})

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(FALLBACK_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    getSiteContent()
      .then((content) => {
        if (cancelled) return
        setData(content)
        setIsLive(true)
      })
      .catch((err) => {
        if (cancelled) return
        // Keep showing the static fallback content — just log it.
        console.error('Could not load live site content, showing fallback:', err)
        setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <SiteDataContext.Provider value={{ ...data, loading, error, isLive }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  return useContext(SiteDataContext)
}
