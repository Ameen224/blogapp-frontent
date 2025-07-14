// src/components/admin/admin-navbar

import { useDispatch } from "react-redux"
import { Button } from "../ui/button"
import { logout } from "../../lib/authSlice"
import api from "../../lib/api"

export function AdminNavbar({ onCategoryClick }) {
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout")
      dispatch(logout())
    } catch (err) {
      console.error("Logout failed:", err)
      dispatch(logout()) // Logout anyway
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">ReadFlow Admin</h1>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={onCategoryClick}>
                Manage Categories
              </Button>
            </div>
          </div>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
