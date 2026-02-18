'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { PostFilters } from '@/types'

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  categoryId: z.string(),
  images: z.array(z.string()).default([]),
})

export async function getPosts(filters?: PostFilters) {
  try {
    const where: any = {}

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters?.isVerified !== undefined) {
      where.isVerified = filters.isVerified
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const orderBy = filters?.sortBy === 'oldest' 
      ? { createdAt: 'asc' } 
      : { createdAt: 'desc' }

    const posts = await prisma.post.findMany({
      where,
      orderBy,
      include: {
        author: true,
        category: true,
      },
    })

    return { success: true, data: posts }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { success: false, error: 'Failed to fetch posts' }
  }
}

export async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
      },
    })

    if (!post) {
      return { success: false, error: 'Post not found' }
    }

    return { success: true, data: post }
  } catch (error) {
    console.error('Error fetching post:', error)
    return { success: false, error: 'Failed to fetch post' }
  }
}

export async function createPost(authorId: string, data: z.infer<typeof postSchema>) {
  try {
    const validatedData = postSchema.parse(data)

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId,
      },
      include: {
        author: true,
        category: true,
      },
    })

    revalidatePath('/community')
    revalidatePath('/dashboard')

    return { success: true, data: post }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    console.error('Error creating post:', error)
    return { success: false, error: 'Failed to create post' }
  }
}

export async function updatePost(id: string, authorId: string, data: Partial<z.infer<typeof postSchema>>) {
  try {
    // Verify ownership
    const existing = await prisma.post.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: 'Post not found' }
    }

    if (existing.authorId !== authorId) {
      return { success: false, error: 'Unauthorized' }
    }

    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
        category: true,
      },
    })

    revalidatePath('/community')
    revalidatePath(`/community/${id}`)
    revalidatePath('/dashboard')

    return { success: true, data: post }
  } catch (error) {
    console.error('Error updating post:', error)
    return { success: false, error: 'Failed to update post' }
  }
}

export async function deletePost(id: string, authorId: string) {
  try {
    // Verify ownership
    const existing = await prisma.post.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: 'Post not found' }
    }

    if (existing.authorId !== authorId) {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.post.delete({
      where: { id },
    })

    revalidatePath('/community')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    })

    return { success: true, data: posts }
  } catch (error) {
    console.error('Error fetching user posts:', error)
    return { success: false, error: 'Failed to fetch posts' }
  }
}
