// src/pages/user/ProfileSetup.jsx

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/common/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { setCredentials } from "../lib/authSlice"
import api from "@/lib/api"

const defaultCategories = [
  { id: "tech", name: "Technology", icon: "💻" },
  { id: "lifestyle", name: "Lifestyle", icon: "🌱" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "health", name: "Health", icon: "🏥" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "arts", name: "Arts & Culture", icon: "🎨" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "food", name: "Food & Cooking", icon: "🍳" },
]

export default function ProfileSetup() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/")
    } else if (user.name && user.category) {
      navigate("/home")
    }
    fetchCategories()
  }, [user, navigate])

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories")
      if (response.data.success) {
        setAvailableCategories(response.data.categories)
      } else {
        setAvailableCategories(defaultCategories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setAvailableCategories(defaultCategories)
    }
  }

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!name.trim()) {
      setError("Name is required")
      setLoading(false)
      return
    }

    if (selectedCategories.length === 0) {
      setError("Please select at least one category")
      setLoading(false)
      return
    }

    try {
      const response = await api.post("/user/profile", {
        name: name.trim(),
        category: selectedCategories,
      })

      if (response.data.success) {
        setSuccess("Profile updated successfully!")
        // Update user in Redux store
        if (user) {
          dispatch(
            setCredentials({
              accessToken: user.accessToken || "",
              user: { ...user, name: name.trim(), category: selectedCategories },
            }),
          )
        }
        setTimeout(() => navigate("/home"), 1000)
      } else {
        setError(response.data.message || "Failed to update profile")
      }
    } catch (err) {
      console.error("Profile update error:", err)
      setError(err.response?.data?.message || "Server error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!user || (user.name && user.category)) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">Tell us about yourself to get personalized content</p>
          </div>

          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full p-4"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-4">
                Select Your Interests (Choose multiple)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableCategories.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant="outline"
                    onClick={() => handleCategoryToggle(category.id)}
                    disabled={loading}
                    className={`p-4 h-auto text-left hover:shadow-md transition-all ${
                      selectedCategories.includes(category.id)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Selected: {selectedCategories.length} categor{selectedCategories.length !== 1 ? "ies" : "y"}
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full py-4 font-semibold">
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Updating Profile...
                </div>
              ) : (
                "Save and Continue"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
