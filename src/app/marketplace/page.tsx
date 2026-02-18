import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { getProducts } from '@/app/actions/products'
import { prisma } from '@/lib/prisma'
import { Package, Plus, Search, MapPin, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SearchParams {
  search?: string
  categoryId?: string
  minPrice?: string
  maxPrice?: string
  location?: string
  page?: string
}

interface Category {
  id: string
  name: string
  _count: {
    products: number
  }
}

async function ProductsGrid({ searchParams }: { searchParams: SearchParams }) {
  const filters = {
    search: searchParams.search,
    categoryId: searchParams.categoryId,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    location: searchParams.location,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
  }

  const { products, pagination } = await getProducts(filters)

  if (products.length === 0) {
    return (
      <div className="lg:col-span-3">
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your filters or search terms to find what you're looking for."
          action={{
            label: 'Clear Filters',
            href: '/marketplace',
          }}
        />
      </div>
    )
  }

  return (
    <>
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/marketplace/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="aspect-square relative bg-gray-100">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-3">৳{product.price.toLocaleString()}</p>
                  
                  {product.location && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {product.location}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600">
                        {product.seller.name}
                      </div>
                      {product.seller.verified && (
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <Badge variant="secondary">{product.category.name}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/marketplace?${new URLSearchParams({ ...searchParams, page: page.toString() }).toString()}`}
              >
                <Button
                  variant={pagination.page === page ? 'default' : 'outline'}
                  size="sm"
                >
                  {page}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

async function FilterSidebar({ searchParams }: { searchParams: SearchParams }) {
  let categories: Category[] = []
  try {
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })
  } catch (error) {
    console.error('Failed to load categories:', error)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            <Link href="/marketplace">
              <Button
                variant={!searchParams.categoryId ? 'default' : 'ghost'}
                className="w-full justify-start"
                size="sm"
              >
                All Categories
              </Button>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/marketplace?${new URLSearchParams({ ...searchParams, categoryId: category.id }).toString()}`}
              >
                <Button
                  variant={searchParams.categoryId === category.id ? 'default' : 'ghost'}
                  className="w-full justify-between"
                  size="sm"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category._count.products}
                  </Badge>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Price Range</h3>
          <form action="/marketplace" method="get" className="space-y-3">
            {Object.entries(searchParams)
              .filter(([key, value]) => key !== 'minPrice' && key !== 'maxPrice' && value)
              .map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Min Price (৳)</label>
              <Input
                type="number"
                name="minPrice"
                placeholder="0"
                defaultValue={searchParams.minPrice}
                min="0"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Max Price (৳)</label>
              <Input
                type="number"
                name="maxPrice"
                placeholder="Any"
                defaultValue={searchParams.maxPrice}
                min="0"
              />
            </div>
            <Button type="submit" className="w-full" size="sm">
              Apply
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
            <p className="text-gray-600 mt-2">Buy and sell products locally</p>
          </div>
          <Link href="/marketplace/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              List Product
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <form action="/marketplace" method="get" className="mb-8">
          {Object.entries(searchParams)
            .filter(([key, value]) => key !== 'search' && value)
            .map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              name="search"
              placeholder="Search products..."
              defaultValue={searchParams.search}
              className="pl-10"
            />
          </div>
        </form>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded h-96" />}>
            <FilterSidebar searchParams={searchParams} />
          </Suspense>
          
          <Suspense fallback={<div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-t-lg" />
                <div className="bg-white p-4 rounded-b-lg space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>}>
            <ProductsGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
