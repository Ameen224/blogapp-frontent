// src/components/admin/category-modal

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { LoadingSpinner } from "../ui/loading-spinner"
import api from "../../lib/api"

export function CategoryModal({ onClose, onCategoryAdded, existingCategories }) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.name.trim() || !formData.icon.trim()) {
      setError("Both name and icon are required")
      setLoading(false)
      return
    }

    // Check if category already exists
    const exists = existingCategories.some((cat) => cat.name.toLowerCase() === formData.name.toLowerCase())
    if (exists) {
      setError("Category already exists")
      setLoading(false)
      return
    }

    try {
      const response = await api.post("/admin/categories", {
        name: formData.name.trim(),
        icon: formData.icon.trim(),
      })

      if (response.data.success) {
        onCategoryAdded(response.data.category)
      } else {
        setError(response.data.message || "Failed to add category")
      }
    } catch (err) {
      console.error("Error adding category:", err)
      setError(err.response?.data?.message || "Server error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Technology"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="icon">Icon (Emoji)</Label>
            <Input
              id="icon"
              name="icon"
              type="text"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g., 💻"
              required
              disabled={loading}
              maxLength={2}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Adding...
                </div>
              ) : (
                "Add Category"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
