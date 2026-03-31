import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import html2pdf from 'html2pdf.js'
import { COVER_LETTER_TEMPLATES } from './CoverLetterTemplates'

// ── Letter generator ──────────────────────────────────────────────────────────

function generateLetter({ name, email, phone, location, targetJob, company, strengths, tone, yearsExp, latestRole, latestCompany }) {
  const jobTitle    = targetJob || 'this role'
  const companyName = company   || 'your organisation'
  const hasExp      = yearsExp > 0
  const expYrs      = `${yearsExp}+ year${yearsExp > 1 ? 's' : ''}`

  const greetings = {
    formal:    'Dear Hiring Manager,',
    friendly:  `Dear ${company ? company + ' Team,' : 'Hiring Team,'}`,
    confident: 'Dear Hiring Manager,',
  }

  const openers = {
    formal:
      `I am writing to express my sincere interest in the ${jobTitle} position at ${companyName}. Having followed ${companyName}'s work with great admiration, I believe my background, skills and professional values make me a strong fit for this opportunity and for the wider team.`,
    friendly:
      `I'm genuinely excited to throw my hat in the ring for the ${jobTitle} role at ${companyName}. The work you're doing really resonates with me, and from everything I've seen, it looks like exactly the kind of environment where I'd thrive and grow.`,
    confident:
      `I am applying for the ${jobTitle} position at ${companyName} with full confidence that I will make an immediate and measurable impact on your team. My record of delivering results — consistently and at pace — is exactly what ${companyName} needs at this stage of its growth.`,
  }

  const expLines = {
    formal:
      hasExp
        ? `With ${expYrs} of professional experience${latestRole ? ` — most recently serving as ${latestRole}${latestCompany ? ` at ${latestCompany}` : ''}` : ''} — I have developed a rigorous approach to problem-solving and a deep familiarity with the demands this role requires. Throughout my career I have worked across cross-functional teams, contributed to high-stakes projects, and consistently met or exceeded the expectations set for me.`
        : `I am eager to bring my focused academic background and project experience to a professional setting, and I am confident that the energy and dedication I would bring to ${companyName} more than compensates for the early stage of my career.`,
    friendly:
      hasExp
        ? `I've spent ${expYrs} in this field${latestRole ? `, most recently as ${latestRole}${latestCompany ? ` at ${latestCompany}` : ''}` : ''}, and honestly it's been a really rewarding journey. I've had the chance to work on challenging problems alongside talented people, and every experience has sharpened my skills and given me a clearer sense of where I can add the most value.`
        : `I'm early in my career, but I've already had hands-on experience through projects and internships that have given me a strong foundation and real enthusiasm for this kind of work.`,
    confident:
      hasExp
        ? `Over ${expYrs} in the industry${latestRole ? ` — including as ${latestRole}${latestCompany ? ` at ${latestCompany}` : ''}` : ''} — I have built a track record of stepping into complex situations and driving them to successful outcomes. I thrive in high-expectation environments, and I have repeatedly demonstrated the ability to lead, execute and deliver where it counts most.`
        : `My academic performance, independent projects and internship experience have positioned me well above the typical entry-level candidate. I do not wait for opportunities — I create them.`,
  }

  const strengthsLines = {
    formal:
      strengths.length > 0
        ? `The skills I would bring to this position include ${strengths.join(', ')}. I am confident that this combination of capabilities would allow me to add value to your team from the outset, and to grow meaningfully in the role over time.`
        : `I am a fast learner who takes pride in delivering thorough, high-quality work. I am equally comfortable operating independently and contributing as part of a collaborative team.`,
    friendly:
      strengths.length > 0
        ? `My strongest areas are ${strengths.join(', ')} — and from what I've read about the role, those are exactly the things that would make a real difference here. I'm also someone who picks up new tools and workflows quickly, so I'd get up to speed fast.`
        : `I'm a quick learner, a strong communicator, and someone who genuinely cares about doing good work. I tend to bring a lot of energy and follow-through to whatever I work on.`,
    confident:
      strengths.length > 0
        ? `My core strengths — ${strengths.join(', ')} — are precisely aligned with what this role demands. These are not soft claims; they are capabilities I have demonstrated under real pressure, with real results to show for them.`
        : `I bring exceptional drive, clear communication and a relentless bias for action. I do not just meet expectations — I redefine them.`,
  }

  const whyLines = {
    formal:
      `I have researched ${companyName} in depth and I am particularly drawn to your reputation for excellence, your values-driven culture, and the calibre of the team you have built. I would consider it a privilege to contribute to your continued success.`,
    friendly:
      `What really draws me to ${companyName} is the culture and the people. From everything I've read and heard, it's a place that takes both its work and its people seriously — and that's exactly where I want to build the next chapter of my career.`,
    confident:
      `${companyName} is exactly the kind of organisation where I want to make my mark. The ambition, the pace, and the calibre of people here match the professional environment in which I do my best work.`,
  }

  const closings = {
    formal:
      `I would welcome the opportunity to discuss my application in more detail at your convenience. I have enclosed my CV for your consideration and I am available for interview at any time. Thank you sincerely for considering my application — I look forward to the possibility of working together.`,
    friendly:
      `I'd love to have a conversation about the role and how I can contribute. I've attached my CV and I'm happy to provide any additional information you need. Thanks so much for taking the time to read this — I really hope we get to connect!`,
    confident:
      `I would welcome a direct conversation about how I can contribute to ${companyName}'s goals. I am available at your earliest convenience and ready to hit the ground running. I look forward to speaking with you.`,
  }

  const signOffs = {
    formal:    'Yours sincerely,',
    friendly:  'Best wishes,',
    confident: 'Kind regards,',
  }

  return {
    greeting:      greetings[tone],
    opener:        openers[tone],
    expLine:       expLines[tone],
    strengthsLine: strengthsLines[tone],
    whyLine:       whyLines[tone],
    closing:       closings[tone],
    sign:          signOffs[tone],
    name,
    contact: [phone, email, location].filter(Boolean).join('  ·  '),
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function wordCount(letter) {
  const parts = [letter.opener, letter.expLine, letter.strengthsLine, letter.whyLine, letter.closing].filter(Boolean)
  return parts.join(' ').split(/\s+/).filter(Boolean).length
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CoverLetter() {
  const navigate               = useNavigate()
  const [searchParams]         = useSearchParams()
  const { isSignedIn, user }   = useUser()
  const previewRef             = useRef(null)

  const [isDownloading, setIsDownloading] = useState(false)
  const [copied, setCopied]               = useState(false)

  // Template style from URL param (e.g. /cover-letter?template=modern)
  const templateId    = searchParams.get('template') || 'classic'
  const activeStyle   = COVER_LETTER_TEMPLATES.find(t => t.id === templateId) || COVER_LETTER_TEMPLATES[0]

  // Form state
  const [targetJob, setTargetJob]   = useState('')
  const [company, setCompany]       = useState('')
  const [tone, setTone]             = useState('formal')
  const [selectedStrengths, setSelectedStrengths] = useState([])
  const [customStrength, setCustomStrength]       = useState('')

  // Resume data from localStorage
  const [resumeData, setResumeData] = useState(null)

  useEffect(() => {
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

  const yearsExp = (() => {
    if (workList.length === 0) return 0
    const earliest = workList.reduce((min, w) => {
      const y = parseInt(w.startYear)
      return y && y < min ? y : min
    }, new Date().getFullYear())
    return Math.max(0, new Date().getFullYear() - earliest)
  })()

  const latestWork    = workList[0] || null
  const latestRole    = latestWork?.jobTitle || ''
  const latestCompany = latestWork?.company  || ''

  const suggestedStrengths = [
    ...skillsList.slice(0, 8).map(s => s.name),
    ...(latestRole ? [latestRole] : []),
  ].filter(Boolean).slice(0, 12)

  const toggleStrength = (s) => {
    setSelectedStrengths(prev =>
      prev.includes(s) ? prev.filter(x => x !== s)
      : prev.length < 4 ? [...prev, s]
      : prev
    )
  }

  const addCustomStrength = () => {
    const v = customStrength.trim()
    if (v && !selectedStrengths.includes(v) && selectedStrengths.length < 4) {
      setSelectedStrengths(prev => [...prev, v])
    }
    setCustomStrength('')
  }

  const letter = generateLetter({
    name, email, phone, location,
    targetJob, company,
    strengths: selectedStrengths,
    tone, yearsExp, latestRole, latestCompany,
  })

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const wc    = wordCount(letter)

  // PDF download
  const handleDownload = () => {
    setIsDownloading(true)
    const el = document.getElementById('cover-letter-preview')
    if (!el) { setIsDownloading(false); return }
    html2pdf().set({
      margin: [14, 18, 14, 18],
      filename: `Cover_Letter_${(name || 'Cover').replace(/\s+/g,'_')}_${(company || 'Company').replace(/\s+/g,'_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0, windowWidth: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(el).save()
      .then(() => setIsDownloading(false))
      .catch(() => setIsDownloading(false))
  }

  // Copy plain text
  const handleCopy = () => {
    const parts = [
      name || 'Your Name',
      letter.contact,
      '',
      today,
      '',
      company && `${company}`,
      targetJob && `Re: ${targetJob} position`,
      '',
      letter.greeting,
      '',
      letter.opener,
      letter.expLine,
      letter.strengthsLine,
      letter.whyLine,
      letter.closing,
      '',
      letter.sign,
      name || 'Your Name',
    ].filter(s => s !== undefined && s !== null)

    navigator.clipboard.writeText(parts.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const TONES = [
    { id: 'formal',    label: 'Formal',     desc: 'Professional & structured',   icon: '🎩' },
    { id: 'friendly',  label: 'Friendly',   desc: 'Warm & conversational',       icon: '😊' },
    { id: 'confident', label: 'Confident',  desc: 'Bold & results-focused',      icon: '🚀' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/builder')}
              className="text-gray-500 hover:text-gray-800 transition text-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Builder
            </button>
            <div className="h-5 w-px bg-gray-200" />
            <h1 className="text-lg font-bold text-[#1a2744] flex items-center gap-2">
              ✉️ Cover Letter Builder
            </h1>
            {/* Active style badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeStyle.accent }} />
              {activeStyle.name}
              <Link to="/cover-letter-templates" className="text-[#1a2744] hover:underline ml-1">change</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-1.5 border ${
                copied
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {copied ? '✓ Copied!' : '📋 Copy Text'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading || !name}
              className={`px-5 py-2 rounded-lg font-bold text-sm text-white transition flex items-center gap-1.5 ${
                isDownloading || !name ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1a2744] hover:bg-[#152235]'
              }`}
            >
              {isDownloading ? '⏳ Generating…' : '⬇ Download PDF'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT: Form ── */}
          <div className="space-y-5">

            {/* No resume notice */}
            {!resumeData && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Resume data not linked</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    <button onClick={() => navigate('/builder')} className="underline font-semibold">Fill your resume first</button>{' '}
                    and we'll auto-fill your name, skills and experience here.
                  </p>
                </div>
              </div>
            )}

            {/* Job details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1a2744] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                Job Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Job title you're applying for <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={targetJob}
                    onChange={e => setTargetJob(e.target.value)}
                    placeholder="e.g. Senior Product Manager"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Company name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Razorpay"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744] focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Tone */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1a2744] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                Tone &amp; Style
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition text-center ${
                      tone === t.id
                        ? 'border-[#1a2744] bg-[#1a2744]/5'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <p className={`text-sm font-bold ${tone === t.id ? 'text-[#1a2744]' : 'text-gray-800'}`}>{t.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                    </div>
                    {tone === t.id && (
                      <span className="w-4 h-4 bg-[#1a2744] rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Key strengths */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1a2744] text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
                  Key Strengths
                </h2>
                <span className="text-xs text-gray-400">{selectedStrengths.length}/4 selected</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 ml-8">Pick up to 4 strengths to highlight in your letter</p>

              {suggestedStrengths.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestedStrengths.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleStrength(s)}
                      disabled={!selectedStrengths.includes(s) && selectedStrengths.length >= 4}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                        selectedStrengths.includes(s)
                          ? 'bg-[#1a2744] text-white border-[#1a2744]'
                          : selectedStrengths.length >= 4
                            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#1a2744] hover:bg-slate-50'
                      }`}
                    >
                      {selectedStrengths.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-3 italic ml-8">
                  Add skills to your resume to see suggestions here.
                </p>
              )}

              {/* Custom strength */}
              {selectedStrengths.length < 4 && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customStrength}
                    onChange={e => setCustomStrength(e.target.value)}
                    placeholder="Type a custom strength…"
                    className="flex-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a2744] text-gray-600"
                    onKeyDown={e => { if (e.key === 'Enter') addCustomStrength() }}
                  />
                  <button
                    onClick={addCustomStrength}
                    disabled={!customStrength.trim()}
                    className="px-3 py-2 bg-[#1a2744] text-white rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-[#152235] transition"
                  >
                    Add
                  </button>
                </div>
              )}

              {selectedStrengths.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedStrengths.map(s => (
                    <span key={s} className="flex items-center gap-1 bg-[#1a2744]/10 text-[#1a2744] text-xs font-semibold px-3 py-1 rounded-full">
                      {s}
                      <button onClick={() => toggleStrength(s)} className="text-[#1a2744]/40 hover:text-[#1a2744] ml-0.5 leading-none text-sm">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Your details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1a2744] text-white rounded-full text-xs flex items-center justify-center font-bold">4</span>
                Your Details
              </h2>
              {resumeData ? (
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                  <p><span className="font-semibold text-gray-700">Name:</span> {name || '—'}</p>
                  <p><span className="font-semibold text-gray-700">Email:</span> {email || '—'}</p>
                  <p><span className="font-semibold text-gray-700">Phone:</span> {phone || '—'}</p>
                  {location && <p><span className="font-semibold text-gray-700">Location:</span> {location}</p>}
                  <button onClick={() => navigate('/builder')} className="text-[#1a2744] hover:underline text-xs mt-1 block font-medium">
                    ← Edit in resume builder
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No resume data found.{' '}
                  <button onClick={() => navigate('/builder')} className="text-[#1a2744] underline">
                    Build your resume first →
                  </button>
                </p>
              )}
            </div>

          </div>

          {/* ── RIGHT: Preview ── */}
          <div className="lg:sticky lg:top-24 h-fit space-y-3">

            {/* Preview toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Live Preview</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    wc < 150 ? 'bg-yellow-100 text-yellow-700' : wc > 400 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {wc} words{wc < 150 ? ' — add more details' : wc > 400 ? ' — consider trimming' : ' — great length'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition border ${
                      copied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || !name}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                      isDownloading || !name ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1a2744] text-white hover:bg-[#152235]'
                    }`}
                  >
                    {isDownloading ? '⏳' : '⬇ PDF'}
                  </button>
                </div>
              </div>

              {/* Letter preview — styled by activeStyle */}
              <div
                id="cover-letter-preview"
                ref={previewRef}
                style={{
                  minHeight: '700px',
                  fontFamily: activeStyle.font,
                  backgroundColor: activeStyle.previewStyle.bodyBg,
                  color: activeStyle.previewStyle.dark ? '#e2e8f0' : '#111827',
                }}
              >
                {/* Template header */}
                <div style={{ backgroundColor: activeStyle.previewStyle.headerBg, padding: '28px 48px 20px' }}>
                  {/* Gold accent line for Executive */}
                  {activeStyle.previewStyle.goldBar && (
                    <div style={{ height: '3px', backgroundColor: '#f0a04b', width: '48px', marginBottom: '12px', borderRadius: '2px' }} />
                  )}
                  {/* Left bar for Modern */}
                  {activeStyle.previewStyle.leftBar ? (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '4px', backgroundColor: activeStyle.accent, borderRadius: '2px', alignSelf: 'stretch' }} />
                      <div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: activeStyle.previewStyle.headerText, margin: 0 }}>{name || 'Your Name'}</p>
                        {(email || phone || location) && <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{[email, phone, location].filter(Boolean).join('  ·  ')}</p>}
                      </div>
                    </div>
                  ) : activeStyle.previewStyle.elegant ? (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '20px', fontWeight: 'bold', color: activeStyle.accent, fontStyle: 'italic', margin: 0 }}>{name || 'Your Name'}</p>
                      {(email || phone || location) && <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{[email, phone, location].filter(Boolean).join('  ·  ')}</p>}
                      <div style={{ height: '1px', backgroundColor: activeStyle.accent, width: '60px', margin: '10px auto 0', opacity: 0.4 }} />
                    </div>
                  ) : activeStyle.previewStyle.minimal ? (
                    <div>
                      <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{name || 'Your Name'}</p>
                      {(email || phone || location) && <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{[email, phone, location].filter(Boolean).join('  ·  ')}</p>}
                      <div style={{ height: '2px', backgroundColor: '#e5e7eb', marginTop: '12px', borderRadius: '1px' }} />
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '20px', fontWeight: 'bold', color: activeStyle.previewStyle.headerText, margin: 0 }}>{name || 'Your Name'}</p>
                      {(email || phone || location) && (
                        <p style={{ fontSize: '11px', marginTop: '4px', color: activeStyle.previewStyle.headerBg === activeStyle.previewStyle.bodyBg ? '#6b7280' : 'rgba(255,255,255,0.8)' }}>
                          {[email, phone, location].filter(Boolean).join('  ·  ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Letter body */}
                <div style={{ padding: '24px 48px 32px' }}>
                  {/* Date */}
                  <p style={{ fontSize: '13px', color: activeStyle.previewStyle.dark ? '#94a3b8' : '#6b7280', marginBottom: '18px' }}>{today}</p>

                  {/* Company & role */}
                  {(company || targetJob) && (
                    <div style={{ marginBottom: '18px' }}>
                      {company   && <p style={{ fontSize: '13px', fontWeight: '600', color: activeStyle.previewStyle.dark ? '#e2e8f0' : '#1f2937', margin: 0 }}>{company}</p>}
                      {targetJob && <p style={{ fontSize: '13px', color: activeStyle.previewStyle.dark ? '#94a3b8' : '#6b7280', marginTop: '2px' }}>Re: {targetJob} position</p>}
                    </div>
                  )}

                  {/* Greeting */}
                  <p style={{ fontSize: '13px', color: activeStyle.previewStyle.dark ? '#e2e8f0' : '#374151', marginBottom: '14px' }}>{letter.greeting}</p>

                  {/* Body paragraphs */}
                  {[letter.opener, letter.expLine, letter.strengthsLine, letter.whyLine, letter.closing].filter(Boolean).map((para, i) => (
                    <p key={i} style={{ fontSize: '13px', lineHeight: '1.7', color: activeStyle.previewStyle.dark ? '#cbd5e1' : '#374151', marginBottom: '14px' }}>{para}</p>
                  ))}

                  {/* Sign-off */}
                  <p style={{ fontSize: '13px', color: activeStyle.previewStyle.dark ? '#e2e8f0' : '#374151', marginTop: '24px' }}>{letter.sign}</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: activeStyle.accent, marginTop: '6px' }}>{name || 'Your Name'}</p>
                </div>
              </div>
            </div>

            {/* Tips card */}
            <div className="bg-[#1a2744]/5 border border-[#1a2744]/10 rounded-xl p-4">
              <p className="text-xs font-bold text-[#1a2744] mb-2">✨ Quick tips</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Keep it to one page (250–350 words is ideal)</li>
                <li>• Customise the company name for every application</li>
                <li>• Match your tone to the company's culture</li>
                <li>• Always pair it with a tailored resume</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
