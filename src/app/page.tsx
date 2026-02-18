import Link from "next/link"
import { Package, MessageSquare, Shield, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                TheChattala <span className="text-sm font-normal text-gray-500">চট্টলা</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/marketplace">
                <Button variant="ghost">Marketplace</Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost">Community</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to TheChattala
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold text-gray-700 mb-4">
            চট্টলার হাইপারলোকাল প্ল্যাটফর্ম
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Connecting the Chittagong community through a hyperlocal marketplace and social hub.
            Buy, sell, and connect with your neighbors.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/marketplace">
              <Button size="lg" className="text-lg px-8 py-6">
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p className="text-lg text-gray-600">Everything you need to connect locally</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Marketplace</CardTitle>
              <CardDescription>
                Buy and sell products locally with categories, search, and filters
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Community Hub</CardTitle>
              <CardDescription>
                Share posts, discuss local topics, and connect with verified members
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>
                Comprehensive dashboard for managing users, products, and content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>
                Cloudinary integration for products, posts, and profile pictures
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Built with Modern Tech</CardTitle>
            <CardDescription className="text-base">
              Next.js 16 · React 19 · TypeScript · Prisma · PostgreSQL · Supabase · Cloudinary · Tailwind CSS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="px-3 py-1 bg-white rounded-full border">Next.js App Router</span>
              <span className="px-3 py-1 bg-white rounded-full border">Server Actions</span>
              <span className="px-3 py-1 bg-white rounded-full border">Prisma ORM</span>
              <span className="px-3 py-1 bg-white rounded-full border">Supabase Auth</span>
              <span className="px-3 py-1 bg-white rounded-full border">shadcn/ui</span>
              <span className="px-3 py-1 bg-white rounded-full border">Responsive Design</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join the Chittagong community today
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/marketplace">
            <Button size="lg">Explore Marketplace</Button>
          </Link>
          <Link href="/community">
            <Button size="lg" variant="outline">Join Community</Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © 2024 TheChattala. Made with ❤️ for the Chittagong community
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="/docs" className="hover:text-gray-900">Documentation</a>
              <a href="https://github.com/abumdselim/thechattala" className="hover:text-gray-900">GitHub</a>
              <a href="/admin" className="hover:text-gray-900">Admin</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
