# Agency Management Panel

A comprehensive management system for software house/digital agency operations with advanced case studies management.

## 🚀 Features

### ✅ Implemented
- **Case Studies Management** - Complete CRUD system for portfolio case studies
- **Markdown Export** - Generate and publish case studies to website
- **Dashboard Overview** - Agency metrics and activity monitoring
- **Project Management** - Advanced project tracking with status, progress, and team assignments
- **Client Management** - Comprehensive client information system with contact details and project history
- **Financial Management** - Revenue tracking, invoicing, and expense management
- **Analytics Dashboard** - Business intelligence and performance metrics
- **Reporting System** - Generate and manage various business reports
- **Settings Panel** - Configure system preferences and integrations

### 🔄 In Development
- **Service Management** - Service catalog and pricing
- **Advanced Analytics** - Detailed reporting and insights
- **Mobile Application** - Native mobile app for iOS and Android

## 📁 Project Structure

```
agency-management-panel/
├── frontend/                 # Next.js 15 frontend
│   ├── src/app/             # App Router pages
│   ├── src/components/      # Reusable components
│   └── src/lib/            # Utilities and configurations
├── backend/                 # Node.js/Express API
├── aws/                    # AWS configuration and services
└── docker-compose.yml      # Development environment
```

## 🛠 Tech Stack (100% DARMOWY)

### Frontend
- **Next.js 15** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Supabase Client** - Real-time data

### Backend
- **Node.js + Express.js** - API server
- **TypeScript** - Type safety
- **Supabase** - Database (PostgreSQL) + Auth + Storage - **DARMOWE**
- **Upstash Redis** - Caching - **DARMOWE** (10k commands/day)
- **Resend** - Email - **DARMOWE** (3k emails/month)

### Development
- **Docker Compose** - Local development environment
- **ESLint + Prettier** - Code quality
- **Git hooks** - Pre-commit validation

### 💰 Koszty: $0/miesiąc
- Supabase Free Tier: 500MB DB + 1GB Storage + 50k MAU
- Upstash Free Tier: 10k commands/day
- Resend Free Tier: 3k emails/month
- Vercel Free Tier: Unlimited projects

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agency-management-panel
   ```

2. **Start with Docker (Recommended)**
   ```bash
   docker-compose up
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

3. **Or run manually**
   ```bash
   # Frontend
   cd frontend
   npm install
   npm run dev

   # Backend (in another terminal)
   cd backend
   npm install
   npm run dev
   ```

## 📋 Case Studies Module

The case studies module allows you to:

1. **Create** - Multi-step form for comprehensive case studies
2. **Manage** - List, filter, and organize case studies
3. **Export** - Generate markdown files for website publication
4. **Publish** - Automatically save to `dokumentacja-ecm/portfolio-case-studies/`
5. **Sync** - Import existing case studies from documentation

### Case Study Structure
- Basic project information
- Challenge description (problems, goals, constraints)
- Solution details (strategy, phases, features)
- Results and KPIs
- Client testimonials and ratings

## 🔧 Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Backend
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start           # Start production server
```

### Environment Variables

#### Frontend (.env.local):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Backend (.env):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
REDIS_URL=redis://default:[password]@[endpoint].upstash.io:6379
RESEND_API_KEY=re_your_api_key
JWT_SECRET=your-super-secret-jwt-key
```

**Bez konfiguracji:** Aplikacja działa w trybie demo z przykładowymi danymi.

## 📊 Dashboard Features

- **Agency Overview** - Key metrics and statistics
- **Recent Projects** - Latest project activity
- **Team Activity** - Team member actions and updates
- **Quick Actions** - Common tasks and shortcuts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software developed for ECM Digital.

## 🚀 Deployment

### Production Deployment
The agency management panel is designed for deployment to Vercel:

1. **Build the application**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

### Integration with Main Website
The panel integrates with the main ECM Digital website through:
- Navigation dropdown menu under "Moje Konto"
- Direct access at `/agency-management-panel` path
- Automatic redirect from placeholder page

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📞 Support

For support and questions:
- Email: hello@ecm-digital.com
- Phone: +48 535 330 323

---

*Developed by ECM Digital Team*