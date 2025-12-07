import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'

const PORT = 3001

// Create HTTP server
const httpServer = createServer()

// Enable CORS
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
})

// Apply CORS middleware to the HTTP server
httpServer.on('request', corsMiddleware)

// Create Socket.IO server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Store connected users and messages
let connectedUsers = 0
const messages: Array<{
  id: string
  username: string
  message: string
  timestamp: Date
}> = []

// Generate unique ID for messages
const generateId = () => Math.random().toString(36).substr(2, 9)

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)
  connectedUsers++

  // Send current user count to all clients
  io.emit('userCount', connectedUsers)

  // Send previous messages to new user
  socket.emit('previousMessages', messages)

  // Handle new messages
  socket.on('message', (data) => {
    const message = {
      id: generateId(),
      username: data.username || 'Anonymous',
      message: data.message,
      timestamp: new Date()
    }

    // Store message (keep last 50 messages)
    messages.push(message)
    if (messages.length > 50) {
      messages.shift()
    }

    // Broadcast message to all clients
    io.emit('message', message)
    
    console.log(`Message from ${message.username}: ${message.message}`)
  })

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.broadcast.emit('userTyping', {
      username: data.username,
      isTyping: data.isTyping
    })
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    connectedUsers--
    io.emit('userCount', connectedUsers)
  })

  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error)
  })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`)
  console.log(`Socket.IO server ready for connections`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  httpServer.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  httpServer.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})