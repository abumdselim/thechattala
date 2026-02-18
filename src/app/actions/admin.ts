'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required')
  }

  return dbUser
}

export async function getStats() {
  await getAdminUser()

  const [totalUsers, totalProducts, totalPosts, pendingProducts, verifiedUsers] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.post.count(),
    prisma.product.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { verified: true } }),
  ])

  return {
    totalUsers,
    totalProducts,
    totalPosts,
    pendingProducts,
    verifiedUsers,
  }
}

export async function getUsers(filters?: {
  role?: 'USER' | 'ADMIN'
  verified?: boolean
  suspended?: boolean
  search?: string
}) {
  await getAdminUser()

  const where: any = {}

  if (filters?.role) where.role = filters.role
  if (filters?.verified !== undefined) where.verified = filters.verified
  if (filters?.suspended !== undefined) where.suspended = filters.suspended
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          products: true,
          posts: true,
        },
      },
    },
  })

  return users
}

export async function verifyUser(userId: string) {
  await getAdminUser()

  const user = await prisma.user.update({
    where: { id: userId },
    data: { verified: true },
  })

  revalidatePath('/admin/users')
  return user
}

export async function suspendUser(userId: string, reason?: string) {
  await getAdminUser()

  const user = await prisma.user.update({
    where: { id: userId },
    data: { suspended: true },
  })

  revalidatePath('/admin/users')
  return user
}

export async function unsuspendUser(userId: string) {
  await getAdminUser()

  const user = await prisma.user.update({
    where: { id: userId },
    data: { suspended: false },
  })

  revalidatePath('/admin/users')
  return user
}

export async function changeUserRole(userId: string, role: 'USER' | 'ADMIN') {
  await getAdminUser()

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  revalidatePath('/admin/users')
  return user
}

export async function getProducts(filters?: {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  categoryId?: string
  search?: string
}) {
  await getAdminUser()

  const where: any = {}

  if (filters?.status) where.status = filters.status
  if (filters?.categoryId) where.categoryId = filters.categoryId
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      seller: {
        select: { id: true, name: true, email: true, verified: true },
      },
      category: true,
    },
  })

  return products
}

export async function approveProduct(productId: string) {
  await getAdminUser()

  const product = await prisma.product.update({
    where: { id: productId },
    data: { status: 'APPROVED' },
  })

  revalidatePath('/admin/products')
  revalidatePath('/marketplace')
  return product
}

export async function rejectProduct(productId: string, reason?: string) {
  await getAdminUser()

  const product = await prisma.product.update({
    where: { id: productId },
    data: { status: 'REJECTED' },
  })

  revalidatePath('/admin/products')
  return product
}

export async function deleteProduct(productId: string) {
  await getAdminUser()

  const product = await prisma.product.delete({
    where: { id: productId },
  })

  revalidatePath('/admin/products')
  revalidatePath('/marketplace')
  return product
}

export async function getPosts(filters?: {
  pinned?: boolean
  search?: string
}) {
  await getAdminUser()

  const where: any = {}

  if (filters?.pinned !== undefined) where.pinned = filters.pinned
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: [
      { pinned: 'desc' },
      { createdAt: 'desc' },
    ],
    include: {
      author: {
        select: { id: true, name: true, email: true, verified: true },
      },
      _count: {
        select: { comments: true },
      },
    },
  })

  return posts
}

export async function pinPost(postId: string) {
  await getAdminUser()

  const post = await prisma.post.update({
    where: { id: postId },
    data: { pinned: true },
  })

  revalidatePath('/admin/posts')
  revalidatePath('/community')
  return post
}

export async function unpinPost(postId: string) {
  await getAdminUser()

  const post = await prisma.post.update({
    where: { id: postId },
    data: { pinned: false },
  })

  revalidatePath('/admin/posts')
  revalidatePath('/community')
  return post
}

export async function deletePost(postId: string) {
  await getAdminUser()

  const post = await prisma.post.delete({
    where: { id: postId },
  })

  revalidatePath('/admin/posts')
  revalidatePath('/community')
  return post
}

export async function getCategories() {
  await getAdminUser()

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  return categories
}

export async function createCategory(data: {
  name: string
  nameBn?: string
  slug: string
  description?: string
}) {
  await getAdminUser()

  const category = await prisma.category.create({
    data,
  })

  revalidatePath('/admin/settings')
  return category
}

export async function updateCategory(categoryId: string, data: {
  name?: string
  nameBn?: string
  slug?: string
  description?: string
}) {
  await getAdminUser()

  const category = await prisma.category.update({
    where: { id: categoryId },
    data,
  })

  revalidatePath('/admin/settings')
  return category
}

export async function deleteCategory(categoryId: string) {
  await getAdminUser()

  // Check if category has products
  const productCount = await prisma.product.count({
    where: { categoryId },
  })

  if (productCount > 0) {
    throw new Error('Cannot delete category with existing products')
  }

  const category = await prisma.category.delete({
    where: { id: categoryId },
  })

  revalidatePath('/admin/settings')
  return category
}
