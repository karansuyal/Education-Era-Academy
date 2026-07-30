import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'
import { getBlogPosts } from '../api/client'
import usePageMeta from '../utils/usePageMeta'

export default function Blog() {
  const { siteInfo } = useSiteData()
  usePageMeta(
    `Blog & Announcements | ${siteInfo.name} ${siteInfo.nameSuffix}`,
    'Latest announcements, admission updates and result highlights from Education Era Academy, Rudrapur.'
  )

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getBlogPosts()
      .then((data) => { if (!cancelled) setPosts(data) })
      .catch((err) => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section className="section-pad bg-chalk" style={{ minHeight: '60vh' }}>
      <div className="wrap">
        <p className="section-eyebrow">Announcements</p>
        <h2>Blog &amp; announcements.</h2>

        {loading && <p>Loading posts…</p>}
        {!loading && error && <p>Couldn't load posts right now — please check back shortly.</p>}
        {!loading && !error && sorted.length === 0 && <p>No announcements yet — check back soon.</p>}

        <div className="blog-grid">
          {sorted.map((post) => (
            <article className="blog-card" key={post.slug}>
              <span className="blog-date">
                {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="blog-read">Read more →</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
