import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageSquare, Plus, Pin, Search, CheckCircle2 } from 'lucide-react'
import { getPosts } from '@/app/actions/posts'
import { formatDistanceToNow } from 'date-fns'

interface SearchParams {
  search?: string
  pinnedOnly?: string
  page?: string
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const search = params.search || ''
  const pinnedOnly = params.pinnedOnly === 'true'
  const page = Number(params.page) || 1

  const { posts, pagination } = await getPosts({
    search,
    page,
    limit: 20,
  })

  const displayPosts = pinnedOnly ? posts.filter(p => p.pinned) : posts

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
              <p className="text-gray-600 mt-2">Connect with your neighbors</p>
            </div>
            <Link href="/community/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <form className="flex-1" action="/community" method="get">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  defaultValue={search}
                  placeholder="Search posts..."
                  className="pl-10"
                />
              </div>
            </form>
            <form action="/community" method="get">
              {search && <input type="hidden" name="search" value={search} />}
              <Button
                type="submit"
                variant={pinnedOnly ? 'default' : 'outline'}
                className="whitespace-nowrap"
              >
                <Pin className="h-4 w-4 mr-2" />
                {pinnedOnly ? 'Show All' : 'Pinned Only'}
                <input type="hidden" name="pinnedOnly" value={pinnedOnly ? '' : 'true'} />
              </Button>
            </form>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {displayPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No posts found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {search ? 'Try a different search term' : 'Be the first to create a post!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            displayPosts.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Post Image */}
                      {post.image && (
                        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Post Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {post.pinned && (
                                <Pin className="h-4 w-4 text-orange-500 fill-orange-500" />
                              )}
                              <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                                {post.title}
                              </h2>
                            </div>
                            <p className="text-gray-600 line-clamp-2">
                              {post.content.slice(0, 150)}
                              {post.content.length > 150 && '...'}
                            </p>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{post.author.name || 'Unknown User'}</span>
                            {post.author.verified && (
                              <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500" />
                            )}
                          </div>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post._count.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {page > 1 && (
              <Link href={`/community?page=${page - 1}${search ? `&search=${search}` : ''}`}>
                <Button variant="outline">Previous</Button>
              </Link>
            )}
            <div className="flex items-center gap-2 px-4">
              Page {page} of {pagination.totalPages}
            </div>
            {page < pagination.totalPages && (
              <Link href={`/community?page=${page + 1}${search ? `&search=${search}` : ''}`}>
                <Button variant="outline">Next</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
