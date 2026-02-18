# Layout Components

This directory contains the main layout components for The Chattala application.

## Components

### Header (`header.tsx`)
Main header component with:
- Logo and brand name "The Chattala"
- Desktop navigation links (Home, Marketplace, Community)
- User authentication state management via Supabase
- User dropdown menu with dashboard links (when logged in)
- Login/Signup buttons (when logged out)
- Mobile-responsive with hamburger menu integration
- Sticky positioning for better UX

**Usage:**
```tsx
import { Header } from "@/components/layout"

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
```

### Footer (`footer.tsx`)
Footer component featuring:
- Brand section with logo and description
- Organized link sections (Marketplace, Community, Company, Legal)
- Social media links (Facebook, Twitter, Instagram, Email)
- Copyright notice with current year
- Responsive grid layout

**Usage:**
```tsx
import { Footer } from "@/components/layout"

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

### Mobile Navigation (`mobile-nav.tsx`)
Mobile navigation drawer using shadcn/ui Sheet component:
- Hamburger menu button for mobile devices (hidden on desktop)
- Slide-in drawer from left side
- Navigation links with icons
- Active route highlighting
- Closes automatically on navigation

**Usage:**
```tsx
// Typically imported and used within the Header component
import { MobileNav } from "@/components/layout"
```

## Features

- **TypeScript**: Full type safety with proper TypeScript definitions
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: Semantic HTML and ARIA labels
- **Authentication**: Integrated Supabase auth state management
- **Theme**: Uses custom color scheme (primary: #0891B2, secondary: #059669)
- **Icons**: Lucide React icons throughout
- **UI Components**: Leverages shadcn/ui components (Button, Avatar, Sheet, DropdownMenu)

## Dependencies

- `@/components/ui/*` - UI component library
- `@/lib/supabase/client` - Supabase client for authentication
- `next/link` - Next.js Link component for routing
- `next/navigation` - Next.js navigation hooks
- `lucide-react` - Icon library

## Color Scheme

- Primary: `#0891B2` (Cyan 600)
- Secondary: `#059669` (Emerald 600)
- Accent colors follow the Tailwind CSS palette
