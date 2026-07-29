import { Link } from 'react-router-dom'
import { blogPosts, siteInfo } from '../data/content'
import usePageMeta from '../utils/usePageMeta'

export default function Blog() {
  usePageMeta(
    `Blog & Announcements | ${siteInfo.name} ${siteInfo.nameSuffix}`,
    'Latest announcements, admission updates and result highlights from Education Era Academy, Rudrapur.'
  )

  const sorted = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section className="section-pad bg-chalk" style={{ minHeight: '60vh' }}>
      <div className="wrap">
        <p className="section-eyebrow">Announcements</p>
        <h2>Blog &amp; announcements.</h2>

        <div className="blog-grid">
          {sorted.map((post) => (
            <article className="blog-card" key={post.id}>
              <span className="blog-date">
                {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="blog-read">Read more →</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
