import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch user's game results
    const gameResults = await db.gameResult.findMany({
      where: {
        userId
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 50 // Limit to last 50 games
    })

    // Calculate user statistics
    const totalGames = gameResults.length
    const averageWPM = totalGames > 0 
      ? gameResults.reduce((sum, game) => sum + game.wpm, 0) / totalGames 
      : 0
    const averageAccuracy = totalGames > 0 
      ? gameResults.reduce((sum, game) => sum + game.accuracy, 0) / totalGames 
      : 0
    const bestWPM = totalGames > 0 
      ? Math.max(...gameResults.map(game => game.wpm)) 
      : 0
    const totalWordsTyped = gameResults.reduce((sum, game) => sum + game.totalWords, 0)
    const totalTimeSpent = gameResults.reduce((sum, game) => sum + game.timeSpent, 0)

    const stats = {
      totalGames,
      averageWPM,
      averageAccuracy,
      bestWPM,
      totalWordsTyped,
      totalTimeSpent
    }

    return NextResponse.json({
      success: true,
      results: gameResults,
      stats
    })
  } catch (error) {
    console.error('Error fetching game history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}