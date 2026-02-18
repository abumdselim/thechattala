import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { getProduct } from '@/app/actions/products'
import { getCurrentUser } from '@/lib/auth'
import { ArrowLeft, MapPin, Phone, CheckCircle2, Edit, Eye, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  let product
  try {
    product = await getProduct(params.id)
  } catch (error) {
    notFound()
  }

  const currentUser = await getCurrentUser().catch(() => null)
  const isOwner = currentUser?.id === product.sellerId

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
        {/* Back Button */}
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {product.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Thumbnail Gallery */}
                    {product.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-4 p-4">
                        {product.images.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
                          >
                            <img
                              src={image}
                              alt={`${product.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-6xl mb-2">📦</div>
                      <p>No image available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Product Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">{product.category.name}</Badge>
                  {product.status === 'PENDING' && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Pending Approval
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
                {product.titleBn && (
                  <h2 className="text-xl text-gray-600 mb-4">{product.titleBn}</h2>
                )}

                <p className="text-4xl font-bold text-primary mb-6">
                  ৳{product.price.toLocaleString()}
                </p>

                {product.location && (
                  <div className="flex items-center text-gray-700 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    {product.location}
                  </div>
                )}

                {product.contact && (
                  <div className="flex items-center text-gray-700 mb-6">
                    <Phone className="h-5 w-5 mr-2" />
                    {product.contact}
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500 mb-6 gap-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {product.views} views
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {isOwner ? (
                  <Link href={`/marketplace/${product.id}/edit`}>
                    <Button className="w-full" size="lg">
                      <Edit className="h-5 w-5 mr-2" />
                      Edit Product
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" size="lg">
                    Contact Seller
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Seller Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    {product.seller.image ? (
                      <img src={product.seller.image} alt={product.seller.name || 'Seller'} />
                    ) : (
                      <div 
                        className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground"
                        aria-label={`${product.seller.name || 'Seller'}'s avatar`}
                      >
                        {product.seller.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{product.seller.name}</p>
                      {product.seller.verified && (
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Member since {new Date(product.seller.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {!isOwner && (
                  <Button variant="outline" className="w-full">
                    View Seller Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
