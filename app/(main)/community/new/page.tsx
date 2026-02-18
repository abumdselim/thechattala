import { redirect } from "next/navigation"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { PostForm } from "@/components/community/post-form"
import { Loader2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Create Post - The Chattala",
  description: "Create a new community post",
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

async function NewPostContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/community/new')
  }

  const dbUser = await getUserFromDb(user.email!)
  
  if (!dbUser) {
    redirect('/login?redirect=/community/new')
  }

  const categories = await getCommunityCategories()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <PostForm userId={dbUser.id} categories={categories} />
    </div>
  )
}

export default function NewPostPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
        </div>
      }
    >
      <NewPostContent />
    </Suspense>
  )
}
