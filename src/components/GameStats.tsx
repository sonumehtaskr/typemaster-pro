'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  Flame,
  Star
} from 'lucide-react'

interface GameStats {
  wpm: number
  accuracy: number
  totalWords: number
  correctWords: number
  timeSpent: number
}

interface GameStatsProps {
  stats: GameStats
}

export default function GameStats({ stats }: GameStatsProps) {
  const getPerformanceLevel = (wpm: number) => {
    if (wpm >= 80) return { level: 'Expert', color: 'bg-purple-500', icon: Trophy }
    if (wpm >= 60) return { level: 'Advanced', color: 'bg-blue-500', icon: Zap }
    if (wpm >= 40) return { level: 'Intermediate', color: 'bg-green-500', icon: Target }
    return { level: 'Beginner', color: 'bg-yellow-500', icon: Star }
  }

  const getAccuracyGrade = (accuracy: number) => {
    if (accuracy >= 98) return { grade: 'A+', color: 'text-green-600' }
    if (accuracy >= 95) return { grade: 'A', color: 'text-green-500' }
    if (accuracy >= 90) return { grade: 'B', color: 'text-yellow-600' }
    if (accuracy >= 80) return { grade: 'C', color: 'text-orange-600' }
    return { grade: 'D', color: 'text-red-600' }
  }

  const performance = getPerformanceLevel(stats.wpm)
  const accuracyGrade = getAccuracyGrade(stats.accuracy)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Game Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Level */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <performance.icon className="h-6 w-6 text-muted-foreground" />
            <Badge className={`${performance.color} text-white`}>
              {performance.level}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Current Performance Level
          </p>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Speed</span>
            </div>
            <span className="text-lg font-bold">{stats.wpm} WPM</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{stats.accuracy}%</span>
              <Badge variant="outline" className={accuracyGrade.color}>
                {accuracyGrade.grade}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <span className="text-lg font-bold">
              {Math.floor(stats.timeSpent / 60)}:{(stats.timeSpent % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Word Statistics */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Word Statistics</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Words</span>
              <span className="font-medium">{stats.totalWords}</span>
            </div>
            <Progress 
              value={(stats.correctWords / Math.max(stats.totalWords, 1)) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Correct: {stats.correctWords}</span>
              <span className="text-red-600">
                Errors: {stats.totalWords - stats.correctWords}
              </span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Achievements</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className={`text-center p-2 rounded-lg border ${
              stats.wpm >= 40 ? 'bg-yellow-50 border-yellow-200' : 'opacity-30'
            }`}>
              <Star className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
              <p className="text-xs">Fast Typer</p>
            </div>
            <div className={`text-center p-2 rounded-lg border ${
              stats.accuracy >= 95 ? 'bg-green-50 border-green-200' : 'opacity-30'
            }`}>
              <Target className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <p className="text-xs">Precision</p>
            </div>
            <div className={`text-center p-2 rounded-lg border ${
              stats.timeSpent >= 60 ? 'bg-blue-50 border-blue-200' : 'opacity-30'
            }`}>
              <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <p className="text-xs">Endurance</p>
            </div>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border">
          <div className="flex items-center justify-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-lg font-bold">0</span>
          </div>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
      </CardContent>
    </Card>
  )
}