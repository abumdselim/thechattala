import { Suspense } from "react"
import { getProducts } from "@/lib/actions/product-actions"
import { prisma } from "@/lib/prisma"
import { MarketClient } from "@/components/marketplace/market-client"
import { Loader2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Marketplace - The Chattala",
  description: "Buy and sell products in Chattogram",
}

async function getMarketplaceCategories() {
  const categories = await prisma.category.findMany({
    where: { type: 'MARKETPLACE' },
    orderBy: { name: 'asc' },
  })
  return categories
}

async function MarketContent() {
  const [productsResult, categories] = await Promise.all([
    getProducts(),
    getMarketplaceCategories(),
  ])

  const products = productsResult.success && productsResult.data ? productsResult.data : []

  return <MarketClient initialProducts={products} categories={categories} />
}

export default function MarketPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
        </div>
      }
    >
      <MarketContent />
    </Suspense>
  )
}
