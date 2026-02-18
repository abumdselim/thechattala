import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Plus } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
            <p className="text-gray-600 mt-2">Connect with your neighbors</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Community features are under development.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This page will include posts, comments, discussions, and more.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
