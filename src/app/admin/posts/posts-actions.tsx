'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { pinPost, unpinPost, deletePost } from '@/app/actions/admin'
import { toast } from 'sonner'

interface Post {
  id: string
  title: string
  pinned: boolean
}

export function PostsActions({ post }: { post: Post }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handlePin = async () => {
    setLoading(true)
    try {
      if (post.pinned) {
        await unpinPost(post.id)
        toast.success('Post unpinned')
      } else {
        await pinPost(post.id)
        toast.success('Post pinned')
      }
      router.refresh()
    } catch {
      toast.error('Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deletePost(post.id)
      toast.success('Post deleted successfully')
      setShowDeleteDialog(false)
      router.refresh()
    } catch {
      toast.error('Failed to delete post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant={post.pinned ? 'outline' : 'default'}
          onClick={handlePin}
          disabled={loading}
        >
          {post.pinned ? 'Unpin' : 'Pin'}
        </Button>
        
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          disabled={loading}
        >
          Delete
        </Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{post.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
