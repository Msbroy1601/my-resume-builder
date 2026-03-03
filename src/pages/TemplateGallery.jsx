import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const TEMPLATES = [
  { id: 'modern',       name: 'Modern',        emoji: '🔵', desc: 'Clean blue header, dot skills',        badge: 'Popular' },
  { id: 'classic',      name: 'Classic',        emoji: '⚫', desc: 'Traditional black & white',           badge: '' },
  { id: 'minimal',      name: 'Minimal',        emoji: '⚪', desc: 'Ultra-clean, lots of whitespace',     badge: '' },
  { id: 'creative',     name: 'Creative',       emoji: '🟣', desc: 'Purple gradient, bold style',         badge: '' },
  { id: 'professional', name: 'Professional',   emoji: '🔷', desc: 'Corporate blue, structured layout',   badge: 'ATS Friendly' },
  { id: 'sidebar',      name: 'Sidebar',        emoji: '🟢', desc: 'Green sidebar, photo support',        badge: '📷 Photo' },
  { id: 'elegant',      name: 'Elegant',        emoji: '🌸', desc: 'Rose serif, refined and stylish',     badge: '' },
  { id: 'tech',         name: 'Tech',           emoji: '💻', desc: 'Dark code-inspired, for developers',  badge: 'For Devs' },
  { id: 'greensidebar', name: 'Green Sidebar',  emoji: '🌿', desc: 'Dark green sidebar, modern feel',     badge: '📷 Photo' },
  { id: 'goldheader',   name: 'Gold Header',    emoji: '🥇', desc: 'Amber gradient header, premium look', badge: '📷 Photo' },
  { id: 'classicserif', name: 'Classic Serif',  emoji: '📜', desc: 'Serif font, timeless elegance',       badge: '📷 Photo' },
  { id: 'coral',        name: 'Coral',          emoji: '🪸', desc: 'Warm coral accents, modern layout',   badge: '📷 Photo' },
  { id: 'amber',        name: 'Amber',          emoji: '🟡', desc: 'Golden header, progress bar skills',  badge: '📷 Photo' },
  { id: 'serif2',       name: 'Formal Serif',   emoji: '🎓', desc: 'Small-caps headers, photo top-left',  badge: '📷 Photo' },
  { id: 'hexagon',      name: 'Hexagon',        emoji: '🔷', desc: 'Salmon hexagon monogram, dot skills', badge: '' },
  { id: 'navy',         name: 'Navy Icons',     emoji: '🏛', desc: 'Navy section badges, square photo',   badge: '📷 Photo' },
  { id: 'bluesidebar',  name: 'Blue Sidebar',   emoji: '🩵', desc: 'Bright blue sidebar, pill skills',    badge: '📷 Photo' },
]

export default function TemplateGallery() {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()

  const handleSelect = (templateId) => {
    if (!isSignedIn) { navigate('/login'); return }
    navigate(`/builder?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Template</h1>
          <p className="text-lg text-gray-600">17 professionally designed templates — pick the one that fits your style</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {TEMPLATES.map(t => (
            <div key={t.id} onClick={() => handleSelect(t.id)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 group overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                {t.emoji}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                  {t.badge && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{t.badge}</span>}
                </div>
                <p className="text-xs text-gray-500 leading-snug">{t.desc}</p>
                <button className="mt-3 w-full bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                  Use This Template
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-8">All templates are free to use. More coming soon!</p>
      </div>
    </div>
  )
}
