import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

//  Template list 

const TEMPLATES = [
  { id: 'modern',       name: 'Modern',        desc: 'Clean blue header with dot-style skill indicators. Great for tech and corporate roles.',       badge: 'Popular',      badgeColor: 'bg-blue-100 text-blue-700' },
  { id: 'classic',      name: 'Classic',        desc: 'Timeless black & white layout trusted by hiring managers across all industries.',              badge: '',             badgeColor: '' },
  { id: 'minimal',      name: 'Minimal',        desc: 'Ultra-clean design with generous whitespace. Lets your content do the talking.',              badge: '',             badgeColor: '' },
  { id: 'creative',     name: 'Creative',       desc: 'Bold purple gradient header. Perfect for design, marketing and creative fields.',             badge: '',             badgeColor: '' },
  { id: 'professional', name: 'Professional',   desc: 'Corporate blue with structured layout. Optimised for ATS scanning.',                          badge: 'ATS Friendly', badgeColor: 'bg-green-100 text-green-700' },
  { id: 'sidebar',      name: 'Sidebar',        desc: 'Teal sidebar with photo support. A modern two-column format that stands out.',                badge: ' Photo',     badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'elegant',      name: 'Elegant',        desc: 'Refined rose serif styling for a polished, sophisticated first impression.',                  badge: '',             badgeColor: '' },
  { id: 'tech',         name: 'Tech',           desc: 'Dark code-inspired theme built for software engineers and developers.',                       badge: 'For Devs',     badgeColor: 'bg-violet-100 text-violet-700' },
  { id: 'greensidebar', name: 'Green Sidebar',  desc: 'Deep forest-green sidebar with a strong modern feel. Includes photo slot.',                  badge: ' Photo',     badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'goldheader',   name: 'Gold Header',    desc: 'Rich amber gradient header that radiates a premium executive look.',                          badge: ' Photo',     badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'classicserif', name: 'Classic Serif',  desc: 'Traditional serif typography for a timeless, trustworthy presence.',                         badge: ' Photo',     badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'coral',        name: 'Coral',          desc: 'Warm coral-to-orange header accents. Modern, friendly and approachable.',                    badge: ' Photo',     badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'amber',        name: 'Amber',          desc: 'Golden header with animated skill progress bars. Eye-catching and contemporary.',             badge: ' Photo',     badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'serif2',       name: 'Formal Serif',   desc: 'Small-caps section headers with a photo slot top-left. Formal and distinguished.',           badge: ' Photo',     badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'hexagon',      name: 'Hexagon',        desc: 'Salmon hexagon monogram accent with dot-style skills. Unique and memorable.',                badge: '',             badgeColor: '' },
  { id: 'navy',         name: 'Navy Icons',     desc: 'Navy section badges and square photo frame. Authoritative and structured.',                  badge: ' Photo',     badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 'bluesidebar',  name: 'Blue Sidebar',   desc: 'Bright cobalt sidebar with pill-style skill tags. Fresh and modern.',                        badge: ' Photo',     badgeColor: 'bg-gray-100 text-gray-600' },
]

//  Main component 

export default function TemplateGallery() {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const [modalIdx, setModalIdx] = useState(null) // index into TEMPLATES, or null
  const [choiceTemplateId, setChoiceTemplateId] = useState(null) // template chosen, waiting for start choice

  // Lock body scroll when modal is open
  useEffect(() =>{
    document.body.style.overflow = modalIdx !== null ? 'hidden' : ''
    return () =>{ document.body.style.overflow = '' }
  }, [modalIdx])

  // Keyboard navigation
  const handleKey = useCallback((e) =>{
    if (modalIdx === null) return
    if (e.key === 'Escape') setModalIdx(null)
    if (e.key === 'ArrowRight') setModalIdx(i =>(i + 1) % TEMPLATES.length)
    if (e.key === 'ArrowLeft')  setModalIdx(i =>(i - 1 + TEMPLATES.length) % TEMPLATES.length)
  }, [modalIdx])

  useEffect(() =>{
    window.addEventListener('keydown', handleKey)
    return () =>window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const handleSelect = (templateId) =>{
    if (!isSignedIn) { navigate('/login'); return }
    setModalIdx(null) // close preview modal if open
    setChoiceTemplateId(templateId)
  }

  const activeTemplate = modalIdx !== null ? TEMPLATES[modalIdx] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6"> <div className="max-w-6xl mx-auto"> {/*  Header  */}
        <div className="text-center mb-12"> <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Template</h1> <p className="text-lg text-gray-600">17 professionally designed templates — click the preview to explore</p>
</div> {/*  Template grid  */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"> {TEMPLATES.map((t, idx) =>(
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-400 overflow-hidden group"
            > {/* Thumbnail */}
              <div
                className="relative overflow-hidden cursor-pointer bg-gray-100"
                style={{ height: '200px' }}
                onClick={() =>setModalIdx(idx)}
              > <img
                  src={`/template-previews/${t.id}.jpg`}
                  alt={`${t.name} resume template`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                /> {/* Hover: "Use this template" overlay (matches reference) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}> <span className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg pointer-events-none"> Use this template
</span>
</div> {/* Zoom icon bottom-right (matches reference) */}
                <button
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 z-10"
                  onClick={e =>{ e.stopPropagation(); setModalIdx(idx) }}
                  aria-label={`Preview ${t.name}`}
                > <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
</svg>
</button>
</div> {/* Card info */}
              <div className="p-4"> <div className="flex items-center justify-between mb-1"> <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3> {t.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.badgeColor}`}> {t.badge}
</span> )}
</div> <p className="text-xs text-gray-500 leading-snug mb-3 line-clamp-2">{t.desc}</p> <button
                  onClick={() =>handleSelect(t.id)}
                  className="w-full bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition"
                > Use This Template
</button>
</div>
</div> ))}
</div> <p className="text-center text-sm text-gray-500 mt-8">All templates are free to use. More coming soon!</p>
</div> {/*  Start Choice Modal  */}
      {choiceTemplateId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          onClick={() =>setChoiceTemplateId(null)}
        > <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md"
            onClick={e =>e.stopPropagation()}
          > {/* Header */}
            <div className="px-8 pt-8 pb-5 text-center border-b border-gray-100"> <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"> {TEMPLATES.find(t =>t.id === choiceTemplateId)?.badge?.includes('Photo') ? '' : ''}
</div> <h2 className="text-xl font-bold text-gray-900"> {TEMPLATES.find(t =>t.id === choiceTemplateId)?.name} selected
</h2> <p className="text-sm text-gray-500 mt-1">How would you like to start?</p>
</div> {/* Two options */}
            <div className="p-6 space-y-3"> {/* Import option */}
              <button
                onClick={() =>navigate(`/builder?template=${choiceTemplateId}&import=true`)}
                className="w-full flex items-start gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-left group"
              > <div className="w-11 h-11 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition"> </div> <div> <p className="font-bold text-gray-900 text-sm">Import my existing CV</p> <p className="text-xs text-gray-500 mt-0.5">Upload a PDF, Word doc, or TXT file — we'll pre-fill the form for you</p>
</div>
</button> {/* Scratch option */}
              <button
                onClick={() =>navigate(`/builder?template=${choiceTemplateId}`)}
                className="w-full flex items-start gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-left group"
              > <div className="w-11 h-11 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition"> </div> <div> <p className="font-bold text-gray-900 text-sm">Start from scratch</p> <p className="text-xs text-gray-500 mt-0.5">Fill in your details fresh with role-based suggestions as you type</p>
</div>
</button>
</div> {/* Back */}
            <div className="px-6 pb-6"> <button
                onClick={() =>setChoiceTemplateId(null)}
                className="w-full py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition"
              > ← Back to templates
</button>
</div>
</div>
</div> )}

      {/*  Preview Modal  */}
      {activeTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
          onClick={() =>setModalIdx(null)}
        > {/* Prev arrow */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition z-20"
            onClick={e =>{ e.stopPropagation(); setModalIdx(i =>(i - 1 + TEMPLATES.length) % TEMPLATES.length) }}
            aria-label="Previous template"
          > <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
</svg>
</button> {/* Next arrow */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition z-20"
            onClick={e =>{ e.stopPropagation(); setModalIdx(i =>(i + 1) % TEMPLATES.length) }}
            aria-label="Next template"
          > <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
</svg>
</button> {/* Modal panel */}
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden flex"
            style={{ maxWidth: '860px', width: '100%', maxHeight: '88vh' }}
            onClick={e =>e.stopPropagation()}
          > {/* LEFT: template info */}
            <div className="flex flex-col justify-between p-8 bg-white flex-shrink-0" style={{ width: '280px' }}> <div> {/* Close button */}
                <div className="flex justify-end mb-4"> <button
                    onClick={() =>setModalIdx(null)}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                  > <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg>
</button>
</div> <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTemplate.name}</h2> {activeTemplate.badge && (
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold mb-4 ${activeTemplate.badgeColor}`}> {activeTemplate.badge}
</span> )}
                <p className="text-sm text-gray-500 leading-relaxed mb-8">{activeTemplate.desc}</p> {/* Template counter */}
                <p className="text-xs text-gray-400 mb-6"> {(modalIdx + 1)} of {TEMPLATES.length} templates
</p>
</div> {/* CTA */}
              <div className="space-y-3"> <button
                  onClick={() =>{ setModalIdx(null); handleSelect(activeTemplate.id) }}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition text-sm"
                > Use This Template →
</button> <button
                  onClick={() =>setModalIdx(null)}
                  className="w-full border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition text-sm"
                > Back to gallery
</button>
</div>
</div> {/* RIGHT: full CV preview (scrollable) */}
            <div
              className="flex-1 overflow-y-auto border-l border-gray-100 bg-gray-50"
              style={{ maxHeight: '88vh' }}
            > <img
                src={`/template-previews/${activeTemplate.id}.jpg`}
                alt={`${activeTemplate.name} full preview`}
                className="w-full"
              />
</div>
</div>
</div> )}
</div> )
}
