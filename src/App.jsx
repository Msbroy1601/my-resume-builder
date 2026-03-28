import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp, AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
import Home from './pages/Home'
import TemplateGallery from './pages/TemplateGallery'
import Builder from './pages/Builder'
import CoverLetter from './pages/CoverLetter'

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

// Redirect already signed-in users away from login/signup pages
function PublicRoute({ children }) {
  return (
    <>
      <SignedIn><Navigate to="/templates" replace /></SignedIn>
      <SignedOut>{children}</SignedOut>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup/sso-callback" element={<AuthenticateWithRedirectCallback signInForceRedirectUrl="/templates" signUpForceRedirectUrl="/templates" />} />
      
      {/* Clerk's built-in auth pages — redirect to /templates if already signed in */}
      <Route
        path="/signup/*"
        element={
          <PublicRoute>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <SignUp routing="path" path="/signup" signInUrl="/login" forceRedirectUrl="/templates" />
            </div>
          </PublicRoute>
        }
      />
      <Route
        path="/login/*"
        element={
          <PublicRoute>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <SignIn routing="path" path="/login" signUpUrl="/signup" forceRedirectUrl="/templates" />
            </div>
          </PublicRoute>
        }
      />
      
      <Route 
        path="/templates" 
        element={
          <ProtectedRoute>
            <TemplateGallery />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/builder"
        element={
          <ProtectedRoute>
            <Builder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cover-letter"
        element={
          <ProtectedRoute>
            <CoverLetter />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
