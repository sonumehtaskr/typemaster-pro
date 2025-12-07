'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
}

export function useSocket() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connectedUsers, setConnectedUsers] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('/?XTransformPort=3001')
    
    const socket = socketRef.current

    socket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to chat server')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from chat server')
    })

    socket.on('message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    })

    socket.on('userCount', (count: number) => {
      setConnectedUsers(count)
    })

    socket.on('previousMessages', (previousMessages: ChatMessage[]) => {
      setMessages(previousMessages)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const sendMessage = useCallback((message: string, username: string = 'Anonymous') => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('message', {
        username,
        message,
        timestamp: new Date()
      })
    }
  }, [isConnected])

  return {
    messages,
    connectedUsers,
    isConnected,
    sendMessage
  }
}