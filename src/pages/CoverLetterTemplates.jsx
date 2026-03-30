import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

// ── 10 Cover Letter Templates ─────────────────────────────────────────────────

export const COVER_LETTER_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Clean white background with serif typography. The timeless choice for any industry.',
    badge: 'Most Popular',
    badgeColor: 'bg-amber-100 text-amber-700',
    accent: '#1a2744',
    bg: '#ffffff',
    font: 'Georgia, serif',
    categories: ['professional','simple'],
    previewStyle: { headerBg: '#1a2744', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#1a2744' },
  },
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Navy left accent bar with bold name header. Clean sans-serif layout for contemporary roles.',
    badge: '',
    badgeColor: '',
    accent: '#1a2744',
    bg: '#f8fafc',
    font: 'Inter, sans-serif',
    categories: ['modern','professional'],
    previewStyle: { headerBg: '#f8fafc', headerText: '#1a2744', bodyBg: '#f8fafc', accentLine: '#1a2744', leftBar: true },
  },
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Double-column header with contact sidebar. Structured, formal and highly ATS-friendly.',
    badge: 'ATS Friendly',
    badgeColor: 'bg-green-100 text-green-700',
    accent: '#1e3a5f',
    bg: '#ffffff',
    font: 'Georgia, serif',
    categories: ['professional'],
    previewStyle: { headerBg: '#1e3a5f', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#1e3a5f' },
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Bold purple gradient header with a modern sidebar. Perfect for designers and marketers.',
    badge: '',
    badgeColor: '',
    accent: '#7c3aed',
    bg: '#ffffff',
    font: 'Inter, sans-serif',
    categories: ['creative'],
    previewStyle: { headerBg: '#7c3aed', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#7c3aed' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Ultra-clean layout with generous whitespace and light grey dividers. Let the words shine.',
    badge: '',
    badgeColor: '',
    accent: '#374151',
    bg: '#ffffff',
    font: 'Inter, sans-serif',
    categories: ['simple','modern'],
    previewStyle: { headerBg: '#ffffff', headerText: '#111827', bodyBg: '#ffffff', accentLine: '#e5e7eb', minimal: true },
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Premium dark navy header with gold accent line. Designed for senior and leadership roles.',
    badge: 'Premium',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    accent: '#f0a04b',
    bg: '#ffffff',
    font: 'Georgia, serif',
    categories: ['professional','executive'],
    previewStyle: { headerBg: '#0f1c38', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#f0a04b', goldBar: true },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    desc: 'Rose serif styling with italic accents. Sophisticated and memorable for creative industries.',
    badge: '',
    badgeColor: '',
    accent: '#8b1a2e',
    bg: '#ffffff',
    font: 'Georgia, serif',
    categories: ['creative','simple'],
    previewStyle: { headerBg: '#ffffff', headerText: '#8b1a2e', bodyBg: '#ffffff', accentLine: '#8b1a2e', elegant: true },
  },
  {
    id: 'tech',
    name: 'Tech',
    desc: 'Dark background with monospaced accents. Built for software engineers and tech roles.',
    badge: 'For Devs',
    badgeColor: 'bg-violet-100 text-violet-700',
    accent: '#6d28d9',
    bg: '#0f172a',
    font: 'monospace',
    categories: ['modern','creative'],
    previewStyle: { headerBg: '#0f172a', headerText: '#e2e8f0', bodyBg: '#0f172a', accentLine: '#6d28d9', dark: true },
  },
  {
    id: 'coral',
    name: 'Coral',
    desc: 'Warm coral gradient header with a friendly, approachable style. Great for startups.',
    badge: '',
    badgeColor: '',
    accent: '#e85d4a',
    bg: '#ffffff',
    font: 'Inter, sans-serif',
    categories: ['modern','creative'],
    previewStyle: { headerBg: '#e85d4a', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#e85d4a' },
  },
  {
    id: 'amber',
    name: 'Amber',
    desc: 'Warm golden header with a confident, energetic feel. Stand out in competitive industries.',
    badge: '',
    badgeColor: '',
    accent: '#d97706',
    bg: '#ffffff',
    font: 'Inter, sans-serif',
    categories: ['modern','professional'],
    previewStyle: { headerBg: '#d97706', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#d97706' },
  },
]

const FILTERS = [
  { key: 'all',          label: 'All',          count: COVER_LETTER_TEMPLATES.length },
  { key: 'professional', label: 'Professional', count: COVER_LETTER_TEMPLATES.filter(t => t.categories.includes('professional')).length },
  { key: 'modern',       label: 'Modern',       count: COVER_LETTER_TEMPLATES.filter(t => t.categories.includes('modern')).length },
  { key: 'creative',     label: 'Creative',     count: COVER_LETTER_TEMPLATES.filter(t => t.categories.includes('creative')).length },
  { key: 'simple',       label: 'Simple',       count: COVER_LETTER_TEMPLATES.filter(t => t.categories.includes('simple')).length },
  { key: 'executive',    label: 'Executive',    count: COVER_LETTER_TEMPLATES.filter(t => t.categories.includes('executive')).length },
]

// ── Cover Letter Preview Card ─────────────────────────────────────────────────

function CLPreviewCard({ template }) {
  const ps = template.previewStyle
  const isDark = !!ps.dark

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-inner" style={{ backgroundColor: ps.bodyBg, fontFamily: template.font }}>
      {/* Header area */}
      <div className="px-5 py-4" style={{ backgroundColor: ps.headerBg }}>
        {ps.goldBar && <div className="h-0.5 bg-[#f0a04b] mb-3 w-12" />}
        {ps.elegant && <div className="text-center">
          <p className="text-sm italic font-bold" style={{ color: ps.headerText, fontFamily: 'Georgia, serif' }}>Olivia Johnson</p>
          <p className="text-xs mt-0.5" style={{ color: ps.headerText, opacity: 0.7 }}>olivia@email.com · +91 98765 43210</p>
        </div>}
        {!ps.elegant && !ps.minimal && (
          <div className={ps.leftBar ? 'flex gap-3' : ''}>
            {ps.leftBar && <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: ps.accentLine }} />}
            <div>
              <p className={`font-bold ${ps.leftBar ? 'text-base' : 'text-lg'}`} style={{ color: ps.headerText, fontFamily: template.font }}>
                Olivia Johnson
              </p>
              <p className="text-xs mt-0.5" style={{ color: isDark ? '#94a3b8' : ps.headerBg === ps.bodyBg ? '#6b7280' : 'rgba(255,255,255,0.75)' }}>
                olivia@email.com · +91 98765 43210
              </p>
            </div>
          </div>
        )}
        {ps.minimal && (
          <div>
            <p className="text-base font-bold text-gray-900">Olivia Johnson</p>
            <div className="h-px mt-2" style={{ backgroundColor: ps.accentLine }} />
          </div>
        )}
      </div>
      {/* Body */}
      <div className="px-5 py-3 space-y-2">
        <div className="h-2 rounded" style={{ backgroundColor: isDark ? '#334155' : '#e5e7eb', width: '40%' }} />
        <div className="h-1.5 rounded" style={{ backgroundColor: isDark ? '#1e293b' : '#f3f4f6', width: '100%' }} />
        <div className="h-1.5 rounded" style={{ backgroundColor: isDark ? '#1e293b' : '#f3f4f6', width: '92%' }} />
        <div className="h-1.5 rounded" style={{ backgroundColor: isDark ? '#1e293b' : '#f3f4f6', width: '97%' }} />
        <div className="h-1.5 rounded" style={{ backgroundColor: isDark ? '#1e293b' : '#f3f4f6', width: '85%' }} />
        <div className="mt-2 h-1.5 rounded" style={{ backgroundColor: isDark ? '#1e293b' : '#f3f4f6', width: '98%' }} />
        <div className="h-1.5 rounded" style={{ backgroundColor: isDark ? '#1e293b' : '#f3f4f6', width: '90%' }} />
        <div className="h-1.5 rounded" style={{ backgroundColor: isDark ? '#1e293b' : '#f3f4f6', width: '75%' }} />
      </div>
      {/* Footer / sign-off */}
      <div className="px-5 py-3">
        <div className="h-1.5 rounded mb-1.5" style={{ backgroundColor: isDark ? '#1e293b' : '#f3f4f6', width: '35%' }} />
        <div className="h-2 rounded font-bold" style={{ backgroundColor: isDark ? '#334155' : ps.accentLine === '#e5e7eb' ? '#d1d5db' : ps.accentLine, opacity: 0.4, width: '45%' }} />
      </div>
    </div>
  )
}

// ── Journey Tabs ──────────────────────────────────────────────────────────────

function JourneyTabs({ active }) {
  const navigate = useNavigate()
  const tabs = [
    { key: 'resume',       label: '📄 Resume Templates',       path: '/resume-templates' },
    { key: 'cv',           label: '📋 CV Templates',           path: '/cv-templates' },
    { key: 'cover-letter', label: '✉️ Cover Letter Templates', path: '/cover-letter-templates' },
  ]
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 flex gap-0">
        {tabs.map(t => (
          <button key={t.key} onClick={() => navigate(t.path)}
            className={`px-6 py-4 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              active === t.key ? 'border-[#1a2744] text-[#1a2744]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CoverLetterTemplates() {
  const navigate       = useNavigate()
  const { isSignedIn } = useUser()
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch]             = useState('')

  const displayed = COVER_LETTER_TEMPLATES.filter(t => {
    const matchesFilter = activeFilter === 'all' || t.categories.includes(activeFilter)
    const q = search.toLowerCase()
    const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  const handleSelect = (templateId) => {
    if (!isSignedIn) { navigate('/login'); return }
    navigate(`/cover-letter?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">

      {/* ── Hero ── */}
      <div className="bg-[#1a2744] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-blue-300 text-xs mb-3">
            <button onClick={() => navigate('/')} className="hover:text-white transition">Home</button>
            <span>›</span>
            <span className="text-white">Cover Letter Templates</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            Professional Cover Letter Templates
          </h1>
          <p className="text-lg text-blue-200 mb-8 max-w-xl">
            Unlock your next career move with {COVER_LETTER_TEMPLATES.length} HR-approved cover letter templates. Pair with any resume template.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <button onClick={() => handleSelect('classic')}
              className="px-6 py-3 bg-[#f0a04b] text-[#1a2744] font-bold rounded-full hover:bg-[#e8943e] transition shadow-lg text-sm">
              Create My Cover Letter →
            </button>
          </div>
          <div className="relative max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search cover letter templates…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-[#f0a04b]"/>
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">×</button>}
          </div>
        </div>
      </div>

      {/* ── Journey tabs ── */}
      <JourneyTabs active="cover-letter" />

      {/* ── Filter bar ── */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  activeFilter === f.key ? 'bg-[#1a2744] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {f.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeFilter === f.key ? 'bg-white/20 text-white' : 'bg-white text-gray-500'}`}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm text-gray-500 mb-6">
          {search ? `${displayed.length} result${displayed.length !== 1 ? 's' : ''} for "${search}"` : `Showing ${displayed.length} cover letter templates`}
        </p>

        {displayed.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No templates found</h3>
            <button onClick={() => { setSearch(''); setActiveFilter('all') }} className="px-5 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#152235] transition">Clear filters</button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {displayed.map(t => (
            <div key={t.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#1a2744] overflow-hidden group">
              {/* Live preview card */}
              <div className="relative cursor-pointer bg-gray-50 overflow-hidden" style={{ height: '200px', padding: '8px' }}
                onClick={() => handleSelect(t.id)}>
                <CLPreviewCard template={t} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.35)', margin: '8px', borderRadius: '8px' }}>
                  <span className="bg-[#1a2744] text-white text-xs font-bold px-4 py-2 rounded-full pointer-events-none">Use This Style</span>
                </div>
                {/* Accent dot */}
                <div className="absolute top-3 left-3 w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: t.accent }} />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                  {t.badge && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.badgeColor}`}>{t.badge}</span>}
                </div>
                <p className="text-xs text-gray-500 leading-snug mb-3 line-clamp-2">{t.desc}</p>
                <button onClick={() => handleSelect(t.id)} className="w-full bg-[#1a2744] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#152235] transition">
                  Use This Style
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tip card ── */}
        <div className="mt-12 bg-[#1a2744]/5 border border-[#1a2744]/10 rounded-2xl p-6">
          <h3 className="font-bold text-[#1a2744] mb-2">✨ Pro tip: Match your cover letter to your resume</h3>
          <p className="text-sm text-gray-600">
            For the strongest impression, choose a cover letter style that complements your resume template. Use the same colour family and similar font weight for a cohesive application package.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={() => navigate('/resume-templates')} className="px-4 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold hover:bg-[#152235] transition">
              Browse Resume Templates →
            </button>
            <button onClick={() => navigate('/cv-templates')} className="px-4 py-2 border border-[#1a2744] text-[#1a2744] rounded-lg text-sm font-semibold hover:bg-[#1a2744]/5 transition">
              Browse CV Templates →
            </button>
          </div>
        </div>

        {/* ── Cross-promo ── */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4 hover:border-[#1a2744] hover:shadow-md transition cursor-pointer group" onClick={() => navigate('/resume-templates')}>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-blue-100 transition">📄</div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Need a matching resume?</p>
              <p className="text-xs text-gray-500 mt-0.5">Browse 10 resume templates that pair perfectly →</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4 hover:border-[#1a2744] hover:shadow-md transition cursor-pointer group" onClick={() => navigate('/cv-templates')}>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-purple-100 transition">📋</div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Looking for CV templates?</p>
              <p className="text-xs text-gray-500 mt-0.5">Explore 10 comprehensive CV templates →</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
