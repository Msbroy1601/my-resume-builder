import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'

const TEMPLATE_LABELS = {
  modern: 'Modern', classic: 'Classic', minimal: 'Minimal',
  creative: 'Creative', professional: 'Professional', sidebar: 'Sidebar',
  elegant: 'Elegant', tech: 'Tech', greensidebar: 'Green Sidebar',
  goldheader: 'Gold Header', classicserif: 'Classic Serif', coral: 'Coral',
  amber: 'Amber', serif2: 'Formal Serif', hexagon: 'Hexagon',
  navy: 'Navy Icons', bluesidebar: 'Blue Sidebar',
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 2)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs  < 24) return `${hrs}h ago`
  if (days < 7)  return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { signOut } = useClerk()

  const [saves, setSaves]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null) // id being deleted
  const [msg, setMsg]           = useState(null)

  const fetchSaves = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('resumes')
      .select('id, resume_name, resume_data, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setLoading(false)
    if (!error) setSaves(data || [])
  }, [user])

  useEffect(() => { fetchSaves() }, [fetchSaves])

  const handleLoad = (save) => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(save.resume_data))
      localStorage.setItem('currentResumeId', save.id)
      navigate(`/builder?template=${save.resume_data?.selectedTemplate || 'modern'}`)
    } catch {
      navigate('/builder')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume? This cannot be undone.')) return
    setDeleting(id)
    const { error } = await supabase.from('resumes').delete().eq('id', id)
    setDeleting(null)
    if (error) {
      setMsg({ type: 'error', text: 'Failed to delete. Please try again.' })
    } else {
      setSaves(prev => prev.filter(s => s.id !== id))
      setMsg({ type: 'success', text: 'Resume deleted.' })
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2744] tracking-tight">ResumeAI</h1>
            <p className="text-xs text-gray-500 mt-0.5">Hi, {displayName}!</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/builder')}
              className="px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Builder
            </button>
            <button
              onClick={() => navigate('/templates')}
              className="px-4 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#152235] transition"
            >
              + New Resume
            </button>
            <button
              onClick={() => { if (window.confirm('Log out?')) { signOut(); navigate('/') } }}
              className="px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Resumes</h2>
            <p className="text-sm text-gray-500 mt-1">
              {saves.length > 0 ? `${saves.length} saved resume${saves.length > 1 ? 's' : ''}` : 'No saved resumes yet'}
            </p>
          </div>
          <button
            onClick={() => navigate('/templates')}
            className="px-5 py-2.5 bg-[#1a2744] text-white rounded-xl text-sm font-semibold hover:bg-[#152235] transition shadow-sm"
          >
            + Create New
          </button>
        </div>

        {/* Toast */}
        {msg && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium border ${
            msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {msg.text}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400 text-sm">Loading your resumes…</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && saves.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-2xl">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No resumes saved yet</h3>
            <p className="text-sm text-gray-400 mb-6">Build your first professional resume in minutes</p>
            <button
              onClick={() => navigate('/templates')}
              className="px-6 py-3 bg-[#1a2744] text-white rounded-xl font-semibold text-sm hover:bg-[#152235] transition shadow-sm"
            >
              Start Building
            </button>
          </div>
        )}

        {/* Resume grid */}
        {!loading && saves.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saves.map(save => {
              const data = save.resume_data || {}
              const templateLabel = TEMPLATE_LABELS[data.selectedTemplate] || data.selectedTemplate || 'Unknown'
              const initials = data.name
                ? data.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase()
                : '?'
              const expCount  = data.workExperiences?.length || 0
              const skillCount = data.skillsList?.length || 0

              return (
                <div key={save.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                  {/* Card header */}
                  <div className="bg-[#1a2744] px-5 py-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{data.name || 'Unnamed'}</p>
                      <p className="text-blue-200 text-xs truncate">{data.email || '—'}</p>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-4 flex-1">
                    <p className="text-base font-semibold text-gray-800 truncate mb-1">{save.resume_name}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {templateLabel}
                      </span>
                      {expCount > 0 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {expCount} role{expCount > 1 ? 's' : ''}
                        </span>
                      )}
                      {skillCount > 0 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {skillCount} skills
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Updated {timeAgo(save.updated_at)}</p>
                  </div>

                  {/* Card footer */}
                  <div className="px-5 pb-4 flex gap-2">
                    <button
                      onClick={() => handleLoad(save)}
                      className="flex-1 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#152235] transition"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(save.id)}
                      disabled={deleting === save.id}
                      className="px-4 py-2 bg-white border border-[#8b1a2e] text-[#8b1a2e] rounded-lg text-sm font-medium hover:bg-[#8b1a2e] hover:text-white transition disabled:opacity-40"
                    >
                      {deleting === save.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Create new card */}
            <button
              onClick={() => navigate('/templates')}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-12 hover:border-[#1a2744] hover:bg-gray-50 transition group"
            >
              <div className="w-12 h-12 rounded-full border-2 border-gray-300 group-hover:border-[#1a2744] flex items-center justify-center mb-3 transition">
                <span className="text-2xl text-gray-400 group-hover:text-[#1a2744] leading-none">+</span>
              </div>
              <p className="text-sm font-semibold text-gray-500 group-hover:text-[#1a2744] transition">Create New Resume</p>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
