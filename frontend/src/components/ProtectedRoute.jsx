// ============================================
// Protected Route — Redirects to /admin/login
// ============================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Memverifikasi sesi...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
