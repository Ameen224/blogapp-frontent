// src/App.jsx

import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./components/auth-provider"
import { ErrorBoundary } from "./components/ui/error-boundary"

// Pages
import Welcome from "./pages/Welcome"
import ProfileSetup from "./pages/ProfileSetup"
import Home from "./pages/Home"
import AuthSuccess from "./pages/AuthSuccess"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminRegister from "./pages/admin/AdminSignup"
import AdminHome from "./pages/admin/AdminHome"

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/home" element={<AdminHome />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App