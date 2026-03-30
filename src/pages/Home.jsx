import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

/* ── Template data ─────────────────────────────────────────────── */
const ALL_TEMPLATES = [
  { id: 'modern',       name: 'Modern',        category: 'popular',      badge: 'Popular' },
  { id: 'professional', name: 'Professional',  category: 'professional', badge: 'ATS Friendly' },
  { id: 'minimal',      name: 'Minimal',       category: 'minimal',      badge: '' },
  { id: 'classic',      name: 'Classic',       category: 'professional', badge: '' },
  { id: 'sidebar',      name: 'Sidebar',       category: 'creative',     badge: 'Photo' },
  { id: 'tech',         name: 'Tech',          category: 'creative',     badge: 'For Devs' },
  { id: 'elegant',      name: 'Elegant',       category: 'minimal',      badge: '' },
  { id: 'navy',         name: 'Navy Icons',    category: 'professional', badge: 'Photo' },
  { id: 'coral',        name: 'Coral',         category: 'creative',     badge: 'Photo' },
  { id: 'goldheader',   name: 'Gold Header',   category: 'popular',      badge: 'Photo' },
  { id: 'bluesidebar',  name: 'Blue Sidebar',  category: 'creative',     badge: 'Photo' },
  { id: 'amber',        name: 'Amber',         category: 'popular',      badge: 'Photo' },
]

const FILTER_TABS = ['All', 'Popular', 'Professional', 'Creative', 'Minimal']

/* ── Steps ─────────────────────────────────────────────────────── */
const STEPS = [
  { n: '1', title: 'Pick a template', body: 'Choose from 17 professionally crafted designs. Click any template to preview it in full.' },
  { n: '2', title: 'Fill in your details', body: 'Add your experience, education, and skills. AI suggestions help you write better bullet points.' },
  { n: '3', title: 'Preview in real time', body: 'Watch your resume update live as you type. Switch templates instantly — your data stays intact.' },
  { n: '4', title: 'Download your PDF', body: 'One click. Clean, crisp, ATS-ready PDF delivered instantly, completely free.' },
]

/* ── Features ───────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '🎨', title: '17 Professional Templates', body: 'From minimal and modern to creative and corporate — find the perfect look for your industry.' },
  { icon: '⚡', title: 'Live Preview', body: 'See every change reflected in your resume in real time. No surprises when you download.' },
  { icon: '🤖', title: 'AI Content Suggestions', body: 'Struggling with bullet points? Our AI generates role-specific suggestions you can one-click add.' },
  { icon: '📄', title: 'Import Existing CV', body: 'Upload your old PDF or Word doc — we extract your data and pre-fill the form automatically.' },
  { icon: '✅', title: 'ATS Checker Built In', body: 'Scan your resume against ATS requirements before you submit. Get your score and fix gaps.' },
  { icon: '☁️', title: 'Cloud Save & Sync', body: 'Save multiple resume versions to the cloud. Tailor different CVs for different roles.' },
  { icon: '✉️', title: 'Cover Letter Generator', body: 'Generate a personalised cover letter from your resume data in seconds.' },
  { icon: '🎯', title: 'Job Match Score', body: 'Paste a job description and see how well your resume matches — with keyword suggestions.' },
]

/* ── FAQs ───────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'Is ResumeAI completely free?', a: 'Yes — building, editing, and downloading your resume is 100% free. We offer optional Pro features (more templates, expert CV tune-up) at a one-time fee with no subscription.' },
  { q: 'Can I upload my existing CV to edit it?', a: 'Absolutely. Click "Import Existing CV" to upload a PDF or Word document. We extract your information and populate the form — then you pick a new template and download.' },
  { q: 'Will my resume pass ATS filters?', a: 'Our Professional and Modern templates are ATS-optimised. We also include a built-in ATS checker that scans your resume for common issues — keyword gaps, formatting problems — before you apply.' },
  { q: 'Can I create a cover letter too?', a: 'Yes! Once your resume is built, switch to Cover Letter. We generate a personalised letter from your resume data — adjust the tone, company, and role, then download.' },
  { q: 'How many resumes can I save?', a: 'Free users can save multiple versions to the cloud. Each preserves all your data so you can maintain different CVs for different types of roles.' },
  { q: 'Is my data private?', a: 'Your data is stored securely and never shared. You can delete saved resumes any time from the dashboard.' },
]

/* ── Component ──────────────────────────────────────────────────── */
export default function Home() {
  const { user } = useUser()
  const isSignedIn = !!user
  const [openFaq, setOpenFaq] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [heroTemplate, setHeroTemplate] = useState('modern')

  const ctaLink = isSignedIn ? '/resume-templates' : '/signup'

  const filteredTemplates = activeFilter === 'All'
    ? ALL_TEMPLATES
    : ALL_TEMPLATES.filter(t => t.category === activeFilter.toLowerCase())

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#1a2744] flex items-center justify-center shadow-sm group-hover:bg-[#152235] transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <span className="text-[1.2rem] font-bold text-[#1a2744] tracking-tight">ResumeAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/resume-templates" className="hover:text-[#1a2744] transition-colors">Resumes</Link>
            <Link to="/cv-templates" className="hover:text-[#1a2744] transition-colors">CVs</Link>
            <Link to="/cover-letter-templates" className="hover:text-[#1a2744] transition-colors">Cover Letters</Link>
            <Link to="/pricing" className="hover:text-[#1a2744] transition-colors">Pricing</Link>
            <a href="#faq" className="hover:text-[#1a2744] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <>
                <Link to="/dashboard" className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#1a2744] transition">Dashboard</Link>
                <Link to="/resume-templates" className="px-5 py-2 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#152235] transition shadow-sm">
                  + New Resume
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#1a2744] transition-colors border border-gray-200 rounded-lg hover:border-[#1a2744]">
                  Log In
                </Link>
                <Link to="/signup" className="px-5 py-2 bg-[#f0a04b] text-[#1a2744] text-sm font-bold rounded-lg hover:bg-[#e8943e] transition shadow-sm">
                  Get Started Free →
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO — split layout ── */}
      <section className="bg-gradient-to-br from-[#0f1c38] via-[#1a2744] to-[#1e3260] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
              Free · No credit card · Download instantly
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight mb-5">
              Build a Resume That<br />
              <span className="text-[#f0a04b]">Gets You Hired</span>
            </h1>

            <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-lg">
              Create a professional, ATS-ready resume in minutes.
              17 beautiful templates, live preview, AI content help — all free.
            </p>

            {/* Social proof row */}
            <div className="flex items-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">17</p>
                <p className="text-xs text-blue-300">Templates</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-blue-300">Free</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">ATS</p>
                <p className="text-xs text-blue-300">Optimised</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">PDF</p>
                <p className="text-xs text-blue-300">Instant</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={ctaLink}
                className="px-7 py-3.5 bg-[#f0a04b] text-[#1a2744] font-bold rounded-xl hover:bg-[#e8943a] transition text-sm shadow-lg shadow-[#f0a04b]/30"
              >
                Build My Resume — Free →
              </Link>
              <Link
                to={ctaLink}
                className="px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition text-sm"
              >
                Import Existing CV
              </Link>
            </div>

            <p className="text-xs text-blue-400 mt-4">No sign-up tricks. No hidden fees. No watermark on your PDF.</p>
          </div>

          {/* Right: template switcher + live preview */}
          <div className="relative flex flex-col items-center">
            {/* Mini template picker */}
            <div className="flex gap-2 mb-4 flex-wrap justify-center">
              {['modern', 'minimal', 'professional', 'sidebar', 'tech'].map(tid => (
                <button
                  key={tid}
                  onClick={() => setHeroTemplate(tid)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border capitalize ${
                    heroTemplate === tid
                      ? 'bg-white text-[#1a2744] border-white shadow'
                      : 'bg-white/10 text-blue-200 border-white/20 hover:bg-white/20'
                  }`}
                >
                  {tid}
                </button>
              ))}
            </div>

            {/* CV thumbnail */}
            <div className="relative w-full max-w-[340px] group">
              <div className="absolute -inset-3 bg-gradient-to-r from-[#f0a04b]/30 to-blue-500/20 rounded-3xl blur-xl opacity-60" />
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white/20">
                <img
                  src={`/template-previews/${heroTemplate}.jpg`}
                  alt={`${heroTemplate} resume template`}
                  className="w-full object-cover object-top transition-all duration-500"
                  style={{ maxHeight: '420px' }}
                />
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#1a2744]/80 to-transparent flex items-end justify-center pb-4">
                  <Link
                    to={ctaLink}
                    className="px-5 py-2 bg-white text-[#1a2744] text-xs font-bold rounded-full shadow-lg hover:scale-105 transition"
                  >
                    Use This Template →
                  </Link>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-green-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Free Download
              </div>
            </div>

            <p className="text-blue-300 text-xs mt-3">Click a style above to preview · {ALL_TEMPLATES.length} templates total</p>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs font-medium text-gray-500">
          {['🇮🇳 Built for India\'s job market', '🔒 Your data is private', '⚡ PDF in one click', '✅ ATS-friendly templates', '🤖 AI-powered suggestions', '☁️ Free cloud saves'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── TEMPLATES SECTION ── */}
      {/* ── 3 JOURNEYS ── */}
      <section id="templates" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#1a2744] mb-3">Three journeys. One platform.</h2>
            <p className="text-gray-500 text-lg">Resume, CV, or Cover Letter — we have 10+ templates for each, designed to get you hired.</p>
          </div>

          {/* Journey cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Resume */}
            <Link to="/resume-templates" className="group relative bg-gradient-to-br from-[#1a2744] to-[#2d4a8a] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-5">📄</div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Resume Templates</h3>
                <p className="text-blue-200 text-sm leading-relaxed mb-5">10 clean, ATS-optimised designs for US and Canada job applications. 1–2 pages, role-focused.</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Modern', 'Classic', 'Minimal', 'Tech'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full border border-white/20">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[#f0a04b] font-bold text-sm group-hover:gap-3 transition-all">
                  Browse 10 templates <span>→</span>
                </div>
              </div>
              {/* Mini template previews */}
              <div className="flex gap-2 px-8 pb-6 overflow-hidden">
                {['modern', 'minimal', 'tech'].map(id => (
                  <div key={id} className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 opacity-70 group-hover:opacity-90 transition border border-white/20">
                    <img src={`/template-previews/${id}.jpg`} alt={id} className="w-full h-full object-cover object-top"/>
                  </div>
                ))}
                <div className="w-16 h-20 rounded-lg flex-shrink-0 bg-white/10 border border-white/20 flex items-center justify-center text-white/60 text-xs font-bold">+7</div>
              </div>
            </Link>

            {/* CV */}
            <Link to="/cv-templates" className="group relative bg-gradient-to-br from-[#4c1d95] to-[#6d28d9] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-5">📋</div>
                <h3 className="text-2xl font-extrabold text-white mb-2">CV Templates</h3>
                <p className="text-purple-200 text-sm leading-relaxed mb-5">10 comprehensive designs for UK, India, Europe and academic applications. Detailed, multi-page friendly.</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Classic Serif', 'Gold Header', 'Elegant', 'Navy'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full border border-white/20">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[#f0a04b] font-bold text-sm group-hover:gap-3 transition-all">
                  Browse 10 templates <span>→</span>
                </div>
              </div>
              <div className="flex gap-2 px-8 pb-6 overflow-hidden">
                {['classicserif', 'goldheader', 'navy'].map(id => (
                  <div key={id} className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 opacity-70 group-hover:opacity-90 transition border border-white/20">
                    <img src={`/template-previews/${id}.jpg`} alt={id} className="w-full h-full object-cover object-top"/>
                  </div>
                ))}
                <div className="w-16 h-20 rounded-lg flex-shrink-0 bg-white/10 border border-white/20 flex items-center justify-center text-white/60 text-xs font-bold">+7</div>
              </div>
            </Link>

            {/* Cover Letter */}
            <Link to="/cover-letter-templates" className="group relative bg-gradient-to-br from-[#7f1d1d] to-[#8b1a2e] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-5">✉️</div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Cover Letter Templates</h3>
                <p className="text-red-200 text-sm leading-relaxed mb-5">10 distinct styles from formal to bold. Auto-generated from your resume data in seconds.</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Formal', 'Modern', 'Executive', 'Creative'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full border border-white/20">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[#f0a04b] font-bold text-sm group-hover:gap-3 transition-all">
                  Browse 10 templates <span>→</span>
                </div>
              </div>
              {/* Cover letter style swatches */}
              <div className="flex gap-2 px-8 pb-6">
                {['#1a2744','#7c3aed','#0f1c38','#e85d4a','#d97706'].map(color => (
                  <div key={color} className="w-8 h-20 rounded-lg flex-shrink-0 opacity-70 group-hover:opacity-90 transition border border-white/20 flex flex-col overflow-hidden">
                    <div className="h-8 flex-shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 bg-white/10 p-1 space-y-0.5">
                      {[...Array(4)].map((_,i) => <div key={i} className="h-0.5 bg-white/30 rounded" />)}
                    </div>
                  </div>
                ))}
                <div className="w-8 h-20 rounded-lg flex-shrink-0 bg-white/10 border border-white/20 flex items-center justify-center text-white/60 text-xs font-bold">+5</div>
              </div>
            </Link>
          </div>

          {/* Quick template strip */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 font-medium">Most popular resume templates</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
            {['modern','classic','minimal','professional','sidebar','tech'].map(id => (
              <Link key={id} to="/resume-templates"
                className="group rounded-xl overflow-hidden border-2 border-transparent hover:border-[#1a2744] transition shadow-sm hover:shadow-md">
                <div className="relative overflow-hidden bg-gray-100" style={{ height: '140px' }}>
                  <img src={`/template-previews/${id}.jpg`} alt={id} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/40 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition bg-white text-[#1a2744] text-xs font-bold px-3 py-1.5 rounded-full shadow">Use</span>
                  </div>
                </div>
                <div className="bg-white px-2 py-1.5 text-center">
                  <p className="text-xs font-semibold text-gray-700 capitalize">{id === 'bluesidebar' ? 'Blue Sidebar' : id.charAt(0).toUpperCase() + id.slice(1)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/resume-templates" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a2744] text-white font-semibold rounded-xl hover:bg-[#152235] transition text-sm">
              View All 30 Templates →
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-[#1a2744] mb-3">Build your resume in 4 steps</h2>
            <p className="text-gray-500 text-lg">Takes less than 5 minutes. Seriously.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a2744] text-white flex items-center justify-center text-lg font-extrabold mb-4 group-hover:bg-[#8b1a2e] transition">
                  {step.n}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 text-gray-300 text-xl z-10">→</div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to={ctaLink} className="inline-block px-8 py-3.5 bg-[#1a2744] text-white font-bold rounded-xl hover:bg-[#152235] transition text-sm shadow-md">
              Start Building Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-[#1a2744] mb-3">Everything you need to land the job</h2>
            <p className="text-gray-500 text-lg">All the tools in one place — free forever</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:border-[#1a2744]/20 transition group cursor-default"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPLIT PROMO — Import CV ── */}
      <section className="py-20 px-6 bg-[#1a2744] overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#f0a04b] text-sm font-bold uppercase tracking-widest mb-3">Already have a CV?</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
              Import it. Upgrade it.<br />Download it.
            </h2>
            <p className="text-blue-200 text-base leading-relaxed mb-6">
              Upload your existing PDF or Word resume — we'll extract your details instantly and populate the form. Then pick a stunning new template and download a fresh version.
            </p>
            <ul className="space-y-3 mb-8">
              {['Supports PDF, Word (.docx), and plain text', 'Auto-extracts name, email, experience, education', 'Keep what is good, fix what is not', 'Switch to any of our 17 templates instantly'].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-blue-100">
                  <span className="w-5 h-5 rounded-full bg-[#f0a04b] text-[#1a2744] font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to={ctaLink}
              className="inline-block px-7 py-3.5 bg-[#f0a04b] text-[#1a2744] font-bold rounded-xl hover:bg-[#e8943a] transition text-sm shadow-lg"
            >
              Import My CV →
            </Link>
          </div>

          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[300px]">
              <div className="absolute -inset-4 bg-[#f0a04b]/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="bg-white/10 rounded-xl p-3 mb-3 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f0a04b]/20 flex items-center justify-center text-xl">📄</div>
                  <div>
                    <p className="text-white text-xs font-bold">your_resume.pdf</p>
                    <p className="text-blue-300 text-[10px]">Uploading...</p>
                  </div>
                  <span className="ml-auto text-green-400 text-lg">✓</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-2 text-blue-300 text-xs mb-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span>extracted</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                {[['Name', 'Baishali Roy'], ['Email', 'baishali@email.com'], ['Experience', '3 jobs found'], ['Education', '2 entries'], ['Skills', '8 skills']].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-white/10 last:border-0">
                    <span className="text-blue-300 text-xs">{label}</span>
                    <span className="text-white text-xs font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESOURCE LINKS ── */}
      <section className="py-20 px-6 bg-slate-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1a2744] mb-2">Resume Guides & Resources</h2>
            <p className="text-gray-500 text-base">Everything you need to write a winning job application</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { href: '/resume-tips', emoji: '📄', label: 'Resume Guide', title: 'How to Write a Resume That Gets Callbacks', body: 'ATS tips, bullet point formulas, formatting advice — practical and India-specific.' },
              { href: '/cover-letter-tips', emoji: '✉️', label: 'Cover Letter', title: 'How to Write a Cover Letter That Gets Noticed', body: 'Structure, tone, openers, closers — everything from scratch to final draft.' },
              { href: '/resume-templates', emoji: '🎨', label: 'Templates', title: 'Browse All 17 Resume Templates', body: 'Minimal, creative, professional, ATS-friendly — there\'s one for every role.' },
            ].map(c => (
              <Link
                key={c.href}
                to={c.href}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-[#1a2744]/20 transition group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="text-xs font-bold text-[#8b1a2e] uppercase tracking-wide">{c.label}</span>
                </div>
                <h3 className="font-bold text-[#1a2744] mb-2 text-sm leading-snug group-hover:underline">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{c.body}</p>
                <span className="text-xs font-bold text-[#1a2744]">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#1a2744] mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know</p>
          </div>

          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4 leading-snug">{f.q}</span>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#1a2744] to-[#0f1c38]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#f0a04b] text-sm font-bold uppercase tracking-widest mb-3">Ready to get started?</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Your next role starts with<br className="hidden sm:block" /> a great resume
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Build, customise, and download — completely free. No hidden fees, no subscription, no watermark.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ctaLink}
              className="px-8 py-4 bg-[#f0a04b] text-[#1a2744] font-extrabold rounded-xl hover:bg-[#e8943a] transition text-base shadow-xl shadow-[#f0a04b]/20"
            >
              Build My Resume — Free →
            </Link>
            <Link
              to="/resume-templates"
              className="px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/25 hover:border-white/50 hover:bg-white/10 transition text-base"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>

      {/* ── BLOG / RESOURCES ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-[#1a2744] mb-2">Career Advice &amp; Resources</h2>
              <p className="text-gray-500">Expert guides to help you land your next role faster.</p>
            </div>
            <Link to="/resume-tips" className="hidden md:block text-sm font-semibold text-[#1a2744] hover:underline">
              View all articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                tag: 'Resume Guide',
                tagColor: 'bg-blue-100 text-blue-700',
                title: 'How to Write a Resume That Gets Callbacks in 2025',
                body: 'ATS tips, bullet point formulas, and formatting advice written specifically for the Indian job market.',
                readTime: '8 min read',
                href: '/resume-tips',
                emoji: '📄',
                bg: 'from-blue-50 to-indigo-50',
              },
              {
                tag: 'Cover Letter',
                tagColor: 'bg-rose-100 text-rose-700',
                title: 'How to Write a Cover Letter That Actually Gets Read',
                body: 'Structure, tone, openers, and closers — a practical guide from blank page to final draft.',
                readTime: '6 min read',
                href: '/cover-letter-tips',
                emoji: '✉️',
                bg: 'from-rose-50 to-orange-50',
              },
              {
                tag: 'CV vs Resume',
                tagColor: 'bg-purple-100 text-purple-700',
                title: 'CV vs Resume: Which One Should You Send?',
                body: 'UK, India, US — the rules differ. We break down exactly which document to use and when.',
                readTime: '4 min read',
                href: '/cv-templates',
                emoji: '📋',
                bg: 'from-purple-50 to-violet-50',
              },
            ].map(article => (
              <Link key={article.title} to={article.href}
                className={`group block rounded-2xl bg-gradient-to-br ${article.bg} border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                <div className="p-6">
                  <div className="text-3xl mb-4">{article.emoji}</div>
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${article.tagColor}`}>{article.tag}</span>
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#1a2744] transition leading-snug">{article.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{article.body}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{article.readTime}</span>
                    <span className="text-xs font-semibold text-[#1a2744] group-hover:gap-2 flex items-center gap-1 transition-all">Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/resume-tips" className="text-sm font-semibold text-[#1a2744] hover:underline">View all articles →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#8b1a2e] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <span className="text-lg font-bold tracking-tight">ResumeAI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Free resume builder for India's job seekers. Create professional CVs in minutes, download as PDF, get hired faster.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link to="/resume-templates" className="hover:text-white transition">Templates</Link></li>
                <li><Link to={ctaLink} className="hover:text-white transition">Resume Builder</Link></li>
                <li><Link to="/cover-letter-tips" className="hover:text-white transition">Cover Letter</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link to="/resume-tips" className="hover:text-white transition">Resume Tips</Link></li>
                <li><Link to="/cover-letter-tips" className="hover:text-white transition">Cover Letter Tips</Link></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="mailto:baishaliroy11@gmail.com" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>© 2025 ResumeAI by Baishali Roy. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
