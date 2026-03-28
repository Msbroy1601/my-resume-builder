import { useNavigate } from 'react-router-dom'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean blue accents, rounded cards, professional pill-style skills',
    color: 'from-blue-500 to-indigo-600',
    preview: '',
    tag: 'Popular'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Bold black borders, all-caps headings, timeless corporate style',
    color: 'from-gray-700 to-gray-900',
    preview: '',
    tag: 'Trusted'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Light typography, generous whitespace, elegant simplicity',
    color: 'from-gray-400 to-gray-600',
    preview: '',
    tag: 'Clean'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Purple-pink gradients, vibrant cards, bold and expressive',
    color: 'from-purple-500 to-pink-500',
    preview: '',
    tag: 'Bold'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Blue left-border accents, structured layout, corporate-ready',
    color: 'from-blue-600 to-blue-800',
    preview: '',
    tag: 'Corporate'
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Green sidebar for contact & skills, two-column layout',
    color: 'from-green-600 to-green-800',
    preview: '',
    tag: 'Two-Column'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Rose-orange tones, serif fonts, italic accents — refined and classy',
    color: 'from-rose-400 to-orange-500',
    preview: '',
    tag: 'Classy'
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Violet-purple palette, monospace fonts, dev/engineering focused',
    color: 'from-violet-600 to-purple-700',
    preview: '',
    tag: 'Dev'
  },
  {
    id: 'greensidebar',
    name: 'Green Sidebar',
    description: 'Dark green sidebar with initials avatar, timeline-style work history',
    color: 'from-green-700 to-green-900',
    preview: '',
    tag: 'New '
  },
  {
    id: 'goldheader',
    name: 'Gold Header',
    description: 'Gold/amber header with skill progress bars, warm professional look',
    color: 'from-yellow-500 to-amber-600',
    preview: '',
    tag: 'New '
  },
  {
    id: 'classicserif',
    name: 'Classic Serif',
    description: 'Small-caps headings, photo avatar, clean three-column skills grid',
    color: 'from-gray-600 to-gray-800',
    preview: '',
    tag: 'New '
  },
  {
    id: 'coral',
    name: 'Coral',
    description: 'Coral-orange gradient badge, left-border accents, modern and warm',
    color: 'from-orange-400 to-rose-500',
    preview: '',
    tag: 'New '
  }
]

function Templates() {
  const navigate = useNavigate()

  const handleSelect = (templateId) =>{
    navigate(`/builder?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4"> <div className="max-w-6xl mx-auto"> {/* Header */}
        <div className="text-center mb-12"> <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Template</h1> <p className="text-lg text-gray-600">Pick a design that suits your style. You can switch anytime.</p> <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm"> 100% Free — All 12 templates included
</div>
</div> {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {templates.map((template) =>(
            <div
              key={template.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              onClick={() =>handleSelect(template.id)}
            > {/* Colour preview bar */}
              <div className={`h-28 bg-gradient-to-br ${template.color} flex items-center justify-center relative`}> <span className="text-5xl">{template.preview}</span> {template.tag && (
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${
                    template.tag.includes('New') 
                      ? 'bg-yellow-400 text-yellow-900' 
                      : 'bg-white/20 text-white'
                  }`}> {template.tag}
</span> )}
</div> {/* Info */}
              <div className="p-5"> <h3 className="text-lg font-bold text-gray-900 mb-1">{template.name}</h3> <p className="text-sm text-gray-500 leading-relaxed mb-4">{template.description}</p> <button
                  onClick={() =>handleSelect(template.id)}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white text-sm bg-gradient-to-r ${template.color} hover:opacity-90 transition shadow-md`}
                > Use This Template →
</button>
</div>
</div> ))}
</div> {/* Footer note */}
        <div className="text-center mt-12 text-gray-500 text-sm"> <p>All templates include every section — Work Experience, Education, Projects, Certifications, Languages, and more.</p> <p className="mt-1">You can switch templates anytime from inside the builder without losing your data.</p>
</div> </div>
</div> )
}

export default Templates
