'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post, Category } from '@prisma/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deletePost } from '@/lib/actions/post-actions'
import { useRouter } from 'next/navigation'

type PostWithCategory = Post & {
  category: Category
}

interface UserPostsProps {
  posts: PostWithCategory[]
  userId: string
}

export function UserPosts({ posts, userId }: UserPostsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setLoading(postId)
    const result = await deletePost(postId, userId)
    setLoading(null)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Failed to delete post')
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">You haven't created any posts yet.</p>
        <Link href="/community/new">
          <Button>Create Your First Post</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
              {post.isVerified && (
                <Badge variant="default">Verified</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {post.content}
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{post.category.name}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1"
            >
              <Link href={`/community/${post.id}`}>View</Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(post.id)}
              disabled={loading === post.id}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
