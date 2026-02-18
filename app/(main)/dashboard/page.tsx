import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserByEmail } from '@/lib/actions/user-actions'
import { getUserProducts } from '@/lib/actions/product-actions'
import { getUserPosts } from '@/lib/actions/post-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserProducts } from '@/components/dashboard/user-products'
import { UserPosts } from '@/components/dashboard/user-posts'
import { ProfileEdit } from '@/components/dashboard/profile-edit'
import { Package, FileText, Edit } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login')
  }

  const userResult = await getUserByEmail(authUser.email!)
  
  if (!userResult.success || !userResult.data) {
    redirect('/login')
  }

  const user = userResult.data

  const [productsResult, postsResult] = await Promise.all([
    getUserProducts(user.id),
    getUserPosts(user.id),
  ])

  const products = productsResult.success && productsResult.data ? productsResult.data : []
  const posts = postsResult.success && postsResult.data ? postsResult.data : []

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.name || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Manage your products, posts, and profile
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {products.filter(p => !p.isSold).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">
              {posts.filter(p => p.isVerified).length} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {user.bio ? 'Bio added' : 'No bio yet'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {user.location || 'No location set'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Products</h2>
              <p className="text-muted-foreground">
                Manage your marketplace listings
              </p>
            </div>
          </div>
          <UserProducts products={products} userId={user.id} />
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Posts</h2>
              <p className="text-muted-foreground">
                Manage your community posts
              </p>
            </div>
          </div>
          <UserPosts posts={posts} userId={user.id} />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <div className="max-w-2xl">
            <ProfileEdit user={user} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
