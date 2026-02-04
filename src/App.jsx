import { useState, useEffect } from 'react'
import './App.css'

function App() {
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
        console.log('✅ Data loaded from localStorage')
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [])

  // Manual save function
  const handleSave = () => {
    const dataToSave = {
      name,
      email,
      phone,
      summary,
      workExperiences,
      educationList,
      skills
    }
    localStorage.setItem('resumeData', JSON.stringify(dataToSave))
    alert('✅ Resume saved to browser!')
    console.log('Saved data:', dataToSave)
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

  // Placeholder download function
  const handleDownload = () => {
    alert('PDF download feature coming soon! (Week 6-7)')
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
      alert('All data cleared!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">✨ Resume Builder</h1>
              <p className="text-sm text-gray-600 mt-1">Create your professional resume in minutes</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <p className="text-xs text-gray-500">Built by Baishali Roy</p>
                <p className="text-xs text-blue-600 font-semibold">Free • No Sign-up Required</p>
              </div>
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
                    placeholder="+1 (555) 123-4567"
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
                  placeholder="e.g. Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code and user experience."
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
                    placeholder="e.g. Google, Microsoft"
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
                    placeholder="e.g. Software Engineer"
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
                      placeholder="Jan 2022"
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
                    placeholder="e.g. Harvard University"
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
                    placeholder="e.g. Bachelor of Science in Computer Science"
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
                    placeholder="e.g. 2024"
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
                  placeholder="e.g. JavaScript, React, Python, SQL, Leadership"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-500 mt-2">💡 Tip: Separate each skill with a comma</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - LIVE PREVIEW */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="p-6 bg-white rounded-xl shadow-xl border border-gray-200">
              {/* Download Button */}
              <div className="mb-6">
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center justify-center"
                >
                  <span className="mr-2">📥</span> Download PDF
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">Feature coming in Week 6-7</p>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                  <span className="mr-2">👁️</span> Live Preview
                </h2>
                
                {/* Personal Info Preview */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {name || 'Your Name'}
                  </h3>
                  <p className="text-sm text-gray-600">{email || 'your.email@example.com'}</p>
                  <p className="text-sm text-gray-600">{phone || '(123) 456-7890'}</p>
                </div>

                {/* Professional Summary Preview */}
                {summary && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
                      Professional Summary
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                )}

                {/* Work Experience Preview */}
                {workExperiences.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                      Work Experience
                    </h3>
                    <div className="space-y-4">
                      {workExperiences.map((exp, index) => (
                        <div key={index}>
                          <p className="font-bold text-gray-900">{exp.jobTitle}</p>
                          <p className="text-sm text-gray-700 font-medium">{exp.company}</p>
                          <p className="text-xs text-gray-500 mb-2">
                            {exp.startDate} - {exp.endDate}
                          </p>
                          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Preview */}
                {educationList.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                      Education
                    </h3>
                    <div className="space-y-3">
                      {educationList.map((edu, index) => (
                        <div key={index}>
                          <p className="font-bold text-gray-900">{edu.school}</p>
                          <p className="text-sm text-gray-700">{edu.degree}</p>
                          <p className="text-xs text-gray-500">{edu.gradYear}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Preview */}
                {skills && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.split(',').map((skill, index) => (
                        skill.trim() && (
                          <span 
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 rounded-full text-sm font-semibold border border-blue-200"
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default App