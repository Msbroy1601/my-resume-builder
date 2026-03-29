import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import html2pdf from 'html2pdf.js'

//  Letter generator 

function generateLetter({ name, email, phone, location, targetJob, company, strengths, tone, yearsExp, latestRole, latestCompany }) {
  const greeting = tone === 'formal' ? 'Dear Hiring Manager,' : `Dear ${company} Team,`
  const opener = tone === 'formal'
    ? `I am writing to express my strong interest in the ${targetJob || 'open'} position at ${company || 'your organisation'}.`
    : `I'm really excited to apply for the ${targetJob || 'open'} role at ${company || 'your team'} — it looks like a fantastic fit for where I'm headed in my career.`

  const expLine = yearsExp >0
    ? tone === 'formal'
      ? `With ${yearsExp}+ year${yearsExp >1 ? 's' : ''} of experience${latestRole ? ` as ${latestRole}${latestCompany ? ` at ${latestCompany}` : ''}` : ''}, I have developed a strong foundation in my field.`
      : `I've spent ${yearsExp}+ year${yearsExp >1 ? 's' : ''} in this space${latestRole ? `, most recently as ${latestRole}${latestCompany ? ` at ${latestCompany}` : ''}` : ''}, and I've learnt a lot along the way.`
    : ''

  const strengthsLine = strengths.length >0
    ? tone === 'formal'
      ? `I bring particular expertise in ${strengths.join(', ')}, and I am confident these capabilities would enable me to make an immediate contribution to your team.`
      : `I'm especially strong in ${strengths.join(', ')}, which I think would make me genuinely useful from day one.`
    : ''

  const closing = tone === 'formal'
    ? `I would welcome the opportunity to discuss how my background aligns with your requirements. Thank you for considering my application. I look forward to hearing from you.`
    : `I'd love to chat more about the role and how I can contribute. Thanks so much for taking the time to read this — I really hope we get to connect!`

  const sign = tone === 'formal' ? 'Yours sincerely,' : 'Best regards,'

  const contact = [phone, email, location].filter(Boolean).join('  ·  ')

  return { greeting, opener, expLine, strengthsLine, closing, sign, name, contact }
}

//  Main component 

export default function CoverLetter() {
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()
  const previewRef = useRef(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // Form state
  const [targetJob, setTargetJob]     = useState('')
  const [company, setCompany]         = useState('')
  const [tone, setTone]               = useState('formal')
  const [selectedStrengths, setSelectedStrengths] = useState([])

  // Resume data loaded from localStorage
  const [resumeData, setResumeData] = useState(null)

  // Load resume data on mount
  useEffect(() =>{
    try {
      const raw = localStorage.getItem('resumeData')
      if (raw) setResumeData(JSON.parse(raw))
    } catch (_) {}
  }, [])

  const name         = resumeData?.name         || (isSignedIn ? (user?.firstName || '') : '')
  const email        = resumeData?.email        || ''
  const phone        = resumeData?.phone        || ''
  const location     = resumeData?.location     || ''
  const skillsList   = resumeData?.skillsList   || []
  const workList     = resumeData?.workExperiences || []

  // Compute years of experience from work history
  const yearsExp = (() =>{
    if (workList.length === 0) return 0
    const earliest = workList.reduce((min, w) =>{
      const y = parseInt(w.startYear)
      return y && y < min ? y : min
    }, new Date().getFullYear())
    return Math.max(0, new Date().getFullYear() - earliest)
  })()

  const latestWork    = workList[0] || null
  const latestRole    = latestWork?.jobTitle    || ''
  const latestCompany = latestWork?.company     || ''

  const suggestedStrengths = [
    ...skillsList.slice(0, 8).map(s =>s.name),
    ...(latestRole ? [latestRole] : []),
  ].filter(Boolean).slice(0, 10)

  const toggleStrength = (s) =>{
    setSelectedStrengths(prev => prev.includes(s) ? prev.filter(x =>x !== s) : prev.length < 4 ? [...prev, s] : prev
    )
  }

  // Build letter object for preview
  const letter = generateLetter({
    name, email, phone, location,
    targetJob, company,
    strengths: selectedStrengths,
    tone, yearsExp, latestRole, latestCompany
  })

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // PDF download
  const handleDownload = () =>{
    setIsDownloading(true)
    const el = document.getElementById('cover-letter-preview')
    if (!el) { setIsDownloading(false); return }
    const opt = {
      margin: [12, 14, 12, 14],
      filename: `Cover_Letter_${(name || 'Cover').replace(/\s+/g, '_')}_${(company || 'Company').replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0, windowWidth: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }
    html2pdf().set(opt).from(el).save()
      .then(() =>setIsDownloading(false))
      .catch(() =>setIsDownloading(false))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"> {/*  Header  */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30"> <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"> <div className="flex items-center gap-4"> <button
              onClick={() =>navigate('/builder')}
              className="text-gray-500 hover:text-gray-800 transition text-sm flex items-center gap-1"
            > ← Back to Builder
</button> <div className="h-5 w-px bg-gray-200" /> <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2"> Cover Letter Builder
</h1>
</div> <button
            onClick={handleDownload}
            disabled={isDownloading || !name}
            className={`px-5 py-2 rounded-lg font-bold text-sm text-white transition flex items-center gap-2 ${isDownloading || !name ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          > {isDownloading ? '⏳ Generating…' : ' Download PDF'}
</button>
</div>
</header> <div className="max-w-7xl mx-auto px-6 py-8"> <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/*  LEFT: Form  */}
          <div className="space-y-5"> {/* No resume data notice */}
            {!resumeData && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">  <div> <p className="text-sm font-semibold text-amber-800">Resume data not found</p> <p className="text-xs text-amber-600 mt-0.5"> <button onClick={() =>navigate('/builder')} className="underline">Fill your resume first</button>and we'll pre-fill your name, skills and experience here automatically.
</p>
</div>
</div> )}

            {/* Job details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"> <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"> Job Details
</h2> <div className="space-y-4"> <div> <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job title you're applying for <span className="text-red-500">*</span></label> <input
                    type="text"
                    value={targetJob}
                    onChange={e =>setTargetJob(e.target.value)}
                    placeholder="e.g. Senior Product Manager"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/500 transition"
                  />
</div> <div> <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company name <span className="text-red-500">*</span></label> <input
                    type="text"
                    value={company}
                    onChange={e =>setCompany(e.target.value)}
                    placeholder="e.g. Razorpay"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/500 transition"
                  />
</div>
</div>
</div> {/* Tone */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"> <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"> Tone
</h2> <div className="grid grid-cols-2 gap-3"> {[
                  { id: 'formal',   label: 'Formal',   desc: 'Professional & structured',   icon: '' },
                  { id: 'friendly', label: 'Friendly', desc: 'Warm & conversational',        icon: '' },
                ].map(t =>(
                  <button
                    key={t.id}
                    onClick={() =>setTone(t.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition text-left ${
                      tone === t.id
                        ? 'border-[#1a2744]/30 border-500 bg-slate-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  > <span className="text-2xl">{t.icon}</span> <div> <p className={`text-sm font-bold ${tone === t.id ? 'text-blue-700' : 'text-gray-800'}`}>{t.label}</p> <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
</div>
</button> ))}
</div>
</div> {/* Strengths */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"> <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2"> Key Strengths
</h2> <p className="text-xs text-gray-500 mb-4">Pick up to 4 to highlight in your letter</p> {suggestedStrengths.length >0 ? (
                <div className="flex flex-wrap gap-2 mb-4"> {suggestedStrengths.map(s =>(
                    <button
                      key={s}
                      onClick={() =>toggleStrength(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                        selectedStrengths.includes(s)
                          ? 'bg-[#1a2744] text-white border-[#1a2744]/30 border-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#1a2744]/30 border-300'
                      }`}
                    > {selectedStrengths.includes(s) ? ' ' : ''}{s}
</button> ))}
</div> ) : (
                <p className="text-xs text-gray-400 mb-3 italic">Add skills to your resume to see suggestions here.</p> )}

              {/* Custom strength input */}
              {selectedStrengths.length < 4 && (
                <input
                  type="text"
                  placeholder="+ Type a custom strength and press Enter"
                  className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a2744]/400 text-gray-600"
                  onKeyDown={e =>{
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      toggleStrength(e.target.value.trim())
                      e.target.value = ''
                    }
                  }}
                /> )}

              {selectedStrengths.length >0 && (
                <div className="mt-3 flex flex-wrap gap-2"> {selectedStrengths.map(s =>(
                    <span key={s} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full"> {s}
                      <button onClick={() =>toggleStrength(s)} className="text-blue-400 hover:text-blue-700 ml-0.5 leading-none">×</button>
</span> ))}
</div> )}
</div> {/* Your details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"> <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2"> Your Details
</h2> {resumeData ? (
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-0.5"> <p><span className="font-semibold">Name:</span>{name || '—'}</p> <p><span className="font-semibold">Email:</span>{email || '—'}</p> <p><span className="font-semibold">Phone:</span>{phone || '—'}</p> {location && <p><span className="font-semibold">Location:</span>{location}</p>}
                  <button onClick={() =>navigate('/builder')} className="text-blue-500 hover:underline text-xs mt-1 block"> ← Edit in resume builder
</button>
</div> ) : (
                <p className="text-xs text-gray-400 italic">No resume data found. <button onClick={() =>navigate('/builder')} className="text-blue-500 underline">Build your resume first →</button></p> )}
</div> </div> {/*  RIGHT: Preview  */}
          <div className="lg:sticky lg:top-24 h-fit"> <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"> <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50"> <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Live Preview</p> <button
                  onClick={handleDownload}
                  disabled={isDownloading || !name}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${isDownloading || !name ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                > {isDownloading ? '⏳' : ' Download PDF'}
</button>
</div> {/* Letter preview — this is what gets printed */}
              <div
                id="cover-letter-preview"
                ref={previewRef}
                className="bg-white px-12 py-10 font-serif text-gray-900"
                style={{ minHeight: '700px', fontFamily: 'Georgia, "Times New Roman", serif' }}
              > {/* Sender info */}
                <div className="mb-8"> <p className="text-xl font-bold text-gray-900" style={{fontFamily: 'Georgia, serif'}}>{name || 'Your Name'}</p> {(email || phone || location) && (
                    <p className="text-xs text-gray-500 mt-1">{[email, phone, location].filter(Boolean).join('  ·  ')}</p> )}
</div> {/* Date */}
                <p className="text-sm text-gray-600 mb-6">{today}</p> {/* Company */}
                {(company || targetJob) && (
                  <div className="mb-6"> {company && <p className="text-sm font-semibold text-gray-800">{company}</p>}
                    {targetJob && <p className="text-sm text-gray-500">Re: {targetJob} position</p>}
</div> )}

                {/* Greeting */}
                <p className="text-sm text-gray-800 mb-4">{letter.greeting}</p> {/* Opening paragraph */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{letter.opener}</p> {/* Experience paragraph */}
                {letter.expLine && (
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{letter.expLine}</p> )}

                {/* Strengths paragraph */}
                {letter.strengthsLine && (
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{letter.strengthsLine}</p> )}

                {/* Closing */}
                <p className="text-sm text-gray-700 leading-relaxed mb-8">{letter.closing}</p> {/* Sign-off */}
                <p className="text-sm text-gray-700">{letter.sign}</p> <p className="text-sm font-bold text-gray-900 mt-2">{name || 'Your Name'}</p>
</div>
</div>
</div> </div>
</div>
</div> )
}
