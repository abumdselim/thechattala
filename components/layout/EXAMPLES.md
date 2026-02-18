# Layout Components Usage Examples

## Basic Page Layout

```tsx
// app/layout.tsx or any page
import { Header, Footer } from "@/components/layout"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

## Full Page Example

```tsx
// app/page.tsx
import { Header, Footer } from "@/components/layout"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold">Welcome to The Chattala</h1>
          <p className="mt-4 text-gray-600">
            Your local marketplace connecting communities.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
```

## With Custom Content Between Header and Footer

```tsx
// app/marketplace/page.tsx
import { Header, Footer } from "@/components/layout"

export default function MarketplacePage() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0891B2] to-[#059669] py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold">Marketplace</h1>
          <p className="mt-4 text-xl">Find amazing products from local sellers</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Product cards go here */}
        </div>
      </main>

      <Footer />
    </>
  )
}
```

## Standalone Mobile Nav Usage

While `MobileNav` is typically used within the `Header` component, you can use it standalone:

```tsx
import { MobileNav } from "@/components/layout"

export default function CustomHeader() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between p-4">
        <MobileNav />
        <div>Logo</div>
        <div>Menu</div>
      </div>
    </header>
  )
}
```

## Customizing the Header

You can extend the header by wrapping it or creating a custom version:

```tsx
import { Header } from "@/components/layout"

export default function CustomLayout({ children }) {
  return (
    <div>
      <Header />
      
      {/* Add a banner below the header */}
      <div className="bg-yellow-100 px-4 py-2 text-center">
        <p>🎉 Special sale! Get 20% off on all products this week!</p>
      </div>

      <main>{children}</main>
    </div>
  )
}
```

## Authentication Flow

The Header automatically handles authentication state:

- **Logged Out**: Shows "Login" and "Sign Up" buttons
- **Logged In**: Shows user avatar with dropdown menu containing:
  - User info (name and email)
  - Dashboard link
  - My Orders link
  - My Products link
  - Settings link
  - Sign out button

The component uses Supabase's `onAuthStateChange` to reactively update when the user logs in or out.

## Responsive Behavior

### Desktop (≥768px)
- Full navigation links visible in header
- Footer in multi-column grid layout
- User dropdown menu in header

### Mobile (<768px)
- Hamburger menu button shows mobile navigation drawer
- Footer stacks vertically
- Simplified button layout in header

## Styling Customization

All components use Tailwind CSS and support the custom color scheme:
- Primary: `#0891B2`
- Secondary: `#059669`

To customize colors, update the inline styles or use Tailwind config:

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0891B2',
        secondary: '#059669',
      },
    },
  },
}
```

Then use in components:
```tsx
<div className="bg-primary text-white">...</div>
```
