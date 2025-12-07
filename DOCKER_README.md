# TypeMaster Pro - Advanced Typing Game

A modern, responsive typing game with real-time chat, performance analytics, and user authentication built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **🎮 Typing Game**: Multiple difficulty levels with real-time WPM and accuracy tracking
- **💬 Live Chat**: Real-time chat room for authenticated users (Socket.IO)
- **📊 Performance Analytics**: Interactive charts and statistics visualization (ECharts)
- **👥 User Authentication**: Secure login/registration with email verification
- **📱 Responsive Design**: Mobile-first design with beautiful UI/UX
- **🎯 Anonymous Mode**: Play without registration, premium features blurred
- **🏆 Progress Tracking**: Save game history and track improvement over time

## 🐳 Docker Setup

### Prerequisites

- [Docker](https://www.docker.com/get-started/) (version 20.0 or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or later)

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd typemaster-pro
   ```

2. **Start with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Main App: http://localhost:3000
   - Chat Service: http://localhost:3001

### Services

The Docker setup includes the following services:

#### 1. Main Application (Port 3000)
- **Next.js 15** application with TypeScript
- **Authentication** system with NextAuth.js
- **Database** integration with Prisma ORM
- **Real-time** features and responsive UI

#### 2. Chat Service (Port 3001)
- **Socket.IO** server for real-time chat
- **Independent** Node.js service
- **Scalable** architecture

#### 3. Optional Services
You can enable additional services by uncommenting them in `docker-compose.yml`:

**PostgreSQL Database** (Port 5432):
```yaml
# Uncomment in docker-compose.yml
db:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: typemaster
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: password
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

**Redis Cache** (Port 6379):
```yaml
# Uncomment in docker-compose.yml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=file:/app/data/custom.db

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Optional: External Database
# DATABASE_URL=postgresql://postgres:password@localhost:5432/typemaster
```

### Development vs Production

**Development Mode**:
```bash
docker-compose up
```

**Production Mode**:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## 🛠️ Development Setup

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up database**:
   ```bash
   npm run db:push
   ```

3. **Start development servers**:
   ```bash
   # Main application
   npm run dev
   
   # Chat service (in separate terminal)
   cd mini-services/chat-service
   npm run dev
   ```

### Database Setup

**SQLite (Default)**:
```bash
npm run db:push
```

**PostgreSQL (Optional)**:
1. Uncomment PostgreSQL service in `docker-compose.yml`
2. Update `DATABASE_URL` in `.env`
3. Restart services

## 📁 Project Structure

```
typemaster-pro/
├── src/app/                    # Next.js App Router pages
├── src/components/               # React components
├── src/hooks/                   # Custom React hooks
├── src/lib/                     # Utility libraries
├── mini-services/               # Microservices
│   └── chat-service/           # Socket.IO chat service
├── prisma/                     # Database schema and migrations
├── docker-compose.yml           # Docker services configuration
├── Dockerfile                  # Main application container
└── README.md                   # This file
```

## 🔒 Security Features

- **Authentication**: NextAuth.js with secure session management
- **Password Hashing**: bcryptjs for secure password storage
- **API Protection**: Middleware for protected routes
- **Input Validation**: Comprehensive form validation
- **CORS Configuration**: Proper cross-origin setup

## 🎮 Game Features

### Anonymous Users
- ✅ Play typing challenges
- ✅ Real-time performance feedback
- ❌ Chat (blurred with signup prompt)
- ❌ Analytics (blurred with signup prompt)
- ❌ Progress saving

### Authenticated Users
- ✅ All typing features
- ✅ Live chat with user identity
- ✅ Performance analytics and charts
- ✅ Game history and statistics
- ✅ User profile and achievements

## 📱 Mobile Support

- **Responsive Design**: Mobile-first approach
- **Touch-Friendly**: Optimized for mobile interaction
- **Progressive Enhancement**: Works on all screen sizes
- **PWA Ready**: Can be installed as mobile app

## 🚀 Deployment

### Docker Production

1. **Build and deploy**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Behind reverse proxy** (nginx/Apache):
   ```nginx
   server {
       listen 80;
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /socket.io/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }
   ```

### Environment Variables for Production

```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
DATABASE_URL=your-production-database-url
```

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :3001
   ```

2. **Database connection**:
   ```bash
   # Check database container logs
   docker-compose logs db
   
   # Recreate database
   docker-compose down -v
   docker-compose up -d
   ```

3. **Build issues**:
   ```bash
   # Rebuild containers
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Health Checks

All services include health checks:
```bash
# Check service status
docker-compose ps

# View service logs
docker-compose logs app
docker-compose logs chat-service
```

## 📊 Monitoring

### Application Logs
```bash
# View all logs
docker-compose logs -f

# Follow specific service
docker-compose logs -f app
```

### Performance Monitoring
- Application metrics available at `/api/health`
- Chat service metrics at socket.io endpoints
- Database query performance logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the documentation for common solutions

---

**Built with ❤️ using Next.js 15, TypeScript, Tailwind CSS, and Docker**