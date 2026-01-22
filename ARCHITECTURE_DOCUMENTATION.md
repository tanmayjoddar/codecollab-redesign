# CodeBuddy - Complete Architecture & Production Deployment Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Main Coding & Compiler Logic](#2-main-coding--compiler-logic)
3. [Project Architecture Deep Dive](#3-project-architecture-deep-dive)
4. [Frontend Structure](#4-frontend-structure)
5. [Backend Structure](#5-backend-structure)
6. [Production Deployment Strategy](#6-production-deployment-strategy)
7. [API Reference](#7-api-reference)
8. [WebSocket Protocol](#8-websocket-protocol)
9. [Database Schema](#9-database-schema)
10. [Environment Configuration](#10-environment-configuration)

---

## 1. Project Overview

**CodeBuddy** is a real-time collaborative code editor that allows multiple developers to code together simultaneously. The application follows a **monorepo architecture** where both frontend and backend coexist in a single repository but can be deployed separately for production.

### Current Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                     MONOREPO STRUCTURE                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐           ┌─────────────────┐          │
│  │   Frontend      │           │    Backend      │          │
│  │   (client/)     │  ◄────►   │    (server/)    │          │
│  │   React + Vite  │   HTTP/WS │    Express.js   │          │
│  └─────────────────┘           └─────────────────┘          │
│           │                            │                     │
│           └────────────┬───────────────┘                     │
│                        │                                     │
│              ┌─────────▼─────────┐                          │
│              │   Shared Code     │                          │
│              │   (shared/)       │                          │
│              │   Types + Schema  │                          │
│              └───────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Main Coding & Compiler Logic

### 2.1 Code Execution Flow

The code execution happens in a **client-server model**:

```
User writes code → Monaco Editor → API Request → Backend Executor → Result returned
```

### 2.2 Primary Code Execution Files

#### **Backend: Code Executor**

📁 **File:** `server/code-executor.ts`

This is the **MAIN COMPILER/EXECUTION ENGINE**. It handles code execution for multiple languages:

```typescript
// Key function: executeCode()
export async function executeCode(
  code: string,
  language: string
): Promise<ExecutionResult> {
  switch (language) {
    case "javascript":
      return executeJavaScript(code); // Uses sandboxed VM
    case "python":
      return executePython(code); // Mock/simulated
    case "java":
      return executeJava(code); // Mock/simulated
    case "cpp":
      return executeCpp(code); // Mock/simulated
    case "ruby":
      return executeRuby(code); // Mock/simulated
  }
}
```

**Key Points:**

- JavaScript execution uses a **sandboxed Function constructor** for security
- Other languages (Python, Java, C++, Ruby) are **mock implementations** - in production, you'd integrate with containers/sandboxes
- Returns `ExecutionResult` with `output`, `error`, and `logs`

#### **Backend: Execution Route**

📁 **File:** `server/routes/execution.ts`

API endpoint that receives code and triggers execution:

```typescript
router.post("/execute", async (req, res) => {
  const { code, language } = req.body;
  const result = await executeCode(code, language);
  return res.status(200).json(result);
});
```

**API Endpoint:** `POST /api/execute`

#### **Frontend: Execution Hook**

📁 **File:** `client/src/hooks/use-execution.ts`

React hook that calls the execution API:

```typescript
export function useExecuteCode() {
  return useMutation({
    mutationFn: ({ code, language }) => executionApi.execute(code, language),
  });
}
```

#### **Frontend: Execution API Client**

📁 **File:** `client/src/lib/api/execution.ts`

HTTP client for execution requests:

```typescript
export const executionApi = {
  async execute(code: string, language: string): Promise<ExecutionResult> {
    const res = await apiRequest("POST", "/api/execute", { code, language });
    return res.json();
  },
};
```

### 2.3 Monaco Code Editor

📁 **File:** `client/src/components/editor/monaco-editor.tsx`

The Monaco Editor (same as VS Code) provides the coding interface:

```typescript
// Creates VS Code-like editor instance
const editor = monaco.editor.create(containerRef.current, {
  value,
  language: monacoLanguage,
  theme: "vs-dark",
  // ... professional editor configurations
});
```

**Features:**

- Syntax highlighting for JavaScript, Python, Java, C++, Ruby
- Real-time collaborative cursor tracking
- Line numbers, minimap, bracket matching
- Font ligatures support

### 2.4 Complete Execution Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CODE EXECUTION FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌─────────────────────────┐
│ Monaco Editor│────►│ use-execution│────►│ executionApi.execute()  │
│ (User types  │     │  hook        │     │ POST /api/execute       │
│  code)       │     │              │     │                         │
└──────────────┘     └──────────────┘     └────────────┬────────────┘
                                                        │
                                                        │ HTTP POST
                                                        ▼
┌──────────────┐     ┌──────────────┐     ┌─────────────────────────┐
│ Display      │◄────│ Frontend     │◄────│ execution.ts (route)    │
│ Result in UI │     │ receives     │     │ router.post("/execute") │
│              │     │ JSON response│     │                         │
└──────────────┘     └──────────────┘     └────────────┬────────────┘
                                                        │
                                                        │ calls
                                                        ▼
                                          ┌─────────────────────────┐
                                          │ code-executor.ts        │
                                          │ executeCode(code, lang) │
                                          │                         │
                                          │ • JavaScript: Sandbox VM│
                                          │ • Python: Mock          │
                                          │ • Java: Mock            │
                                          │ • C++: Mock             │
                                          │ • Ruby: Mock            │
                                          └─────────────────────────┘
```

---

## 3. Project Architecture Deep Dive

### 3.1 Directory Structure Breakdown

```
codebuddy/
│
├── 📂 client/                    # FRONTEND (React Application)
│   ├── index.html                # Entry HTML file
│   ├── 📂 public/                # Static assets
│   └── 📂 src/
│       ├── main.tsx              # React entry point
│       ├── index.css             # Global styles (Tailwind)
│       ├── 📂 components/        # React UI components
│       │   ├── 📂 editor/        # Code editor components
│       │   ├── 📂 landing/       # Landing page sections
│       │   ├── 📂 layout/        # App layout components
│       │   └── 📂 ui/            # Reusable UI (shadcn/ui)
│       ├── 📂 container/         # App container
│       ├── 📂 hooks/             # Custom React hooks
│       ├── 📂 lib/               # Utilities, API clients
│       │   └── 📂 api/           # API client modules
│       └── 📂 pages/             # Page components (routes)
│
├── 📂 server/                    # BACKEND (Express.js Application)
│   ├── index.ts                  # Server entry point
│   ├── routes.ts                 # Route registration
│   ├── auth.ts                   # Authentication setup (Passport.js)
│   ├── db.ts                     # Database connection (Drizzle ORM)
│   ├── storage.ts                # Data access layer (CRUD operations)
│   ├── code-executor.ts          # ⭐ CODE EXECUTION ENGINE
│   ├── vite.ts                   # Vite dev server integration
│   ├── notification-service.ts   # Push notifications
│   ├── 📂 routes/                # API route handlers
│   │   ├── index.ts              # Route aggregator
│   │   ├── execution.ts          # Code execution API
│   │   ├── sessions.ts           # Session management API
│   │   ├── files.ts              # File management API
│   │   ├── collaboration.ts      # Collaboration requests API
│   │   └── notifications.ts      # Notifications API
│   ├── 📂 websocket/             # Real-time WebSocket handlers
│   │   ├── index.ts              # WebSocket server setup
│   │   ├── handlers.ts           # Message handlers
│   │   └── types.ts              # WebSocket types
│   ├── 📂 middleware/            # Express middleware
│   └── 📂 __tests__/             # Backend unit tests
│
├── 📂 shared/                    # SHARED CODE (Frontend & Backend)
│   ├── schema.ts                 # ⭐ Database schema (Drizzle ORM)
│   └── constant.tsx              # Shared constants
│
├── 📂 migrations/                # Database migrations
│   ├── schema.ts                 # Migration schemas
│   ├── relations.ts              # Table relationships
│   └── 📂 meta/                  # Migration metadata
│
├── 📂 types/                     # TypeScript type definitions
│   └── index.ts                  # Shared types
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript config
│   ├── vite.config.ts            # Vite bundler config
│   ├── drizzle.config.ts         # Drizzle ORM config
│   ├── tailwind.config.ts        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS config
│   ├── jest.config.cjs           # Jest test config
│   ├── Dockerfile                # Docker build config
│   ├── docker-compose.yml        # Docker Compose config
│   └── fly.toml                  # Fly.io deployment config
│
└── 📄 Documentation
    ├── README.md
    ├── CI_CD_PIPELINE.md
    └── IMPROVEMENT_ROADMAP.md
```

### 3.2 Key Integration Points

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INTEGRATION ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────┘

     FRONTEND (client/)                    BACKEND (server/)
     ==================                    ==================

┌───────────────────────┐           ┌────────────────────────┐
│ pages/playground/     │           │ routes/sessions.ts     │
│  - usePlayground()    │◄──REST───►│  - GET/POST /sessions  │
│  - Session state      │           │  - Session CRUD        │
└───────────────────────┘           └────────────────────────┘

┌───────────────────────┐           ┌────────────────────────┐
│ components/editor/    │           │ routes/files.ts        │
│  - MonacoEditor       │◄──REST───►│  - GET/POST /files     │
│  - FileExplorer       │           │  - File CRUD           │
└───────────────────────┘           └────────────────────────┘

┌───────────────────────┐           ┌────────────────────────┐
│ hooks/use-execution   │           │ routes/execution.ts    │
│  - Execute code       │◄──REST───►│  - POST /execute       │
│                       │           │  - code-executor.ts    │
└───────────────────────┘           └────────────────────────┘

┌───────────────────────┐           ┌────────────────────────┐
│ lib/websocket.ts      │           │ websocket/index.ts     │
│  - wsManager          │◄───WS────►│  - WebSocket Server    │
│  - Real-time sync     │           │  - handlers.ts         │
└───────────────────────┘           └────────────────────────┘

┌───────────────────────┐           ┌────────────────────────┐
│ hooks/use-auth        │           │ auth.ts                │
│  - Login/Register     │◄──REST───►│  - Passport.js         │
│  - User state         │           │  - Session cookies     │
└───────────────────────┘           └────────────────────────┘

                    SHARED (shared/)
                    ================
              ┌────────────────────────┐
              │ schema.ts              │
              │  - Database tables     │
              │  - Zod validation      │
              │  - TypeScript types    │
              └────────────────────────┘
```

---

## 4. Frontend Structure

### 4.1 Technology Stack

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| React 18       | UI Framework            |
| TypeScript     | Type Safety             |
| Vite           | Build Tool & Dev Server |
| Monaco Editor  | Code Editor (VS Code)   |
| TanStack Query | Server State Management |
| Tailwind CSS   | Styling                 |
| shadcn/ui      | UI Component Library    |
| Wouter         | Client-side Routing     |
| WebSocket      | Real-time Communication |

### 4.2 Key Frontend Files

| File                                             | Purpose                           |
| ------------------------------------------------ | --------------------------------- |
| `client/src/main.tsx`                            | Application entry point           |
| `client/src/container/App/`                      | Root app component with providers |
| `client/src/pages/playground/`                   | Main coding workspace             |
| `client/src/components/editor/monaco-editor.tsx` | Monaco editor wrapper             |
| `client/src/lib/websocket.ts`                    | WebSocket client manager          |
| `client/src/lib/queryClient.ts`                  | TanStack Query setup              |
| `client/src/hooks/use-*.ts`                      | Custom React hooks                |

### 4.3 State Management

```
┌──────────────────────────────────────────────────────────────┐
│                   FRONTEND STATE MANAGEMENT                   │
└──────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────┐
    │                 TanStack Query                       │
    │  - Server state (sessions, files, users)            │
    │  - Caching & invalidation                           │
    │  - Automatic refetching                             │
    └─────────────────────────────────────────────────────┘
                            │
                            ▼
    ┌─────────────────────────────────────────────────────┐
    │              Custom React Hooks                      │
    │  - useAuth()        → Authentication state          │
    │  - useSession()     → Session data                  │
    │  - useFiles()       → File operations               │
    │  - useExecution()   → Code execution                │
    │  - useCollaboration() → Real-time sync              │
    └─────────────────────────────────────────────────────┘
                            │
                            ▼
    ┌─────────────────────────────────────────────────────┐
    │              WebSocket Manager                       │
    │  - Real-time code sync                              │
    │  - Cursor position updates                          │
    │  - Chat messages                                    │
    │  - Notifications                                    │
    └─────────────────────────────────────────────────────┘
```

### 4.4 Page Routing

| Route             | Component           | Description               |
| ----------------- | ------------------- | ------------------------- |
| `/`               | `pages/home/`       | Dashboard (logged in)     |
| `/`               | `pages/landing/`    | Landing page (logged out) |
| `/playground/:id` | `pages/playground/` | Code editor workspace     |
| `/login`          | `pages/login/`      | Login page                |
| `/signup`         | `pages/signup/`     | Registration page         |
| `/settings`       | `pages/settings/`   | User settings             |
| `/profile`        | `pages/profile/`    | User profile              |

---

## 5. Backend Structure

### 5.1 Technology Stack

| Technology  | Purpose          |
| ----------- | ---------------- |
| Node.js 20  | Runtime          |
| Express.js  | Web Framework    |
| TypeScript  | Type Safety      |
| PostgreSQL  | Database         |
| Drizzle ORM | Database ORM     |
| Passport.js | Authentication   |
| ws          | WebSocket Server |

### 5.2 Key Backend Files

| File                      | Purpose                     |
| ------------------------- | --------------------------- |
| `server/index.ts`         | Server entry point          |
| `server/routes.ts`        | Route registration          |
| `server/auth.ts`          | Passport.js authentication  |
| `server/db.ts`            | Database connection         |
| `server/storage.ts`       | Data access layer           |
| `server/code-executor.ts` | **Code execution engine**   |
| `server/vite.ts`          | Vite integration (dev mode) |
| `server/websocket/`       | WebSocket handling          |

### 5.3 API Routes Structure

```
server/routes/
├── index.ts           # Route aggregator
├── sessions.ts        # /api/sessions/*
├── files.ts           # /api/sessions/:id/files, /api/files/*
├── execution.ts       # /api/execute, /api/languages
├── collaboration.ts   # /api/collaboration/*
└── notifications.ts   # /api/notifications/*
```

### 5.4 Request Processing Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    REQUEST PROCESSING                         │
└──────────────────────────────────────────────────────────────┘

    HTTP Request
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Express Middleware Stack                                     │
│  1. express.json()        - Parse JSON body                 │
│  2. express.urlencoded()  - Parse URL-encoded body          │
│  3. express-session       - Session management              │
│  4. passport.initialize() - Auth initialization             │
│  5. passport.session()    - Deserialize user                │
│  6. Custom logging        - Request logging                 │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Route Handlers                                               │
│  • setupAuth()           → /api/register, /api/login, etc.  │
│  • registerApiRoutes()   → /api/sessions, /api/files, etc.  │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Data Access (storage.ts)                                     │
│  • Drizzle ORM queries                                       │
│  • PostgreSQL database                                       │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
    HTTP Response
```

---

## 6. Production Deployment Strategy

### 6.1 Strategy Options

#### Option A: Single Deployment (Current - Monolith)

**Best for:** Small to medium traffic, simpler operations

```
┌─────────────────────────────────────────────────────────────┐
│                 SINGLE DEPLOYMENT                            │
└─────────────────────────────────────────────────────────────┘

         ┌─────────────────────────────────────┐
         │     Single Container/Server         │
         │  ┌─────────────────────────────┐   │
         │  │    Express.js Server        │   │
         │  │  ┌───────────┐ ┌─────────┐  │   │
         │  │  │  API      │ │ Static  │  │   │
         │  │  │  Routes   │ │ Files   │  │   │
         │  │  └───────────┘ └─────────┘  │   │
         │  │  ┌───────────────────────┐  │   │
         │  │  │    WebSocket Server   │  │   │
         │  │  └───────────────────────┘  │   │
         │  └─────────────────────────────┘   │
         └─────────────────────────────────────┘
                          │
                          ▼
                    ┌──────────┐
                    │PostgreSQL│
                    └──────────┘
```

**Deployment Files:**

- `Dockerfile` - Single image build
- `docker-compose.yml` - Full stack with DB
- `fly.toml` - Fly.io deployment

---

#### Option B: Separate Frontend & Backend (Recommended for Scale)

**Best for:** Large traffic, independent scaling, CDN benefits

```
┌─────────────────────────────────────────────────────────────────────┐
│              SEPARATED DEPLOYMENT ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────┘

        FRONTEND                              BACKEND
        ========                              =======

    ┌────────────────┐               ┌────────────────────────┐
    │   CDN (Edge)   │               │    API Server(s)       │
    │  Vercel/CF/    │               │    (Load Balanced)     │
    │  Netlify       │               │                        │
    │                │    REST/WS    │  ┌─────────────────┐   │
    │  ┌──────────┐  │──────────────►│  │  Express.js     │   │
    │  │ Static   │  │               │  │  + WebSocket    │   │
    │  │ React    │  │               │  └─────────────────┘   │
    │  │ Build    │  │               │                        │
    │  └──────────┘  │               └───────────┬────────────┘
    └────────────────┘                           │
                                                 ▼
                                       ┌──────────────────┐
                                       │   PostgreSQL     │
                                       │   (Managed DB)   │
                                       └──────────────────┘
```

---

### 6.2 Step-by-Step: Separating for Production

#### Step 1: Create Separate Dockerfiles

**📁 Create: `client/Dockerfile.frontend`**

```dockerfile
# Frontend Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/ 2>/dev/null || true

# Copy source files needed for frontend build
COPY tsconfig.json vite.config.ts theme.json ./
COPY postcss.config.js tailwind.config.ts ./
COPY client ./client
COPY shared ./shared
COPY types ./types

# Install dependencies
RUN npm ci

# Build frontend
RUN npm run build:frontend  # You'll create this script

# Production stage - serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**📁 Create: `server/Dockerfile.backend`**

```dockerfile
# Backend Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json drizzle.config.ts ./
COPY server ./server
COPY shared ./shared
COPY migrations ./migrations
COPY types ./types

RUN npm ci
RUN npm run build:backend  # You'll create this script

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache dumb-init

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY migrations ./migrations

USER node
EXPOSE 5000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

---

#### Step 2: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "tsx --env-file=.env server/index.ts",

    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "vite build",
    "build:backend": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",

    "start": "NODE_ENV=production node dist/index.js",
    "start:backend": "NODE_ENV=production node dist/index.js",

    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit generate && drizzle-kit push"
  }
}
```

---

#### Step 3: Create nginx.conf for Frontend

**📁 Create: `nginx.conf`**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (point to your backend URL)
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket proxy
    location /ws {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

#### Step 4: Create docker-compose.production.yml

**📁 Create: `docker-compose.production.yml`**

```yaml
version: "3.8"

services:
  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    container_name: codebuddy-db
    environment:
      POSTGRES_USER: ${DB_USER:-codebuddy}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME:-codebuddy}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-codebuddy}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - codebuddy-network
    restart: unless-stopped

  # Backend API Server
  backend:
    build:
      context: .
      dockerfile: server/Dockerfile.backend
    container_name: codebuddy-backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER:-codebuddy}:${DB_PASSWORD}@db:5432/${DB_NAME:-codebuddy}
      SESSION_SECRET: ${SESSION_SECRET}
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - codebuddy-network
    restart: unless-stopped

  # Frontend Web Server
  frontend:
    build:
      context: .
      dockerfile: client/Dockerfile.frontend
    container_name: codebuddy-frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - codebuddy-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  codebuddy-network:
    driver: bridge
```

---

#### Step 5: Environment Variables

**📁 Create: `.env.production`**

```env
# Database
DB_USER=codebuddy
DB_PASSWORD=<strong-password-here>
DB_NAME=codebuddy
DATABASE_URL=postgresql://codebuddy:<password>@db:5432/codebuddy

# Session
SESSION_SECRET=<generate-strong-secret>

# Server
NODE_ENV=production
PORT=5000

# Frontend (if using separate build)
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws
```

---

### 6.3 Cloud Deployment Options

#### Option 1: Full Managed (Easiest)

| Service                   | Frontend | Backend | Database           |
| ------------------------- | -------- | ------- | ------------------ |
| Vercel + Railway          | Vercel   | Railway | Railway PostgreSQL |
| Netlify + Render          | Netlify  | Render  | Render PostgreSQL  |
| Cloudflare Pages + Fly.io | CF Pages | Fly.io  | Fly PostgreSQL     |

**Example: Vercel (Frontend) + Railway (Backend)**

```bash
# Frontend - Deploy to Vercel
cd client
vercel

# Backend - Deploy to Railway
# Push to GitHub, connect Railway to your repo
# Set environment variables in Railway dashboard
```

---

#### Option 2: Docker Compose on VPS

```bash
# On your VPS (DigitalOcean, Linode, AWS EC2)

# Clone repo
git clone https://github.com/youruser/codebuddy.git
cd codebuddy

# Set up environment
cp .env.example .env.production
# Edit .env.production with your values

# Deploy
docker-compose -f docker-compose.production.yml up -d

# Run migrations
docker-compose exec backend npm run db:push
```

---

#### Option 3: Kubernetes (Enterprise Scale)

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: codebuddy-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: codebuddy-backend
  template:
    spec:
      containers:
        - name: backend
          image: ghcr.io/youruser/codebuddy-backend:latest
          ports:
            - containerPort: 5000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: codebuddy-secrets
                  key: database-url
```

---

### 6.4 Deployment Checklist

#### Pre-Deployment

- [ ] Set strong `SESSION_SECRET`
- [ ] Set strong database password
- [ ] Configure CORS for frontend domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure monitoring (health checks)

#### Post-Deployment

- [ ] Run database migrations
- [ ] Verify WebSocket connectivity
- [ ] Test code execution
- [ ] Monitor error logs
- [ ] Set up alerting

---

## 7. API Reference

### 7.1 Authentication APIs

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/api/register` | Register new user |
| POST   | `/api/login`    | Login user        |
| POST   | `/api/logout`   | Logout user       |
| GET    | `/api/user`     | Get current user  |

### 7.2 Session APIs

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/sessions`     | List user's sessions |
| POST   | `/api/sessions`     | Create new session   |
| GET    | `/api/sessions/:id` | Get session details  |
| PATCH  | `/api/sessions/:id` | Update session       |
| DELETE | `/api/sessions/:id` | Delete session       |

### 7.3 File APIs

| Method | Endpoint                    | Description        |
| ------ | --------------------------- | ------------------ |
| GET    | `/api/sessions/:id/files`   | List session files |
| POST   | `/api/sessions/:id/files`   | Create file        |
| POST   | `/api/sessions/:id/folders` | Create folder      |
| PATCH  | `/api/files/:id`            | Update file        |
| DELETE | `/api/files/:id`            | Delete file        |

### 7.4 Execution APIs

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/api/execute`   | Execute code             |
| GET    | `/api/languages` | List supported languages |

### 7.5 Collaboration APIs

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| POST   | `/api/collaboration/request`  | Send collab request   |
| GET    | `/api/collaboration/requests` | List requests         |
| POST   | `/api/collaboration/respond`  | Accept/reject request |

---

## 8. WebSocket Protocol

### 8.1 Connection

```javascript
const ws = new WebSocket("wss://yourdomain.com/ws");
```

### 8.2 Message Types

#### Client → Server

```typescript
// Authenticate
{ type: "auth", userId: "uuid" }

// Join session
{ type: "join_session", sessionId: "uuid", cursor?: { line, column, fileId } }

// Leave session
{ type: "leave_session" }

// Update cursor
{ type: "cursor_update", cursor: { line, column, fileId } }

// Code change
{ type: "code_change", fileId: "uuid", content: "..." }

// Chat message
{ type: "chat_message", content: "Hello!" }
```

#### Server → Client

```typescript
// Participants updated
{ type: "participants_update", participants: [...] }

// Code changed (broadcast)
{ type: "code_changed", fileId: "uuid", content: "...", userId: "uuid" }

// Cursor updated (broadcast)
{ type: "cursor_updated", userId: "uuid", cursor: {...} }

// Chat message (broadcast)
{ type: "chat_message", content: "...", user: {...} }

// Notification
{ type: "notification", notification: {...} }

// Access denied
{ type: "access_denied", message: "...", requiresAuth?: boolean, requiresRequest?: boolean }
```

---

## 9. Database Schema

### 9.1 Tables Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                               │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────────┐       ┌───────────────┐
│    users     │       │     sessions     │       │     files     │
├──────────────┤       ├──────────────────┤       ├───────────────┤
│ id (PK)      │◄──────│ owner_id (FK)    │       │ id (PK)       │
│ username     │       │ id (PK)          │◄──────│ session_id    │
│ password     │       │ name             │       │ name          │
│ email        │       │ language         │       │ content       │
│ created_at   │       │ is_public        │       │ is_folder     │
│ updated_at   │       │ created_at       │       │ parent_id     │
└──────────────┘       │ updated_at       │       │ created_at    │
       │               └──────────────────┘       │ updated_at    │
       │                        │                 └───────────────┘
       │                        │
       ▼                        ▼
┌──────────────────────────────────────────┐
│         session_participants              │
├──────────────────────────────────────────┤
│ id (PK)                                   │
│ session_id (FK) ─────────────────────────┤
│ user_id (FK) ────────────────────────────┤
│ cursor (JSONB)                            │
│ is_active                                 │
│ joined_at                                 │
└──────────────────────────────────────────┘

┌──────────────────────┐       ┌───────────────────────┐
│      messages        │       │ collaboration_requests │
├──────────────────────┤       ├───────────────────────┤
│ id (PK)              │       │ id (PK)               │
│ content              │       │ session_id (FK)       │
│ user_id (FK)         │       │ from_user_id (FK)     │
│ session_id (FK)      │       │ status                │
│ created_at           │       │ created_at            │
│ updated_at           │       │ updated_at            │
└──────────────────────┘       └───────────────────────┘

┌──────────────────────┐
│    notifications     │
├──────────────────────┤
│ id (PK)              │
│ user_id (FK)         │
│ type                 │
│ title                │
│ message              │
│ data (JSONB)         │
│ is_read              │
│ created_at           │
│ updated_at           │
└──────────────────────┘
```

### 9.2 Schema Definition Location

📁 **File:** `shared/schema.ts`

All Drizzle ORM table definitions and Zod validation schemas are defined here.

---

## 10. Environment Configuration

### 10.1 Required Environment Variables

| Variable         | Description                  | Example                               |
| ---------------- | ---------------------------- | ------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Express session secret       | `your-strong-secret-key`              |
| `PORT`           | Server port (optional)       | `5000`                                |
| `NODE_ENV`       | Environment                  | `development` / `production`          |

### 10.2 Development Setup

```bash
# .env file
DATABASE_URL=postgresql://codebuddy:password@localhost:5432/codebuddy
SESSION_SECRET=dev-secret-key
PORT=5000
NODE_ENV=development
```

### 10.3 Production Setup

```bash
# .env.production file
DATABASE_URL=postgresql://codebuddy:STRONG_PASSWORD@db-host:5432/codebuddy
SESSION_SECRET=GENERATED_STRONG_SECRET_AT_LEAST_32_CHARS
PORT=5000
NODE_ENV=production
```

---

## Summary

### Where Code Execution Happens

| Layer          | File                   | Responsibility            |
| -------------- | ---------------------- | ------------------------- |
| **UI**         | `monaco-editor.tsx`    | Code editing interface    |
| **Hook**       | `use-execution.ts`     | React mutation hook       |
| **API Client** | `lib/api/execution.ts` | HTTP request to backend   |
| **Route**      | `routes/execution.ts`  | Express endpoint handler  |
| **Engine**     | `code-executor.ts`     | **Actual code execution** |

### For Production Separation

1. **Frontend** → Build with `vite build` → Deploy to CDN (Vercel/Netlify)
2. **Backend** → Build with `esbuild` → Deploy to container platform (Railway/Fly.io)
3. **Database** → Use managed PostgreSQL (Railway/Neon/Supabase)
4. **Configure** → Set `VITE_API_URL` in frontend for backend URL

The current monolith setup works well for smaller deployments, but separating provides better scalability and CDN caching benefits for the frontend.
