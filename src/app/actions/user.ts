'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const user = await requireAuth()

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      _count: {
        select: {
          products: true,
          posts: true,
          comments: true,
        },
      },
    },
  })

  if (!profile) {
    throw new Error('Profile not found')
  }

  return profile
}

export async function updateProfile(data: {
  name?: string
  image?: string
}) {
  const user = await requireAuth()

  if (user.suspended) {
    throw new Error('Your account is suspended')
  }

  const profile = await prisma.user.update({
    where: { id: user.id },
    data,
  })

  revalidatePath('/profile')
  revalidatePath('/profile/settings')
  return profile
}

export async function updateAvatar(imageUrl: string) {
  const user = await requireAuth()

  if (user.suspended) {
    throw new Error('Your account is suspended')
  }

  const profile = await prisma.user.update({
    where: { id: user.id },
    data: { image: imageUrl },
  })

  revalidatePath('/profile')
  revalidatePath('/profile/settings')
  return profile
}
