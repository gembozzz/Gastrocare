// ============================================
// GastroCare — Auth Context
// ============================================
// Manages JWT token, user state, login/logout.

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('gc_token'))
  const [loading, setLoading] = useState(true)

  // Helper — authenticated fetch
  const authFetch = useCallback(async (endpoint, options = {}) => {
    const currentToken = localStorage.getItem('gc_token')
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
        ...options.headers,
      },
    })
    return res
  }, [])

  // Fetch profile on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await authFetch('/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.data)
        } else {
          // Token expired or invalid
          localStorage.removeItem('gc_token')
          setToken(null)
          setUser(null)
        }
      } catch {
        localStorage.removeItem('gc_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [token, authFetch])

  // Login
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Login gagal.')
    }

    localStorage.setItem('gc_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  // Logout
  const logout = async () => {
    try {
      await authFetch('/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    localStorage.removeItem('gc_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
