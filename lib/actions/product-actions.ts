'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { ProductFilters } from '@/types'

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  condition: z.string().optional(),
  categoryId: z.string(),
  images: z.array(z.string()).default([]),
})

export async function getProducts(filters?: ProductFilters) {
  try {
    const where: any = {
      isSold: false,
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {}
      if (filters.minPrice) where.price.gte = filters.minPrice
      if (filters.maxPrice) where.price.lte = filters.maxPrice
    }

    if (filters?.condition) {
      where.condition = filters.condition
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters?.location) {
      where.seller = {
        location: { contains: filters.location, mode: 'insensitive' }
      }
    }

    let orderBy: any = { createdAt: 'desc' }

    if (filters?.sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' }
    } else if (filters?.sortBy === 'price-low') {
      orderBy = { price: 'asc' }
    } else if (filters?.sortBy === 'price-high') {
      orderBy = { price: 'desc' }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        seller: true,
        category: true,
      },
    })

    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, error: 'Failed to fetch products' }
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: true,
        category: true,
      },
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    return { success: true, data: product }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}

export async function createProduct(sellerId: string, data: z.infer<typeof productSchema>) {
  try {
    const validatedData = productSchema.parse(data)

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        sellerId,
      },
      include: {
        seller: true,
        category: true,
      },
    })

    revalidatePath('/market')
    revalidatePath('/dashboard')

    return { success: true, data: product }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' }
  }
}

export async function updateProduct(id: string, sellerId: string, data: Partial<z.infer<typeof productSchema>>) {
  try {
    // Verify ownership
    const existing = await prisma.product.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: 'Product not found' }
    }

    if (existing.sellerId !== sellerId) {
      return { success: false, error: 'Unauthorized' }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        seller: true,
        category: true,
      },
    })

    revalidatePath('/market')
    revalidatePath(`/market/${id}`)
    revalidatePath('/dashboard')

    return { success: true, data: product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: string, sellerId: string) {
  try {
    // Verify ownership
    const existing = await prisma.product.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: 'Product not found' }
    }

    if (existing.sellerId !== sellerId) {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/market')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

export async function toggleProductSold(id: string, sellerId: string) {
  try {
    // Verify ownership
    const existing = await prisma.product.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: 'Product not found' }
    }

    if (existing.sellerId !== sellerId) {
      return { success: false, error: 'Unauthorized' }
    }

    const product = await prisma.product.update({
      where: { id },
      data: { isSold: !existing.isSold },
    })

    revalidatePath('/market')
    revalidatePath(`/market/${id}`)
    revalidatePath('/dashboard')

    return { success: true, data: product }
  } catch (error) {
    console.error('Error toggling product sold status:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

export async function getUserProducts(userId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    })

    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching user products:', error)
    return { success: false, error: 'Failed to fetch products' }
  }
}
