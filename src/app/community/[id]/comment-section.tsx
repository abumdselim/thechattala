'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { createComment } from '@/app/actions/posts'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string | null
    email: string
    verified: boolean
    image: string | null
  }
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  currentUser: {
    id: string
    name: string | null
    email: string
    image: string | null
  } | null
}

export function CommentSection({ postId, comments, currentUser }: CommentSectionProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      toast.error('Please log in to comment')
      return
    }

    if (!content.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      setLoading(true)
      await createComment(postId, content)
      setContent('')
      toast.success('Comment added!')
      router.refresh()
    } catch (error) {
      console.error('Comment error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !content.trim()}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Comment
              </Button>
            </form>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-600 mb-4">Please log in to leave a comment</p>
              <Link href="/auth/login">
                <Button>Log In</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.image || undefined} />
                    <AvatarFallback>{comment.author.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{comment.author.name || 'Unknown User'}</span>
                      {comment.author.verified && (
                        <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500" />
                      )}
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
