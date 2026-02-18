import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getProducts } from '@/lib/actions/product-actions'
import { getPosts } from '@/lib/actions/post-actions'
import { formatPrice, formatRelativeTime } from '@/lib/utils'
import { ShoppingBag, Users, MapPin, TrendingUp, Shield, Zap } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch featured products and posts
  const productsResult = await getProducts({ sortBy: 'newest' })
  const postsResult = await getPosts({ sortBy: 'newest', isVerified: true })

  const featuredProducts = productsResult.success && productsResult.data ? productsResult.data.slice(0, 6) : []
  const latestPosts = postsResult.success && postsResult.data ? postsResult.data.slice(0, 4) : []

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to <span className="text-primary">The Chattala</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Your hyperlocal platform for Chattogram. Buy, sell, and connect with your community.
              Discover local products, services, and stay updated with community news.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Button asChild size="lg">
                <Link href="/market">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Marketplace
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/community">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Hyperlocal Focus</CardTitle>
                <CardDescription>
                  Exclusively for Chattogram residents. Connect with your neighbors and local businesses.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Safe & Verified</CardTitle>
                <CardDescription>
                  Verified listings and trusted community members. Your safety is our priority.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Quick & Easy</CardTitle>
                <CardDescription>
                  List your products or join discussions in minutes. Simple and user-friendly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Latest listings in the marketplace</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/market">View All</Link>
            </Button>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product: any) => (
                <Link key={product.id} href={`/market/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {product.isSold && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">Sold</Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.condition && (
                          <Badge variant="outline">{product.condition}</Badge>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {product.seller.location || 'Chattogram'}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No products available yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/market/new">List Your First Product</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Community News Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Community Updates</h2>
              <p className="text-muted-foreground mt-2">Latest verified news and announcements</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/community">View All</Link>
            </Button>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {latestPosts.map((post: any) => (
                <Link key={post.id} href={`/community/${post.id}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{post.category.name}</Badge>
                        {post.isVerified && (
                          <Badge className="bg-secondary">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.content}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>By {post.author.name}</span>
                        <span>{formatRelativeTime(post.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No community posts yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/community/new">Create Your First Post</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join The Chattala community today and experience the best hyperlocal platform
                for Chattogram. Buy, sell, and connect with your neighbors.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button asChild size="lg">
                  <Link href="/signup">Sign Up Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/market">Explore Marketplace</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
