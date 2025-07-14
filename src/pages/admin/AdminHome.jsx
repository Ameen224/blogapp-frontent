// src/pages/admin/AdminHome.jsx

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AdminNavbar } from "../../components/admin/admin-navbar"
import { CategoryModal } from "../../components/admin/category-modal"
import { UserList } from "../../components/admin/user-list"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { LoadingSpinner } from "../../components/ui/loading-spinner"
import api from "../../lib/api"

export default function AdminHome() {
  const admin = useSelector((state) => state.auth.admin)
  const navigate = useNavigate()
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login")
    } else {
      fetchUsers()
      fetchCategories()
    }
  }, [admin, navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/users")
      setUsers(response.data.users)
    } catch (err) {
      setError("Failed to fetch users")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories")
      setCategories(response.data.categories)
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  const handleCategoryAdded = (newCategory) => {
    setCategories((prev) => [...prev, newCategory])
    setShowCategoryModal(false)
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${userId}`)
        setUsers((prev) => prev.filter((user) => user._id !== userId))
      } catch (err) {
        alert("Failed to delete user")
      }
    }
  }

  if (!admin) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar onCategoryClick={() => setShowCategoryModal(true)} />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  const activeToday = users.filter((user) => {
    const today = new Date()
    const userLastActive = new Date(user.updatedAt)
    return today.toDateString() === userLastActive.toDateString()
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar onCategoryClick={() => setShowCategoryModal(true)} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {admin?.name || admin?.email}</p>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{categories.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">Active Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{activeToday}</p>
            </CardContent>
          </Card>
        </div>

        <UserList users={users} onDeleteUser={handleDeleteUser} />
      </div>

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onCategoryAdded={handleCategoryAdded}
          existingCategories={categories}
        />
      )}
    </div>
  )
}
