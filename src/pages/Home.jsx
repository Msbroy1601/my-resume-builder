import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const TEMPLATES_PREVIEW = [
  { id: 'modern',       name: 'Modern',        badge: 'Popular' },
  { id: 'professional', name: 'Professional',  badge: 'ATS Friendly' },
  { id: 'minimal',      name: 'Minimal',       badge: '' },
  { id: 'classic',      name: 'Classic',       badge: '' },
  { id: 'sidebar',      name: 'Sidebar',       badge: 'Photo' },
  { id: 'tech',         name: 'Tech',          badge: 'For Devs' },
  { id: 'elegant',      name: 'Elegant',       badge: '' },
  { id: 'navy',         name: 'Navy Icons',    badge: 'Photo' },
  { id: 'coral',        name: 'Coral',         badge: 'Photo' },
]

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Build in Minutes',
    desc: 'Step-by-step form with live preview. Fill your details, see your CV update in real time.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: '17 Professional Templates',
    desc: 'From minimal to creative, classic to modern — there\'s a template for every role and industry.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Download as PDF',
    desc: 'One click to export a crisp, ATS-friendly PDF ready to attach to any job application.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
    title: 'Import Existing CV',
    desc: 'Upload a PDF or Word doc — we extract your details and pre-fill the form automatically.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'AI Cover Letter',
    desc: 'Generate a personalised cover letter from your CV data in seconds. Edit and download instantly.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'ATS Optimised',
    desc: 'Built-in ATS checker and job match score help your CV pass automated screening filters.',
  },
]

const FAQS = [
  {
    q: 'Is ResumeAI completely free?',
    a: 'Yes — building, editing, and downloading your resume is 100% free. We offer optional Pro features (more templates, expert tune-up) at a one-time fee, with no recurring subscription.',
  },
  {
    q: 'Can I upload my existing CV and edit it?',
    a: 'Absolutely. Use the "Import CV" button to upload a PDF or Word document. We extract your details and populate the form — you can then edit everything and choose a new template.',
  },
  {
    q: 'Will my resume pass ATS (Applicant Tracking Systems)?',
    a: 'Our Professional and Modern templates are optimised for ATS. We also include a built-in ATS checker that scans your CV for common issues before you submit.',
  },
  {
    q: 'Can I create a cover letter too?',
    a: 'Yes! Once your CV is built, switch to the Cover Letter tab. We generate a personalised letter from your CV data — adjust the tone, company, and target role, then download.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Your data is stored securely with Supabase. We never share your personal information. You can delete your saved resumes at any time from the dashboard.',
  },
  {
    q: 'How many resumes can I save?',
    a: 'Free users can save multiple resume versions to the cloud. Each version preserves all your data so you can tailor different CVs for different roles.',
  },
]

const STEPS = [
  { num: '01', title: 'Choose a template', desc: 'Pick from 17 professionally designed layouts.' },
  { num: '02', title: 'Fill in your details', desc: 'Add your experience, education, and skills.' },
  { num: '03', title: 'Customise & preview', desc: 'See your resume update live as you type.' },
  { num: '04', title: 'Download your PDF', desc: 'One click to get a job-ready PDF.' },
]

function ChevronIcon({ open }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      className={`transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6"/>
    </svg>
  )
}

export default function Home() {
  const { user } = useUser()
  const isSignedIn = !!user
  const [openFaq, setOpenFaq] = useState(null)

  const ctaHref = isSignedIn ? '/templates' : '/signup'

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1a2744] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1a2744] tracking-tight">ResumeAI</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#templates" className="hover:text-[#1a2744] transition">Templates</a>
            <a href="#how-it-works" className="hover:text-[#1a2744] transition">How it works</a>
            <Link to="/resume-tips" className="hover:text-[#1a2744] transition">Resume Tips</Link>
            <Link to="/cover-letter-tips" className="hover:text-[#1a2744] transition">Cover Letter</Link>
            <a href="#faq" className="hover:text-[#1a2744] transition">FAQ</a>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#1a2744] transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/templates"
                  className="px-5 py-2 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#152235] transition"
                >
                  + New Resume
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#1a2744] transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#152235] transition"
                >
                  Get Started — Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-slate-50 to-white pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a2744]/8 text-[#1a2744] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a2744] animate-pulse inline-block"></span>
            17 professional templates · AI-powered · 100% free
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#1a2744] leading-[1.1] tracking-tight mb-6">
            Build a Resume That<br />
            <span className="text-[#8b1a2e]">Gets You Hired</span>
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create a job-ready resume in minutes. Choose from 17 beautiful templates,
            fill in your details, and download a PDF — all for free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={ctaHref}
              className="px-8 py-4 bg-[#1a2744] text-white text-base font-bold rounded-xl hover:bg-[#152235] transition shadow-lg shadow-[#1a2744]/20"
            >
              Build My Resume — Free →
            </Link>
            <Link
              to={`${ctaHref}?import=true`}
              className="px-8 py-4 bg-white text-[#1a2744] text-base font-bold rounded-xl border-2 border-[#1a2744]/20 hover:border-[#1a2744]/40 hover:bg-slate-50 transition"
            >
              Import Existing CV
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-5">
            No credit card required · Takes less than 5 minutes · Trusted by thousands of job seekers
          </p>
        </div>

        {/* Template thumbnail strip */}
        <div className="max-w-6xl mx-auto mt-16 overflow-hidden">
          <div className="flex gap-4 justify-center flex-wrap">
            {TEMPLATES_PREVIEW.slice(0, 6).map(t => (
              <Link
                key={t.id}
                to={ctaHref}
                className="relative group flex-shrink-0 w-36 bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all hover:-translate-y-1"
              >
                <div className="h-48 bg-gray-50 overflow-hidden">
                  <img
                    src={`/template-previews/${t.id}.jpg`}
                    alt={t.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{t.name}</span>
                  {t.badge && (
                    <span className="text-[10px] bg-[#1a2744]/10 text-[#1a2744] px-1.5 py-0.5 rounded font-medium">{t.badge}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/templates" className="text-sm font-semibold text-[#1a2744] hover:underline">
              View all 17 templates →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-gray-500">
          {[
            { icon: '🇮🇳', text: 'Built for the Indian job market' },
            { icon: '🔒', text: 'Your data stays private' },
            { icon: '⚡', text: 'Instant PDF download' },
            { icon: '🤖', text: 'ATS-friendly templates' },
            { icon: '✨', text: 'AI-generated content suggestions' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span className="font-medium text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1a2744] mb-3">How it works</h2>
            <p className="text-gray-500 text-lg">Get your resume done in four simple steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#1a2744]/20 to-transparent z-0" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-[#1a2744] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={ctaHref}
              className="inline-block px-8 py-3.5 bg-[#1a2744] text-white font-bold rounded-xl hover:bg-[#152235] transition text-sm"
            >
              Start Building Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ───────────────────────────────────────────────────── */}
      <section id="templates" className="bg-gradient-to-b from-slate-50 to-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1a2744] mb-3">17 Professional Templates</h2>
            <p className="text-gray-500 text-lg">Pick the perfect design for your industry and style</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {TEMPLATES_PREVIEW.map(t => (
              <Link
                key={t.id}
                to={ctaHref}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg overflow-hidden transition-all hover:-translate-y-0.5"
              >
                <div className="relative h-52 bg-gray-50 overflow-hidden">
                  <img
                    src={`/template-previews/${t.id}.jpg`}
                    alt={`${t.name} resume template`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-400"
                  />
                  <div className="absolute inset-0 bg-[#1a2744]/0 group-hover:bg-[#1a2744]/30 transition-all duration-200 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition bg-white text-[#1a2744] text-xs font-bold px-4 py-2 rounded-full shadow">
                      Use Template
                    </span>
                  </div>
                </div>
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">{t.name}</span>
                  {t.badge && (
                    <span className="text-[10px] bg-[#1a2744]/10 text-[#1a2744] px-1.5 py-0.5 rounded font-semibold">{t.badge}</span>
                  )}
                </div>
              </Link>
            ))}

            {/* View All card */}
            <Link
              to="/templates"
              className="group bg-[#1a2744] rounded-xl border border-[#1a2744] overflow-hidden transition-all hover:bg-[#152235] flex flex-col items-center justify-center h-[13.5rem] gap-3"
            >
              <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white text-2xl font-bold">+</div>
              <p className="text-white text-sm font-bold">View All 17</p>
              <p className="text-white/60 text-xs">Templates</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1a2744] mb-3">Everything you need to land the job</h2>
            <p className="text-gray-500 text-lg">All the tools in one place, completely free</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1a2744]/8 text-[#1a2744] flex items-center justify-center mb-4 group-hover:bg-[#1a2744] group-hover:text-white transition">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCE LINKS ──────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-slate-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1a2744] mb-2">Resume Resources</h2>
            <p className="text-gray-500">Guides to help you write a winning job application</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                href: '/resume-tips',
                icon: '📄',
                title: 'How to Write a Resume',
                desc: 'Step-by-step guide to writing a resume that gets callbacks — format, length, and what to include.',
              },
              {
                href: '/cover-letter-tips',
                icon: '✉️',
                title: 'Cover Letter Guide',
                desc: 'How to write a compelling cover letter, what to include, and common mistakes to avoid.',
              },
              {
                href: '/templates',
                icon: '🎨',
                title: 'Template Gallery',
                desc: 'Browse all 17 resume templates and choose the one that best fits your industry and style.',
              },
            ].map(card => (
              <Link
                key={card.href}
                to={card.href}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition group"
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-[#1a2744] mb-2 group-hover:underline">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                <p className="text-xs font-semibold text-[#1a2744] mt-3">Read more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a2744] mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  <ChevronIcon open={openFaq === i} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="bg-[#1a2744] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Your next role starts with<br />a great resume
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            Build, customise, and download — completely free. No hidden fees, no subscription.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ctaHref}
              className="px-8 py-4 bg-white text-[#1a2744] font-bold rounded-xl hover:bg-blue-50 transition text-base shadow-lg"
            >
              Build My Resume →
            </Link>
            <Link
              to="/templates"
              className="px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/30 hover:border-white/60 transition text-base"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#8b1a2e] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <span className="text-lg font-bold">ResumeAI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Free resume builder for India's job seekers. Build professional CVs in minutes.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-300 uppercase tracking-wide">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link to="/templates" className="hover:text-white transition">Templates</Link></li>
                <li><Link to={ctaHref} className="hover:text-white transition">Resume Builder</Link></li>
                <li><Link to="/cover-letter-tips" className="hover:text-white transition">Cover Letter</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-300 uppercase tracking-wide">Resources</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link to="/resume-tips" className="hover:text-white transition">Resume Tips</Link></li>
                <li><Link to="/cover-letter-tips" className="hover:text-white transition">Cover Letter Tips</Link></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-300 uppercase tracking-wide">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>© 2025 ResumeAI by Baishali Roy. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
