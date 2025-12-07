# 📥 Download & Setup TypeMaster Pro for VS Code

## 🎯 **Quick Start Guide**

### **Step 1: Get the Project Files**

You need to copy/download all the project files. Here's the complete structure:

```
typemaster-pro/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main typing game page
│   │   ├── auth/
│   │   │   ├── signin/page.tsx         # Login page
│   │   │   └── signup/page.tsx         # Registration page
│   │   ├── profile/page.tsx             # User profile page
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts  # NextAuth configuration
│   │       ├── game-results/route.ts          # Game results API
│   │       ├── users/game-history/route.ts     # User statistics API
│   │       └── auth/register/route.ts          # User registration API
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components (25+ files)
│   │   ├── StatsChart.tsx            # ECharts performance visualization
│   │   ├── ChatComponent.tsx          # Real-time chat component
│   │   ├── GameStats.tsx             # Game statistics display
│   │   ├── PremiumOverlay.tsx         # Blurred overlay for premium features
│   │   └── providers.tsx            # Session provider wrapper
│   ├── hooks/
│   │   ├── useTypingGame.ts         # Typing game logic
│   │   ├── useSocket.ts              # Socket.IO integration
│   │   └── use-toast.ts             # Toast notifications
│   ├── lib/
│   │   ├── db.ts                    # Prisma database client
│   │   ├── auth.ts                  # NextAuth configuration
│   │   └── utils.ts                 # Utility functions
│   └── types/
│       └── next-auth.d.ts            # NextAuth type extensions
├── mini-services/
│   └── chat-service/
│       ├── index.ts                  # Socket.IO chat server
│       ├── package.json              # Chat service dependencies
│       └── Dockerfile               # Chat service container
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── public/
│   └── logo.svg                  # Application logo
├── Dockerfile                     # Main application container
├── docker-compose.yml              # Development environment
├── docker-compose.prod.yml          # Production environment
├── Makefile                      # Common Docker commands
├── setup-docker.sh                # Automated setup script
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS config
├── next.config.ts                # Next.js configuration
├── eslint.config.mjs              # ESLint configuration
├── components.json               # shadcn/ui configuration
├── DOCKER_README.md              # Docker documentation
├── DOCKER_SETUP_COMPLETE.md      # Docker setup summary
└── ANONYMOUS_FEATURES.md         # Feature documentation
```

### **Step 2: Create Project Folder**

```bash
# Create project directory
mkdir typemaster-pro
cd typemaster-pro
```

### **Step 3: Open in VS Code**

```bash
# Open the project in VS Code
code .
```

## 🔧 **Initial Setup in VS Code**

### **1. Install Dependencies**
Open VS Code terminal (`Ctrl+```) and run:

```bash
# Install all Node.js dependencies
npm install
```

### **2. Set Up Environment**
Create a `.env` file with:

```env
# Database
DATABASE_URL=file:/app/data/custom.db

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=typemaster-secret-key-change-in-production

# Application
NODE_ENV=development
```

### **3. Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npm run db:push
```

### **4. Create Test User (Optional)**
```bash
# Create test user for demo
npx tsx create-test-user.ts
```

## 🚀 **Start Development**

### **Option 1: Standard Development**
```bash
# Terminal 1: Main application
npm run dev

# Terminal 2: Chat service (new terminal)
cd mini-services/chat-service
npm run dev
```

### **Option 2: Docker Development**
```bash
# Quick automated setup
./setup-docker.sh

# Or use Makefile
make up
```

## 📱 **Access the Application**

- **Main App**: http://localhost:3000
- **Chat Service**: http://localhost:3001
- **Database**: SQLite file in `db/custom.db`

## 🎮 **Demo Credentials**

- **Email**: test@example.com
- **Password**: password123

## 🔍 **VS Code Extensions to Install**

1. **ES7+ React/Redux/React-Native snippets**
2. **Prettier - Code formatter**
3. **ESLint**
4. **Tailwind CSS IntelliSense**
5. **Prisma**
6. **Thunder Client**
7. **GitLens**
8. **Auto Rename Tag**
9. **Bracket Pair Colorizer**
10. **DotENV**

## 🎨 **VS Code Settings**

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## 🔧 **VS Code Tasks**

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development",
      "type": "shell",
      "command": "npm run dev",
      "group": "build"
    },
    {
      "label": "Start Chat Service",
      "type": "shell",
      "command": "cd mini-services/chat-service && npm run dev",
      "group": "build"
    },
    {
      "label": "Install Dependencies",
      "type": "shell",
      "command": "npm install",
      "group": "build"
    },
    {
      "label": "Database Setup",
      "type": "shell",
      "command": "npm run db:push",
      "group": "build"
    }
  ]
}
```

## 🐛 **Troubleshooting**

### **Common Issues & Solutions**

1. **Module not found errors**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port conflicts**:
   ```bash
   # Check ports
   lsof -i :3000
   lsof -i :3001
   
   # Kill processes
   sudo kill -9 <PID>
   ```

3. **Database connection issues**:
   ```bash
   # Reset database
   rm db/custom.db
   npm run db:push
   ```

4. **TypeScript errors**:
   ```bash
   # Check for issues
   npm run lint
   ```

## 🎯 **Development Workflow**

1. **Open project**: `code typemaster-pro`
2. **Install deps**: `npm install`
3. **Setup env**: Create `.env` file
4. **Database**: `npm run db:push`
5. **Start dev**: `npm run dev`
6. **Access**: http://localhost:3000

## 📊 **Features Overview**

- ✅ **Anonymous Play**: Anyone can play the game
- ✅ **Premium Overlays**: Blurred features with signup prompts
- ✅ **Real-time Chat**: Socket.IO integration
- ✅ **Performance Analytics**: ECharts visualization
- ✅ **User Authentication**: NextAuth.js with email verification
- ✅ **Game Statistics**: Personal progress tracking
- ✅ **Responsive Design**: Mobile-first UI/UX
- ✅ **Docker Support**: Complete containerization

## 🎉 **Ready to Code!**

Your TypeMaster Pro project is now ready for local development in VS Code!

**Key Features:**
- Modern Next.js 15 with TypeScript
- Real-time chat with Socket.IO
- Anonymous + authenticated user modes
- Beautiful UI with shadcn/ui components
- Performance analytics with ECharts
- Complete Docker setup
- Comprehensive documentation

**Start building your typing game today!** 🚀