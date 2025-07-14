// src/pages/user/Home.jsx

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/common/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import api from "@/lib/api"

export default function Home() {
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalReads: 0,
    totalWrites: 0,
    followers: 0,
    following: 0,
  })

  useEffect(() => {
    if (!user) {
      navigate("/")
    } else if (!user.name || !user.category) {
      navigate("/profile-setup")
    } else {
      fetchUserStats()
    }
  }, [user, navigate])

  const fetchUserStats = async () => {
    try {
      const response = await api.get("/user/stats")
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      tech: "💻",
      lifestyle: "🌱",
      education: "📚",
      business: "💼",
      health: "🏥",
      science: "🔬",
      arts: "🎨",
      sports: "⚽",
      travel: "✈️",
      food: "🍳",
    }
    return icons[category] || "📖"
  }

  if (!user || !user.name || !user.category) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}! 🎉</h1>
                <p className="text-gray-600 text-lg">Ready to explore and share knowledge today?</p>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalReads}</div>
              <div className="text-gray-600">Articles Read</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalWrites}</div>
              <div className="text-gray-600">Articles Written</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.followers}</div>
              <div className="text-gray-600">Followers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.following}</div>
              <div className="text-gray-600">Following</div>
            </CardContent>
          </Card>
        </div>

        {/* Interests Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Your Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {user?.category?.map((cat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 text-center border border-blue-200"
                >
                  <div className="text-2xl mb-2">{getCategoryIcon(cat)}</div>
                  <div className="text-sm font-medium text-gray-700 capitalize">{cat}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">✍️ Write New Article</Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 py-3">📚 Browse Articles</Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 py-3">👥 Discover Writers</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  📖
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Welcome to ReadFlow!</div>
                  <div className="text-xs text-gray-500">Complete your profile to get started</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                  ✨
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Account Created</div>
                  <div className="text-xs text-gray-500">Your reading journey begins now</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
