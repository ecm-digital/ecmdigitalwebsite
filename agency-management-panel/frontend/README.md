# ECM Digital Agency Management Panel

A comprehensive management system for ECM Digital Agency to handle clients, projects, and finances.

## Features

- **Client Management**: Track clients, contacts, and project history
- **Project Tracking**: Monitor project progress, deadlines, and team assignments
- **Financial Dashboard**: Manage invoices, expenses, and revenue tracking
- **Analytics**: Business intelligence and performance metrics
- **Reporting**: Generate and manage various business reports
- **Settings**: Configure system preferences and integrations

## Deployment

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at http://localhost:3001

### Production Build

```bash
# Create production build
npm run build

# Start production server
npm run start
```

### Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

The application will be deployed to your Vercel account and accessible at:
`https://agency-management-panel.vercel.app`

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database connection
DATABASE_URL=your_database_url

# API Keys
NEXT_PUBLIC_API_URL=your_api_url

# Authentication
NEXT_PUBLIC_AUTH_URL=your_auth_url
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── lib/                 # Utility functions and helpers
└── styles/              # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Integration with Main Website

The agency management panel is linked from the main ECM Digital website through:
- Navigation dropdown menu under "Moje Konto" → "Panel Zarządzania"
- Direct access at `/agency-management-panel` path
- Automatic redirect from the placeholder page

## Support

For support, contact the development team or check the main documentation in the `dokumentacja-ecm` folder.