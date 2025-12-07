import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, name, avatar } = body

    // Validate required fields
    if (!username || !email) {
      return NextResponse.json(
        { success: false, error: 'Username and email are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this username or email already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const user = await db.user.create({
      data: {
        username,
        email,
        name: name || username,
        avatar: avatar || null
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: user 
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    const id = searchParams.get('id')

    // Build where clause
    const where: any = {}
    if (username) {
      where.username = username
    }
    if (id) {
      where.id = id
    }

    // Get user(s)
    const users = await db.user.findMany({
      where,
      include: {
        gameResults: {
          take: 10,
          orderBy: { completedAt: 'desc' }
        },
        _count: {
          select: {
            gameResults: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: users 
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}