// src/components/common/Navbar.jsx

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../ui/button"
import { SignupModal } from "../modals/SignupModal"
import { logout } from "../../lib/authSlice"
import api from "../../lib/api"

export function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)

  const handleLogout = async () => {
    try {
      await api.post("/user/logout")
      dispatch(logout())
    } catch (err) {
      console.error("Logout failed:", err)
      dispatch(logout()) // Logout anyway
    }
  }

  return (
    <>
      <nav className="flex justify-between items-center p-8 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">ReadFlow.</h1>
        <div className="flex gap-4 items-center">
          <span className="text-base text-gray-600">📝 Write</span>
          {user ? (
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          ) : (
            <Button onClick={() => setShowModal(true)} className="bg-blue-400 hover:bg-blue-500">
              Get Started
            </Button>
          )}
        </div>
      </nav>
      {showModal && <SignupModal onClose={() => setShowModal(false)} />}
    </>
  )
}
