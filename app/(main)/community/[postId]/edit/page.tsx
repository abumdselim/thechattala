import { redirect, notFound } from "next/navigation"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { getPost } from "@/lib/actions/post-actions"
import { PostForm } from "@/components/community/post-form"
import type { PostWithRelations } from "@/types"
import { Loader2 } from "lucide-react"

export const dynamic = 'force-dynamic'

interface EditPostPageProps {
  params: Promise<{ postId: string }>
}

export async function generateMetadata({ params }: EditPostPageProps) {
  const { postId } = await params
  const result = await getPost(postId)
  
  if (!result.success || !result.data) {
    return {
      title: "Post Not Found - The Chattala",
    }
  }

  return {
    title: `Edit ${result.data.title} - The Chattala`,
    description: "Edit your community post",
  }
}

async function getCommunityCategories() {
  const categories = await prisma.category.findMany({
    where: { type: 'COMMUNITY' },
    orderBy: { name: 'asc' },
  })
  return categories
}

async function getUserFromDb(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

async function EditPostContent({ postId }: { postId: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/community/${postId}/edit`)
  }

  const dbUser = await getUserFromDb(user.email!)
  
  if (!dbUser) {
    redirect(`/login?redirect=/community/${postId}/edit`)
  }

  const result = await getPost(postId)

  if (!result.success || !result.data) {
    notFound()
  }

  const post = result.data as PostWithRelations

  // Check ownership
  if (post.author.email !== user.email) {
    redirect('/community')
  }

  const categories = await getCommunityCategories()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <PostForm userId={dbUser.id} categories={categories} post={post} />
    </div>
  )
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await params

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
        </div>
      }
    >
      <EditPostContent postId={postId} />
    </Suspense>
  )
}
