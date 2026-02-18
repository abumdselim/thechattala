import { requireAuth } from '@/lib/auth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  User, 
  Menu, 
  X 
} from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user
  try {
    user = await requireAuth()
  } catch (error) {
    redirect('/auth/login?redirect=/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            {/* User Info */}
            <div className="flex items-center flex-shrink-0 px-4 pb-4 border-b">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 mt-5 space-y-1">
              <NavLink href="/dashboard" icon={LayoutDashboard}>
                Overview
              </NavLink>
              <NavLink href="/dashboard/products" icon={Package}>
                My Products
              </NavLink>
              <NavLink href="/dashboard/posts" icon={FileText}>
                My Posts
              </NavLink>
              <NavLink href="/dashboard/profile" icon={User}>
                Profile
              </NavLink>
            </nav>

            {/* Bottom Section */}
            <div className="flex-shrink-0 p-4 border-t">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <span className="ml-2 font-medium">{user.name || 'User'}</span>
            </div>
            <button
              className="p-2"
              onClick={() => {
                const nav = document.getElementById('mobile-nav')
                nav?.classList.toggle('hidden')
              }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div id="mobile-nav" className="hidden border-t">
            <nav className="px-4 py-2 space-y-1">
              <MobileNavLink href="/dashboard" icon={LayoutDashboard}>
                Overview
              </MobileNavLink>
              <MobileNavLink href="/dashboard/products" icon={Package}>
                My Products
              </MobileNavLink>
              <MobileNavLink href="/dashboard/posts" icon={FileText}>
                My Posts
              </MobileNavLink>
              <MobileNavLink href="/dashboard/profile" icon={User}>
                Profile
              </MobileNavLink>
              <div className="pt-2 border-t">
                <Link href="/">
                  <Button variant="outline" className="w-full" size="sm">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:pl-64">
          <main className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 mt-16 md:mt-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: any
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 text-gray-700 hover:text-gray-900"
    >
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: any
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 text-gray-700 hover:text-gray-900"
      onClick={() => {
        document.getElementById('mobile-nav')?.classList.add('hidden')
      }}
    >
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </Link>
  )
}
