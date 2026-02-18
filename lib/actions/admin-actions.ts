'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
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

    return { success: true, data: users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Failed to fetch users' }
  }
}

export async function updateUserRole(adminId: string, userId: string, role: 'USER' | 'ADMIN') {
  try {
    // Verify admin status
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    revalidatePath('/admin')

    return { success: true, data: user }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: 'Failed to update user role' }
  }
}

export async function verifyPost(adminId: string, postId: string, isVerified: boolean) {
  try {
    // Verify admin status
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: { isVerified },
    })

    revalidatePath('/admin')
    revalidatePath('/community')
    revalidatePath(`/community/${postId}`)

    return { success: true, data: post }
  } catch (error) {
    console.error('Error verifying post:', error)
    return { success: false, error: 'Failed to verify post' }
  }
}

export async function deleteProductAdmin(adminId: string, productId: string) {
  try {
    // Verify admin status
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.product.delete({
      where: { id: productId },
    })

    revalidatePath('/admin')
    revalidatePath('/market')

    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

export async function deletePostAdmin(adminId: string, postId: string) {
  try {
    // Verify admin status
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.post.delete({
      where: { id: postId },
    })

    revalidatePath('/admin')
    revalidatePath('/community')

    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}

export async function getSiteStatistics() {
  try {
    const [
      totalUsers,
      totalProducts,
      totalPosts,
      activeProducts,
      soldProducts,
      verifiedPosts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.post.count(),
      prisma.product.count({ where: { isSold: false } }),
      prisma.product.count({ where: { isSold: true } }),
      prisma.post.count({ where: { isVerified: true } }),
    ])

    return {
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalPosts,
        activeProducts,
        soldProducts,
        verifiedPosts,
      },
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return { success: false, error: 'Failed to fetch statistics' }
  }
}

export async function createCategory(adminId: string, data: {
  name: string
  slug: string
  type: 'MARKETPLACE' | 'COMMUNITY'
}) {
  try {
    // Verify admin status
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const category = await prisma.category.create({
      data,
    })

    revalidatePath('/admin')

    return { success: true, data: category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function deleteCategory(adminId: string, categoryId: string) {
  try {
    // Verify admin status
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if category has products or posts
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true,
            posts: true,
          },
        },
      },
    })

    if (category && (category._count.products > 0 || category._count.posts > 0)) {
      return { 
        success: false, 
        error: 'Cannot delete category with existing products or posts' 
      }
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}
