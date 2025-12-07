import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      username?: string
      image?: string | null
      createdAt?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    username?: string
    avatar?: string | null
    createdAt?: Date
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string
    createdAt?: string
  }
}