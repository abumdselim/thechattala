import { notFound } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { getPost, getPosts } from "@/lib/actions/post-actions"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostCard } from "@/components/community/post-card"
import { ArrowLeft, Clock, CheckCircle, Loader2 } from "lucide-react"
import type { PostWithRelations } from "@/types"
import { PostActions } from "./post-actions"
import Image from "next/image"

export const dynamic = 'force-dynamic'

interface PostPageProps {
  params: Promise<{ postId: string }>
}

export async function generateMetadata({ params }: PostPageProps) {
  const { postId } = await params
  const result = await getPost(postId)
  
  if (!result.success || !result.data) {
    return {
      title: "Post Not Found - The Chattala",
    }
  }

  return {
    title: `${result.data.title} - The Chattala`,
    description: result.data.content.substring(0, 160),
  }
}

async function getRelatedPosts(categoryId: string, currentPostId: string) {
  const result = await getPosts({ categoryId })
  if (result.success && result.data) {
    return result.data.filter((p: PostWithRelations) => p.id !== currentPostId).slice(0, 3)
  }
  return []
}

async function PostContent({ postId }: { postId: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const result = await getPost(postId)
  
  if (!result.success || !result.data) {
    notFound()
  }

  const post = result.data as PostWithRelations
  const isOwner = user?.email === post.author.email

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/community">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Post Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {post.images && post.images.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                  <Image
                    src={post.images[0]}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thumbnail Gallery */}
                {post.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {post.images.slice(1, 5).map((image: string, index: number) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={image}
                          alt={`${post.title} ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Post Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {post.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{post.category.name}</Badge>
                      {post.isVerified && (
                        <Badge className="bg-green-500 text-white border-0">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Posted {formatDate(post.createdAt)}</span>
                </div>

                <div className="border-t pt-4">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Author Info & Actions */}
        <div className="space-y-6">
          {/* Author Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Posted By</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author.image || undefined} />
                    <AvatarFallback style={{ backgroundColor: '#0891B2' }} className="text-white">
                      {getUserInitials(post.author.name || undefined, post.author.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {post.author.name || 'Anonymous'}
                    </div>
                    {post.author.location && (
                      <div className="text-sm text-gray-600">
                        {post.author.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner Actions */}
          {isOwner && (
            <PostActions 
              postId={post.id} 
              authorId={user?.email || ''}
            />
          )}
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Related Posts</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost: PostWithRelations) => (
              <PostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = await params

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
        </div>
      }
    >
      <PostContent postId={postId} />
    </Suspense>
  )
}
