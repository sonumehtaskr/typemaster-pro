'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, MessageSquare, Trophy, BarChart3, User } from 'lucide-react'
import Link from 'next/link'

interface PremiumOverlayProps {
  feature: 'chat' | 'stats' | 'profile' | 'leaderboard'
  title: string
  description: string
  children: React.ReactNode
}

export default function PremiumOverlay({ feature, title, description, children }: PremiumOverlayProps) {
  const getIcon = () => {
    switch (feature) {
      case 'chat': return <MessageSquare className="h-8 w-8" />
      case 'stats': return <BarChart3 className="h-8 w-8" />
      case 'profile': return <User className="h-8 w-8" />
      case 'leaderboard': return <Trophy className="h-8 w-8" />
      default: return <Lock className="h-8 w-8" />
    }
  }

  return (
    <div className="relative">
      {/* Blurred Content */}
      <div className="blur-sm opacity-60 pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
        <Card className="max-w-sm mx-4 shadow-2xl border-2 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4 text-primary">
              {getIcon()}
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            
            <div className="space-y-2">
              <Link href="/auth/signin">
                <Button className="w-full" size="sm">
                  Sign In to Access
                </Button>
              </Link>
              
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full" size="sm">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}