'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Users } from 'lucide-react'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
}

interface ChatComponentProps {
  messages: ChatMessage[]
  onSendMessage: (message: string, username?: string) => void
  username?: string
}

export default function ChatComponent({ messages, onSendMessage, username: propUsername }: ChatComponentProps) {
  const [inputMessage, setInputMessage] = useState('')
  const [username, setUsername] = useState(propUsername || `User${Math.floor(Math.random() * 1000)}`)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim(), username)
      setInputMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-3 lg:p-4 border rounded-lg bg-background"
      >
        <div className="space-y-3 lg:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 lg:py-8">
              <Users className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm lg:text-base">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex gap-2 lg:gap-3 items-start">
                <Avatar className="h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.username}`} />
                  <AvatarFallback className="text-xs">
                    {message.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs lg:text-sm truncate">{message.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-xs lg:text-sm bg-muted/50 rounded-lg p-2 break-words">
                    {message.message}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Username Display */}
      <div className="px-2 py-1 border-t">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Posting as:</span>
          <Badge variant="secondary" className="text-xs">
            {username}
          </Badge>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2 pt-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 text-sm"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          size="icon"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}