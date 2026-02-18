import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProductWithRelations } from "@/types"
import { MapPin, Clock } from "lucide-react"

interface ProductCardProps {
  product: ProductWithRelations
}

export function ProductCard({ product }: ProductCardProps) {
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
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  return (
    <Link href={`/market/${product.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          {product.condition && (
            <Badge
              className={`absolute right-2 top-2 ${getConditionColor(product.condition)} border-0 text-white`}
            >
              {product.condition.charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ')}
            </Badge>
          )}
          {product.isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive" className="text-lg">
                SOLD
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 font-semibold text-gray-900">
            {product.title}
          </h3>
          <p className="mt-2 text-2xl font-bold text-[#0891B2]">
            {formatPrice(product.price)}
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline" className="text-xs">
              {product.category.name}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 px-4 py-3">
          <div className="flex w-full items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{product.seller.location || 'Chattogram'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(product.createdAt)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
