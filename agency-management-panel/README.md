# Agency Management Panel

A comprehensive management system for software house/digital agency operations with advanced case studies management.

## 🚀 Features

### ✅ Implemented
- **Case Studies Management** - Complete CRUD system for portfolio case studies
- **Markdown Export** - Generate and publish case studies to website
- **Dashboard Overview** - Agency metrics and activity monitoring
- **Project Management** - Basic project tracking
- **Team Management** - Team member overview
- **Client Management** - Client information system

### 🔄 In Development
- **Financial Management** - Revenue tracking and invoicing
- **Service Management** - Service catalog and pricing
- **Advanced Analytics** - Detailed reporting and insights

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

## 🛠 Tech Stack

### Frontend
- **Next.js 15** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

### Backend
- **Node.js + Express.js** - API server
- **TypeScript** - Type safety
- **AWS** - Database (RDS), authentication, and services

### Development
- **Docker Compose** - Local development environment
- **ESLint + Prettier** - Code quality
- **Git hooks** - Pre-commit validation

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

Create `.env.local` in the frontend directory:
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-west-1
```

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

## 📞 Support

For support and questions:
- Email: hello@ecm-digital.com
- Phone: +48 535 330 323

---

*Developed by ECM Digital Team*