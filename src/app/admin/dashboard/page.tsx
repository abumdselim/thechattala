import { getStats } from '@/app/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, MessageSquare, CheckCircle, Settings } from 'lucide-react'

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: `${stats.verifiedUsers} verified`,
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      description: `${stats.pendingProducts} pending approval`,
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: MessageSquare,
      description: 'Community discussions',
    },
    {
      title: 'Verified Users',
      value: stats.verifiedUsers,
      icon: CheckCircle,
      description: 'Trusted members',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of your platform statistics and activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.pendingProducts > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                <div>
                  <p className="font-medium text-sm">Product Approvals Needed</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingProducts} products awaiting review
                  </p>
                </div>
                <a
                  href="/admin/products?status=PENDING"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Review →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <a
                href="/admin/users"
                className="flex items-center p-3 border rounded-md hover:bg-gray-50"
              >
                <Users className="h-5 w-5 mr-3 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Manage Users</p>
                  <p className="text-xs text-muted-foreground">
                    Verify, suspend, or change roles
                  </p>
                </div>
              </a>
              <a
                href="/admin/products"
                className="flex items-center p-3 border rounded-md hover:bg-gray-50"
              >
                <Package className="h-5 w-5 mr-3 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Review Products</p>
                  <p className="text-xs text-muted-foreground">
                    Approve or reject listings
                  </p>
                </div>
              </a>
              <a
                href="/admin/posts"
                className="flex items-center p-3 border rounded-md hover:bg-gray-50"
              >
                <MessageSquare className="h-5 w-5 mr-3 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Moderate Posts</p>
                  <p className="text-xs text-muted-foreground">
                    Manage community content
                  </p>
                </div>
              </a>
              <a
                href="/admin/settings"
                className="flex items-center p-3 border rounded-md hover:bg-gray-50"
              >
                <Settings className="h-5 w-5 mr-3 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Platform Settings</p>
                  <p className="text-xs text-muted-foreground">
                    Configure categories and settings
                  </p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
