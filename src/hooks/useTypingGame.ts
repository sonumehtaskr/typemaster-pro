'use client'

import { useState, useCallback, useEffect } from 'react'

interface GameStats {
  wpm: number
  accuracy: number
  totalWords: number
  correctWords: number
  timeSpent: number
}

export function useTypingGame() {
  const [currentText, setCurrentText] = useState('')
  const [gameStats, setGameStats] = useState<GameStats>({
    wpm: 0,
    accuracy: 100,
    totalWords: 0,
    correctWords: 0,
    timeSpent: 0
  })
  const [typedChars, setTypedChars] = useState<Array<{char: string, correct: boolean, timestamp: number}>>([])

  const startGame = useCallback((text: string) => {
    setCurrentText(text)
    setGameStats({
      wpm: 0,
      accuracy: 100,
      totalWords: 0,
      correctWords: 0,
      timeSpent: 0
    })
    setTypedChars([])
  }, [])

  const resetGame = useCallback(() => {
    setCurrentText('')
    setGameStats({
      wpm: 0,
      accuracy: 100,
      totalWords: 0,
      correctWords: 0,
      timeSpent: 0
    })
    setTypedChars([])
  }, [])

  const handleKeyPress = useCallback((input: string) => {
    if (!currentText || input.length <= typedChars.length) return

    const currentIndex = input.length - 1
    const typedChar = input[currentIndex]
    const expectedChar = currentText[currentIndex]
    const isCorrect = typedChar === expectedChar

    setTypedChars(prev => [...prev, {
      char: typedChar,
      correct: isCorrect,
      timestamp: Date.now()
    }])
  }, [currentText, typedChars.length])

  const calculateStats = useCallback((input: string, text: string, timeSpentSeconds: number) => {
    const wordsTyped = input.trim().split(/\s+/).length
    const wordsInText = text.trim().split(/\s+/).length
    
    // Calculate WPM
    const wpm = timeSpentSeconds > 0 ? Math.round((wordsTyped / timeSpentSeconds) * 60) : 0
    
    // Calculate accuracy
    let correctChars = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correctChars++
    }
    const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100
    
    // Calculate correct words
    const inputWords = input.trim().split(/\s+/)
    const textWords = text.trim().split(/\s+/)
    let correctWords = 0
    for (let i = 0; i < Math.min(inputWords.length, textWords.length); i++) {
      if (inputWords[i] === textWords[i]) correctWords++
    }

    setGameStats({
      wpm,
      accuracy,
      totalWords: wordsTyped,
      correctWords,
      timeSpent: timeSpentSeconds
    })
  }, [])

  return {
    currentText,
    gameStats,
    typedChars,
    startGame,
    resetGame,
    handleKeyPress,
    calculateStats
  }
}