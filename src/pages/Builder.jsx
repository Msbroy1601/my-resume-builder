import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import html2pdf from 'html2pdf.js'

function Builder() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useUser()
  const { signOut } = useClerk()
  const currentUser = user
  
  // Get user's display name
  const displayName = currentUser?.firstName || currentUser?.fullName || 'there'
  
  // Get template from URL or default to 'modern'
  const [selectedTemplate, setSelectedTemplate] = useState(
    searchParams.get('template') || 'modern'
  )
  
  // Personal info state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [summary, setSummary] = useState('')
  
  // Work experience state
  const [workExperiences, setWorkExperiences] = useState([])
  const [currentWork, setCurrentWork] = useState({
    company: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
    description: ''
  })

  // Education state
  const [educationList, setEducationList] = useState([])
  const [currentEducation, setCurrentEducation] = useState({
    school: '',
    degree: '',
    gradYear: ''
  })

  // Skills state
  const [skills, setSkills] = useState('')

  // PDF download state
  const [isDownloading, setIsDownloading] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resumeData')
      if (savedData) {
        const data = JSON.parse(savedData)
        setName(data.name || '')
        setEmail(data.email || '')
        setPhone(data.phone || '')
        setSummary(data.summary || '')
        setWorkExperiences(data.workExperiences || [])
        setEducationList(data.educationList || [])
        setSkills(data.skills || '')
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [])

  // Update template when URL changes
  useEffect(() => {
    const templateFromUrl = searchParams.get('template')
    if (templateFromUrl) {
      setSelectedTemplate(templateFromUrl)
    }
  }, [searchParams])

  // Manual save function
  const handleSave = () => {
    const dataToSave = {
      name,
      email,
      phone,
      summary,
      workExperiences,
      educationList,
      skills,
      selectedTemplate
    }
    localStorage.setItem('resumeData', JSON.stringify(dataToSave))
    alert('✅ Resume saved to browser!')
  }

  // Add work experience
  const addWorkExperience = () => {
    if (currentWork.company || currentWork.jobTitle) {
      setWorkExperiences([...workExperiences, currentWork])
      setCurrentWork({
        company: '',
        jobTitle: '',
        startDate: '',
        endDate: '',
        description: ''
      })
    }
  }

  // Delete work experience
  const deleteWorkExperience = (index) => {
    setWorkExperiences(workExperiences.filter((_, i) => i !== index))
  }

  // Add education
  const addEducation = () => {
    if (currentEducation.school || currentEducation.degree) {
      setEducationList([...educationList, currentEducation])
      setCurrentEducation({
        school: '',
        degree: '',
        gradYear: ''
      })
    }
  }

  // Delete education
  const deleteEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index))
  }

  // PDF Download function - THE NEW PART!
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleDownload = () => {
    setShowPaymentModal(true)
  }

  const actuallyDownload = () => {
    setShowPaymentModal(true)
  }

  const handlePaid = () => {
    setShowPaymentModal(false)
    actuallyDownload()
  }

  const actuallyDownload = () => {
    setIsDownloading(true)
    
    // Get the resume preview element
    const element = document.getElementById('resume-preview')
    
    if (!element) {
      alert('❌ Could not find resume preview')
      setIsDownloading(false)
      return
    }
    
    // Generate filename
    const userName = name || 'Resume'
    const templateName = selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)
    const filename = `Resume_${userName.replace(/\s+/g, '_')}_${templateName}.pdf`
    
    // PDF options
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }
    
    // Generate PDF
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsDownloading(false)
      })
      .catch((error) => {
        setIsDownloading(false)
        console.error('PDF generation error:', error)
        alert('❌ Error generating PDF. Please try again.')
      })
  }

  // Clear all data
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setName('')
      setEmail('')
      setPhone('')
      setSummary('')
      setWorkExperiences([])
      setCurrentWork({
        company: '',
        jobTitle: '',
        startDate: '',
        endDate: '',
        description: ''
      })
      setEducationList([])
      setCurrentEducation({
        school: '',
        degree: '',
        gradYear: ''
      })
      setSkills('')
      localStorage.removeItem('resumeData')
    }
  }
  // MODERN TEMPLATE
  const ModernTemplate = () => (
    <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200">
      <div className="mb-6">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div id="resume-preview" className="border-t-2 border-gray-200 pt-6">
        <h2 className="text-xl font-bold mb-8 text-gray-900 flex items-center">
          <span className="mr-2">👁️</span> Live Preview - Modern
        </h2>
        
        <div className="mb-8 pb-8 border-b-2 border-gray-200">
          <h3 className="text-4xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
            {name || 'Your Name'}
          </h3>
          <p className="text-base text-gray-600 mb-1 leading-relaxed">{email || 'your.email@example.com'}</p>
          <p className="text-base text-gray-600 leading-relaxed">{phone || '(123) 456-7890'}</p>
        </div>

        {summary && (
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <h3 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
              Professional Summary
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">
              Work Experience
            </h3>
            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div key={index}>
                  <p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p>
                  <p className="text-base text-blue-600 font-semibold mb-1">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-3 italic">
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {educationList.length > 0 && (
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">
              Education
            </h3>
            <div className="space-y-5">
              {educationList.map((edu, index) => (
                <div key={index}>
                  <p className="text-lg font-bold text-gray-900 mb-1">{edu.school}</p>
                  <p className="text-base text-gray-700 mb-1">{edu.degree}</p>
                  <p className="text-sm text-gray-500 italic">{edu.gradYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-blue-600 mb-5 uppercase tracking-wide">
              Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.split(',').map((skill, index) => (
                skill.trim() && (
                  <span 
                    key={index}
                    className="px-5 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 rounded-full text-base font-semibold border-2 border-blue-200"
                  >
                    {skill.trim()}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // CLASSIC TEMPLATE
  const ClassicTemplate = () => (
    <div className="p-10 bg-white shadow-xl border-4 border-gray-900">
      <div className="mb-6">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full bg-gray-900 text-white py-4 px-6 font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center border-2 border-gray-900 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div id="resume-preview" className="border-t-4 border-gray-900 pt-8">
        <h2 className="text-xl font-bold mb-8 text-gray-900 text-center uppercase tracking-wider">
          Live Preview - Classic
        </h2>
        
        <div className="mb-10 text-center">
          <h3 className="text-5xl font-bold text-gray-900 mb-3 uppercase tracking-tight">
            {name || 'Your Name'}
          </h3>
          <div className="flex items-center justify-center gap-3 text-base text-gray-700">
            <span>{email || 'your.email@example.com'}</span>
            <span className="font-bold">•</span>
            <span>{phone || '(123) 456-7890'}</span>
          </div>
        </div>

        {summary && (
          <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">
              Professional Summary
            </h3>
            <p className="text-base text-gray-800 leading-relaxed">{summary}</p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">
              Professional Experience
            </h3>
            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div key={index}>
                  <p className="font-bold text-gray-900 text-lg mb-1">{exp.jobTitle}</p>
                  <p className="text-base text-gray-800 italic mb-2">
                    {exp.company} | {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {educationList.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">
              Education
            </h3>
            <div className="space-y-4">
              {educationList.map((edu, index) => (
                <div key={index}>
                  <p className="font-bold text-gray-900 text-base">{edu.school}</p>
                  <p className="text-base text-gray-800">{edu.degree} | {edu.gradYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">
              Skills
            </h3>
            <p className="text-base text-gray-800 leading-relaxed">
              {skills.split(',').map(s => s.trim()).filter(Boolean).join(' • ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // MINIMAL TEMPLATE
  const MinimalTemplate = () => (
    <div className="p-12 bg-white">
      <div className="mb-6">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full bg-black text-white py-4 px-6 font-medium text-lg hover:bg-gray-800 transition flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div id="resume-preview" className="border-t border-gray-300 pt-10">
        <h2 className="text-lg font-medium mb-10 text-gray-900 text-center tracking-wide">
          Live Preview - Minimal
        </h2>
        
        <div className="mb-12">
          <h3 className="text-6xl font-light text-gray-900 mb-4 tracking-tight">
            {name || 'Your Name'}
          </h3>
          <p className="text-base text-gray-600 leading-relaxed">{email || 'your.email@example.com'}</p>
          <p className="text-base text-gray-600 leading-relaxed">{phone || '(123) 456-7890'}</p>
        </div>

        {summary && (
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
              About
            </h3>
            <p className="text-base text-gray-700 leading-relaxed font-light">{summary}</p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">
              Experience
            </h3>
            <div className="space-y-8">
              {workExperiences.map((exp, index) => (
                <div key={index}>
                  <p className="text-lg font-medium text-gray-900 mb-1">{exp.jobTitle}</p>
                  <p className="text-base text-gray-600 font-light mb-1">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-3 font-light">
                    {exp.startDate} — {exp.endDate}
                  </p>
                  <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {educationList.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">
              Education
            </h3>
            <div className="space-y-5">
              {educationList.map((edu, index) => (
                <div key={index}>
                  <p className="text-base font-medium text-gray-900">{edu.school}</p>
                  <p className="text-base text-gray-700 font-light">{edu.degree}</p>
                  <p className="text-sm text-gray-500 font-light">{edu.gradYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-5 tracking-widest uppercase">
              Skills
            </h3>
            <div className="flex flex-wrap gap-4">
              {skills.split(',').map((skill, index) => (
                skill.trim() && (
                  <span 
                    key={index}
                    className="text-base text-gray-700 font-light"
                  >
                    {skill.trim()}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // CREATIVE TEMPLATE
  const CreativeTemplate = () => (
    <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-xl shadow-2xl border-4 border-purple-300">
      <div className="mb-6">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div id="resume-preview" className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 flex items-center">
          <span className="mr-2">✨</span> Live Preview - Creative
        </h2>
        
        <div className="mb-8 pb-8 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
          <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-4 leading-tight">
            {name || 'Your Name'}
          </h3>
          <div className="flex flex-col gap-1">
            <p className="text-base text-gray-700 font-medium">{email || 'your.email@example.com'}</p>
            <p className="text-base text-gray-700 font-medium">{phone || '(123) 456-7890'}</p>
          </div>
        </div>

        {summary && (
          <div className="mb-8 pb-8 border-b-2 border-purple-200">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-5 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-purple-900 mb-3 uppercase tracking-wide">
                💫 About Me
              </h3>
              <p className="text-base text-gray-800 leading-relaxed">{summary}</p>
            </div>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-8 pb-8 border-b-2 border-purple-200">
            <h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center">
              <span className="mr-2">💼</span> Work Experience
            </h3>
            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-l-4 border-pink-500">
                  <p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p>
                  <p className="text-base text-purple-600 font-bold mb-1">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-3 italic">
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {educationList.length > 0 && (
          <div className="mb-8 pb-8 border-b-2 border-purple-200">
            <h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center">
              <span className="mr-2">🎓</span> Education
            </h3>
            <div className="space-y-5">
              {educationList.map((edu, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-5 border-l-4 border-orange-500">
                  <p className="text-lg font-bold text-gray-900 mb-1">{edu.school}</p>
                  <p className="text-base text-gray-800 mb-1">{edu.degree}</p>
                  <p className="text-sm text-gray-600 italic">{edu.gradYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-purple-600 mb-5 uppercase tracking-wide flex items-center">
              <span className="mr-2">⚡</span> Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.split(',').map((skill, index) => (
                skill.trim() && (
                  <span 
                    key={index}
                    className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-base font-bold shadow-lg hover:scale-105 transition-transform"
                  >
                    {skill.trim()}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
  // PROFESSIONAL TEMPLATE
  const ProfessionalTemplate = () => (
    <div className="p-10 bg-white shadow-2xl border-l-8 border-blue-600">
      <div className="mb-6">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div id="resume-preview" className="border-t-2 border-blue-600 pt-8">
        <h2 className="text-xl font-bold mb-8 text-blue-600 uppercase tracking-wider text-center">
          Live Preview - Professional
        </h2>
        
        <div className="mb-10 pb-6 border-b-2 border-gray-300">
          <h3 className="text-4xl font-bold text-gray-900 mb-3 uppercase tracking-tight">
            {name || 'Your Name'}
          </h3>
          <div className="flex items-center gap-4 text-base text-gray-700">
            <span className="flex items-center gap-2">
              <span className="text-blue-600">✉️</span>
              {email || 'your.email@example.com'}
            </span>
            <span className="text-gray-400">|</span>
            <span className="flex items-center gap-2">
              <span className="text-blue-600">📱</span>
              {phone || '(123) 456-7890'}
            </span>
          </div>
        </div>

        {summary && (
          <div className="mb-10 pb-6 border-b-2 border-gray-300">
            <h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide flex items-center">
              <span className="w-2 h-8 bg-blue-600 mr-3"></span>
              Professional Summary
            </h3>
            <p className="text-base text-gray-800 leading-relaxed ml-5">{summary}</p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-10 pb-6 border-b-2 border-gray-300">
            <h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide flex items-center">
              <span className="w-2 h-8 bg-blue-600 mr-3"></span>
              Professional Experience
            </h3>
            <div className="space-y-6 ml-5">
              {workExperiences.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="text-xl font-bold text-gray-900">{exp.jobTitle}</p>
                    <p className="text-sm text-gray-600 italic">
                      {exp.startDate} - {exp.endDate}
                    </p>
                  </div>
                  <p className="text-base text-blue-600 font-semibold mb-3">{exp.company}</p>
                  <p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {educationList.length > 0 && (
          <div className="mb-10 pb-6 border-b-2 border-gray-300">
            <h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide flex items-center">
              <span className="w-2 h-8 bg-blue-600 mr-3"></span>
              Education
            </h3>
            <div className="space-y-5 ml-5">
              {educationList.map((edu, index) => (
                <div key={index}>
                  <p className="text-lg font-bold text-gray-900">{edu.school}</p>
                  <p className="text-base text-gray-800 mb-1">{edu.degree}</p>
                  <p className="text-sm text-gray-600 italic">{edu.gradYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-blue-600 mb-5 uppercase tracking-wide flex items-center">
              <span className="w-2 h-8 bg-blue-600 mr-3"></span>
              Core Competencies
            </h3>
            <div className="grid grid-cols-2 gap-3 ml-5">
              {skills.split(',').map((skill, index) => (
                skill.trim() && (
                  <div 
                    key={index}
                    className="flex items-center text-base text-gray-800"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {skill.trim()}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // SIDEBAR TEMPLATE
  const SidebarTemplate = () => (
    <div className="bg-white shadow-2xl overflow-hidden">
      <div className="mb-6 p-8 pb-0">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-teal-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div id="resume-preview" className="grid grid-cols-3 gap-0">
        {/* LEFT SIDEBAR */}
        <div className="col-span-1 bg-gradient-to-b from-green-700 to-teal-700 text-white p-8">
          <h2 className="text-lg font-bold mb-8 text-center border-b-2 border-white pb-2">
            Live Preview - Sidebar
          </h2>
          
          {/* Contact Info */}
          <div className="mb-8">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-green-200 text-xs mb-1">Email</p>
                <p className="break-words">{email || 'your.email@example.com'}</p>
              </div>
              <div>
                <p className="text-green-200 text-xs mb-1">Phone</p>
                <p>{phone || '(123) 456-7890'}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {skills && (
            <div className="mb-8">
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">
                Skills
              </h3>
              <div className="space-y-2">
                {skills.split(',').map((skill, index) => (
                  skill.trim() && (
                    <div key={index} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                      <span>{skill.trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {educationList.length > 0 && (
            <div>
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">
                Education
              </h3>
              <div className="space-y-4">
                {educationList.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-bold">{edu.school}</p>
                    <p className="text-green-200 text-xs mt-1">{edu.degree}</p>
                    <p className="text-green-300 text-xs mt-1">{edu.gradYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="col-span-2 p-8">
          {/* Name */}
          <div className="mb-8">
            <h3 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {name || 'Your Name'}
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-teal-600"></div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-green-700 mb-3 uppercase tracking-wide">
                Professional Summary
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {workExperiences.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-green-700 mb-5 uppercase tracking-wide">
                Work Experience
              </h3>
              <div className="space-y-6">
                {workExperiences.map((exp, index) => (
                  <div key={index}>
                    <p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p>
                    <p className="text-base text-green-600 font-semibold mb-1">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-3 italic">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // ELEGANT TEMPLATE
  const ElegantTemplate = () => (
    <div className="p-10 bg-gradient-to-br from-rose-50 to-orange-50 shadow-2xl">
      <div className="mb-6">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-rose-700 hover:to-orange-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div id="resume-preview" className="bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-8 text-rose-600 text-center italic">
          Live Preview - Elegant
        </h2>
        
        <div className="text-center mb-10 pb-8 border-b-2 border-rose-200">
          <h3 className="text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
            {name || 'Your Name'}
          </h3>
          <div className="flex items-center justify-center gap-3 text-base text-gray-600 italic">
            <span>{email || 'your.email@example.com'}</span>
            <span className="text-rose-400">◆</span>
            <span>{phone || '(123) 456-7890'}</span>
          </div>
        </div>

        {summary && (
          <div className="mb-10 pb-8 border-b border-rose-100">
            <h3 className="text-lg font-serif font-bold text-rose-600 mb-4 text-center italic">
              Professional Profile
            </h3>
            <p className="text-base text-gray-700 leading-relaxed text-center italic">
              {summary}
            </p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-10 pb-8 border-b border-rose-100">
            <h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">
              Professional Experience
            </h3>
            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div key={index} className="border-l-4 border-rose-300 pl-6">
                  <p className="text-xl font-serif font-bold text-gray-900 mb-1">{exp.jobTitle}</p>
                  <p className="text-base text-rose-600 font-semibold mb-1 italic">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-3 italic">
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {educationList.length > 0 && (
          <div className="mb-10 pb-8 border-b border-rose-100">
            <h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">
              Education
            </h3>
            <div className="space-y-5">
              {educationList.map((edu, index) => (
                <div key={index} className="border-l-4 border-orange-300 pl-6">
                  <p className="text-lg font-serif font-bold text-gray-900">{edu.school}</p>
                  <p className="text-base text-gray-700 mb-1 italic">{edu.degree}</p>
                  <p className="text-sm text-gray-500 italic">{edu.gradYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && (
          <div className="mb-6">
            <h3 className="text-lg font-serif font-bold text-rose-600 mb-5 text-center italic">
              Core Competencies
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {skills.split(',').map((skill, index) => (
                skill.trim() && (
                  <span 
                    key={index}
                    className="px-5 py-2 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-800 rounded-full text-base font-medium italic border border-rose-200"
                  >
                    {skill.trim()}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // TECH TEMPLATE
  const TechTemplate = () => (
    <div className="p-8 bg-gray-900 shadow-2xl">
      <div className="mb-6">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div id="resume-preview" className="bg-white p-10 rounded-xl">
        <h2 className="text-xl font-bold mb-8 text-violet-600 flex items-center">
          <span className="mr-2">💻</span> Live Preview - Tech
        </h2>
        
        <div className="mb-8 pb-8 border-b-2 border-violet-200">
          <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 mb-3 leading-tight">
            {name || 'Your Name'}
          </h3>
          <div className="flex items-center gap-3 text-base text-gray-600 font-mono">
            <span className="text-violet-600">$</span>
            <span>{email || 'your.email@example.com'}</span>
            <span className="text-violet-400">|</span>
            <span>{phone || '(123) 456-7890'}</span>
          </div>
        </div>

        {summary && (
          <div className="mb-8 pb-8 border-b-2 border-violet-200">
            <h3 className="text-lg font-bold text-violet-600 mb-4 uppercase tracking-wide font-mono flex items-center">
              <span className="text-violet-400 mr-2">{'>'}</span>
              README.md
            </h3>
            <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-violet-500 font-mono text-sm">
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-8 pb-8 border-b-2 border-violet-200">
            <h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center">
              <span className="text-violet-400 mr-2">{'>'}</span>
              Work Experience
            </h3>
            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div key={index} className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
                  <p className="text-xl font-bold text-gray-900 mb-1 font-mono">{exp.jobTitle}</p>
                  <p className="text-base text-violet-600 font-semibold mb-1 font-mono">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-3 font-mono">
                    <span className="text-violet-400">{'['}</span>
                    {exp.startDate} - {exp.endDate}
                    <span className="text-violet-400">{']'}</span>
                  </p>
                  <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {educationList.length > 0 && (
          <div className="mb-8 pb-8 border-b-2 border-violet-200">
            <h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center">
              <span className="text-violet-400 mr-2">{'>'}</span>
              Education
            </h3>
            <div className="space-y-5">
              {educationList.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-5 rounded-lg border-l-4 border-violet-400">
                  <p className="text-lg font-bold text-gray-900 font-mono">{edu.school}</p>
                  <p className="text-base text-gray-700 mb-1">{edu.degree}</p>
                  <p className="text-sm text-gray-500 font-mono">{edu.gradYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-violet-600 mb-5 uppercase tracking-wide font-mono flex items-center">
              <span className="text-violet-400 mr-2">{'>'}</span>
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.split(',').map((skill, index) => (
                skill.trim() && (
                  <span 
                    key={index}
                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md text-base font-bold font-mono shadow-md hover:scale-105 transition-transform"
                  >
                    {skill.trim()}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    {showPaymentModal && <UPIPaymentModal onClose={() => setShowPaymentModal(false)} onPaid={handlePaid} />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">✨ Resume Builder</h1>
              <p className="text-sm text-gray-600 mt-1">Create your professional resume</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Hi, {displayName}!</span>
              <button
                onClick={() => navigate('/templates')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Change Template
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition text-sm border border-green-200 flex items-center gap-2"
              >
                💾 Save
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition text-sm border border-red-200"
              >
                🗑️ Clear All
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to log out?')) {
                    signOut()
                    navigate('/')
                  }
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition text-sm"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE - FORM */}
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
                <span className="mr-2">👤</span> Personal Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Full Name
                  </label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Email
                  </label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Phone
                  </label>
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary Section */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
                <span className="mr-2">📝</span> Professional Summary
              </h2>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  About You (2-3 sentences)
                </label>
                <textarea 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. Recent computer science graduate with strong programming skills..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-500 mt-2">💡 Tip: Keep it concise and highlight your key strengths</p>
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
                <span className="mr-2">💼</span> Work Experience
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Company Name
                  </label>
                  <input 
                    type="text"
                    value={currentWork.company}
                    onChange={(e) => setCurrentWork({...currentWork, company: e.target.value})}
                    placeholder="e.g. TCS, Infosys, Wipro"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Job Title
                  </label>
                  <input 
                    type="text"
                    value={currentWork.jobTitle}
                    onChange={(e) => setCurrentWork({...currentWork, jobTitle: e.target.value})}
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Start Date
                    </label>
                    <input 
                      type="text"
                      value={currentWork.startDate}
                      onChange={(e) => setCurrentWork({...currentWork, startDate: e.target.value})}
                      placeholder="Jan 2024"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      End Date
                    </label>
                    <input 
                      type="text"
                      value={currentWork.endDate}
                      onChange={(e) => setCurrentWork({...currentWork, endDate: e.target.value})}
                      placeholder="Present"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Description
                  </label>
                  <textarea 
                    value={currentWork.description}
                    onChange={(e) => setCurrentWork({...currentWork, description: e.target.value})}
                    placeholder="Describe your responsibilities and achievements..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <button
                  onClick={addWorkExperience}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                >
                  + Add Work Experience
                </button>

                {workExperiences.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Added ({workExperiences.length}):</h3>
                    {workExperiences.map((exp, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{exp.jobTitle}</p>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                        </div>
                        <button
                          onClick={() => deleteWorkExperience(index)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm hover:bg-red-50 px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
                <span className="mr-2">🎓</span> Education
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    School Name
                  </label>
                  <input 
                    type="text"
                    value={currentEducation.school}
                    onChange={(e) => setCurrentEducation({...currentEducation, school: e.target.value})}
                    placeholder="e.g. IIT Delhi, NIT Trichy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Degree
                  </label>
                  <input 
                    type="text"
                    value={currentEducation.degree}
                    onChange={(e) => setCurrentEducation({...currentEducation, degree: e.target.value})}
                    placeholder="e.g. B.Tech in Computer Science"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Graduation Year
                  </label>
                  <input 
                    type="text"
                    value={currentEducation.gradYear}
                    onChange={(e) => setCurrentEducation({...currentEducation, gradYear: e.target.value})}
                    placeholder="e.g. 2025"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <button
                  onClick={addEducation}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                >
                  + Add Education
                </button>

                {educationList.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Added ({educationList.length}):</h3>
                    {educationList.map((edu, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{edu.school}</p>
                          <p className="text-sm text-gray-600">{edu.degree}</p>
                        </div>
                        <button
                          onClick={() => deleteEducation(index)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm hover:bg-red-50 px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
                <span className="mr-2">⚡</span> Skills
              </h2>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Your Skills (separate with commas)
                </label>
                <textarea 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. JavaScript, React, Python, Java, SQL"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-500 mt-2">💡 Tip: Separate each skill with a comma</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - TEMPLATE PREVIEW */}
          <div className="lg:sticky lg:top-8 h-fit">
            {selectedTemplate === 'modern' && <ModernTemplate />}
            {selectedTemplate === 'classic' && <ClassicTemplate />}
            {selectedTemplate === 'minimal' && <MinimalTemplate />}
            {selectedTemplate === 'creative' && <CreativeTemplate />}
            {selectedTemplate === 'professional' && <ProfessionalTemplate />}
            {selectedTemplate === 'sidebar' && <SidebarTemplate />}
            {selectedTemplate === 'elegant' && <ElegantTemplate />}
            {selectedTemplate === 'tech' && <TechTemplate />}
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default Builder