'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Clock, 
  Target, 
  Zap, 
  Users, 
  MessageSquare, 
  Play, 
  RotateCcw,
  TrendingUp,
  Award,
  Keyboard,
  LogOut,
  User,
  Lock
} from 'lucide-react'
import StatsChart from '@/components/StatsChart'
import ChatComponent from '@/components/ChatComponent'
import GameStats from '@/components/GameStats'
import PremiumOverlay from '@/components/PremiumOverlay'
import { useTypingGame } from '@/hooks/useTypingGame'
import { useSocket } from '@/hooks/useSocket'

export default function TypingGame() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const {
    currentText,
    gameStats,
    startGame,
    resetGame,
    handleKeyPress,
    calculateStats
  } = useTypingGame()

  const { messages, sendMessage, connectedUsers } = useSocket()

  const isAuthenticated = status === 'authenticated' && session

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to start/reset game
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (gameState === 'idle') {
          handleStartGame()
        } else {
          handleResetGame()
        }
      }
      
      // Escape to reset game
      if (e.key === 'Escape' && gameState !== 'idle') {
        handleResetGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === 'playing' && startTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [gameState, startTime])

  // Sample texts for different difficulties
  const sampleTexts = {
    easy: "The quick brown fox jumps over the lazy dog. This pangram sentence contains every letter of the alphabet at least once.",
    medium: "In the heart of the bustling city, where skyscrapers touched the clouds and streets hummed with endless activity, there existed a small café that served as a sanctuary for those seeking moments of tranquility.",
    hard: "The implementation of sophisticated algorithms in modern computational systems has revolutionized the way we approach complex problem-solving, enabling unprecedented levels of efficiency and accuracy in data processing and analysis across various domains of scientific research and technological innovation."
  }

  const currentDisplayText = sampleTexts[selectedDifficulty]

  const handleStartGame = () => {
    startGame(currentDisplayText)
    setGameState('playing')
    setStartTime(Date.now())
    setTimeElapsed(0)
    setUserInput('')
    inputRef.current?.focus()
  }

  const handleResetGame = () => {
    resetGame()
    setGameState('idle')
    setStartTime(null)
    setTimeElapsed(0)
    setUserInput('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Prevent typing past the text length
    if (value.length > currentDisplayText.length) {
      return
    }
    
    setUserInput(value)
    handleKeyPress(value)
    
    // Check if game is finished
    if (value === currentDisplayText) {
      setGameState('finished')
      calculateStats(value, currentDisplayText, timeElapsed)
      
      // Save game result to database
      saveGameResult(value, currentDisplayText, timeElapsed)
    }
  }

  const saveGameResult = async (userInput: string, text: string, timeSpent: number) => {
    try {
      const wpm = calculateWPM()
      const accuracy = calculateAccuracy()
      const totalWords = text.trim().split(/\s+/).length
      const correctWords = userInput.trim().split(/\s+/).length
      
      const response = await fetch('/api/game-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wpm,
          accuracy,
          totalWords,
          correctWords,
          timeSpent,
          difficulty: selectedDifficulty,
          textId: 'demo-text'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(data.message || 'Game result saved successfully')
      }
    } catch (error) {
      console.error('Error saving game result:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateWPM = () => {
    if (!timeElapsed) return 0
    const words = userInput.trim().split(/\s+/).length
    return Math.round((words / timeElapsed) * 60)
  }

  const calculateAccuracy = () => {
    if (!userInput.length) return 100
    let correct = 0
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentDisplayText[i]) correct++
    }
    return Math.round((correct / userInput.length) * 100)
  }

  const progress = (userInput.length / currentDisplayText.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with User Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TypeMaster Pro
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {isAuthenticated 
                ? 'Improve your typing skills with real-time stats' 
                : 'Play typing game for free - Sign up to save progress and chat!'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Download Project Button */}
            <a 
              href="/TypeMaster-Pro.zip" 
              download="TypeMaster-Pro.zip"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.586-3.414-3.414A4 4 0 01-3.414-3.414L7 7m0 10a4 4 0 01-3.414 3.414L17 7m0 10a4 4 0 013.414 3.414L7 17m10 0a4 4 0 013.414-3.414L17 7m-10z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 4h2m-6 0v6m0-4H6" />
              </svg>
              Download Project
            </a>
            
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ''} />
                    <AvatarFallback>
                      {session.user.username?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{session.user.username || session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                </div>
                
                {/* Profile & Sign Out */}
                <div className="flex items-center gap-2">
                  <Link href="/profile">
                    <Button variant="outline" size="sm">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              /* Sign In/Up Buttons */
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="flex items-center gap-1">
            <Keyboard className="h-3 w-3" />
            Ctrl+Enter: Start
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Keyboard className="h-3 w-3" />
            Esc: Reset
          </Badge>
        </div>

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Panel - Game */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Game Controls */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <Target className="h-5 w-5" />
                    Typing Challenge
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={gameState === 'playing' ? 'default' : 'secondary'} className="text-xs">
                      {gameState === 'idle' ? 'Ready' : gameState === 'playing' ? 'Playing' : 'Finished'}
                    </Badge>
                    {connectedUsers > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3" />
                        {connectedUsers}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Difficulty Selection */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={selectedDifficulty === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(level)}
                      disabled={gameState === 'playing'}
                      className="text-xs sm:text-sm"
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Game Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs lg:text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                      Time
                    </div>
                    <div className="text-lg lg:text-2xl font-bold">{formatTime(timeElapsed)}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs lg:text-sm text-muted-foreground">
                      <Zap className="h-3 w-3 lg:h-4 lg:w-4" />
                      WPM
                    </div>
                    <div className="text-lg lg:text-2xl font-bold">{calculateWPM()}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs lg:text-sm text-muted-foreground">
                      <Target className="h-3 w-3 lg:h-4 lg:w-4" />
                      Accuracy
                    </div>
                    <div className="text-lg lg:text-2xl font-bold">{calculateAccuracy()}%</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs lg:text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4" />
                      Progress
                    </div>
                    <div className="text-lg lg:text-2xl font-bold">{Math.round(progress)}%</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress value={progress} className="h-2" />

                {/* Text Display */}
                <div className="p-4 lg:p-6 bg-muted/50 rounded-lg min-h-[100px] lg:min-h-[120px]">
                  <div className="text-sm lg:text-lg leading-relaxed font-mono break-words">
                    {currentDisplayText.split('').map((char, index) => {
                      let className = 'text-muted-foreground'
                      if (index < userInput.length) {
                        className = userInput[index] === char ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950'
                      } else if (index === userInput.length) {
                        className = 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      }
                      return (
                        <span key={index} className={className}>
                          {char}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Input Area */}
                <div className="space-y-2">
                  <Input
                    ref={inputRef}
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Start typing here..."
                    disabled={gameState !== 'playing'}
                    className="text-base lg:text-lg p-3 lg:p-4"
                  />
                  <div className="flex gap-2 justify-center">
                    {gameState === 'idle' && (
                      <Button onClick={handleStartGame} size="lg" className="flex items-center gap-2 text-sm lg:text-base">
                        <Play className="h-4 w-4" />
                        Start Game
                      </Button>
                    )}
                    {gameState === 'playing' && (
                      <Button onClick={handleResetGame} variant="outline" size="lg" className="flex items-center gap-2 text-sm lg:text-base">
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>
                    )}
                    {gameState === 'finished' && (
                      <div className="text-center space-y-2 w-full">
                        <div className="text-lg lg:text-2xl font-bold text-green-600 dark:text-green-400">
                          🎉 Game Completed!
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Button onClick={handleResetGame} size="lg" className="flex items-center gap-2 text-sm lg:text-base">
                            <RotateCcw className="h-4 w-4" />
                            Play Again
                          </Button>
                          {!isAuthenticated && (
                            <Link href="/auth/signup">
                              <Button size="lg" className="flex items-center gap-2 text-sm lg:text-base">
                                <User className="h-4 w-4" />
                                Sign Up to Save Progress
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Visualization */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 lg:h-80">
                  {isAuthenticated ? (
                    <StatsChart />
                  ) : (
                    <PremiumOverlay
                      feature="stats"
                      title="Performance Analytics"
                      description="Sign in to view your typing statistics and track your progress over time."
                    >
                      <StatsChart />
                    </PremiumOverlay>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Chat & Stats */}
          <div className="space-y-4 lg:space-y-6">
            {/* Live Chat */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <MessageSquare className="h-5 w-5" />
                  Live Chat
                  {connectedUsers > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {connectedUsers} online
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 lg:h-96">
                  {isAuthenticated ? (
                    <ChatComponent 
                      messages={messages} 
                      onSendMessage={sendMessage}
                      username={session.user.username || session.user.name || 'User'}
                    />
                  ) : (
                    <PremiumOverlay
                      feature="chat"
                      title="Live Chat"
                      description="Join the conversation with other typists! Sign in to access the chat room."
                    >
                      <ChatComponent 
                        messages={[]} 
                        onSendMessage={() => {}}
                      />
                    </PremiumOverlay>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Game Stats */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <Award className="h-5 w-5" />
                  Game Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  <GameStats stats={gameStats} />
                ) : (
                  <PremiumOverlay
                    feature="profile"
                    title="Game Statistics"
                    description="Track your achievements, view detailed statistics, and monitor your improvement over time."
                  >
                    <GameStats stats={gameStats} />
                  </PremiumOverlay>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}