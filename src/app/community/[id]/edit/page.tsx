'use client'

import { useState, useEffect } from 'react'
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
import { updatePost, deletePost } from '@/app/actions/posts'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  titleBn: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image: z.string().optional(),
})

type PostFormData = z.infer<typeof postSchema>

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const [postId, setPostId] = useState<string>('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  })

  useEffect(() => {
    async function loadPost() {
      try {
        const { id } = await params
        setPostId(id)
        
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) {
          throw new Error('Failed to load post')
        }
        
        const data = await response.json()
        
        if (!data.isAuthor) {
          toast.error('Unauthorized: You can only edit your own posts')
          router.push(`/community/${id}`)
          return
        }

        setIsAuthorized(true)
        setValue('title', data.post.title)
        setValue('titleBn', data.post.titleBn || '')
        setValue('content', data.post.content)
        if (data.post.image) {
          setImages([data.post.image])
        }
      } catch (error) {
        console.error('Load post error:', error)
        toast.error('Failed to load post')
        router.push('/community')
      } finally {
        setLoadingPost(false)
      }
    }

    loadPost()
  }, [params, router, setValue])

  const onSubmit = async (data: PostFormData) => {
    try {
      setLoading(true)

      await updatePost(postId, {
        ...data,
        image: images[0] || undefined,
      })

      toast.success('Post updated successfully!')
      router.push(`/community/${postId}`)
      router.refresh()
    } catch (error) {
      console.error('Update post error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deletePost(postId)
      toast.success('Post deleted successfully!')
      router.push('/community')
      router.refresh()
    } catch (error) {
      console.error('Delete post error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete post')
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
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
        <Link
          href={`/community/${postId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Post
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Post</CardTitle>
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
                  Update Post
                </Button>
                <Link href={`/community/${postId}`}>
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
              </div>

              {/* Delete Button */}
              <div className="pt-6 border-t">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
