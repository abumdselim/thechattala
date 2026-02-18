"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/community/post-card"
import { PostFilters } from "@/components/community/post-filters"
import { getPosts } from "@/lib/actions/post-actions"
import { createClient } from "@/lib/supabase/client"
import type { PostWithRelations, PostFilters as FilterType } from "@/types"
import { Plus, Loader2, FileText } from "lucide-react"

interface CommunityClientProps {
  initialPosts: PostWithRelations[]
  categories: Array<{ id: string; name: string; slug: string }>
}

export function CommunityClient({ initialPosts, categories }: CommunityClientProps) {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [posts, setPosts] = useState<PostWithRelations[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<FilterType>({})
  const [showFilters, setShowFilters] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const result = await getPosts(filters)
      if (result.success) {
        setPosts(result.data as PostWithRelations[])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [filters])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="mt-1 text-gray-600">
            Stay connected with local news and discussions
          </p>
        </div>
        {user && (
          <Button asChild style={{ backgroundColor: '#0891B2' }}>
            <Link href="/community/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar - Filters */}
        <aside className="w-full lg:w-64">
          <div className="lg:sticky lg:top-20">
            <Button
              variant="outline"
              className="mb-4 w-full lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <div className={showFilters ? 'block' : 'hidden lg:block'}>
              <PostFilters
                filters={filters}
                onFilterChange={setFilters}
                categories={categories}
              />
            </div>
          </div>
        </aside>

        {/* Posts Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No posts found
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Try adjusting your filters or be the first to create a post!
              </p>
              {user && (
                <Button asChild className="mt-4" style={{ backgroundColor: '#0891B2' }}>
                  <Link href="/community/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {posts.length} post{posts.length !== 1 ? 's' : ''} found
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
