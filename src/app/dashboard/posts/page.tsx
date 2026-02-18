import { getUserPosts } from '@/app/actions/posts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Plus, Eye, Edit, MessageSquare, Calendar } from 'lucide-react'
import { DeletePostButton } from './delete-post-button'

export default async function PostsPage() {
  const posts = await getUserPosts()

  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
          <Link href="/community/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </Link>
        </div>
        <EmptyState
          icon={FileText}
          title="No posts yet"
          description="Share your thoughts and experiences with the TheChattala community."
          action={{
            label: 'Create Post',
            href: '/community/create',
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600 mt-1">
            Manage your posts ({posts.length} total)
          </p>
        </div>
        <Link href="/community/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-md transition">
            {post.image && (
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-5">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                {post.title}
              </h3>
              
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                {post.content.length > 150 && '...'}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {post._count.comments} comments
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/community/${post.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/community/${post.id}/edit`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </Link>
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
