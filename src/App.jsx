import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp, AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
import Home from './pages/Home'
import TemplateGallery from './pages/TemplateGallery'
import ResumeTemplates from './pages/ResumeTemplates'
import CVTemplates from './pages/CVTemplates'
import CoverLetterTemplates from './pages/CoverLetterTemplates'
import Builder from './pages/Builder'
import CoverLetter from './pages/CoverLetter'
import Dashboard from './pages/Dashboard'
import ResumeTips from './pages/ResumeTips'
import CoverLetterTips from './pages/CoverLetterTips'

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  )
}

function PublicRoute({ children }) {
  return (
    <>
      <SignedIn><Navigate to="/resume-templates" replace /></SignedIn>
      <SignedOut>{children}</SignedOut>
    </>
  )
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/resume-templates"       element={<ResumeTemplates />} />
      <Route path="/cv-templates"           element={<CVTemplates />} />
      <Route path="/cover-letter-templates" element={<CoverLetterTemplates />} />
      <Route path="/resume-tips"            element={<ResumeTips />} />
      <Route path="/cover-letter-tips"      element={<CoverLetterTips />} />

      {/* Auth */}
      <Route path="/signup/sso-callback" element={<AuthenticateWithRedirectCallback signInForceRedirectUrl="/resume-templates" signUpForceRedirectUrl="/resume-templates" />} />
      <Route path="/signup/*" element={
        <PublicRoute>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <SignUp routing="path" path="/signup" signInUrl="/login" forceRedirectUrl="/resume-templates" />
          </div>
        </PublicRoute>
      } />
      <Route path="/login/*" element={
        <PublicRoute>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <SignIn routing="path" path="/login" signUpUrl="/signup" forceRedirectUrl="/resume-templates" />
          </div>
        </PublicRoute>
      } />

      {/* Legacy /templates → redirect to resume-templates */}
      <Route path="/templates" element={<Navigate to="/resume-templates" replace />} />

      {/* Protected app */}
      <Route path="/builder"      element={<ProtectedRoute><Builder /></ProtectedRoute>} />
      <Route path="/cover-letter" element={<ProtectedRoute><CoverLetter /></ProtectedRoute>} />
      <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
