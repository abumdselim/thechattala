import { Suspense } from "react"
import { getPosts } from "@/lib/actions/post-actions"
import { prisma } from "@/lib/prisma"
import { CommunityClient } from "@/components/community/community-client"
import { Loader2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Community - The Chattala",
  description: "Stay connected with local news and discussions in Chattogram",
}

async function getCommunityCategories() {
  const categories = await prisma.category.findMany({
    where: { type: 'COMMUNITY' },
    orderBy: { name: 'asc' },
  })
  return categories
}

async function CommunityContent() {
  const [postsResult, categories] = await Promise.all([
    getPosts(),
    getCommunityCategories(),
  ])

  const posts = postsResult.success && postsResult.data ? postsResult.data : []

  return <CommunityClient initialPosts={posts} categories={categories} />
}

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
        </div>
      }
    >
      <CommunityContent />
    </Suspense>
  )
}
