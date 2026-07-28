import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import StickyWhatsapp from './components/StickyWhatsapp'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import MockTest from './pages/MockTest'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="/mock-test" element={<MockTest />} />
      </Routes>
      <Footer />
      <StickyWhatsapp />
    </>
  )
}
