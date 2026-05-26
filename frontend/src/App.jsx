import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/authContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultPage from './pages/ResultPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages with Navbar + Footer */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/questionnaire" element={<PublicLayout><QuestionnairePage /></PublicLayout>} />
          <Route path="/result" element={<PublicLayout><ResultPage /></PublicLayout>} />

          {/* Admin pages — NO Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 font-sans">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default App
