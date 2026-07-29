import { Link, useParams } from 'react-router-dom'
import { blogPosts, siteInfo } from '../data/content'
import usePageMeta from '../utils/usePageMeta'

export default function BlogPost() {
  const { postId } = useParams()
  const post = blogPosts.find((p) => p.id === postId)

  usePageMeta(
    post ? `${post.title} | ${siteInfo.name} ${siteInfo.nameSuffix}` : `Post not found | ${siteInfo.name}`,
    post ? post.excerpt : undefined
  )

  if (!post) {
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
