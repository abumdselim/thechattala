import { redirect } from "next/navigation"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/marketplace/product-form"
import { Loader2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Create Listing - The Chattala",
  description: "Create a new product listing",
}

async function getMarketplaceCategories() {
  const categories = await prisma.category.findMany({
    where: { type: 'MARKETPLACE' },
    orderBy: { name: 'asc' },
  })
  return categories
}

async function getUserFromDb(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

async function NewProductContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/market/new')
  }

  const dbUser = await getUserFromDb(user.email!)
  
  if (!dbUser) {
    redirect('/login?redirect=/market/new')
  }

  const categories = await getMarketplaceCategories()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <ProductForm userId={dbUser.id} categories={categories} />
    </div>
  )
}

export default function NewProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
        </div>
      }
    >
      <NewProductContent />
    </Suspense>
  )
}
