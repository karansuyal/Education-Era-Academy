// Google Analytics (GA4) helper.
//
// Reads the measurement ID from an env var so no code change is needed to
// turn this on/off — just set VITE_GA_MEASUREMENT_ID in your hosting
// provider (Vercel) and redeploy. If it's not set, analytics is simply
// never loaded (e.g. in local dev), so you never see your own dev traffic
// mixed into real visitor data.

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let initialized = false

export function initAnalytics() {
  if (!GA_ID || initialized) return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag

  gtag('js', new Date())
  // send_page_view is disabled here — we send page_view manually on route
  // change instead, since this is a single-page app and GA's automatic
  // pageview only fires once on the very first load otherwise.
  gtag('config', GA_ID, { send_page_view: false })
}

export function trackPageview(path) {
  if (!GA_ID || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
