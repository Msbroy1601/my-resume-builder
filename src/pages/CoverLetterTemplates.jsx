import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

// ── Cover Letter Templates — formal professional palette only ──────────────────

export const COVER_LETTER_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Clean white background with navy header and serif typography. The timeless, universally accepted choice for any industry.',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-100 text-blue-700',
    accent: '#1a2744',
    bg: '#ffffff',
    font: 'Georgia, serif',
    categories: ['professional', 'simple'],
    previewStyle: { headerBg: '#1a2744', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#1a2744' },
  },
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Navy left accent bar with a bold name header. Clean sans-serif layout for contemporary roles and tech companies.',
    badge: '',
    badgeColor: '',
    accent: '#1a2744',
    bg: '#f8fafc',
    font: 'Inter, sans-serif',
    categories: ['modern', 'professional'],
    previewStyle: { headerBg: '#f8fafc', headerText: '#1a2744', bodyBg: '#f8fafc', accentLine: '#1a2744', leftBar: true },
  },
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Strong corporate blue header with a structured two-line contact row. Highly ATS-friendly and HR-approved.',
    badge: 'ATS Friendly',
    badgeColor: 'bg-green-100 text-green-700',
    accent: '#1e3a5f',
    bg: '#ffffff',
    font: 'Georgia, serif',
    categories: ['professional'],
    previewStyle: { headerBg: '#1e3a5f', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#1e3a5f' },
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Premium dark midnight header with a gold accent rule. Crafted for senior leadership, C-suite and consulting applications.',
    badge: 'Senior Roles',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    accent: '#f0a04b',
    bg: '#ffffff',
    font: 'Georgia, serif',
    categories: ['professional', 'executive'],
    previewStyle: { headerBg: '#0f1c38', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#f0a04b', goldBar: true },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Ultra-clean layout with generous whitespace and a single grey rule. The content does the talking.',
    badge: 'Clean',
    badgeColor: 'bg-gray-100 text-gray-600',
    accent: '#374151',
    bg: '#ffffff',
    font: 'Inter, sans-serif',
    categories: ['simple', 'modern'],
    previewStyle: { headerBg: '#ffffff', headerText: '#111827', bodyBg: '#ffffff', accentLine: '#e5e7eb', minimal: true },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    desc: 'Centred serif header with an italic name and a fine decorative rule. Sophisticated, memorable, and ideal for creative industries.',
    badge: '',
    badgeColor: '',
    accent: '#1a2744',
    bg: '#ffffff',
    font: 'Georgia, serif',
    categories: ['professional', 'simple'],
    previewStyle: { headerBg: '#ffffff', headerText: '#1a2744', bodyBg: '#ffffff', accentLine: '#1a2744', elegant: true },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    desc: 'Bold steel-blue full-width header with white text and a bottom accent strip. Signals authority and corporate polish.',
    badge: '',
    badgeColor: '',
    accent: '#0369a1',
    bg: '#ffffff',
    font: 'Inter, sans-serif',
    categories: ['professional', 'modern'],
    previewStyle: { headerBg: '#0369a1', headerText: '#ffffff', bodyBg: '#ffffff', accentLine: '#0369a1', corporate: true },
  },
  {
    id: 'academic',
    name: 'Academic',
    desc: 'Traditional single-column layout with a centred black heading and subtle divider. Perfect for research, education and government applications.',
    badge: '',
    badgeColor: '',
    accent: '#111827',
    bg: '#ffffff',
    font: 'Georgia, serif',
    categories: ['professional', 'simple', 'executive'],
    previewStyle: { headerBg: '#ffffff', headerText: '#111827', bodyBg: '#ffffff', accentLine: '#111827', academic: true },
  },
]

const FILTERS = [
  { key: 'all',          label: 'All',          count: COVER_LETTER_TEMPLATES.length },
  { key: 'professional', label: 'Professional', count: COVER_LETTER_TEMPLATES.filter(t => t.categories.includes('professional')).length },
  { key: 'modern',       label: 'Modern',       count: COVER_LETTER_TEMPLATES.filter(t => t.categories.includes('modern')).length },
  { key: 'simple',       label: 'Simple',       count: COVER_LETTER_TEMPLATES.filter(t => t.categories.includes('simple')).length },
  { key: 'executive',    label: 'Executive',    count: COVER_LETTER_TEMPLATES.filter(t => t.categories.includes('executive')).length },
]

// ── Cover Letter Preview Card — realistic letter layout ───────────────────────

function CLPreviewCard({ template }) {
  const ps    = template.previewStyle
  const col   = ps.accentLine || template.accent
  const body  = ps.bodyBg || '#ffffff'
  const lineC = '#dde1e7'

  // Row of text lines simulating a paragraph
  const Para = ({ widths }) => (
    <div style={{ marginBottom: '6px' }}>
      {widths.map((w, i) => (
        <div key={i} style={{ height: '3.5px', backgroundColor: lineC, width: `${w}%`, borderRadius: '1px', marginBottom: '2.5px' }} />
      ))}
    </div>
  )

  return (
    <div style={{ backgroundColor: body, fontFamily: template.font, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontSize: '7px' }}>

      {/* ── Header ── */}
      {ps.academic ? (
        // Academic: centred black heading, divider
        <div style={{ padding: '10px 12px 6px', borderBottom: `1.5px solid ${col}`, textAlign: 'center' }}>
          <div style={{ fontSize: '8.5px', fontWeight: 700, color: '#111827', letterSpacing: '0.3px' }}>OLIVIA JOHNSON</div>
          <div style={{ fontSize: '5px', color: '#6b7280', marginTop: '2px' }}>olivia@email.com · +91 98765 43210</div>
        </div>
      ) : ps.elegant ? (
        // Elegant: centred italic name
        <div style={{ padding: '10px 12px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, fontStyle: 'italic', color: col }}>Olivia Johnson</div>
          <div style={{ fontSize: '5px', color: '#9ca3af', marginTop: '2px' }}>olivia@email.com · +91 98765 43210</div>
          <div style={{ height: '1px', backgroundColor: col, width: '28px', margin: '5px auto 0', opacity: 0.35 }} />
        </div>
      ) : ps.minimal ? (
        // Minimal: plain name + rule
        <div style={{ padding: '10px 12px 0' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#111827' }}>Olivia Johnson</div>
          <div style={{ fontSize: '5px', color: '#9ca3af', marginTop: '2px' }}>olivia@email.com · +91 98765 43210</div>
          <div style={{ height: '1px', backgroundColor: '#d1d5db', marginTop: '6px' }} />
        </div>
      ) : ps.leftBar ? (
        // Modern: left accent bar
        <div style={{ padding: '10px 12px 8px', display: 'flex', gap: '6px', alignItems: 'stretch', backgroundColor: body }}>
          <div style={{ width: '2.5px', backgroundColor: col, borderRadius: '1px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: col }}>Olivia Johnson</div>
            <div style={{ fontSize: '5px', color: '#9ca3af', marginTop: '2px' }}>olivia@email.com · +91 98765 43210</div>
          </div>
        </div>
      ) : ps.goldBar ? (
        // Executive: dark header + gold rule
        <div style={{ backgroundColor: ps.headerBg, padding: '9px 12px 8px' }}>
          <div style={{ height: '2px', backgroundColor: '#f0a04b', width: '18px', borderRadius: '1px', marginBottom: '5px' }} />
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#ffffff' }}>Olivia Johnson</div>
          <div style={{ fontSize: '5px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>olivia@email.com · +91 98765 43210</div>
        </div>
      ) : (
        // Default: solid colour header (classic, professional, corporate)
        <div style={{ backgroundColor: ps.headerBg, padding: '10px 12px 8px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: ps.headerText || '#ffffff' }}>Olivia Johnson</div>
          <div style={{ fontSize: '5px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>olivia@email.com · +91 98765 43210</div>
          {ps.corporate && <div style={{ height: '1.5px', backgroundColor: 'rgba(255,255,255,0.25)', marginTop: '6px' }} />}
        </div>
      )}

      {/* ── Letter body ── */}
      <div style={{ flex: 1, padding: '7px 12px 6px' }}>
        {/* Date line */}
        <div style={{ height: '3px', backgroundColor: '#e5e7eb', width: '28%', borderRadius: '1px', marginBottom: '6px' }} />
        {/* Salutation */}
        <div style={{ fontSize: '6px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Dear Hiring Manager,</div>
        {/* Opening paragraph */}
        <Para widths={[100, 96, 98, 92, 100, 68]} />
        {/* Body paragraph */}
        <Para widths={[100, 94, 97, 90, 95, 75]} />
        {/* Short closing paragraph */}
        <Para widths={[96, 91, 60]} />
        {/* Sign-off */}
        <div style={{ marginTop: '6px' }}>
          <div style={{ fontSize: '5.5px', color: '#6b7280', marginBottom: '3px' }}>Yours sincerely,</div>
          <div style={{ fontSize: '6.5px', fontWeight: 700, color: '#111827' }}>Olivia Johnson</div>
        </div>
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
