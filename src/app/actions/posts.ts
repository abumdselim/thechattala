'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(data: {
  title: string
  titleBn?: string
  content: string
  image?: string
}) {
  const user = await requireAuth()

  if (user.suspended) {
    throw new Error('Your account is suspended')
  }

  const post = await prisma.post.create({
    data: {
      ...data,
      authorId: user.id,
    },
  })

  revalidatePath('/community')
  revalidatePath('/profile/posts')
  return post
}

export async function updatePost(
  id: string,
  data: {
    title?: string
    titleBn?: string
    content?: string
    image?: string
  }
) {
  const user = await requireAuth()

  const existingPost = await prisma.post.findUnique({
    where: { id },
  })

  if (!existingPost) {
    throw new Error('Post not found')
  }

  if (existingPost.authorId !== user.id) {
    throw new Error('Unauthorized: You can only update your own posts')
  }

  const post = await prisma.post.update({
    where: { id },
    data,
  })

  revalidatePath('/community')
  revalidatePath('/profile/posts')
  revalidatePath(`/community/${id}`)
  return post
}

export async function deletePost(id: string) {
  const user = await requireAuth()

  const existingPost = await prisma.post.findUnique({
    where: { id },
  })

  if (!existingPost) {
    throw new Error('Post not found')
  }

  if (existingPost.authorId !== user.id) {
    throw new Error('Unauthorized: You can only delete your own posts')
  }

  const post = await prisma.post.delete({
    where: { id },
  })

  revalidatePath('/community')
  revalidatePath('/profile/posts')
  return post
}

export async function getPosts(filters?: {
  search?: string
  authorId?: string
  page?: number
  limit?: number
}) {
  const page = filters?.page || 1
  const limit = filters?.limit || 20
  const skip = (page - 1) * limit

  const where: any = {}

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters?.authorId) {
    where.authorId = filters.authorId
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            verified: true,
            image: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ])

  return {
    posts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          verified: true,
          image: true,
          createdAt: true,
        },
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              verified: true,
              image: true,
            },
          },
        },
      },
    },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  return post
}

export async function createComment(postId: string, content: string) {
  const user = await requireAuth()

  if (user.suspended) {
    throw new Error('Your account is suspended')
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: user.id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          verified: true,
          image: true,
        },
      },
    },
  })

  revalidatePath(`/community/${postId}`)
  return comment
}

export async function getUserPosts() {
  const user = await requireAuth()

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  })

  return posts
}
