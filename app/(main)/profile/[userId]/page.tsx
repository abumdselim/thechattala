import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUserProfile } from '@/lib/actions/user-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Package, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ProfilePageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params
  const result = await getUserProfile(userId)

  if (!result.success || !result.data) {
    notFound()
  }

  const user = result.data
  const products = user.products || []
  const posts = user.posts || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                  <AvatarFallback className="text-2xl">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{user.name || 'Anonymous User'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.bio && (
                <div>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
              )}

              {user.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
              )}

              {user.phoneNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="pt-4 border-t grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <CardTitle>Products</CardTitle>
              </div>
              <CardDescription>
                {products.length} product{products.length !== 1 ? 's' : ''} listed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No products listed yet.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base line-clamp-1">
                            {product.title}
                          </CardTitle>
                          {product.isSold && (
                            <Badge variant="secondary">Sold</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-bold text-primary mb-2">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        <Button variant="outline" size="sm" asChild className="w-full">
                          <Link href={`/market/${product.id}`}>View Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Posts</CardTitle>
              </div>
              <CardDescription>
                {posts.length} post{posts.length !== 1 ? 's' : ''} created
              </CardDescription>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No posts created yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base line-clamp-1">
                            {post.title}
                          </CardTitle>
                          {post.isVerified && (
                            <Badge variant="default">Verified</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/community/${post.id}`}>Read More</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
