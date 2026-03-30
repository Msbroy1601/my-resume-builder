import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: '',
    badge: null,
    color: 'border-gray-200',
    headerBg: 'bg-gray-50',
    cta: 'Get Started Free',
    ctaStyle: 'border-2 border-[#1a2744] text-[#1a2744] hover:bg-[#1a2744] hover:text-white',
    features: [
      { text: '1 free download every 5 days', highlight: true },
      { text: 'All 17+ resume templates' },
      { text: 'ATS & Job Match Checker' },
      { text: 'AI Summary Generator' },
      { text: 'Cover Letter Builder' },
      { text: 'Cloud saves (3 slots)' },
      { text: 'PDF download', note: '(1 per 5 days)' },
    ],
    notIncluded: ['Unlimited downloads', 'Priority support'],
  },
  {
    id: 'per_download',
    name: 'Pay Per Download',
    price: '₹79',
    period: '/ download',
    badge: null,
    color: 'border-gray-200',
    headerBg: 'bg-gray-50',
    cta: 'Download Now',
    ctaStyle: 'border-2 border-gray-400 text-gray-700 hover:bg-gray-100',
    features: [
      { text: 'Single PDF download' },
      { text: 'All templates included' },
      { text: 'No subscription needed' },
      { text: 'Pay only when you need it' },
    ],
    notIncluded: ['Unlimited downloads', 'Priority support'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '₹149',
    period: '/ month',
    badge: null,
    color: 'border-[#1a2744]',
    headerBg: 'bg-[#1a2744]',
    cta: 'Start Monthly Plan',
    ctaStyle: 'bg-[#1a2744] text-white hover:bg-[#152235]',
    features: [
      { text: 'Unlimited downloads', highlight: true },
      { text: 'All 17+ resume templates' },
      { text: 'ATS & Job Match Checker' },
      { text: 'AI Summary Generator' },
      { text: 'Cover Letter Builder' },
      { text: 'Cloud saves (unlimited)' },
      { text: 'Cancel anytime' },
    ],
    notIncluded: [],
  },
  {
    id: 'quarterly',
    name: '3 Months',
    price: '₹349',
    period: '/ 3 months',
    badge: 'Save 22%',
    color: 'border-[#f0a04b]',
    headerBg: 'bg-gradient-to-br from-[#1a2744] to-[#2d5a8e]',
    cta: 'Get 3 Months',
    ctaStyle: 'bg-gradient-to-r from-[#f0a04b] to-[#e8962a] text-white hover:from-[#e8962a] hover:to-[#d88720]',
    features: [
      { text: 'Unlimited downloads', highlight: true },
      { text: 'All 17+ resume templates' },
      { text: 'ATS & Job Match Checker' },
      { text: 'AI Summary Generator' },
      { text: 'Cover Letter Builder' },
      { text: 'Cloud saves (unlimited)' },
      { text: 'Cancel anytime' },
      { text: '≈ ₹116/month', highlight: true },
    ],
    notIncluded: [],
  },
  {
    id: 'biannual',
    name: '6 Months',
    price: '₹599',
    period: '/ 6 months',
    badge: 'Most Popular',
    color: 'border-[#8b1a2e]',
    headerBg: 'bg-gradient-to-br from-[#8b1a2e] to-[#b02540]',
    cta: 'Get 6 Months',
    ctaStyle: 'bg-[#8b1a2e] text-white hover:bg-[#7a1727]',
    features: [
      { text: 'Unlimited downloads', highlight: true },
      { text: 'All 17+ resume templates' },
      { text: 'ATS & Job Match Checker' },
      { text: 'AI Summary Generator' },
      { text: 'Cover Letter Builder' },
      { text: 'Cloud saves (unlimited)' },
      { text: 'Cancel anytime' },
      { text: '≈ ₹100/month', highlight: true },
    ],
    notIncluded: [],
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '₹999',
    period: '/ year',
    badge: 'Best Value',
    color: 'border-[#1a2744]',
    headerBg: 'bg-gradient-to-br from-[#1a2744] via-[#8b1a2e] to-[#1a2744]',
    cta: 'Get Annual Plan',
    ctaStyle: 'bg-gradient-to-r from-[#1a2744] to-[#8b1a2e] text-white hover:opacity-90',
    features: [
      { text: 'Unlimited downloads', highlight: true },
      { text: 'All 17+ resume templates' },
      { text: 'ATS & Job Match Checker' },
      { text: 'AI Summary Generator' },
      { text: 'Cover Letter Builder' },
      { text: 'Cloud saves (unlimited)' },
      { text: 'Cancel anytime' },
      { text: '≈ ₹83/month — best deal!', highlight: true },
    ],
    notIncluded: [],
  },
]

const competitors = [
  { feature: 'Monthly price (approx.)', resumeai: '₹149', zety: '~₹1,200', naukri: '₹200+', shine: '₹99+' },
  { feature: 'Free downloads', resumeai: '1 per 5 days', zety: '❌ None', naukri: '❌ None', shine: '❌ None' },
  { feature: 'Indian templates', resumeai: '✅ 17+', zety: '❌ US-focused', naukri: '✅ Yes', shine: '✅ Yes' },
  { feature: 'ATS checker', resumeai: '✅ Free', zety: '✅ Paid only', naukri: '✅ Paid only', shine: '❌ No' },
  { feature: 'Job Match AI', resumeai: '✅ Free', zety: '✅ Paid only', naukri: '❌ No', shine: '❌ No' },
  { feature: 'Cover Letter Builder', resumeai: '✅ Free', zety: '✅ Paid only', naukri: '❌ No', shine: '❌ No' },
  { feature: 'AI Summary Generator', resumeai: '✅ Free', zety: '✅ Paid only', naukri: '❌ No', shine: '❌ No' },
  { feature: 'Cancel anytime', resumeai: '✅ Yes', zety: '✅ Yes', naukri: '✅ Yes', shine: '✅ Yes' },
]

export default function Pricing() {
  const { isSignedIn } = useUser()
  const navigate = useNavigate()

  const handlePlanClick = (planId) => {
    if (planId === 'free') {
      navigate(isSignedIn ? '/builder' : '/sign-up')
    } else {
      // Future: Razorpay integration
      navigate(isSignedIn ? '/builder' : '/sign-up')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[#1a2744] tracking-tight">ResumeAI</Link>
          <div className="flex items-center gap-4">
            <Link to="/resume-templates" className="text-sm text-gray-600 hover:text-[#1a2744] font-medium transition">Templates</Link>
            <Link to="/builder" className="text-sm bg-[#f0a04b] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#e8962a] transition">Build Free →</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#1a2744] text-white py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-3">Simple, honest pricing</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Start free. Pay only<br className="hidden sm:block" /> when you love it.
        </h1>
        <p className="text-blue-200 text-lg max-w-xl mx-auto mb-6">
          1 free download every 5 days — forever. Upgrade for unlimited downloads, starting at ₹149/month.
        </p>
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-sm font-medium text-blue-100">
          ✅ Cancel anytime &nbsp;·&nbsp; ✅ No hidden fees &nbsp;·&nbsp; ✅ UPI / Cards / Net Banking
        </div>
      </section>

      {/* Plans grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 ${plan.color} shadow-sm hover:shadow-md transition flex flex-col overflow-hidden`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-[#f0a04b] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">{plan.badge}</span>
                </div>
              )}

              {/* Header */}
              <div className={`${plan.headerBg} px-6 py-5`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.headerBg.includes('1a2744') || plan.headerBg.includes('8b1a2e') ? 'text-blue-200' : 'text-gray-500'}`}>{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-extrabold ${plan.headerBg.includes('1a2744') || plan.headerBg.includes('8b1a2e') ? 'text-white' : 'text-[#1a2744]'}`}>{plan.price}</span>
                  {plan.period && <span className={`text-sm mb-1.5 ${plan.headerBg.includes('1a2744') || plan.headerBg.includes('8b1a2e') ? 'text-blue-200' : 'text-gray-400'}`}>{plan.period}</span>}
                </div>
              </div>

              {/* Features */}
              <div className="px-6 py-5 flex-1">
                <ul className="space-y-2.5">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span className={feat.highlight ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                        {feat.text} {feat.note && <span className="text-gray-400">{feat.note}</span>}
                      </span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="font-bold flex-shrink-0 mt-0.5">–</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handlePlanClick(plan.id)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition ${plan.ctaStyle}`}
                >{plan.cta}</button>
                {(plan.id === 'monthly' || plan.id === 'quarterly' || plan.id === 'biannual' || plan.id === 'annual') && (
                  <p className="text-center text-xs text-gray-400 mt-2">Cancel anytime, no questions asked</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a2744] mb-3">How we compare</h2>
          <p className="text-gray-500">ResumeAI vs the rest — built for India, priced for India.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a2744] text-white">
                  <th className="text-left px-5 py-4 font-semibold">Feature</th>
                  <th className="px-5 py-4 font-semibold text-[#f0a04b]">ResumeAI</th>
                  <th className="px-5 py-4 font-semibold text-blue-200">Zety</th>
                  <th className="px-5 py-4 font-semibold text-blue-200">Naukri</th>
                  <th className="px-5 py-4 font-semibold text-blue-200">Shine</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 font-medium text-gray-800">{row.feature}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-emerald-600">{row.resumeai}</td>
                    <td className="px-5 py-3.5 text-center text-gray-500">{row.zety}</td>
                    <td className="px-5 py-3.5 text-center text-gray-500">{row.naukri}</td>
                    <td className="px-5 py-3.5 text-center text-gray-500">{row.shine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="bg-[#1a2744] text-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Common questions</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {[
              { q: 'Is it really free?', a: 'Yes — you get 1 free PDF download every 5 days, forever. No credit card needed.' },
              { q: 'How do I cancel?', a: 'Any paid plan can be cancelled anytime from your account settings. No questions asked.' },
              { q: 'Which payment methods are accepted?', a: 'UPI (GPay, PhonePe, Paytm), debit/credit cards, and net banking via Razorpay.' },
              { q: 'Can I switch plans?', a: 'Yes, you can upgrade or downgrade at any time. Unused days are credited to your account.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="font-semibold text-white mb-1 text-sm">{faq.q}</p>
                <p className="text-blue-200 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 px-6 text-center bg-gray-50">
        <h2 className="text-2xl font-bold text-[#1a2744] mb-3">Ready to land that job?</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">Start free — no credit card needed. Upgrade when you're ready for unlimited downloads.</p>
        <Link to={isSignedIn ? '/builder' : '/sign-up'}
          className="inline-block bg-[#f0a04b] text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-[#e8962a] transition shadow-md">
          Build My Resume Free →
        </Link>
        <p className="text-xs text-gray-400 mt-3">Join thousands of job seekers across India</p>
      </section>

      {/* Footer nav */}
      <footer className="bg-[#1a2744] text-gray-400 text-xs text-center py-6 px-4">
        <p>© 2025 ResumeAI by Baishali Roy · <Link to="/" className="hover:text-white transition">Home</Link> · <Link to="/resume-templates" className="hover:text-white transition">Templates</Link> · <a href="mailto:baishaliroy11@gmail.com" className="hover:text-white transition">Contact</a></p>
      </footer>
    </div>
  )
}
