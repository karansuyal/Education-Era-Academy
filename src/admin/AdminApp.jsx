import { Routes, Route } from 'react-router-dom'
import { AdminAuthProvider } from './AdminAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SiteSettingsPage from './pages/SiteSettingsPage'
import LeadsPage from './pages/LeadsPage'
import AcademicsPage from './pages/AcademicsPage'
import QuizPage from './pages/QuizPage'
import DoubtsPage from './pages/DoubtsPage'
import CrudPage from './components/CrudPage'
import {
  statsResource,
  whyPointsResource,
  batchesResource,
  facultyResource,
  resultsResource,
  testimonialsResource,
  galleryResource,
  faqsResource,
  feePlansResource,
  blogResource,
  liveClassesResource,
} from './resources/resourceConfigs'
import './admin.css'

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path=""
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="site-settings" element={<SiteSettingsPage />} />
          <Route path="stats" element={<CrudPage resource={statsResource} />} />
          <Route path="why-points" element={<CrudPage resource={whyPointsResource} />} />
          <Route path="batches" element={<CrudPage resource={batchesResource} />} />
          <Route path="faculty" element={<CrudPage resource={facultyResource} />} />
          <Route path="results" element={<CrudPage resource={resultsResource} />} />
          <Route path="testimonials" element={<CrudPage resource={testimonialsResource} />} />
          <Route path="gallery" element={<CrudPage resource={galleryResource} />} />
          <Route path="faqs" element={<CrudPage resource={faqsResource} />} />
          <Route path="fee-plans" element={<CrudPage resource={feePlansResource} />} />
          <Route path="blog" element={<CrudPage resource={blogResource} />} />
          <Route path="live-classes" element={<CrudPage resource={liveClassesResource} />} />
          <Route path="academics" element={<AcademicsPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="doubts" element={<DoubtsPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}
