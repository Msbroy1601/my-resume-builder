import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    title: 'How long should a resume be?',
    content: `For most candidates, one page is ideal. If you have more than 10 years of experience or are applying for senior roles, two pages is acceptable. Never go beyond two pages — hiring managers typically spend less than 10 seconds on an initial scan.

Keep it concise: every line should earn its place. Remove outdated experience (older than 10–15 years unless highly relevant) and cut filler phrases like "responsible for" or "worked on".`,
  },
  {
    title: 'What sections should every resume include?',
    content: `A strong resume always has:

• Contact Information — name, email, phone, LinkedIn, city/location
• Professional Summary — 2–3 sentences that sell your value proposition
• Work Experience — in reverse chronological order with bullet points
• Education — degree, institution, graduation year
• Skills — technical and soft skills relevant to the role

Optional but powerful sections: Projects, Certifications, Languages, Volunteer Work.`,
  },
  {
    title: 'How to write a professional summary',
    content: `Your summary sits at the top and is the first thing a recruiter reads. Make it count.

A great formula: [Years of experience] + [your specialty] + [biggest value you bring] + [what you're looking for].

Example: "Results-driven software engineer with 5 years of experience building scalable backend systems in Python and Node.js. Passionate about clean architecture and developer experience. Seeking a senior engineering role at a fast-growing product company."

Avoid vague adjectives like "hardworking", "team player", or "passionate" without evidence.`,
  },
  {
    title: 'How to write bullet points that get attention',
    content: `Bullet points under each role should follow the CAR formula: Context → Action → Result.

✗ Bad: "Worked on improving app performance"
✓ Good: "Reduced API response time by 40% by introducing Redis caching, improving user retention by 15%"

Start every bullet with a strong action verb: Built, Designed, Led, Reduced, Increased, Launched, Managed, Negotiated, Delivered.

Quantify wherever possible — numbers make achievements concrete and memorable.`,
  },
  {
    title: 'How to pass ATS (Applicant Tracking Systems)',
    content: `Most large companies use ATS software to filter resumes before a human sees them. To pass:

• Use standard section headings (Work Experience, Education, Skills — not creative names)
• Include keywords from the job description naturally in your bullet points
• Avoid tables, columns, graphics, and special characters that ATS can't parse
• Use a clean, simple template — our Professional and Modern templates are ATS optimised
• Save as PDF unless the job posting specifically requests Word format
• Don't stuff keywords — focus on genuine relevance

Use ResumeAI's built-in ATS checker to see how your CV scores before you submit.`,
  },
  {
    title: 'What not to include on your resume',
    content: `Leave these out:

• Date of birth, gender, or marital status (illegal to discriminate; don't invite it)
• A photo (unless the industry requires it — some creative fields do)
• References or "References available upon request" — waste of space
• Salary history or expectations
• Your home address (city is enough)
• Irrelevant hobbies ("watching Netflix", "sleeping")
• School activities older than 5 years if you have substantial work experience
• Spelling mistakes or poor grammar — proofread three times`,
  },
  {
    title: 'Tailor your resume for each job',
    content: `Sending the same resume to every company is the number one resume mistake. Spend 10 minutes tailoring each application:

1. Read the job description carefully and highlight the key requirements
2. Mirror the language — if they say "cross-functional collaboration", use that phrase
3. Reorder bullet points to put the most relevant experience at the top
4. Adjust your professional summary to reference the company's product or mission
5. Remove unrelated experience that dilutes your focus

Quality over quantity: 5 tailored applications will outperform 50 generic ones.`,
  },
  {
    title: 'Resume format tips',
    content: `• Font: Use a professional, readable font — Calibri, Helvetica, or Georgia at 10–12pt
• Margins: 0.5–1 inch on all sides
• Spacing: Consistent and generous — don't cram content
• Bold/Italics: Use sparingly for emphasis — job titles, company names, section headers
• Color: A tasteful accent color is fine; avoid garish combinations
• File name: "FirstName_LastName_Resume.pdf" — never "resume_final_v3_ACTUAL.pdf"`,
  },
]

export default function ResumeTips() {
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
          <p className="text-sm font-semibold text-[#8b1a2e] mb-3 uppercase tracking-wide">Resume Guide</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1a2744] mb-4 leading-tight">
            How to Write a Resume<br />That Gets Interviews
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            A practical, no-fluff guide to writing a resume that passes ATS filters and impresses recruiters.
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
          <h3 className="text-2xl font-bold text-white mb-3">Ready to build your resume?</h3>
          <p className="text-blue-200 mb-6">Apply these tips with our free resume builder — 17 professional templates, live preview, and one-click PDF download.</p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3.5 bg-white text-[#1a2744] font-bold rounded-xl hover:bg-blue-50 transition"
          >
            Build My Resume — Free →
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
          <Link to="/cover-letter-tips" className="hover:text-white transition">Cover Letter Tips</Link>
        </p>
        <p className="text-gray-600 text-xs">© 2025 ResumeAI by Baishali Roy</p>
      </footer>
    </div>
  )
}
