import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ModernTemplate from '../components/templates/ModernTemplate'
import ClassicTemplate from '../components/templates/ClassicTemplate'
import MinimalTemplate from '../components/templates/MinimalTemplate'
import CreativeTemplate from '../components/templates/CreativeTemplate'
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate'
import SidebarTemplate from '../components/templates/SidebarTemplate'
import ElegantTemplate from '../components/templates/ElegantTemplate'
import TechTemplate from '../components/templates/TechTemplate'

const UPIPaymentModal = ({ onClose, onPaid }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Download Your Resume</h2>
        <p className="text-gray-500 mb-4">Pay ₹99 to download your PDF</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <img
            src="/qr-code.jpg"
            alt="UPI QR Code"
            className="w-56 h-56 mx-auto rounded-lg object-contain"
          />
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-500 mb-1">Or pay using UPI ID</p>
          <p className="font-bold text-blue-700 text-lg select-all">baishaliroy11@ybl</p>
          <p className="text-xs text-gray-400 mt-1">Works on GPay, PhonePe, Paytm & all UPI apps</p>
        </div>

        <p className="text-sm text-gray-500 mb-4">Amount: <span className="font-bold text-gray-800">₹99</span></p>

        <button
          onClick={onPaid}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-colors mb-3"
        >
          ✅ I've Paid — Download PDF
        </button>

        <button
          onClick={onClose}
          className="w-full text-gray-400 hover:text-gray-600 text-sm py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
export default function Builder() {
  const [searchParams] = useSearchParams()
  const template = searchParams.get('template') || 'modern'
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const [resumeData, setResumeData] = useState({
    personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  })

  const handleDownload = () => {
    setShowPaymentModal(true)
  }

  const handlePaid = async () => {
    setShowPaymentModal(false)
    setIsGenerating(true)
    try {
      const element = document.getElementById('resume-preview')
      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf().set({
        margin: 0,
        filename: 'my-resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).from(element).save()
    } catch (error) {
      console.error('PDF error:', error)
      alert('Something went wrong. Please try again.')
    }
    setIsGenerating(false)
  }

  const templates = { modern: ModernTemplate, classic: ClassicTemplate, minimal: MinimalTemplate, creative: CreativeTemplate, professional: ProfessionalTemplate, sidebar: SidebarTemplate, elegant: ElegantTemplate, tech: TechTemplate }
  const SelectedTemplate = templates[template] || ModernTemplate

  return (
    <div className="min-h-screen bg-gray-50">
      {showPaymentModal && (
        <UPIPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaid={handlePaid}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">👤 Personal Information</h2>
              <div className="space-y-3">
                {['name','email','phone','location','linkedin','website'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-600 capitalize mb-1">{field === 'linkedin' ? 'LinkedIn URL' : field === 'website' ? 'Website URL' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type="text"
                      placeholder={field === 'name' ? 'Full Name' : field === 'email' ? 'your@email.com' : field === 'phone' ? '+91 98765 43210' : field === 'location' ? 'City, State' : field === 'linkedin' ? 'linkedin.com/in/yourname' : 'yourwebsite.com'}
                      value={resumeData.personalInfo[field]}
                      onChange={e => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, [field]: e.target.value}})}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Professional Summary</h2>
              <textarea
                placeholder="Write 2-3 sentences about yourself..."
                value={resumeData.summary}
                onChange={e => setResumeData({...resumeData, summary: e.target.value})}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Skills</h2>
              <input
                type="text"
                placeholder="e.g. JavaScript, React, Python, Java, SQL"
                value={resumeData.skills.join(', ')}
                onChange={e => setResumeData({...resumeData, skills: e.target.value.split(',').map(s => s.trim())})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">💡 Separate each skill with a comma</p>
            </div>

            <div className="sticky bottom-6">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-colors"
              >
                {isGenerating ? '⏳ Generating PDF...' : '📥 Download PDF'}
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">👁️ Live Preview - {template.charAt(0).toUpperCase() + template.slice(1)}</h3>
              <div id="resume-preview" className="transform scale-75 origin-top">
                <SelectedTemplate data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}