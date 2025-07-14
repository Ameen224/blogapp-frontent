// src/pages/admin/AdminSignup.js

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { setCredentials } from "../../lib/authSlice"
import { LoadingSpinner } from "../../components/ui/loading-spinner"

export default function AuthSuccess() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const data = searchParams.get("data")
        if (data) {
          const authData = JSON.parse(decodeURIComponent(data))
          console.log("Auth success data:", authData)
          dispatch(setCredentials(authData))

          if (window.opener) {
            window.opener.postMessage(
              {
                type: "AUTH_SUCCESS",
                payload: authData,
              },
              import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000",
            )
            window.close()
          } else {
            if (!authData.user.name || !authData.user.category) {
              navigate("/profile-setup")
            } else {
              navigate("/home")
            }
          }
        } else {
          const error = searchParams.get("error")
          console.error("Auth error:", error)
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "AUTH_ERROR",
                message: error || "Authentication failed",
              },
              import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000",
            )
            window.close()
          } else {
            navigate("/?error=" + (error || "auth_failed"))
          }
        }
      } catch (err) {
        console.error("Error processing auth success:", err)
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "AUTH_ERROR",
              message: "Failed to process authentication",
            },
            import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000",
          )
          window.close()
        } else {
          navigate("/?error=processing_failed")
        }
      }
    }

    handleAuthSuccess()
  }, [dispatch, navigate, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4">
        <LoadingSpinner size="lg" className="mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Authentication</h2>
        <p className="text-gray-600">Please wait while we complete your login...</p>
      </div>
    </div>
  )
}
