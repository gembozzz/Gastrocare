// ============================================
// Admin Dashboard Page — Tailwind CSS + react-icons/fa6
// ============================================

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import {
  FaShieldHalved,
  FaRightFromBracket,
  FaBars,
  FaArrowsRotate,
  FaGauge,
  FaChartLine,
  FaCircleQuestion,
  FaClipboardList,
  FaCircleCheck,
  FaTriangleExclamation,
  FaCircleExclamation,
  FaXmark,
  FaArrowTrendUp,
  FaArrowTrendDown,
} from 'react-icons/fa6'

export default function AdminDashboardPage() {
  const { user, logout, authFetch } = useAuth()
  const navigate = useNavigate()

  const [summary, setSummary] = useState(null)
  const [trend, setTrend] = useState([])
  const [questionStats, setQuestionStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('daily')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [sumRes, trendRes, qRes] = await Promise.all([
        authFetch('/analytics/summary'),
        authFetch(`/analytics/trend?period=${period}`),
        authFetch('/analytics/questions'),
      ])
      if (!sumRes.ok || !trendRes.ok || !qRes.ok) throw new Error('Gagal memuat data analytics.')
      const [sumData, trendData, qData] = await Promise.all([sumRes.json(), trendRes.json(), qRes.json()])
      setSummary(sumData.data)
      setTrend(trendData.data)
      setQuestionStats(qData.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [authFetch, period])

  useEffect(() => { fetchData() }, [fetchData])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const maxTrendTotal = Math.max(...trend.map(t => t.total), 1)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Memuat dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-900 font-sans">
      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-800 border-r border-slate-700 flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Brand */}
        <div className="px-5 py-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <FaShieldHalved className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-100 font-bold text-lg">GastroCare</span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white cursor-pointer" onClick={() => setSidebarOpen(false)}>
            <FaXmark className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 flex flex-col gap-1 flex-1">
          {[
            [FaGauge, 'Overview', '#overview'],
            [FaChartLine, 'Tren', '#trends'],
            [FaCircleQuestion, 'Pertanyaan', '#questions'],
          ].map(([Icon, label, href], i) => (
            <a key={label} href={href}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm transition-all ${i === 0 ? 'bg-blue-500/15 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-blue-500/8 hover:text-slate-200'}`}>
              <Icon className="w-4 h-4" />{label}
            </a>
          ))}
        </nav>

        {/* User */}
        <div className="px-5 py-4 border-t border-slate-700 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">{user?.role}</p>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
            <FaRightFromBracket className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 pb-16 overflow-y-auto">
        {/* Topbar */}
        <header className="flex items-center gap-4 mb-7">
          <button className="md:hidden text-slate-400 cursor-pointer" onClick={() => setSidebarOpen(true)}>
            <FaBars className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Dashboard Analytics</h1>
            <p className="text-slate-500 text-sm mt-0.5">Selamat datang, {user?.name} 👋</p>
          </div>
          <button onClick={fetchData} title="Refresh"
            className="ml-auto px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer">
            <FaArrowsRotate className="w-4 h-4" />
          </button>
        </header>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-5">{error}</div>
        )}

        {summary && (
          <>
            {/* Stats cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6" id="overview">
              {[
                { Icon: FaClipboardList, color: 'text-blue-400', value: summary.totalAssessments, label: 'Total Asesmen', badge: true },
                { Icon: FaCircleCheck, color: 'text-emerald-400', value: summary.byRiskLevel.LOW, label: 'Risiko Rendah' },
                { Icon: FaTriangleExclamation, color: 'text-amber-400', value: summary.byRiskLevel.MODERATE, label: 'Risiko Sedang' },
                { Icon: FaCircleExclamation, color: 'text-red-400', value: summary.byRiskLevel.HIGH, label: 'Risiko Tinggi' },
              ].map((s, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-start gap-3.5 relative hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all">
                  <s.Icon className={`w-6 h-6 ${s.color} mt-1`} />
                  <div>
                    <span className="text-3xl font-extrabold text-slate-100 leading-none">{s.value}</span>
                    <span className="block text-slate-500 text-xs mt-1.5">{s.label}</span>
                  </div>
                  {s.badge && (
                    <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center gap-1">
                      {summary.growthRate >= 0 ? <FaArrowTrendUp className="w-3 h-3" /> : <FaArrowTrendDown className="w-3 h-3" />}
                      {Math.abs(summary.growthRate)}%
                    </span>
                  )}
                </div>
              ))}
            </section>

            {/* Summary row */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Rata-rata Skor</h3>
                <p className="text-3xl font-extrabold text-slate-100 mt-2">{summary.averageScore}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Rata-rata Persentase</h3>
                <p className="text-3xl font-extrabold text-slate-100 mt-2">{summary.averagePercentage}%</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Bulan Ini</h3>
                <p className="text-3xl font-extrabold text-slate-100 mt-2">{summary.thisMonth}</p>
                <span className="text-slate-500 text-xs">vs {summary.lastMonth} bulan lalu</span>
              </div>

              {/* Donut */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Distribusi Risiko</h3>
                {(() => {
                  const total = summary.byRiskLevel.LOW + summary.byRiskLevel.MODERATE + summary.byRiskLevel.HIGH
                  if (total === 0) return <p className="text-slate-600 text-sm mt-4 text-center">Belum ada data</p>
                  const pL = (summary.byRiskLevel.LOW / total) * 100
                  const pM = (summary.byRiskLevel.MODERATE / total) * 100
                  return (
                    <div className="flex items-center gap-4 mt-2">
                      <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#334155" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${pL} ${100 - pL}`} strokeDashoffset="25" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray={`${pM} ${100 - pM}`} strokeDashoffset={`${25 - pL}`} />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray={`${100 - pL - pM} ${pL + pM}`} strokeDashoffset={`${25 - pL - pM}`} />
                        <text x="18" y="19.5" textAnchor="middle" className="fill-slate-100 text-[0.5rem] font-bold rotate-90 origin-[18px_19px]">{total}</text>
                      </svg>
                      <div className="flex flex-col gap-1.5">
                        {[['bg-emerald-500', 'Rendah'], ['bg-amber-500', 'Sedang'], ['bg-red-500', 'Tinggi']].map(([color, label]) => (
                          <span key={label} className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <span className={`w-2 h-2 rounded-full ${color}`} />{label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </section>
          </>
        )}

        {/* Trend */}
        <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6" id="trends">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-slate-100">Tren Asesmen</h2>
            <div className="flex gap-1 bg-slate-900 rounded-lg p-1">
              {['daily', 'weekly', 'monthly'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3.5 py-1.5 rounded-md text-xs cursor-pointer transition-all ${period === p ? 'bg-blue-500 text-white font-semibold' : 'text-slate-500 hover:text-slate-300'}`}>
                  {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
                </button>
              ))}
            </div>
          </div>

          {trend.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">Belum ada data tren.</p>
          ) : (
            <div className="flex items-end gap-1.5 h-52 pt-5 overflow-x-auto">
              {trend.map((t, i) => (
                <div key={i} className="flex-1 min-w-7 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full max-w-8 rounded-t-md overflow-hidden flex flex-col transition-all duration-500"
                    style={{ height: `${(t.total / maxTrendTotal) * 100}%` }}>
                    {t.high > 0 && <div className="bg-red-500" style={{ flex: t.high }} />}
                    {t.moderate > 0 && <div className="bg-amber-500" style={{ flex: t.moderate }} />}
                    {t.low > 0 && <div className="bg-emerald-500" style={{ flex: t.low }} />}
                  </div>
                  <span className="text-slate-400 text-[10px] font-semibold">{t.total}</span>
                  <span className="text-slate-600 text-[9px] whitespace-nowrap">{t.date.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Question stats */}
        <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6" id="questions">
          <h2 className="text-lg font-bold text-slate-100 mb-5">Statistik Pertanyaan</h2>
          {questionStats.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">Belum ada data.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {questionStats.map((q, i) => (
                <div key={q.questionId} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">Q{i + 1}</span>
                    <span className="text-slate-500 text-xs">{q.totalResponses} respons</span>
                  </div>
                  <p className="text-slate-200 text-sm mb-3.5 leading-relaxed">{q.questionText}</p>
                  <div className="flex flex-col gap-2">
                    {q.optionDistribution.map(opt => (
                      <div key={opt.optionId}>
                        <div className="flex justify-between mb-0.5">
                          <span className="text-slate-400 text-xs">{opt.optionText}</span>
                          <span className="text-blue-400 text-xs font-semibold">{opt.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${opt.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
