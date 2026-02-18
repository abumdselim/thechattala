'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product, Category } from '@prisma/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteProduct, toggleProductSold } from '@/lib/actions/product-actions'
import { useRouter } from 'next/navigation'

type ProductWithCategory = Product & {
  category: Category
}

interface UserProductsProps {
  products: ProductWithCategory[]
  userId: string
}

export function UserProducts({ products, userId }: UserProductsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setLoading(productId)
    const result = await deleteProduct(productId, userId)
    setLoading(null)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Failed to delete product')
    }
  }

  const handleToggleSold = async (productId: string) => {
    setLoading(productId)
    const result = await toggleProductSold(productId, userId)
    setLoading(null)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Failed to update product')
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">You haven't posted any products yet.</p>
        <Link href="/market/new">
          <Button>Post Your First Product</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
              {product.isSold && (
                <Badge variant="secondary">Sold</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary mb-2">
              ₹{product.price.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{product.category.name}</span>
              {product.condition && (
                <>
                  <span>•</span>
                  <span>{product.condition}</span>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1"
            >
              <Link href={`/market/${product.id}`}>View</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleSold(product.id)}
              disabled={loading === product.id}
            >
              {product.isSold ? 'Mark Available' : 'Mark Sold'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(product.id)}
              disabled={loading === product.id}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
