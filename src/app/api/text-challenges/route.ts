import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    const category = searchParams.get('category')

    // Build where clause
    const where: any = {}
    if (difficulty) {
      where.difficulty = difficulty
    }
    if (category) {
      where.category = category
    }

    // Get text challenges
    const challenges = await db.textChallenge.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to 20 challenges
    })

    return NextResponse.json({ 
      success: true, 
      data: challenges 
    })
  } catch (error) {
    console.error('Error fetching text challenges:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch text challenges' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, difficulty, category } = body

    // Validate required fields
    if (!title || !content || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Count words in content
    const wordCount = content.trim().split(/\s+/).length

    // Create new text challenge
    const challenge = await db.textChallenge.create({
      data: {
        title,
        content,
        difficulty,
        category: category || 'general',
        wordCount
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: challenge 
    })
  } catch (error) {
    console.error('Error creating text challenge:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create text challenge' },
      { status: 500 }
    )
  }
}