'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  image: z.string().optional(),
})

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, data: user }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { success: false, error: 'Failed to fetch user profile' }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, data: user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: 'Failed to fetch user' }
  }
}

export async function createUser(data: { email: string; name?: string; image?: string }) {
  try {
    const user = await prisma.user.create({
      data,
    })

    return { success: true, data: user }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function updateUserProfile(userId: string, data: z.infer<typeof profileSchema>) {
  try {
    const validatedData = profileSchema.parse(data)

    const user = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
    })

    revalidatePath('/dashboard')
    revalidatePath(`/profile/${user.id}`)

    return { success: true, data: user }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Error updating user profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function getCategories(type?: 'MARKETPLACE' | 'COMMUNITY') {
  try {
    const where = type ? { type } : undefined

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return { success: true, data: categories }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, error: 'Failed to fetch categories' }
  }
}
