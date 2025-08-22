# Design Document

## Overview

Panel zarządzania agencją to kompleksowa aplikacja webowa typu SaaS, zbudowana w architekturze full-stack z wykorzystaniem nowoczesnych technologii. System zapewnia centralne miejsce do zarządzania wszystkimi aspektami działalności agencji software house - od projektów i klientów, przez zespół i finanse, po analitykę biznesową.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   Redis Cache   │              │
         └──────────────┤   & Sessions    │──────────────┘
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │  File Storage   │
                        │   (AWS S3)      │
                        └─────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- React Query (TanStack Query)
- Zustand (state management)
- React Hook Form + Zod
- Chart.js/Recharts (wykresy)

**Backend:**
- Node.js + Express.js
- TypeScript
- Prisma ORM
- JWT Authentication
- Socket.io (real-time)
- Nodemailer (email)
- Multer (file uploads)

**Database & Storage:**
- PostgreSQL (główna baza)
- Redis (cache, sessions)
- AWS S3 (pliki)

**DevOps:**
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Vercel (frontend deployment)
- Railway/Heroku (backend)

## Components and Interfaces

### Frontend Components Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Main dashboard
│   ├── projects/          # Project management
│   ├── clients/           # Client management
│   ├── team/              # Team management
│   ├── finance/           # Financial management
│   ├── analytics/         # Reports & analytics
│   └── settings/          # System settings
├── components/
│   ├── ui/                # Base UI components (shadcn)
│   ├── dashboard/         # Dashboard specific
│   ├── projects/          # Project components
│   ├── clients/           # Client components
│   ├── team/              # Team components
│   ├── finance/           # Finance components
│   ├── analytics/         # Analytics components
│   └── shared/            # Shared components
├── lib/
│   ├── api.ts             # API client
│   ├── auth.ts            # Authentication
│   ├── utils.ts           # Utilities
│   └── validations.ts     # Zod schemas
└── hooks/                 # Custom React hooks
```

### Backend API Structure

```
src/
├── routes/
│   ├── auth.ts            # Authentication endpoints
│   ├── dashboard.ts       # Dashboard data
│   ├── projects.ts        # Project CRUD
│   ├── clients.ts         # Client CRUD
│   ├── team.ts            # Team management
│   ├── finance.ts         # Financial data
│   ├── timetracking.ts    # Time logging
│   └── analytics.ts       # Reports & analytics
├── middleware/
│   ├── auth.ts            # JWT verification
│   ├── validation.ts      # Request validation
│   └── rateLimit.ts       # Rate limiting
├── services/
│   ├── emailService.ts    # Email notifications
│   ├── fileService.ts     # File handling
│   └── analyticsService.ts # Business analytics
├── models/                # Prisma models
└── utils/                 # Utility functions
```

### Key API Endpoints

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

**Dashboard:**
- `GET /api/dashboard/kpi` - Key performance indicators
- `GET /api/dashboard/recent-activity` - Recent activities
- `GET /api/dashboard/notifications` - User notifications

**Projects:**
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

**Clients:**
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `GET /api/clients/:id/projects` - Client's projects

**Team:**
- `GET /api/team` - List team members
- `POST /api/team` - Add team member
- `GET /api/team/:id/workload` - Member workload
- `POST /api/team/:id/time-off` - Request time off

**Finance:**
- `GET /api/finance/invoices` - List invoices
- `POST /api/finance/invoices` - Create invoice
- `GET /api/finance/reports` - Financial reports
- `PUT /api/finance/invoices/:id/status` - Update payment status

## Data Models

### Core Entities

**User Model:**
```typescript
interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}
```

**Project Model:**
```typescript
interface Project {
  id: string
  name: string
  description: string
  clientId: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD'
  budget: number
  hourlyRate: number
  startDate: Date
  endDate: Date
  teamMembers: User[]
  createdAt: Date
  updatedAt: Date
}
```

**Client Model:**
```typescript
interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company: string
  industry: string
  address?: string
  notes?: string
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT'
  projects: Project[]
  createdAt: Date
  updatedAt: Date
}
```

**TimeEntry Model:**
```typescript
interface TimeEntry {
  id: string
  userId: string
  projectId: string
  description: string
  hours: number
  date: Date
  billable: boolean
  createdAt: Date
}
```

**Invoice Model:**
```typescript
interface Invoice {
  id: string
  clientId: string
  projectId?: string
  number: string
  amount: number
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  issueDate: Date
  dueDate: Date
  paidDate?: Date
  items: InvoiceItem[]
  createdAt: Date
}
```

### Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(EMPLOYEE)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  timeEntries    TimeEntry[]
  projectMembers ProjectMember[]
  notifications  Notification[]
}

model Client {
  id       String      @id @default(cuid())
  name     String
  email    String      @unique
  company  String
  industry String
  status   ClientStatus @default(PROSPECT)
  
  projects Project[]
  invoices Invoice[]
}

model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  clientId    String
  status      ProjectStatus @default(PLANNING)
  budget      Float
  startDate   DateTime
  endDate     DateTime
  
  client      Client          @relation(fields: [clientId], references: [id])
  members     ProjectMember[]
  timeEntries TimeEntry[]
  invoices    Invoice[]
}
```

## Error Handling

### Frontend Error Handling
- React Error Boundaries dla component crashes
- React Query error handling dla API calls
- Toast notifications dla user feedback
- Form validation errors z Zod
- Global error logging do Sentry

### Backend Error Handling
- Centralized error middleware
- Structured error responses
- Input validation z Joi/Zod
- Database error handling
- Rate limiting errors
- Authentication/authorization errors

### Error Response Format
```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
  path: string
}
```

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Component Tests**: Storybook dla UI components
- **Integration Tests**: Playwright dla E2E
- **Visual Tests**: Chromatic dla visual regression

### Backend Testing
- **Unit Tests**: Jest dla business logic
- **Integration Tests**: Supertest dla API endpoints
- **Database Tests**: Test database z migrations
- **Load Tests**: Artillery dla performance testing

### Test Coverage Goals
- Unit tests: >80% coverage
- Integration tests: Critical user flows
- E2E tests: Main user journeys
- Performance tests: Key API endpoints

## Security Considerations

### Authentication & Authorization
- JWT tokens z refresh mechanism
- Role-based access control (RBAC)
- Password hashing z bcrypt
- Rate limiting na login attempts
- Session management z Redis

### Data Protection
- Input validation i sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection z Content Security Policy
- CORS configuration
- File upload validation
- Sensitive data encryption

### Infrastructure Security
- HTTPS enforcement
- Environment variables dla secrets
- Database connection encryption
- Regular security updates
- Audit logging dla sensitive operations

## Performance Optimization

### Frontend Performance
- Next.js App Router z Server Components
- Image optimization z next/image
- Code splitting i lazy loading
- React Query caching
- Service Worker dla offline support

### Backend Performance
- Database indexing strategy
- Redis caching dla frequent queries
- Connection pooling
- API response compression
- Background job processing

### Database Optimization
- Proper indexing na często używane queries
- Query optimization
- Connection pooling
- Read replicas dla analytics
- Regular maintenance tasks

## Deployment Architecture

### Development Environment
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    volumes: ["./frontend:/app"]
    
  backend:
    build: ./backend
    ports: ["3001:3001"]
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/agency_dev
      - REDIS_URL=redis://redis:6379
    
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: agency_dev
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    
  redis:
    image: redis:7-alpine
```

### Production Deployment
- **Frontend**: Vercel z automatic deployments
- **Backend**: Railway/Heroku z auto-scaling
- **Database**: Managed PostgreSQL (Supabase/Neon)
- **Cache**: Managed Redis (Upstash)
- **Storage**: AWS S3 dla file uploads
- **Monitoring**: Sentry + Vercel Analytics