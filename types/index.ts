import { User, Product, Post, Category, UserRole, CategoryType } from '@prisma/client'

export type { User, Product, Post, Category, UserRole, CategoryType }

export type ProductWithRelations = Product & {
  seller: User
  category: Category
}

export type PostWithRelations = Post & {
  author: User
  category: Category
}

export type UserWithRelations = User & {
  products: Product[]
  posts: Post[]
}

export interface ProductFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  location?: string
  search?: string
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high'
}

export interface PostFilters {
  categoryId?: string
  isVerified?: boolean
  search?: string
  sortBy?: 'newest' | 'oldest'
}
