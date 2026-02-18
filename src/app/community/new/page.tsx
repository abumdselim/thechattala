'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/ui/image-upload'
import { createPost } from '@/app/actions/posts'
import { ArrowLeft, Loader2 } from 'lucide-react'

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  titleBn: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image: z.string().optional(),
})

type PostFormData = z.infer<typeof postSchema>

export default function NewPostPage() {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  })

  const onSubmit = async (data: PostFormData) => {
    try {
      setLoading(true)

      const post = await createPost({
        ...data,
        image: images[0], // Single image
      })

      toast.success('Post created successfully!')
      router.push(`/community/${post.id}`)
      router.refresh()
    } catch (error) {
      console.error('Create post error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              TheChattala <span className="text-sm font-normal text-gray-500">চট্টলা</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/marketplace">
                <Button variant="ghost">Marketplace</Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost">Community</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/community" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Community
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter post title"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Title (Bangla) */}
              <div>
                <Label htmlFor="titleBn">Title (বাংলা)</Label>
                <Input
                  id="titleBn"
                  {...register('titleBn')}
                  placeholder="শিরোনাম (ঐচ্ছিক)"
                  className="mt-1"
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  placeholder="Write your post content..."
                  rows={8}
                  className="mt-1"
                />
                {errors.content && (
                  <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <Label>Image (Optional)</Label>
                <ImageUpload
                  value={images}
                  onChange={setImages}
                  maxImages={1}
                  folder="posts"
                  className="mt-1"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Post
                </Button>
                <Link href="/community">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
