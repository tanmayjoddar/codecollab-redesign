# CodeBuddy

A real-time collaborative code editor enabling multiple developers to code together simultaneously with instant synchronization, live chat, and integrated code execution.

## ✨ Core Features

### Real-Time Collaboration

- **Multi-User Editing**: 3+ developers can edit the same codebase simultaneously
- **Live Cursor Tracking**: See exactly where each collaborator is working
- **Instant Code Sync**: All code changes propagate in real-time across all clients
- **Presence Indicators**: Know who's online and active in your session

### Session Management

- **Public & Private Sessions**: Create open coding sessions or invite-only workspaces
- **Collaboration Requests**: Manage access requests for private sessions
- **Participant Management**: Track and manage active collaborators
- **Session History**: Full audit trail of session activities

### Development Tools

- **Multi-Language Support**: JavaScript, Python, TypeScript, Java, C++, Ruby
- **Integrated Execution**: Run code directly from the editor
- **Live Chat**: Built-in communication for team discussions
- **File Management**: Multi-file projects with version tracking
- **Monaco Editor**: Professional-grade code editor with syntax highlighting

### User Experience

- **Real-Time Notifications**: Get instant alerts for requests and updates
- **Theme Customization**: Dark/light modes with customizable themes
- **Responsive UI**: Mobile-friendly interface with shadcn/ui components
- **User Authentication**: Secure authentication with session management

## 🏗️ Technology Stack

**Frontend:**

- React 18 + TypeScript
- Vite (fast build tool)
- Monaco Editor (VS Code-like editing)
- Tailwind CSS + shadcn/ui (modern UI components)
- TanStack Query (state management)
- WebSocket (real-time communication)

**Backend:**

- Node.js + Express.js
- PostgreSQL + Drizzle ORM
- Passport.js (authentication)
- WebSocket Server (real-time sync)
- Sandbox Code Execution

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x+
- PostgreSQL database
- GitHub CLI (for deployment)

### Installation

#### Option 1: Local Development (Without Docker)

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Update DATABASE_URL and SESSION_SECRET in .env

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

#### Option 2: Docker (Recommended)

```bash
# Copy environment variables
cp .env.example .env

# Build and start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down
```

The application will be available at `http://localhost:5000` and PostgreSQL at `localhost:5432`

**Docker Services:**

- **app**: CodeBuddy application (Node.js + React)
- **db**: PostgreSQL 16 database

**First Time Setup:**

```bash
# Enter the app container to run migrations
docker-compose exec app npm run db:push

# Or setup from scratch
docker-compose up -d
docker-compose exec app npm run db:push
```

### Docker Commands

```bash
# Start containers in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop containers
docker-compose down

# View logs
docker-compose logs -f app
docker-compose logs -f db

# Access PostgreSQL container
docker-compose exec db psql -U codebuddy -d codebuddy

# Rebuild Docker image
docker-compose up -d --build

# Remove all data and start fresh
docker-compose down -v
docker-compose up -d
```

## 📝 Available Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Run production build
npm run db:push          # Apply database migrations
npm run check            # Run TypeScript type check
npm run format           # Format code with Prettier
```

## 📦 Project Structure

```
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # UI components and editors
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and API
│   └── index.html
├── server/              # Express backend
│   ├── routes/          # API route handlers
│   ├── websocket/       # Real-time communication
│   ├── middleware/      # Auth, validation, error handling
│   └── index.ts         # Server entry point
├── migrations/          # Database schema and migrations
├── shared/              # Shared types and schemas
└── types/               # TypeScript type definitions
```

## 🔄 Real-Time Architecture

The platform uses WebSocket connections to enable:

- **Session Broadcasting**: Sync code changes to all participants
- **Cursor Synchronization**: Display collaborator positions
- **Instant Notifications**: Push notifications for all events
- **Live Presence**: Real-time participant status

## 🔐 Access Control

- **Public Sessions**: Anyone can join and collaborate
- **Private Sessions**: Owner controls access via collaboration requests
- **Permission System**: Fine-grained access control per session
- **Authentication**: Secure login with session tokens

## 📊 Database Schema

The system tracks:

- Users and authentication
- Sessions and participants
- Files and code content
- Messages and chat history
- Collaboration requests
- Notifications and activity

## 🎯 Use Cases

- **Remote Pair Programming**: Two developers on one codebase
- **Team Code Reviews**: Collaborative editing during reviews
- **Educational Platforms**: Instructor + multiple students learning together
- **Interview Preparation**: Candidates practice with real-time feedback
- **Open Source Collaboration**: Distributed team coordination

## 🐳 Docker Deployment

CodeBuddy is fully containerized for easy deployment.

### Prerequisites for Docker

- Docker Desktop installed
- 2GB RAM minimum
- 1GB free disk space

### Quick Start with Docker

```bash
# 1. Clone the repository
git clone https://github.com/tanmayjoddar/codebuddy.git
cd codebuddy

# 2. Start with Docker Compose
docker-compose up -d

# 3. Run database migrations
docker-compose exec app npm run db:push

# 4. Access the application
# Open http://localhost:5000 in your browser
```

### Configuration

Create or update `.env` file for Docker:

```env
DB_USER=codebuddy
DB_PASSWORD=your_secure_password
DB_NAME=codebuddy
NODE_ENV=development
SESSION_SECRET=your_session_secret_here
```

### Troubleshooting Docker

**Port already in use:**

```bash
# Change ports in docker-compose.yml
# Or stop other services using ports 5000/5432
docker-compose down
```

**Database connection errors:**

```bash
# Check database health
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

**Reset everything:**

```bash
# Remove containers and volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose up -d --build
```

## 🚀 Production Deployment

For production deployments:

```bash
# Build production image
docker build -t codebuddy:latest .

# Push to container registry
docker tag codebuddy:latest your-registry/codebuddy:latest
docker push your-registry/codebuddy:latest

# Deploy on your hosting platform (AWS, Azure, Heroku, DigitalOcean, etc.)
```
