// src/pages/user/Welcome.jsx 

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Navbar } from "../components/common/Navbar"
import { Footer } from "../components/common/Footer"
import { SignupModal } from "../components/modals/SignupModal"
import { Button } from "../components/ui/button"
import { Alert, AlertDescription } from "../components/ui/alert"
import { X } from "lucide-react"

export default function Welcome() {
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [authError, setAuthError] = useState("")

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      switch (error) {
        case "auth_failed":
          setAuthError("Authentication failed. Please try again.")
          break
        case "no_user":
          setAuthError("No user information received. Please try again.")
          break
        case "server_error":
          setAuthError("Server error occurred. Please try again later.")
          break
        case "processing_failed":
          setAuthError("Failed to process authentication. Please try again.")
          break
        default:
          setAuthError("An error occurred during authentication.")
      }
      // Clear the error from URL
      navigate("/", { replace: true })
    }
  }, [searchParams, navigate])

  useEffect(() => {
    if (user) {
      if (!user.name || !user.category) {
        navigate("/profile-setup")
      } else {
        navigate("/home")
      }
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-8">
        {authError && (
          <Alert className="mb-8 max-w-md bg-red-50 border-red-200">
            <AlertDescription className="flex items-center justify-between">
              <span className="text-red-700">{authError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthError("")}
                className="ml-4 text-red-500 hover:text-red-700 h-auto p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold leading-tight mb-8 text-gray-900">
            Write with purpose & <br />
            <span className="text-blue-600">Read with curiosity.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of writers and readers in a community that celebrates knowledge, creativity, and meaningful
            conversations.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            className="px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </main>
      <Footer />
      {showModal && <SignupModal onClose={() => setShowModal(false)} />}
    </div>
  )
}