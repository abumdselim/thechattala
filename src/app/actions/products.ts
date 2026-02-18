'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createProduct(data: {
  title: string
  titleBn?: string
  description: string
  price: number
  images: string[]
  categoryId: string
  location?: string
  contact?: string
}) {
  const user = await requireAuth()

  if (user.suspended) {
    throw new Error('Your account is suspended')
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      sellerId: user.id,
      status: 'PENDING',
    },
  })

  revalidatePath('/marketplace')
  revalidatePath('/profile/products')
  return product
}

export async function updateProduct(
  id: string,
  data: {
    title?: string
    titleBn?: string
    description?: string
    price?: number
    images?: string[]
    categoryId?: string
    location?: string
    contact?: string
  }
) {
  const user = await requireAuth()

  const existingProduct = await prisma.product.findUnique({
    where: { id },
  })

  if (!existingProduct) {
    throw new Error('Product not found')
  }

  if (existingProduct.sellerId !== user.id) {
    throw new Error('Unauthorized: You can only update your own products')
  }

  const product = await prisma.product.update({
    where: { id },
    data,
  })

  revalidatePath('/marketplace')
  revalidatePath('/profile/products')
  revalidatePath(`/marketplace/${id}`)
  return product
}

export async function deleteProduct(id: string) {
  const user = await requireAuth()

  const existingProduct = await prisma.product.findUnique({
    where: { id },
  })

  if (!existingProduct) {
    throw new Error('Product not found')
  }

  if (existingProduct.sellerId !== user.id) {
    throw new Error('Unauthorized: You can only delete your own products')
  }

  const product = await prisma.product.delete({
    where: { id },
  })

  revalidatePath('/marketplace')
  revalidatePath('/profile/products')
  return product
}

export async function getProducts(filters?: {
  categoryId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  page?: number
  limit?: number
}) {
  const page = filters?.page || 1
  const limit = filters?.limit || 20
  const skip = (page - 1) * limit

  const where: any = {
    status: 'APPROVED',
  }

  if (filters?.categoryId) {
    where.categoryId = filters.categoryId
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.price = {}
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice
    }
  }

  if (filters?.location) {
    where.location = { contains: filters.location, mode: 'insensitive' }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            verified: true,
            image: true,
          },
        },
        category: true,
      },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          verified: true,
          image: true,
          createdAt: true,
        },
      },
      category: true,
    },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  if (product.status !== 'APPROVED') {
    const user = await requireAuth().catch(() => null)
    if (!user || (user.id !== product.sellerId && user.role !== 'ADMIN')) {
      throw new Error('Product not found')
    }
  }

  // Increment view count
  await prisma.product.update({
    where: { id },
    data: { views: { increment: 1 } },
  })

  return product
}

export async function getUserProducts() {
  const user = await requireAuth()

  const products = await prisma.product.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
    },
  })

  return products
}
