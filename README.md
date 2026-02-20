# TheChattala - A dedicated Communication and Problem solving Platform for Chattogram

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

A hyperlocal platform for Chittagong connecting communities through a marketplace and social hub.

## 🌟 Features

- **Marketplace** - Buy and sell products locally with categories, search & filters
- **Community Hub** - Share posts, discuss local topics, verified user badges  
- **User Authentication** - Email/password and Google OAuth integration via Supabase
- **Admin Dashboard** - Comprehensive admin panel for user, product, and post management
- **Image Upload** - Cloudinary integration for products, posts, and profile pictures
- **Responsive Design** - Mobile-first design that works on all devices
- **Bilingual Support** - English and Bangla (বাংলা) interface

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui components
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Supabase Auth
- **File Upload:** Cloudinary
- **Forms:** React Hook Form + Zod validation
- **Notifications:** Sonner toast notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- [Supabase account](https://supabase.com/) (for authentication)
- [Cloudinary account](https://cloudinary.com/) (for image uploads)

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/abumdselim/thechattala.git
cd thechattala
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables - see `.env.example` for details.

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed with sample data
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Admin Guide](docs/ADMIN_GUIDE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [API Documentation](docs/API.md)

## 🔐 Admin Access

See [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) for instructions on creating admin users.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the Chittagong community
