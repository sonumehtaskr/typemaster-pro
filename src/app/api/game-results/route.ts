import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get top 10 game results by WPM
    const topResults = await db.gameResult.findMany({
      take: 10,
      orderBy: { wpm: 'desc' },
      include: {
        user: {
          select: {
            username: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: topResults 
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wpm, accuracy, totalWords, correctWords, timeSpent, difficulty, textId } = body

    // Validate required fields
    if (!wpm || !accuracy || !totalWords || !timeSpent) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (session?.user?.id) {
      // Authenticated user - save to database
      const gameResult = await db.gameResult.create({
        data: {
          userId: session.user.id,
          wpm: parseFloat(wpm),
          accuracy: parseFloat(accuracy),
          totalWords: parseInt(totalWords),
          correctWords: parseInt(correctWords),
          incorrectWords: parseInt(totalWords) - parseInt(correctWords),
          timeSpent: parseInt(timeSpent),
          difficulty: difficulty || 'medium',
          textId: textId || 'unknown'
        },
        include: {
          user: {
            select: {
              username: true,
              avatar: true
            }
          }
        }
      })

      return NextResponse.json({ 
        success: true, 
        data: gameResult,
        message: 'Game result saved successfully!'
      })
    } else {
      // Anonymous user - return success but don't save to database
      return NextResponse.json({ 
        success: true, 
        message: 'Game completed! Sign up to save your progress and compete on leaderboards.',
        data: {
          wpm: parseFloat(wpm),
          accuracy: parseFloat(accuracy),
          totalWords: parseInt(totalWords),
          correctWords: parseInt(correctWords),
          timeSpent: parseInt(timeSpent),
          difficulty: difficulty || 'medium',
          anonymous: true
        }
      })
    }
  } catch (error) {
    console.error('Error saving game result:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save game result' },
      { status: 500 }
    )
  }
}