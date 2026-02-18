import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // Create or update user in database
    const dbUser = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        email,
        name,
        role: 'USER',
        verified: false,
        suspended: false,
      },
    })

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
