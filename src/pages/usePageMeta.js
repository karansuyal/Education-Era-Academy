import { useEffect } from 'react'

// Sets a page-specific <title> and meta description, then restores the
// site-wide defaults from index.html when the user navigates away.
// Without this, every route (Notes, Blog, Mock Test...) would show the
// same homepage title/description in Google search results and when
// shared on WhatsApp — this makes each page's link preview accurate.
export default function usePageMeta(title, description) {
  useEffect(() => {
    const defaultTitle = document.title
    const metaDescription = document.querySelector('meta[name="description"]')
    const defaultDescription = metaDescription?.getAttribute('content')

    if (title) document.title = title
    if (description && metaDescription) metaDescription.setAttribute('content', description)

    return () => {
      document.title = defaultTitle
      if (metaDescription && defaultDescription) {
        metaDescription.setAttribute('content', defaultDescription)
      }
    }
  }, [title, description])
}
