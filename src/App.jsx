import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react'
import Home from './pages/Home'
import TemplateGallery from './pages/TemplateGallery'
import Builder from './pages/Builder'

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* Clerk's built-in auth pages */}
      <Route 
        path="/signup/*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <SignUp routing="path" path="/signup" signInUrl="/login" afterSignUpUrl="/templates" />
          </div>
        } 
      />
      <Route 
        path="/login/*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <SignIn routing="path" path="/login" signUpUrl="/signup" afterSignInUrl="/templates" />
          </div>
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
    </Routes>
  )
}

export default App