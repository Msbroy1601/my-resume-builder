import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import HowItWorks from '../components/HowItWorks'
import TrustBadges from '../components/TrustBadges'

function Home() {
  const { user } = useUser()
  const currentUser = user
  const displayName = currentUser?.firstName || currentUser?.fullName || 'there'

  const templates = [
    { id: 'modern', name: 'Modern', emoji: '🚀', color: 'from-blue-500 to-blue-600' },
    { id: 'classic', name: 'Classic', emoji: '📄', color: 'from-gray-700 to-gray-800' },
    { id: 'minimal', name: 'Minimal', emoji: '✨', color: 'from-gray-400 to-gray-500' },
    { id: 'creative', name: 'Creative', emoji: '🎨', color: 'from-purple-500 to-pink-500' },
    { id: 'professional', name: 'Professional', emoji: '💼', color: 'from-blue-600 to-blue-700' },
    { id: 'sidebar', name: 'Sidebar', emoji: '📊', color: 'from-green-500 to-green-600' }
  ]

  const features = [
    {
      icon: '⚡',
      title: 'Create in Minutes',
      description: 'Simple step-by-step builder with live preview as you type'
    },
    {
      icon: '🎨',
      title: '8 Beautiful Templates',
      description: 'Professional designs for every style and industry'
    },
    {
      icon: '💸',
      title: '100% Free',
      description: 'Build and download your resume at no cost. Always.'
    },
    {
      icon: '📱',
      title: 'Works Everywhere',
      description: 'Build on mobile or desktop. Your data stays safe.'
    }
  ]

  const faqs = [
    {
      question: 'Is Resume Builder really free?',
      answer: 'Yes, completely! Building your resume and downloading the PDF is 100% free. No hidden fees, no subscriptions, no credit card required.'
    },
    {
      question: 'Then how do you keep this running?',
      answer: 'This is a passion project! When you download your resume, we show a "buy me a coffee" prompt. If the tool helped you, a small voluntary tip of ₹99 or more keeps the lights on — but it\'s entirely optional.'
    },
    {
      question: 'Can I edit my resume after downloading?',
      answer: 'Absolutely! Your resume is saved to your browser. Come back anytime to make changes and download an updated version for free.'
    },
    {
      question: 'What formats can I download?',
      answer: 'You can download your resume as a PDF — the most widely accepted format for job applications.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#templates" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Templates
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition">
                How it works
              </a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 font-medium transition">
                FAQ
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-gray-700">Hi, {displayName}!</span>
                  <Link
                    to="/templates"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    My Resumes
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 text-gray-700 font-semibold hover:text-blue-600 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          🎉 100% Free — No credit card required
        </div>
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          100% Free — Build and download your resume
        </h2>
        <p className="text-2xl text-gray-600 mb-4">
          Create a job-ready resume in minutes
        </p>
        <p className="text-lg text-gray-500 mb-12">
          Choose from 8 professional templates. Download as PDF. Completely free.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to={currentUser ? "/templates" : "/signup"}
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 transition"
          >
            Build My Resume — Free
          </Link>
          <Link
            to="/templates"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-50 transition border-2 border-blue-600"
          >
            View Templates
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Why Choose Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Why People Choose Us
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Simple, beautiful, and completely free
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Templates Section */}
      <section id="templates" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            8 Professional Templates
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center">
            All free to use. Pick the one that fits your style.
          </p>

          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto pb-8">
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {templates.map((template) => (
                <Link
                  key={template.id}
                  to={currentUser ? `/builder?template=${template.id}` : "/signup"}
                  className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <div className={`h-80 bg-gradient-to-br ${template.color} rounded-t-lg flex items-center justify-center text-7xl`}>
                    {template.emoji}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
                      Use This Template →
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/templates"
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition"
            >
              View All Templates
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Common Questions
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Quick answers about the tool
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-6 rounded-lg">
                <summary className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition">
                  {faq.question}
                </summary>
                <p className="text-gray-700 mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Your next job starts with a great resume
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Build and download yours for free. No sign-up tricks, no hidden costs.
          </p>
          <Link
            to={currentUser ? "/templates" : "/signup"}
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition"
          >
            Build My Resume Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Resume Builder</h3>
              <p className="text-gray-400 text-sm">
                Create professional resumes in minutes. Free forever.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/templates" className="hover:text-white transition">Templates</Link></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How it works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Resume Builder by Baishali Roy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
