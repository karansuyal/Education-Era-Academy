import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'
import { getBlogPost } from '../api/client'
import usePageMeta from '../utils/usePageMeta'

export default function BlogPost() {
  const { siteInfo } = useSiteData()
  const { postId: slug } = useParams()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    getBlogPost(slug)
      .then((data) => { if (!cancelled) setPost(data) })
      .catch(() => { if (!cancelled) setNotFound(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [slug])

  usePageMeta(
    post ? `${post.title} | ${siteInfo.name} ${siteInfo.nameSuffix}` : `Blog | ${siteInfo.name}`,
    post ? post.excerpt : undefined
  )

  if (loading) {
    return (
      <div className="blog-post-page">
        <Link to="/blog" className="back-link">← Back to Blog</Link>
        <p>Loading…</p>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="blog-post-page">
        <Link to="/blog" className="back-link">← Back to Blog</Link>
        <h1>Post not found</h1>
        <p>This announcement may have been removed.</p>
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      <Link to="/blog" className="back-link">← Back to Blog</Link>
      <span className="blog-date">
        {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
      <h1>{post.title}</h1>
      <p className="post-body">{post.content}</p>
    </div>
  )
}
