# ✅ Deployment Checklist - ECM Digital

## 🎯 Pre-Deployment

### 1. Konta i Usługi (DARMOWE)

- [ ] **Supabase** - https://supabase.com
  - [ ] Utworzono projekt
  - [ ] Skopiowano Project URL
  - [ ] Skopiowano anon public key
  - [ ] Skopiowano service_role key
  - [ ] Wykonano SQL schema
  - [ ] Utworzono storage buckets
  - [ ] Włączono RLS policies

- [ ] **Vercel** - https://vercel.com
  - [ ] Utworzono konto
  - [ ] Połączono z GitHub
  - [ ] Dodano zmienne środowiskowe

- [ ] **Upstash Redis** (opcjonalne) - https://upstash.com
  - [ ] Utworzono database
  - [ ] Skopiowano REDIS_URL

- [ ] **Resend** (opcjonalne) - https://resend.com
  - [ ] Utworzono konto
  - [ ] Dodano domenę
  - [ ] Skopiowano API key

### 2. Zmienne Środowiskowe

#### Client Dashboard (.env.local):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

#### Agency Management Panel Frontend (.env.local):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

#### Agency Management Panel Backend (.env):
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
REDIS_URL=redis://default:xxx@xxx.upstash.io:6379
RESEND_API_KEY=re_xxx
JWT_SECRET=your-super-secret-key
NODE_ENV=production
```

### 3. Testy Lokalne

- [ ] **Główna strona**
  ```bash
  cd ecmdigitalwebsite
  npm run build
  npm start
  # Test: http://localhost:3001
  ```

- [ ] **Client Dashboard**
  ```bash
  cd client-dashboard
  npm run build
  npm start
  # Test: http://localhost:3002
  ```

- [ ] **Agency Management Panel**
  ```bash
  # Frontend
  cd agency-management-panel/frontend
  npm run build
  npm start
  
  # Backend
  cd ../backend
  npm run build
  npm start
  ```

## 🚀 Deployment

### 1. Główna Strona (Vercel)

```bash
cd ecmdigitalwebsite

# Deploy
vercel --prod

# Lub przez GitHub:
# 1. Push do main branch
# 2. Vercel auto-deploy
```

**Checklist:**
- [ ] Build successful
- [ ] Strona działa
- [ ] Chatbot działa
- [ ] Formularze działają
- [ ] Wielojęzyczność działa
- [ ] SEO meta tags są poprawne

### 2. Client Dashboard (Vercel)

```bash
cd client-dashboard

# Dodaj zmienne środowiskowe w Vercel Dashboard
# Settings > Environment Variables

# Deploy
vercel --prod
```

**Checklist:**
- [ ] Build successful
- [ ] Logowanie działa
- [ ] Projekty się ładują
- [ ] Messaging działa
- [ ] Upload plików działa
- [ ] Faktury się wyświetlają

### 3. Agency Management Panel

#### Frontend (Vercel):
```bash
cd agency-management-panel/frontend

# Dodaj zmienne środowiskowe w Vercel Dashboard
vercel --prod
```

#### Backend (Railway):
```bash
# 1. Przejdź do https://railway.app
# 2. New Project > Deploy from GitHub
# 3. Wybierz repo i folder: agency-management-panel/backend
# 4. Dodaj zmienne środowiskowe
# 5. Deploy!
```

**Checklist:**
- [ ] Frontend build successful
- [ ] Backend deployed
- [ ] API endpoint działa
- [ ] Dashboard się ładuje
- [ ] Projekty działają
- [ ] Case studies działają
- [ ] Faktury działają

## 🔒 Security Checklist

- [ ] **Supabase RLS** włączone na wszystkich tabelach
- [ ] **Environment variables** nie są w repo
- [ ] **API keys** są w Vercel/Railway secrets
- [ ] **CORS** skonfigurowany poprawnie
- [ ] **JWT_SECRET** jest silny i unikalny
- [ ] **2FA** włączone na wszystkich kontach
- [ ] **Service role key** używany tylko w backendzie

## 📊 Monitoring Setup

### Supabase:
- [ ] Sprawdź Dashboard > Database > Usage
- [ ] Sprawdź Dashboard > Storage > Usage
- [ ] Sprawdź Dashboard > Auth > Users
- [ ] Włącz email notifications dla limitów

### Vercel:
- [ ] Sprawdź Analytics
- [ ] Sprawdź Bandwidth usage
- [ ] Włącz email notifications

### Upstash (jeśli używasz):
- [ ] Sprawdź Commands usage
- [ ] Sprawdź Memory usage

### Resend (jeśli używasz):
- [ ] Sprawdź Email usage
- [ ] Sprawdź Delivery rate

## 🧪 Post-Deployment Testing

### Główna Strona:
- [ ] Strona główna ładuje się < 3s
- [ ] Wszystkie linki działają
- [ ] Formularze wysyłają dane
- [ ] Chatbot odpowiada
- [ ] Mobile responsive
- [ ] SEO meta tags poprawne

### Client Dashboard:
- [ ] Rejestracja działa
- [ ] Logowanie działa
- [ ] Email verification działa
- [ ] Projekty się ładują
- [ ] Real-time messaging działa
- [ ] Upload plików działa
- [ ] Faktury się generują

### Agency Management Panel:
- [ ] Dashboard ładuje metryki
- [ ] Projekty CRUD działa
- [ ] Klienci CRUD działa
- [ ] Case studies export działa
- [ ] Faktury generują się
- [ ] Raporty działają

## 🔧 Troubleshooting

### Build Fails:
```bash
# Wyczyść cache
rm -rf node_modules .next
npm install
npm run build
```

### Supabase Connection Error:
```bash
# Sprawdź credentials
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Sprawdź RLS policies w Supabase Dashboard
# Sprawdź logi w Supabase Dashboard > Logs
```

### Vercel Deployment Error:
```bash
# Sprawdź build logs w Vercel Dashboard
# Sprawdź environment variables
# Sprawdź czy wszystkie dependencies są w package.json
```

### Railway Backend Error:
```bash
# Sprawdź logs w Railway Dashboard
# Sprawdź environment variables
# Sprawdź czy PORT jest ustawiony
```

## 📈 Performance Optimization

- [ ] **Images** - używaj Next.js Image component
- [ ] **Fonts** - używaj next/font
- [ ] **Code splitting** - lazy load komponentów
- [ ] **Caching** - włącz Redis dla API
- [ ] **CDN** - Vercel automatycznie
- [ ] **Compression** - włączone w Next.js

## 🎯 SEO Checklist

- [ ] **Meta tags** - title, description, og:image
- [ ] **Sitemap.xml** - wygenerowany
- [ ] **Robots.txt** - skonfigurowany
- [ ] **Canonical URLs** - ustawione
- [ ] **Schema.org** - structured data
- [ ] **Google Analytics** - zainstalowany
- [ ] **Google Search Console** - dodany

## 📱 Mobile Testing

- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Responsive breakpoints (320px, 768px, 1024px, 1440px)

## 🌐 Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## 📊 Analytics Setup

### Google Analytics:
```html
<!-- Dodaj w layout.tsx -->
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

### Vercel Analytics:
```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🔄 Continuous Deployment

### GitHub Actions (opcjonalne):
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run test
```

## 📞 Support Contacts

### W razie problemów:
- **Supabase Support:** https://supabase.com/support
- **Vercel Support:** https://vercel.com/support
- **Railway Support:** https://railway.app/help
- **ECM Digital:** kontakt@ecm-digital.pl

## ✅ Final Checklist

- [ ] Wszystkie projekty deployed
- [ ] Wszystkie testy przeszły
- [ ] Monitoring skonfigurowany
- [ ] Analytics działają
- [ ] Backupy skonfigurowane
- [ ] Dokumentacja zaktualizowana
- [ ] Team poinformowany
- [ ] Klient poinformowany

## 🎉 Post-Launch

### Dzień 1:
- [ ] Monitoruj logi w Supabase
- [ ] Sprawdź Vercel Analytics
- [ ] Sprawdź error rate
- [ ] Zbierz feedback od użytkowników

### Tydzień 1:
- [ ] Przeanalizuj usage patterns
- [ ] Optymalizuj slow queries
- [ ] Popraw UX na podstawie feedbacku
- [ ] Sprawdź czy nie przekraczasz limitów

### Miesiąc 1:
- [ ] Review kosztów (powinno być $0!)
- [ ] Przeanalizuj analytics
- [ ] Zaplanuj nowe features
- [ ] Backup danych

---

**🚀 Gotowe do startu!**

*Ostatnia aktualizacja: Styczeń 2025*
