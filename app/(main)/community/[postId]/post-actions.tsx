"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deletePost } from "@/lib/actions/post-actions"
import { Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"

interface PostActionsProps {
  postId: string
  authorId: string
}

export function PostActions({ postId, authorId }: PostActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    const result = await deletePost(postId, authorId)
    
    if (result.success) {
      router.push('/community')
      router.refresh()
    } else {
      alert(result.error || 'Failed to delete post')
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Manage Post</h2>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            asChild
            disabled={loading}
          >
            <Link href={`/community/${postId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </Link>
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Post
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
