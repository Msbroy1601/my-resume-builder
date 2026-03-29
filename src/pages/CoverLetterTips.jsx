import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    title: 'What is a cover letter and do you need one?',
    content: `A cover letter is a one-page document you send alongside your resume when applying for a job. It explains why you're interested in the role and why you're the right fit — in your own voice, not just bullet points.

Do you always need one? Not always. Many companies say cover letters are optional. But when they are optional, sending a strong one gives you an edge. When they're required, a weak one will cost you the interview.

Rule of thumb: if you have something meaningful to say about why you want this specific role at this specific company, write a cover letter.`,
  },
  {
    title: 'Cover letter structure and format',
    content: `A strong cover letter follows this structure:

1. Header — your name, contact info, date, and the hiring manager's name/title/company
2. Opening paragraph — a hook that explains which role you're applying for and why this company excites you
3. Middle paragraph(s) — your 2–3 strongest selling points, linked directly to the job requirements
4. Closing paragraph — a confident call to action, expressing enthusiasm to discuss further
5. Sign-off — "Yours sincerely" (formal) or "Best regards" (casual)

Length: aim for 3–4 short paragraphs. Never exceed one page. Never go below half a page — it looks like you didn't try.`,
  },
  {
    title: 'How to write a strong opening',
    content: `Avoid generic openers like "I am writing to apply for the position of..." — every recruiter has read this a thousand times.

Instead, lead with what excites you about the specific company or role:

✗ Weak: "I am writing to apply for the Marketing Manager position at Acme Corp."
✓ Strong: "Acme's recent pivot to B2B SaaS caught my attention — I've spent the last three years building growth funnels for exactly this kind of product, and I'd love to bring that experience to your marketing team."

The goal is to make the recruiter think: "This person actually wants to work here, not just anywhere."`,
  },
  {
    title: 'How to sell yourself without sounding arrogant',
    content: `The middle section is where you connect your achievements to the job requirements. Use the job description as your guide.

For each key requirement in the JD, pick one specific example from your experience. Keep it concrete:

"At my previous role at [Company], I led a team of 4 engineers to rebuild our checkout flow, reducing cart abandonment by 22% and increasing monthly revenue by ₹40 lakhs."

This isn't bragging — it's evidence. Hiring managers want proof, not promises. Focus on 2–3 examples that are directly relevant; don't try to cover everything.`,
  },
  {
    title: 'Tone: formal vs. casual',
    content: `Match your tone to the company culture.

For startups, tech companies, and creative roles: a conversational, enthusiastic tone works well. Show personality.

For banks, law firms, government roles, and large corporates: stick to formal language. "I am", not "I'm". "I would welcome the opportunity", not "I'd love to chat".

When in doubt, err on the side of slightly more formal — it's easier for a recruiter to warm up to a formal letter than to take a breezy one seriously for a serious role.`,
  },
  {
    title: 'How to write a strong closing paragraph',
    content: `End with confidence. Don't be apologetic ("I hope I might be considered..."). Don't be demanding ("I expect to hear back within a week..."). Strike the right balance:

✓ "I would love the opportunity to discuss how my experience in [X] could contribute to [Company]'s growth. I'm available for a call at your convenience — thank you for your time and consideration."

Always say thank you. Always express specific interest. Always include a call to action (even a gentle one).`,
  },
  {
    title: 'Common cover letter mistakes to avoid',
    content: `• Restating your resume — the cover letter should complement your CV, not repeat it word for word
• Generic letters — if you didn't name the company once, it's too generic
• Too long — more than one page is disrespectful of the recruiter's time
• Typos and grammar errors — even one will get you rejected; proofread ruthlessly
• Focusing on what you want ("This job would help me grow...") instead of what you offer ("I can bring X to your team...")
• Not addressing the hiring manager by name — if you can find it on LinkedIn, use it
• Attaching in the wrong format — PDF is standard; Word only if requested`,
  },
  {
    title: 'Cover letter tips for freshers',
    content: `If you don't have much work experience, lean on:

• Internships and part-time work, even in unrelated fields — they show work ethic
• Academic projects, especially if directly relevant to the role
• Skills you've taught yourself (coding, design, writing, analytics)
• Your enthusiasm for the company's product or mission — genuine interest is powerful
• Transferable soft skills with specific examples: "During my final year project, I managed a team of 5 and delivered a working prototype in 8 weeks"

Show initiative. Show you've done your research. That goes further than years of experience.`,
  },
]

export default function CoverLetterTips() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1a2744] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1a2744] tracking-tight">ResumeAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/templates" className="text-sm font-semibold text-gray-600 hover:text-[#1a2744] transition">Templates</Link>
            <Link to="/signup" className="px-5 py-2 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#152235] transition">
              Build My Resume
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-[#8b1a2e] mb-3 uppercase tracking-wide">Cover Letter Guide</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1a2744] mb-4 leading-tight">
            How to Write a Cover Letter<br />That Stands Out
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            A practical guide to writing cover letters that get you noticed — from structure and tone to what not to say.
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {SECTIONS.map((section, i) => (
            <div key={i}>
              <h2 className="text-2xl font-bold text-[#1a2744] mb-4">{section.title}</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-[15px]">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-[#1a2744] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Generate your cover letter in seconds</h3>
          <p className="text-blue-200 mb-6">
            ResumeAI's cover letter generator pulls your experience from your CV and writes a personalised letter. Edit it, adjust the tone, and download instantly.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3.5 bg-white text-[#1a2744] font-bold rounded-xl hover:bg-blue-50 transition"
          >
            Build My Resume + Cover Letter →
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-6 text-center">
        <p className="text-gray-400 text-sm mb-3">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <span className="mx-3">·</span>
          <Link to="/templates" className="hover:text-white transition">Templates</Link>
          <span className="mx-3">·</span>
          <Link to="/resume-tips" className="hover:text-white transition">Resume Tips</Link>
        </p>
        <p className="text-gray-600 text-xs">© 2025 ResumeAI by Baishali Roy</p>
      </footer>
    </div>
  )
}
