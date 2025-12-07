#!/bin/bash

# TypeMaster Pro - Docker Setup Script
# This script sets up the complete Docker environment for TypeMaster Pro

set -e

echo "🚀 Setting up TypeMaster Pro with Docker..."
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data
mkdir -p logs

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file with default values..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=file:/app/data/custom.db

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=typemaster-secret-key-change-in-production-$(date +%s)

# Application Configuration
NODE_ENV=production
EOF
    echo "✅ .env file created with default configuration."
    echo "🔧 Please review and update the .env file as needed."
else
    echo "✅ .env file already exists."
fi

# Build and start services
echo "🐳 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

# Display access information
echo ""
echo "🎉 Setup complete!"
echo "=========================================="
echo "📱 Application URLs:"
echo "   Main App:     http://localhost:3000"
echo "   Chat Service:  http://localhost:3001"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs:      docker-compose logs -f"
echo "   Stop services:  docker-compose down"
echo "   Restart:        docker-compose restart"
echo "   Check status:   docker-compose ps"
echo ""
echo "📖 For detailed documentation, see DOCKER_README.md"
echo "=========================================="

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Main application is running!"
else
    echo "❌ Main application is not responding. Check logs with: docker-compose logs app"
fi

if curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Chat service is running!"
else
    echo "❌ Chat service is not responding. Check logs with: docker-compose logs chat-service"
fi

echo ""
echo "🎮 TypeMaster Pro is ready to use!"
echo "   Open http://localhost:3000 in your browser to start playing!"