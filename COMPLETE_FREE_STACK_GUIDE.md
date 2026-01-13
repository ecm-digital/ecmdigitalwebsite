# 🎉 Kompletny Przewodnik - 100% Darmowy Stack

## 📦 Projekty w Repozytorium

### 1. **Główna Strona ECM Digital** (Next.js)
- Portfolio agencji
- Oferta usług
- Chatbot AI
- Blog i case studies
- **Port:** 3001
- **Stack:** Next.js 14, Tailwind CSS, TypeScript

### 2. **Client Dashboard** (Next.js + Supabase)
- Panel dla klientów
- Zarządzanie projektami
- Komunikacja z zespołem
- Faktury i płatności
- **Port:** 3002
- **Stack:** Next.js 14, Supabase, TypeScript

### 3. **Agency Management Panel** (Next.js + Supabase)
- Panel zarządzania agencją
- Zarządzanie projektami i zespołem
- CRM i klienci
- Finanse i faktury
- Case studies management
- **Port:** 3001 (frontend) + 3000 (backend)
- **Stack:** Next.js 15, Node.js, Supabase, TypeScript

## 💰 Całkowity Koszt: $0/miesiąc

### Darmowe Usługi:

| Usługa | Darmowy Limit | Koszt |
|--------|---------------|-------|
| **Supabase** | 500MB DB + 1GB Storage + 50k MAU | $0 |
| **Upstash Redis** | 10k commands/day | $0 |
| **Resend** | 3k emails/miesiąc | $0 |
| **Vercel** | Unlimited projects + 100GB bandwidth | $0 |
| **n8n** | Self-hosted (unlimited) | $0 |

**Łącznie:** $0/miesiąc dla wszystkich 3 projektów! 🎉

## 🚀 Quick Start (wszystkie projekty)

### Opcja 1: Tryb Demo (bez konfiguracji)

```bash
# 1. Główna strona
cd ecmdigitalwebsite
npm install
npm run dev
# → http://localhost:3001

# 2. Client Dashboard (nowy terminal)
cd client-dashboard
npm install
npm run dev
# → http://localhost:3002

# 3. Agency Management Panel (nowy terminal)
cd agency-management-panel/frontend
npm install
npm run dev
# → http://localhost:3001

# 4. Backend API (nowy terminal)
cd agency-management-panel/backend
npm install
npm run dev
# → http://localhost:3000
```

**✅ Wszystko działa w trybie demo!**

### Opcja 2: Z Supabase (pełna funkcjonalność)

#### Krok 1: Utwórz projekt Supabase
```bash
# 1. Przejdź do https://supabase.com
# 2. Kliknij "New Project"
# 3. Nazwa: ecm-digital-production
# 4. Region: Europe (Frankfurt)
# 5. Hasło: [ustaw silne hasło]
```

#### Krok 2: Pobierz credentials
```bash
# Settings > API
# Skopiuj:
# - Project URL
# - anon public key
# - service_role key (dla backendu)
```

#### Krok 3: Skonfiguruj projekty

**Client Dashboard:**
```bash
cd client-dashboard
cp .env.example .env.local

# Edytuj .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Agency Management Panel:**
```bash
# Frontend
cd agency-management-panel/frontend
cp .env.example .env.local

# Edytuj .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Backend
cd ../backend
cp .env.example .env

# Edytuj .env:
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgres_connection_string
```

#### Krok 4: Utwórz schemat bazy

```bash
# Supabase Dashboard > SQL Editor
# Skopiuj SQL z:
# - client-dashboard/MIGRATION_AWS_TO_SUPABASE.md
# - agency-management-panel/MIGRATION_TO_FREE_STACK.md
# Kliknij: Run
```

#### Krok 5: Utwórz storage buckets

```bash
# Supabase Dashboard > Storage
# Utwórz buckety:
# - documents (private)
# - avatars (public)
# - project-files (private)
# - case-studies (public)
```

#### Krok 6: Uruchom wszystko

```bash
# Główna strona
cd ecmdigitalwebsite
npm run dev

# Client Dashboard
cd client-dashboard
npm run dev

# Agency Management Panel
cd agency-management-panel/frontend
npm run dev

cd ../backend
npm run dev
```

## 📁 Struktura Projektu

```
ecmdigitalwebsite/
│
├── 📄 Dokumentacja główna
│   ├── README.md
│   ├── QUICK_START.md
│   ├── FREE_STACK_MIGRATION.md
│   └── COMPLETE_FREE_STACK_GUIDE.md (ten plik)
│
├── 🌐 Główna strona (Next.js)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── 👥 Client Dashboard (Next.js + Supabase)
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── MIGRATION_AWS_TO_SUPABASE.md
│
└── 🏢 Agency Management Panel
    ├── frontend/ (Next.js)
    ├── backend/ (Node.js + Express)
    ├── docker-compose.yml
    └── MIGRATION_TO_FREE_STACK.md
```

## 🎯 Funkcjonalności

### Główna Strona:
- ✅ Portfolio projektów
- ✅ Oferta usług
- ✅ Chatbot AI
- ✅ Blog i case studies
- ✅ Formularze kontaktowe
- ✅ Wielojęzyczność (PL, EN, DE)
- ✅ SEO optimized

### Client Dashboard:
- ✅ Autentykacja (Supabase Auth)
- ✅ Zarządzanie projektami
- ✅ Real-time messaging
- ✅ Upload dokumentów
- ✅ System faktur
- ✅ Analytics
- ✅ Kalendarz
- ✅ Responsywny design

### Agency Management Panel:
- ✅ Dashboard z KPI
- ✅ Zarządzanie projektami
- ✅ CRM i klienci
- ✅ Zarządzanie zespołem
- ✅ Finanse i faktury
- ✅ Case studies management
- ✅ Raporty i analytics
- ✅ Eksport do markdown

## 🔧 Dodatkowe Usługi (opcjonalne)

### 1. Upstash Redis (Caching)

**Dlaczego?** Przyspiesza aplikację, cache dla API

```bash
# 1. https://upstash.com
# 2. Create Database
# 3. Region: Europe (Frankfurt)
# 4. Plan: Free (10k commands/day)
# 5. Skopiuj REDIS_URL

# Dodaj do backend/.env:
REDIS_URL=redis://default:[password]@[endpoint].upstash.io:6379
```

### 2. Resend (Email)

**Dlaczego?** Wysyłanie emaili (powiadomienia, faktury)

```bash
# 1. https://resend.com
# 2. Zarejestruj się
# 3. Dodaj domenę (opcjonalnie)
# 4. Utwórz API key

# Dodaj do .env:
RESEND_API_KEY=re_your_api_key
```

### 3. n8n (Automatyzacje)

**Dlaczego?** Automatyzacja workflow (np. auto-faktury)

**Opcja A: Self-hosted (DARMOWE):**
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Opcja B: n8n.cloud ($20/m):**
```bash
# https://n8n.cloud
```

### 4. AI Assistant (opcjonalne)

**Opcja A: OpenAI:**
```bash
# https://platform.openai.com
# Pay-as-you-go: ~$0.03/1k tokens
OPENAI_API_KEY=sk-your-key
```

**Opcja B: Anthropic Claude:**
```bash
# https://console.anthropic.com
# Pay-as-you-go: ~$0.015/1k tokens
ANTHROPIC_API_KEY=sk-ant-your-key
```

## 📊 Limity Darmowych Tierów

### Supabase Free:
- ✅ 500MB database storage
- ✅ 1GB file storage
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth
- ✅ 500,000 Edge Function invocations
- ✅ Unlimited API requests
- ✅ 7 days log retention

**Kiedy upgrade do Pro ($25/m)?**
- Gdy przekroczysz 500MB danych
- Gdy potrzebujesz więcej storage
- Gdy masz >50k użytkowników/miesiąc

### Upstash Redis Free:
- ✅ 10,000 commands/day
- ✅ 256MB storage
- ✅ Global replication

**Kiedy upgrade do Pro ($10/m)?**
- Gdy przekroczysz 10k commands/day
- Gdy potrzebujesz więcej pamięci

### Resend Free:
- ✅ 3,000 emails/miesiąc
- ✅ 100 emails/dzień
- ✅ 1 custom domain

**Kiedy upgrade do Pro ($20/m)?**
- Gdy wysyłasz >3k emaili/miesiąc

### Vercel Free:
- ✅ Unlimited projects
- ✅ 100GB bandwidth/miesiąc
- ✅ Automatic HTTPS
- ✅ Edge Functions

**Kiedy upgrade do Pro ($20/m)?**
- Gdy przekroczysz 100GB bandwidth
- Gdy potrzebujesz team collaboration

## 🚀 Deployment

### Vercel (Rekomendowane - DARMOWE)

```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Deploy główną stronę
cd ecmdigitalwebsite
vercel --prod

# Deploy Client Dashboard
cd client-dashboard
vercel --prod

# Deploy Agency Management Panel (frontend)
cd agency-management-panel/frontend
vercel --prod

# Backend można hostować na:
# - Railway (darmowy tier)
# - Render (darmowy tier)
# - Fly.io (darmowy tier)
```

### Railway (Backend - DARMOWE)

```bash
# 1. https://railway.app
# 2. New Project > Deploy from GitHub
# 3. Wybierz repo
# 4. Dodaj zmienne środowiskowe
# 5. Deploy!
```

## 📖 Dokumentacja

### Dla każdego projektu:
- **Client Dashboard:** `client-dashboard/MIGRATION_AWS_TO_SUPABASE.md`
- **Agency Panel:** `agency-management-panel/MIGRATION_TO_FREE_STACK.md`
- **Quick Start:** `QUICK_START.md`
- **Migracja:** `FREE_STACK_MIGRATION.md`

### Zewnętrzna dokumentacja:
- Supabase: https://supabase.com/docs
- Upstash: https://docs.upstash.com
- Resend: https://resend.com/docs
- Vercel: https://vercel.com/docs
- n8n: https://docs.n8n.io

## 🆘 Troubleshooting

### Problem: Port zajęty
```bash
# Znajdź proces
lsof -ti:3001  # lub 3002, 3000

# Zabij proces
kill -9 <PID>
```

### Problem: Supabase nie działa
```bash
# Sprawdź .env.local / .env
cat .env.local

# Sprawdź czy credentials są poprawne
# Sprawdź czy RLS policies są utworzone
# Sprawdź logi w Supabase Dashboard
```

### Problem: Redis connection failed
```bash
# Sprawdź REDIS_URL
echo $REDIS_URL

# Sprawdź czy Upstash database jest aktywna
# Sprawdź logi w Upstash Dashboard
```

### Problem: Build fails
```bash
# Wyczyść cache
rm -rf node_modules .next
npm install
npm run build
```

## 💡 Best Practices

### Development:
1. Używaj `.env.local` dla secrets (nie commituj!)
2. Testuj na różnych urządzeniach
3. Sprawdzaj logi w Supabase Dashboard
4. Używaj TypeScript dla type safety

### Production:
1. Włącz RLS policies w Supabase
2. Używaj environment variables w Vercel
3. Monitoruj usage w dashboardach
4. Regularnie backupuj dane

### Security:
1. Nigdy nie commituj `.env` plików
2. Używaj `service_role` key tylko w backendzie
3. Włącz 2FA na wszystkich kontach
4. Regularnie aktualizuj zależności

## 📈 Skalowanie

### Gdy przekroczysz darmowe limity:

**Supabase Pro ($25/m):**
- 8GB database
- 100GB storage
- 100k MAU
- Daily backups

**Upstash Pro ($10/m):**
- 100k commands/day
- 1GB storage
- Better performance

**Resend Pro ($20/m):**
- 50k emails/miesiąc
- Multiple domains
- Priority support

**Vercel Pro ($20/m):**
- 1TB bandwidth
- Team collaboration
- Advanced analytics

**Łączny koszt po upgrade:** ~$75/miesiąc
(Nadal tańsze niż AWS: $200+/miesiąc!)

## 🎓 Nauka

### Supabase:
- [Quickstart](https://supabase.com/docs/guides/getting-started)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)
- [YouTube Channel](https://www.youtube.com/@Supabase)

### Next.js:
- [Learn Next.js](https://nextjs.org/learn)
- [App Router](https://nextjs.org/docs/app)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

### TypeScript:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/)

## 📞 Wsparcie

### Community:
- Supabase Discord: https://discord.supabase.com
- Next.js Discord: https://nextjs.org/discord

### ECM Digital:
- Email: kontakt@ecm-digital.pl
- Website: https://ecm-digital.com
- Phone: +48 535 330 323

---

## 🎉 Podsumowanie

### Co masz:
- ✅ 3 kompletne aplikacje
- ✅ 100% darmowy stack
- ✅ Gotowe do produkcji
- ✅ Łatwe skalowanie
- ✅ Pełna dokumentacja

### Oszczędności:
- **Koszt AWS:** $200-500/miesiąc
- **Koszt teraz:** $0/miesiąc
- **Oszczędność:** $2,400-6,000/rok! 💰

### Następne kroki:
1. ✅ Uruchom wszystkie projekty lokalnie
2. ✅ Skonfiguruj Supabase
3. ✅ Przetestuj funkcjonalności
4. ✅ Deploy na Vercel
5. ✅ Monitoruj usage
6. ✅ Rozwijaj dalej!

**🚀 Powodzenia z projektami!**

---

*Ostatnia aktualizacja: Styczeń 2025*
*Wersja: 2.0 (Post-AWS Migration)*
