.PHONY: help build up down restart logs clean health

# Default target
help:
	@echo "TypeMaster Pro - Docker Commands"
	@echo "================================"
	@echo "build     Build all Docker images"
	@echo "up         Start all services"
	@echo "down       Stop all services"
	@echo "restart    Restart all services"
	@echo "logs       Show service logs"
	@echo "clean      Remove containers and images"
	@echo "health     Check service health"
	@echo "dev        Start development environment"
	@echo "prod       Start production environment"
	@echo "================================"

# Build Docker images
build:
	@echo "🐳 Building Docker images..."
	docker-compose build

# Start all services
up:
	@echo "🚀 Starting all services..."
	docker-compose up -d
	@make health

# Stop all services
down:
	@echo "🛑 Stopping all services..."
	docker-compose down

# Restart all services
restart:
	@echo "🔄 Restarting all services..."
	docker-compose restart
	@make health

# Show logs
logs:
	@echo "📋 Showing service logs..."
	docker-compose logs -f

# Clean up
clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose down -v --remove-orphans
	docker system prune -f
	docker volume prune -f

# Health check
health:
	@echo "🏥 Checking service health..."
	@echo "================================"
	@if curl -f http://localhost:3000 > /dev/null 2>&1; then \
		echo "✅ Main App (3000): Healthy"; \
	else \
		echo "❌ Main App (3000): Unhealthy"; \
	fi
	@if curl -f http://localhost:3001 > /dev/null 2>&1; then \
		echo "✅ Chat Service (3001): Healthy"; \
	else \
		echo "❌ Chat Service (3001): Unhealthy"; \
	fi
	@echo "================================"

# Development environment
dev:
	@echo "🔧 Starting development environment..."
	docker-compose -f docker-compose.yml up -d

# Production environment
prod:
	@echo "🚀 Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d

# Setup environment
setup:
	@echo "⚙️ Setting up environment..."
	@if [ ! -f .env ]; then \
		echo "Creating .env file..."; \
		cp .env.example .env 2>/dev/null || echo "DATABASE_URL=file:/app/data/custom.db\nNEXTAUTH_URL=http://localhost:3000\nNEXTAUTH_SECRET=typemaster-secret-key-change-in-production" > .env; \
		echo "✅ .env file created"; \
	else \
		echo "✅ .env file already exists"; \
	fi

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Database migration
migrate:
	@echo "🗄️ Running database migrations..."
	npm run db:push

# Development with hot reload
dev-watch:
	@echo "🔧 Starting development with hot reload..."
	docker-compose up

# Production build only
build-prod:
	@echo "🏗️ Building for production..."
	docker-compose -f docker-compose.prod.yml build

# View running containers
ps:
	@echo "📋 Running containers:"
	docker-compose ps

# Access shell in app container
shell:
	@echo "🐚 Accessing app container shell..."
	docker-compose exec app sh

# Access database
db-shell:
	@echo "🗄️ Accessing database shell..."
	docker-compose exec db psql -U postgres -d typemaster