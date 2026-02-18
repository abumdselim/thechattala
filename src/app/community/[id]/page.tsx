import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle2, Edit, Calendar, MessageSquare, ArrowLeft } from 'lucide-react'
import { getPost } from '@/app/actions/posts'
import { getCurrentUser } from '@/lib/auth'
import { formatDistanceToNow, format } from 'date-fns'
import { CommentSection } from './comment-section'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const { id } = await params
    
    const [post, currentUser] = await Promise.all([
      getPost(id),
      getCurrentUser(),
    ])

    const isAuthor = currentUser?.id === post.authorId

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/community" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Community
          </Link>

          {/* Post Content */}
          <Card className="mb-6">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author.image || undefined} />
                    <AvatarFallback>{post.author.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{post.author.name || 'Unknown User'}</h3>
                      {post.author.verified && (
                        <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(post.createdAt), 'PPP')}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {isAuthor && (
                  <Link href={`/community/${id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
              {post.titleBn && (
                <p className="text-xl text-gray-700 mb-4">{post.titleBn}</p>
              )}

              {/* Image */}
              {post.image && (
                <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100 mb-6">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">{post.comments.length} comments</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <CommentSection
            postId={post.id}
            comments={post.comments}
            currentUser={currentUser}
          />
        </div>
      </div>
    )
  } catch {
    notFound()
  }
}
