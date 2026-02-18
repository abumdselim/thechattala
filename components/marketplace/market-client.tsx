"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/marketplace/product-card"
import { ProductFilters } from "@/components/marketplace/product-filters"
import { getProducts } from "@/lib/actions/product-actions"
import { createClient } from "@/lib/supabase/client"
import type { ProductWithRelations, ProductFilters as FilterType } from "@/types"
import { Plus, Loader2, Package } from "lucide-react"

interface MarketClientProps {
  initialProducts: ProductWithRelations[]
  categories: Array<{ id: string; name: string; slug: string }>
}

export function MarketClient({ initialProducts, categories }: MarketClientProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<ProductWithRelations[]>(initialProducts)
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
    const fetchProducts = async () => {
      setLoading(true)
      const result = await getProducts(filters)
      if (result.success) {
        setProducts(result.data as ProductWithRelations[])
      }
      setLoading(false)
    }
    fetchProducts()
  }, [filters])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="mt-1 text-gray-600">
            Buy and sell products in Chattogram
          </p>
        </div>
        {user && (
          <Button asChild style={{ backgroundColor: '#0891B2' }}>
            <Link href="/market/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
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
              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                categories={categories}
              />
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No products found
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Try adjusting your filters or be the first to create a listing!
              </p>
              {user && (
                <Button asChild className="mt-4" style={{ backgroundColor: '#0891B2' }}>
                  <Link href="/market/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Listing
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
