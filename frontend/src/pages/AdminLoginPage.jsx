// ============================================
// Admin Login Page — Tailwind CSS + react-icons/fa6
// ============================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import {
  FaShieldHalved,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCircleXmark,
  FaRightToBracket,
  FaSpinner,
  FaChartColumn,
  FaChartLine,
  FaLockOpen,
} from 'react-icons/fa6'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, user } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) navigate('/admin/dashboard', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans">
      {/* Animated background blobs */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-15 -top-24 -left-24 animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute w-72 h-72 bg-emerald-500 rounded-full blur-[100px] opacity-15 -bottom-20 -right-20 animate-[float_10s_ease-in-out_infinite_reverse]" />
      <div className="absolute w-48 h-48 bg-violet-500 rounded-full blur-[100px] opacity-10 top-1/2 left-[60%] animate-[float_12s_ease-in-out_infinite]" />

      {/* Login card */}
      <div className="flex w-[900px] max-w-[95vw] min-h-[540px] rounded-3xl overflow-hidden shadow-2xl relative z-10">

        {/* Left branding */}
        <div className="hidden md:flex flex-1 flex-col justify-between bg-gradient-to-br from-slate-800 to-slate-900 p-12 border-r border-white/5">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <FaShieldHalved className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mt-5">GastroCare</h1>
            <p className="text-slate-400 text-sm mt-1">Admin Dashboard</p>

            <div className="mt-10 flex flex-col gap-5">
              {[
                [FaChartColumn, 'Analisis data asesmen real-time'],
                [FaChartLine, 'Tren & statistik kesehatan'],
                [FaLock, 'Keamanan data terjamin'],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-3 text-slate-300 text-sm">
                  <Icon className="text-lg text-blue-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-slate-600 text-xs">© 2026 GastroCare. All rights reserved.</p>
        </div>

        {/* Right form */}
        <div className="flex-1 bg-slate-800 p-12 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-slate-100">Selamat Datang</h2>
            <p className="text-slate-400 text-sm mt-1">Masuk ke dashboard admin untuk mengelola data</p>

            {error && (
              <div className="mt-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2" id="login-error">
                <FaCircleXmark className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5" id="admin-login-form">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-slate-400 text-xs font-medium uppercase tracking-wider">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@gastrocare.com" required autoComplete="email"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900 border-[1.5px] border-slate-600 rounded-xl text-slate-200 text-sm placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-slate-400 text-xs font-medium uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3 bg-slate-900 border-[1.5px] border-slate-600 rounded-xl text-slate-200 text-sm placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} id="login-submit-btn"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 mt-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Masuk
                    <FaRightToBracket className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>

            {/* Hint */}
            <div className="mt-6 p-3 rounded-xl bg-blue-500/8 border border-blue-500/15 text-center">
              <p className="text-slate-500 text-xs">Demo credentials:</p>
              <code className="text-blue-300 text-sm">admin@gastrocare.com / Admin@12345</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
