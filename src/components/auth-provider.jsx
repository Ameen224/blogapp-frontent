// src/auth-provider.jsx

import { useEffect } from "react"
import { useAuthCheck } from "../hooks/useAuthCheck"
import { LoadingSpinner } from "../components/ui/loading-spinner"

export function AuthProvider({ children }) {
  const { isLoading, checkAuth } = useAuthCheck()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
}
