import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import StickyWhatsapp from './components/StickyWhatsapp'
import SEOSchema from './components/SEOSchema'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import MockTest from './pages/MockTest'
import Notes from './pages/Notes'
import AdminApp from './admin/AdminApp'
import { initAnalytics, trackPageview } from './utils/analytics'

function PublicSite() {
  const location = useLocation()

  useEffect(() => {
    trackPageview(location.pathname)
  }, [location.pathname])

  return (
    <>
      <SEOSchema />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="/mock-test" element={<MockTest />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
      <Footer />
      <StickyWhatsapp />
    </>
  )
}

export default function App() {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  )
}
