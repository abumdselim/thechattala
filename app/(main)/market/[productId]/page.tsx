import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { getProduct, getProducts, deleteProduct, toggleProductSold } from "@/lib/actions/product-actions"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductCard } from "@/components/marketplace/product-card"
import { ArrowLeft, MapPin, Clock, Mail, Phone, Edit, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { ProductWithRelations } from "@/types"
import { ProductActions } from "./product-actions"

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ productId: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { productId } = await params
  const result = await getProduct(productId)
  
  if (!result.success || !result.data) {
    return {
      title: "Product Not Found - The Chattala",
    }
  }

  return {
    title: `${result.data.title} - The Chattala`,
    description: result.data.description,
  }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const result = await getProducts({ categoryId })
  if (result.success && result.data) {
    return result.data.filter((p: any) => p.id !== currentProductId).slice(0, 3)
  }
  return []
}

async function ProductContent({ productId }: { productId: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const result = await getProduct(productId)
  
  if (!result.success || !result.data) {
    notFound()
  }

  const product = result.data as ProductWithRelations
  const isOwner = user?.email === product.seller.email

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString()}`
  }

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-500'
      case 'like-new':
        return 'bg-blue-500'
      case 'good':
        return 'bg-cyan-500'
      case 'fair':
        return 'bg-yellow-500'
      case 'poor':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/market">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                {product.isSold && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Badge variant="destructive" className="text-2xl px-6 py-2">
                      SOLD
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {product.images.slice(1, 5).map((image: string, index: number) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={image}
                        alt={`${product.title} ${index + 2}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {product.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{product.category.name}</Badge>
                      {product.condition && (
                        <Badge className={`${getConditionColor(product.condition)} border-0 text-white`}>
                          {product.condition.charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#0891B2]">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Posted {formatDate(product.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{product.seller.location || 'Chattogram'}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="whitespace-pre-wrap text-gray-700">
                    {product.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Seller Info & Actions */}
        <div className="space-y-6">
          {/* Seller Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Seller Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.seller.image || undefined} />
                    <AvatarFallback style={{ backgroundColor: '#0891B2' }} className="text-white">
                      {getUserInitials(product.seller.name || undefined, product.seller.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {product.seller.name || 'Seller'}
                    </div>
                    {product.seller.location && (
                      <div className="text-sm text-gray-600">
                        {product.seller.location}
                      </div>
                    )}
                  </div>
                </div>

                {!isOwner && (
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      style={{ backgroundColor: '#0891B2' }}
                      asChild
                      disabled={product.isSold}
                    >
                      <a href={`mailto:${product.seller.email}?subject=Inquiry about ${product.title}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Seller
                      </a>
                    </Button>
                    {product.seller.phoneNumber && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        asChild
                        disabled={product.isSold}
                      >
                        <a href={`tel:${product.seller.phoneNumber}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call Seller
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Owner Actions */}
          {isOwner && (
            <ProductActions 
              productId={product.id} 
              sellerId={user?.email || ''}
              isSold={product.isSold}
            />
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Related Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product as ProductWithRelations} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0891B2]" />
        </div>
      }
    >
      <ProductContent productId={productId} />
    </Suspense>
  )
}
