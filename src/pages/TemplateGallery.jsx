import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

// ── Mini layout preview for each template ──────────────────────────────────────
// Each preview is a tiny HTML/CSS mockup showing colors + layout structure

function PreviewModern() {
  return (
    <div className="w-full h-full bg-white text-[2px] overflow-hidden">
      <div className="bg-blue-600 px-2 py-1.5">
        <div className="w-12 h-1 bg-white rounded mb-0.5"/>
        <div className="flex gap-1">
          <div className="w-6 h-0.5 bg-blue-300 rounded"/>
          <div className="w-4 h-0.5 bg-blue-300 rounded"/>
        </div>
      </div>
      <div className="px-2 py-1">
        {[70,90,60,80,50].map((w,i)=><div key={i} className="h-0.5 bg-gray-300 rounded mb-0.5" style={{width:`${w}%`}}/>)}
        <div className="flex gap-1 mt-1">{['bg-blue-500','bg-blue-400','bg-blue-300'].map((c,i)=><div key={i} className={`w-1 h-1 rounded-full ${c}`}/>)}</div>
        <div className="mt-1">{[85,65,75].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}</div>
      </div>
    </div>
  )
}

function PreviewClassic() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="px-2 py-1.5 text-center border-b-2 border-gray-800">
        <div className="w-10 h-1 bg-gray-800 rounded mx-auto mb-0.5"/>
        <div className="w-14 h-0.5 bg-gray-400 rounded mx-auto"/>
      </div>
      <div className="px-2 py-1">
        {[80,60,90,50,70].map((w,i)=><div key={i} className="h-0.5 bg-gray-300 rounded mb-0.5 mx-auto" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

function PreviewMinimal() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="px-3 py-2">
        <div className="w-10 h-1 bg-gray-900 rounded mb-1"/>
        <div className="w-16 h-0.5 bg-gray-200 rounded mb-1.5"/>
        {[90,70,80,60,75,55].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

function PreviewCreative() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="h-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 flex items-end px-2 pb-1">
        <div className="w-10 h-1 bg-white/80 rounded"/>
      </div>
      <div className="px-2 py-1">
        {[80,60,90,50,70].map((w,i)=><div key={i} className="h-0.5 bg-gray-300 rounded mb-0.5" style={{width:`${w}%`}}/>)}
        <div className="flex gap-1 mt-1">{['bg-purple-400','bg-pink-400','bg-orange-400'].map((c,i)=><div key={i} className={`h-1 rounded ${c}`} style={{width:'20%'}}/>)}</div>
      </div>
    </div>
  )
}

function PreviewProfessional() {
  return (
    <div className="w-full h-full bg-white overflow-hidden flex">
      <div className="w-1.5 bg-blue-600 flex-shrink-0"/>
      <div className="flex-1 px-2 py-1.5">
        <div className="w-12 h-1 bg-gray-800 rounded mb-0.5"/>
        <div className="w-16 h-0.5 bg-gray-300 rounded mb-1"/>
        {[85,65,75,55,80].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

function PreviewSidebar() {
  return (
    <div className="w-full h-full bg-white overflow-hidden flex">
      <div className="w-5 bg-gradient-to-b from-green-600 to-teal-600 flex-shrink-0 px-0.5 py-1">
        <div className="w-3 h-3 rounded-full bg-green-300 mx-auto mb-1"/>
        {[80,60,90,50,70,60,80].map((w,i)=><div key={i} className="h-0.5 bg-green-300/60 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
      <div className="flex-1 px-1.5 py-1">
        <div className="w-10 h-1 bg-gray-800 rounded mb-0.5"/>
        <div className="w-4 h-0.5 bg-green-500 rounded mb-1"/>
        {[90,70,80,60,75,55,85].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

function PreviewElegant() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-rose-50 to-orange-50 overflow-hidden">
      <div className="px-2 py-1.5 text-center">
        <div className="w-14 h-1 bg-gray-800 rounded mx-auto mb-0.5"/>
        <div className="w-10 h-0.5 bg-rose-400 rounded mx-auto mb-1"/>
        {[70,90,65,80,55].map((w,i)=><div key={i} className="h-0.5 bg-gray-300 rounded mb-0.5 mx-auto" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

function PreviewTech() {
  return (
    <div className="w-full h-full bg-gray-900 overflow-hidden">
      <div className="px-2 py-1.5">
        <div className="w-12 h-1 bg-violet-400 rounded mb-0.5"/>
        <div className="flex gap-0.5 mb-1"><div className="w-1 h-0.5 bg-violet-500 rounded"/><div className="w-10 h-0.5 bg-gray-500 rounded"/></div>
        {[80,65,75,55,85,60].map((w,i)=><div key={i} className="h-0.5 bg-gray-600 rounded mb-0.5" style={{width:`${w}%`}}/>)}
        <div className="flex flex-col gap-0.5 mt-0.5">{[75,55,85].map((w,i)=><div key={i} className="h-1 bg-gray-800 rounded border border-violet-800/50" style={{width:`${w}%`}}/>)}</div>
      </div>
    </div>
  )
}

function PreviewGreenSidebar() {
  return (
    <div className="w-full h-full bg-white overflow-hidden flex">
      <div className="w-5 bg-green-800 flex-shrink-0 px-0.5 py-1">
        <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1"/>
        {[80,60,90,50,70,60].map((w,i)=><div key={i} className="h-0.5 bg-green-400/50 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
      <div className="flex-1 px-1.5 py-1">
        <div className="w-10 h-1 bg-green-800 rounded mb-1"/>
        {[90,70,80,60,75,55,85,65].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

function PreviewGoldHeader() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-600 to-amber-500 px-2 py-1.5 flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-white/30 flex-shrink-0"/>
        <div className="w-10 h-1 bg-white/80 rounded"/>
      </div>
      <div className="bg-gray-50 px-2 py-0.5 flex gap-1">
        {[30,25,35].map((w,i)=><div key={i} className="h-0.5 bg-gray-400 rounded" style={{width:`${w}%`}}/>)}
      </div>
      <div className="px-2 py-1">
        {[80,60,90,50,70].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

function PreviewClassicSerif() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="px-2 py-1.5 border-b-2 border-gray-800 flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-gray-300 flex-shrink-0"/>
        <div>
          <div className="w-10 h-0.5 bg-gray-800 rounded mb-0.5"/>
          <div className="w-14 h-0.5 bg-gray-400 rounded"/>
        </div>
      </div>
      <div className="px-2 py-1">
        {[80,60,75,55,85,65].map((w,i)=><div key={i} className="h-0.5 bg-gray-300 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

function PreviewCoral() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="h-5 bg-gradient-to-r from-rose-500 to-orange-400 px-2 flex items-center">
        <div className="w-10 h-1 bg-white/80 rounded"/>
      </div>
      <div className="px-2 py-1">
        <div className="w-8 h-0.5 bg-rose-500 rounded mb-0.5"/>
        {[80,60,90,50,70,55].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

function PreviewAmber() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-2 py-1.5 flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-white/40 flex-shrink-0"/>
        <div className="w-10 h-1 bg-white/80 rounded"/>
      </div>
      <div className="px-2 py-1">
        {[75,55,85,65,80].map((w,i)=> (
          <div key={i} className="mb-0.5">
            <div className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>
            <div className="h-0.5 rounded" style={{width:`${Math.round(w*0.6)}%`, background:'#f59e0b'}}/>
          </div>
        ))}
      </div>
    </div>
  )
}

function PreviewSerif2() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="px-2 py-1.5">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-2.5 h-3 rounded-sm bg-gray-200 flex-shrink-0"/>
          <div>
            <div className="w-10 h-0.5 bg-gray-800 rounded mb-0.5"/>
            <div className="w-8 h-0.5 bg-gray-400 rounded"/>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-0.5">
          {[80,60,75,55,85,65].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
        </div>
      </div>
    </div>
  )
}

function PreviewHexagon() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="px-2 py-1.5 flex items-start gap-1.5">
        <div className="w-4 h-4 bg-rose-200 flex-shrink-0 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}>
          <div className="w-2 h-1 bg-rose-500 rounded"/>
        </div>
        <div className="flex-1">
          <div className="w-10 h-0.5 bg-gray-800 rounded mb-0.5"/>
          {[80,60,75,55,85].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
        </div>
      </div>
    </div>
  )
}

function PreviewNavy() {
  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <div className="px-2 py-1.5">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 bg-blue-900 flex-shrink-0"/>
          <div className="w-10 h-1 bg-gray-800 rounded"/>
        </div>
        {['bg-blue-900','bg-blue-900','bg-blue-900'].map((c,i)=>(
          <div key={i} className="mb-0.5">
            <div className={`inline-block ${c} px-1 py-0.5 rounded-sm mb-0.5`}><div className="w-6 h-0.5 bg-white rounded"/></div>
            <div className="h-0.5 bg-gray-200 rounded" style={{width:'80%'}}/>
          </div>
        ))}
      </div>
    </div>
  )
}

function PreviewBlueSidebar() {
  return (
    <div className="w-full h-full bg-white overflow-hidden flex">
      <div className="w-5 bg-blue-500 flex-shrink-0 px-0.5 py-1">
        <div className="w-3 h-3 rounded-full bg-white/50 mx-auto mb-1"/>
        {[80,60,90,50,70,60].map((w,i)=><div key={i} className="h-0.5 bg-blue-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
      <div className="flex-1 px-1.5 py-1">
        <div className="w-10 h-1 bg-gray-800 rounded mb-1"/>
        {[90,70,80,60,75,55,85,65].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded mb-0.5" style={{width:`${w}%`}}/>)}
      </div>
    </div>
  )
}

const PREVIEW_COMPONENTS = {
  modern: PreviewModern,
  classic: PreviewClassic,
  minimal: PreviewMinimal,
  creative: PreviewCreative,
  professional: PreviewProfessional,
  sidebar: PreviewSidebar,
  elegant: PreviewElegant,
  tech: PreviewTech,
  greensidebar: PreviewGreenSidebar,
  goldheader: PreviewGoldHeader,
  classicserif: PreviewClassicSerif,
  coral: PreviewCoral,
  amber: PreviewAmber,
  serif2: PreviewSerif2,
  hexagon: PreviewHexagon,
  navy: PreviewNavy,
  bluesidebar: PreviewBlueSidebar,
}

// ── Template list ──────────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: 'modern',       name: 'Modern',        desc: 'Clean blue header, dot skills',        badge: 'Popular',     badgeColor: 'bg-blue-100 text-blue-700' },
  { id: 'classic',      name: 'Classic',        desc: 'Traditional black & white',            badge: '',            badgeColor: '' },
  { id: 'minimal',      name: 'Minimal',        desc: 'Ultra-clean, lots of whitespace',      badge: '',            badgeColor: '' },
  { id: 'creative',     name: 'Creative',       desc: 'Purple gradient, bold style',          badge: '',            badgeColor: '' },
  { id: 'professional', name: 'Professional',   desc: 'Corporate blue, structured layout',    badge: 'ATS Friendly',badgeColor: 'bg-green-100 text-green-700' },
  { id: 'sidebar',      name: 'Sidebar',        desc: 'Green sidebar, photo support',         badge: '📷 Photo',    badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'elegant',      name: 'Elegant',        desc: 'Rose serif, refined and stylish',      badge: '',            badgeColor: '' },
  { id: 'tech',         name: 'Tech',           desc: 'Dark code-inspired, for developers',   badge: 'For Devs',    badgeColor: 'bg-violet-100 text-violet-700' },
  { id: 'greensidebar', name: 'Green Sidebar',  desc: 'Dark green sidebar, modern feel',      badge: '📷 Photo',    badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'goldheader',   name: 'Gold Header',    desc: 'Amber gradient header, premium look',  badge: '📷 Photo',    badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'classicserif', name: 'Classic Serif',  desc: 'Serif font, timeless elegance',        badge: '📷 Photo',    badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'coral',        name: 'Coral',          desc: 'Warm coral accents, modern layout',    badge: '📷 Photo',    badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'amber',        name: 'Amber',          desc: 'Golden header, progress bar skills',   badge: '📷 Photo',    badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'serif2',       name: 'Formal Serif',   desc: 'Small-caps headers, photo top-left',   badge: '📷 Photo',    badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'hexagon',      name: 'Hexagon',        desc: 'Salmon hexagon monogram, dot skills',  badge: '',            badgeColor: '' },
  { id: 'navy',         name: 'Navy Icons',     desc: 'Navy section badges, square photo',    badge: '📷 Photo',    badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'bluesidebar',  name: 'Blue Sidebar',   desc: 'Bright blue sidebar, pill skills',     badge: '📷 Photo',    badgeColor: 'bg-gray-100 text-gray-600' },
]

// ── Main component ─────────────────────────────────────────────────────────────

export default function TemplateGallery() {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const [hoveredId, setHoveredId] = useState(null)

  const handleSelect = (templateId) => {
    if (!isSignedIn) { navigate('/login'); return }
    navigate(`/builder?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Template</h1>
          <p className="text-lg text-gray-600">17 professionally designed templates — hover to preview, click to build</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {TEMPLATES.map(t => {
            const PreviewComp = PREVIEW_COMPONENTS[t.id]
            const isHovered = hoveredId === t.id

            return (
              <div
                key={t.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 overflow-visible relative"
                onMouseEnter={() => setHoveredId(t.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* ── Preview thumbnail ── */}
                <div className="h-36 rounded-t-xl overflow-hidden relative bg-gray-50">
                  <PreviewComp />

                  {/* Zoom overlay on hover */}
                  {isHovered && (
                    <div
                      className="absolute inset-0 z-50 flex items-start justify-center pointer-events-none"
                      style={{ overflow: 'visible' }}
                    >
                      <div
                        className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                        style={{
                          width: '280px',
                          height: '380px',
                          transform: 'translateY(-10px)',
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          marginLeft: '-140px',
                          zIndex: 100,
                        }}
                      >
                        {/* Zoomed header */}
                        <div className="bg-gray-800 text-white text-xs px-3 py-1.5 font-semibold flex items-center justify-between">
                          <span>{t.name}</span>
                          {t.badge && <span className="text-gray-300 font-normal">{t.badge}</span>}
                        </div>
                        {/* Zoomed preview at 4× scale */}
                        <div className="relative overflow-hidden" style={{ height: '348px' }}>
                          <div style={{ transform: 'scale(4)', transformOrigin: 'top left', width: '25%', height: '25%' }}>
                            <PreviewComp />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Card info ── */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                    {t.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.badgeColor}`}>
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-snug mb-3">{t.desc}</p>
                  <button
                    onClick={() => handleSelect(t.id)}
                    className="w-full bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">All templates are free to use. More coming soon!</p>
      </div>
    </div>
  )
}
