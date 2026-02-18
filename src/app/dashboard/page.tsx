import { getProfile } from '@/app/actions/user'
import { getUserProducts } from '@/app/actions/products'
import { getUserPosts } from '@/app/actions/posts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Package, 
  FileText, 
  User, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Plus,
  Edit,
  MessageSquare
} from 'lucide-react'

export default async function DashboardPage() {
  const profile = await getProfile()
  const products = await getUserProducts()
  const posts = await getUserPosts()

  const recentProducts = products.slice(0, 5)
  const recentPosts = posts.slice(0, 5)

  const approvedProducts = products.filter(p => p.status === 'APPROVED').length
  const pendingProducts = products.filter(p => p.status === 'PENDING').length
  const rejectedProducts = products.filter(p => p.status === 'REJECTED').length

  const profileCompletion = calculateProfileCompletion(profile)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {profile.name || 'User'}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Products"
          value={profile._count.products}
          icon={Package}
          color="blue"
          link="/dashboard/products"
        >
          <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              {approvedProducts} approved
            </span>
            {pendingProducts > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-600" />
                {pendingProducts} pending
              </span>
            )}
            {rejectedProducts > 0 && (
              <span className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-600" />
                {rejectedProducts} rejected
              </span>
            )}
          </div>
        </StatCard>

        <StatCard
          title="Total Posts"
          value={profile._count.posts}
          icon={FileText}
          color="green"
          link="/dashboard/posts"
        >
          <div className="text-xs text-gray-600 mt-2">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {profile._count.comments} comments received
            </span>
          </div>
        </StatCard>

        <StatCard
          title="Profile Completion"
          value={`${profileCompletion}%`}
          icon={User}
          color="purple"
          link="/dashboard/profile"
        >
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </StatCard>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/marketplace/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Button>
          </Link>
          <Link href="/community/create">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Products
            </h2>
            <Link href="/dashboard/products">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No products yet</p>
              <Link href="/marketplace/create">
                <Button variant="link" size="sm" className="mt-2">
                  Create your first product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">
                        ${product.price.toFixed(2)}
                      </p>
                      <StatusBadge status={product.status} />
                    </div>
                  </div>
                  <Link href={`/marketplace/${product.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Posts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Posts
            </h2>
            <Link href="/dashboard/posts">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No posts yet</p>
              <Link href="/community/create">
                <Button variant="link" size="sm" className="mt-2">
                  Create your first post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post._count.comments}
                      </span>
                    </div>
                  </div>
                  <Link href={`/community/${post.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  link,
  children,
}: {
  title: string
  value: number | string
  icon: any
  color: 'blue' | 'green' | 'purple'
  link: string
  children?: React.ReactNode
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <Link href={link}>
      <Card className="p-6 hover:shadow-md transition cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {children}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    PENDING: { variant: 'default' as const, text: 'Pending' },
    APPROVED: { variant: 'default' as const, text: 'Approved' },
    REJECTED: { variant: 'destructive' as const, text: 'Rejected' },
  }

  const config = variants[status as keyof typeof variants] || variants.PENDING

  return (
    <Badge 
      variant={config.variant}
      className={
        status === 'PENDING' 
          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' 
          : status === 'APPROVED'
          ? 'bg-green-100 text-green-800 hover:bg-green-100'
          : ''
      }
    >
      {config.text}
    </Badge>
  )
}

function calculateProfileCompletion(profile: any): number {
  let completion = 0
  const fields = [
    profile.name,
    profile.email,
    profile.image,
    profile.verified,
  ]

  fields.forEach((field) => {
    if (field) completion += 25
  })

  return completion
}
