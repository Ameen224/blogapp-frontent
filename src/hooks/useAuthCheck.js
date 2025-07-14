// src/hooks/useAuthCheck.js
import { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { setCredentials, setAdminCredentials, logout } from "../lib/authSlice"
import api from "../lib/api"

export const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true)

      // Check for regular user authentication
      try {
        const userResponse = await api.get("/auth/refresh")
        if (userResponse.data) {
          dispatch(setCredentials(userResponse.data))
          return
        }
      } catch (userError) {
        console.log("User auth failed, checking admin...")
      }

      // Check for admin authentication
      try {
        const adminResponse = await api.get("/admin/refresh")
        if (adminResponse.data) {
          dispatch(setAdminCredentials(adminResponse.data))
          return
        }
      } catch (adminError) {
        console.log("Admin auth also failed")
      }

      // If both fail, clear any existing auth state
      dispatch(logout())
    } catch (error) {
      console.error("Auth check failed:", error)
      dispatch(logout())
    } finally {
      setIsLoading(false)
    }
  }, [dispatch])

  return { isLoading, checkAuth }
}
