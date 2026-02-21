import { NextRequest, NextResponse } from 'next/server'
import { getPost } from '@/app/actions/posts'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const [post, user] = await Promise.all([
      getPost(id),
      getCurrentUser(),
    ])

    const isAuthor = user?.id === post.authorId

    return NextResponse.json({
      post,
      isAuthor,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }
}
