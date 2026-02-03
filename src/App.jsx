import { useState } from 'react'
import './App.css'

function App() {
  // Personal info state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  
  // Work experience state
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  // Education state
  const [school, setSchool] = useState('')
  const [degree, setDegree] = useState('')
  const [gradYear, setGradYear] = useState('')

  // Skills state
  const [skills, setSkills] = useState('')

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">My Resume Builder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT SIDE - FORM */}
        <div>
          {/* Personal Information Section */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Personal Information</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Full Name:
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Email:
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Phone:
              </label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Work Experience</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Company Name:
              </label>
              <input 
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Job Title:
              </label>
              <input 
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Start Date:
                </label>
                <input 
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g. Jan 2022"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  End Date:
                </label>
                <input 
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="e.g. Present"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Job Description:
              </label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Education</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                School Name:
              </label>
              <input 
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Harvard University"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Degree:
              </label>
              <input 
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. Bachelor of Science in Computer Science"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Graduation Year:
              </label>
              <input 
                type="text"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                placeholder="e.g. 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Skills</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Skills (separate with commas):
              </label>
              <textarea 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. JavaScript, React, Python, SQL, Leadership"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Tip: Separate each skill with a comma</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - LIVE PREVIEW */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-gray-300 pb-2">
            Live Preview
          </h2>
          
          {/* Personal Info Preview */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {name || 'Your Name'}
            </h3>
            <p className="text-sm text-gray-600">{email || 'your.email@example.com'}</p>
            <p className="text-sm text-gray-600">{phone || '(123) 456-7890'}</p>
          </div>

          {/* Work Experience Preview */}
          {(company || jobTitle || startDate || endDate || jobDescription) && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3 border-b border-gray-300 pb-1">
                Work Experience
              </h3>
              <div>
                <p className="font-semibold text-gray-800">{jobTitle || 'Job Title'}</p>
                <p className="text-sm text-gray-600">{company || 'Company Name'}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {startDate || 'Start Date'} - {endDate || 'End Date'}
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {jobDescription || 'Job description will appear here...'}
                </p>
              </div>
            </div>
          )}

          {/* Education Preview */}
          {(school || degree || gradYear) && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3 border-b border-gray-300 pb-1">
                Education
              </h3>
              <div>
                <p className="font-semibold text-gray-800">{school || 'School Name'}</p>
                <p className="text-sm text-gray-600">{degree || 'Degree'}</p>
                <p className="text-sm text-gray-500">{gradYear || 'Graduation Year'}</p>
              </div>
            </div>
          )}

          {/* Skills Preview */}
          {skills && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3 border-b border-gray-300 pb-1">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.split(',').map((skill, index) => (
                  skill.trim() && (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
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
  )
}

export default App