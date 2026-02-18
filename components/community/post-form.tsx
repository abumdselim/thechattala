"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createPost, updatePost } from "@/lib/actions/post-actions"
import type { PostWithRelations } from "@/types"
import { Loader2, ImagePlus, X } from "lucide-react"
import Image from "next/image"

interface PostFormProps {
  userId: string
  categories: Array<{ id: string; name: string }>
  post?: PostWithRelations
}

export function PostForm({ userId, categories, post }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    categoryId: post?.categoryId || categories[0]?.id || '',
    images: post?.images || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = {
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId,
        images: formData.images,
      }

      let result
      if (post) {
        result = await updatePost(post.id, userId, data)
      } else {
        result = await createPost(userId, data)
      }

      if (result.success) {
        router.push(post ? `/community/${post.id}` : '/community')
        router.refresh()
      } else {
        setError(result.error || 'Failed to save post')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      setFormData({
        ...formData,
        images: [...formData.images, url],
      })
    }
  }

  const handleImageRemove = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_: string, i: number) => i !== index),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title"
              required
              minLength={3}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your thoughts, news, or announcements..."
              rows={8}
              required
              minLength={10}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0891B2] focus:outline-none focus:ring-1 focus:ring-[#0891B2]"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Images (Optional)</Label>
            <div className="space-y-2">
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {formData.images.map((image: string, index: number) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-md border">
                      <Image
                        src={image}
                        alt={`Upload ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={() => handleImageRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleImageUrlAdd}
                className="w-full"
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Add Image URL
              </Button>
              <p className="text-xs text-gray-500">
                Click to add image URLs. Image upload feature coming soon.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              style={{ backgroundColor: '#0891B2' }}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {post ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
