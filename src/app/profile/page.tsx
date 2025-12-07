'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Trophy, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp,
  Calendar,
  Award,
  Gamepad2,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface GameResult {
  id: string
  wpm: number
  accuracy: number
  totalWords: number
  correctWords: number
  timeSpent: number
  difficulty: string
  completedAt: string
}

interface UserStats {
  totalGames: number
  averageWPM: number
  averageAccuracy: number
  bestWPM: number
  totalWordsTyped: number
  totalTimeSpent: number
}

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [gameHistory, setGameHistory] = useState<GameResult[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchGameHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/game-history?userId=${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setGameHistory(data.results || [])
        setUserStats(data.stats || null)
      }
    } catch (error) {
      console.error('Error fetching game history:', error)
    } finally {
      setLoading(false)
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  // Fetch user game history
  useEffect(() => {
    if (session?.user?.id) {
      fetchGameHistory()
    }
  }, [session])

  // Don't render if loading or not authenticated
  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPerformanceLevel = (wpm: number) => {
    if (wpm >= 80) return { level: 'Expert', color: 'text-purple-600' }
    if (wpm >= 60) return { level: 'Advanced', color: 'text-blue-600' }
    if (wpm >= 40) return { level: 'Intermediate', color: 'text-green-600' }
    return { level: 'Beginner', color: 'text-yellow-600' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Game
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">My Profile</h1>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback className="text-lg">
                  {session.user.username?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{session.user.username || session.user.name}</h2>
                <p className="text-muted-foreground">{session.user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  Member since {new Date(session.user.createdAt as string).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Overview */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{userStats.totalGames}</div>
                <p className="text-sm text-muted-foreground">Total Games</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{Math.round(userStats.averageWPM)}</div>
                <p className="text-sm text-muted-foreground">Average WPM</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{Math.round(userStats.averageAccuracy)}%</div>
                <p className="text-sm text-muted-foreground">Average Accuracy</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{userStats.bestWPM}</div>
                <p className="text-sm text-muted-foreground">Best WPM</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game History */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Game History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading game history...</p>
              </div>
            ) : gameHistory.length === 0 ? (
              <div className="text-center py-8">
                <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No games played yet</p>
                <Link href="/">
                  <Button>Start Your First Game</Button>
                </Link>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {gameHistory.map((game) => {
                    const performance = getPerformanceLevel(game.wpm)
                    return (
                      <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">{game.wpm}</div>
                            <p className="text-xs text-muted-foreground">WPM</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{game.accuracy}%</div>
                            <p className="text-xs text-muted-foreground">Accuracy</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{formatTime(game.timeSpent)}</div>
                            <p className="text-xs text-muted-foreground">Time</p>
                          </div>
                          <Badge className={getDifficultyColor(game.difficulty)}>
                            {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={performance.color}>
                            {performance.level}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(game.completedAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}