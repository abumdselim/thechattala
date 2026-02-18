import { redirect, notFound } from "next/navigation"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { getProduct } from "@/lib/actions/product-actions"
import { ProductForm } from "@/components/marketplace/product-form"
import type { ProductWithRelations } from "@/types"
import { Loader2 } from "lucide-react"

export const dynamic = 'force-dynamic'

interface EditProductPageProps {
  params: Promise<{ productId: string }>
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const { productId } = await params
  const result = await getProduct(productId)
  
  if (!result.success || !result.data) {
    return {
      title: "Product Not Found - The Chattala",
    }
  }

  return {
    title: `Edit ${result.data.title} - The Chattala`,
    description: "Edit your product listing",
  }
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

async function EditProductContent({ productId }: { productId: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/market/${productId}/edit`)
  }

  const dbUser = await getUserFromDb(user.email!)
  
  if (!dbUser) {
    redirect(`/login?redirect=/market/${productId}/edit`)
  }

  const result = await getProduct(productId)
  
  if (!result.success || !result.data) {
    notFound()
  }

  const product = result.data as ProductWithRelations

  // Check ownership
  if (product.sellerId !== dbUser.id) {
    redirect(`/market/${productId}`)
  }

  const categories = await getMarketplaceCategories()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <ProductForm userId={dbUser.id} categories={categories} product={product} />
    </div>
  )
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { productId } = await params

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
        </div>
      }
    >
      <EditProductContent productId={productId} />
    </Suspense>
  )
}
