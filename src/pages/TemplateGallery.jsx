import { useNavigate } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'

function TemplateGallery() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { signOut } = useClerk()
  const currentUser = user
  const displayName = currentUser?.firstName || currentUser?.fullName || 'there'

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      emoji: '🚀',
      description: 'Clean & professional',
      color: 'from-blue-500 to-indigo-500',
      recommended: true
    },
    {
      id: 'classic',
      name: 'Classic',
      emoji: '📄',
      description: 'Traditional & formal',
      color: 'from-gray-700 to-gray-900',
      recommended: true
    },
    {
      id: 'minimal',
      name: 'Minimal',
      emoji: '✨',
      description: 'Simple & elegant',
      color: 'from-gray-400 to-gray-600',
      recommended: true
    },
    {
      id: 'creative',
      name: 'Creative',
      emoji: '🎨',
      description: 'Bold & colorful',
      color: 'from-purple-500 to-pink-500',
      recommended: false
    },
    {
      id: 'professional',
      name: 'Professional',
      emoji: '💼',
      description: 'Corporate blue',
      color: 'from-blue-600 to-cyan-600',
      recommended: false
    },
    {
      id: 'sidebar',
      name: 'Sidebar',
      emoji: '📊',
      description: 'Two-column layout',
      color: 'from-green-500 to-teal-500',
      recommended: false
    },
    {
      id: 'elegant',
      name: 'Elegant',
      emoji: '👔',
      description: 'Sophisticated style',
      color: 'from-rose-500 to-orange-500',
      recommended: false
    },
    {
      id: 'tech',
      name: 'Tech',
      emoji: '💻',
      description: 'Modern tech industry',
      color: 'from-violet-500 to-purple-500',
      recommended: false
    }
  ]

  // Sort templates: recommended first
  const sortedTemplates = [...templates].sort((a, b) => {
    if (a.recommended && !b.recommended) return -1
    if (!a.recommended && b.recommended) return 1
    return 0
  })

  const handleTemplateSelect = (templateId) => {
    navigate(`/builder?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-sm text-gray-600 mt-1">Choose your template</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Hi, {displayName}!</span>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Home
              </button>
              <button
                onClick={() => {
                  signOut()
                  navigate('/')
                }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Template Grid */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Select a Template
          </h2>
          <p className="text-lg text-gray-600">
            Pick a template. You can change it later.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {sortedTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 p-6 text-center border-2 border-transparent hover:border-blue-500 relative"
            >
              {/* Recommended Badge */}
              {template.recommended && (
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Recommended
                </div>
              )}
              
              <div className={`w-full h-48 bg-gradient-to-br ${template.color} rounded-lg mb-4 flex items-center justify-center text-6xl`}>
                {template.emoji}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TemplateGallery