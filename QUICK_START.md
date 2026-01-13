# 🚀 Quick Start - ECM Digital

## 📦 Co masz w tym projekcie?

### 1. **Główna strona ECM Digital** (Next.js)
- Portfolio agencji
- Oferta usług
- Chatbot AI
- Formularze kontaktowe
- **Port:** 3001

### 2. **Client Dashboard** (Next.js + Supabase)
- Panel dla klientów
- Zarządzanie projektami
- Komunikacja z zespołem
- Faktury i płatności
- **Port:** 3002

## 🎯 Szybki Start (5 minut)

### Opcja 1: Tryb Demo (bez konfiguracji)

```bash
# 1. Zainstaluj zależności
cd ecmdigitalwebsite
npm install

cd client-dashboard
npm install

# 2. Uruchom główną stronę
cd ..
npm run dev
# Otwórz: http://localhost:3001

# 3. Uruchom dashboard (w nowym terminalu)
cd client-dashboard
npm run dev
# Otwórz: http://localhost:3002
```

**✅ Gotowe!** Obie aplikacje działają w trybie demo.

### Opcja 2: Z Supabase (pełna funkcjonalność)

```bash
# 1. Utwórz konto Supabase (darmowe)
# Przejdź do: https://supabase.com
# Kliknij: "New Project"
# Region: Europe (Frankfurt)

# 2. Pobierz credentials
# Settings > API
# Skopiuj: Project URL i anon public key

# 3. Skonfiguruj Client Dashboard
cd client-dashboard
cp .env.example .env.local

# Edytuj .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 4. Utwórz schemat bazy
# Supabase Dashboard > SQL Editor
# Skopiuj SQL z: MIGRATION_AWS_TO_SUPABASE.md
# Kliknij: Run

# 5. Uruchom
npm run dev
```

## 📁 Struktura Projektu

```
ecmdigitalwebsite/
├── 📄 README.md                    # Główna dokumentacja
├── 📄 FREE_STACK_MIGRATION.md      # Migracja AWS → Supabase
├── 📄 QUICK_START.md               # Ten plik
│
├── 🌐 Główna strona (Next.js)
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   ├── components/             # React komponenty
│   │   └── js/                     # JavaScript utilities
│   ├── public/                     # Statyczne pliki
│   ├── package.json
│   └── next.config.js
│
├── 👥 Client Dashboard (Next.js + Supabase)
│   ├── src/
│   │   ├── app/                    # Strony dashboardu
│   │   ├── components/             # UI komponenty
│   │   ├── hooks/                  # Custom hooks
│   │   ├── lib/                    # Supabase config
│   │   └── types/                  # TypeScript types
│   ├── package.json
│   ├── .env.example
│   └── MIGRATION_AWS_TO_SUPABASE.md
│
└── 📚 Dokumentacja
    ├── SYSTEM_STATUS.md            # Status systemu
    ├── DEPLOYMENT_GUIDE.md         # Deployment
    └── USER_GUIDE.md               # Instrukcja użytkownika
```

## 🎨 Główne Funkcje

### Główna Strona:
- ✅ Portfolio projektów
- ✅ Oferta usług (WWW, Shopify, MVP, UX, Automatyzacje, Social Media)
- ✅ Chatbot AI (AWS Bedrock)
- ✅ Formularze kontaktowe (HubSpot)
- ✅ Blog i case studies
- ✅ Wielojęzyczność (PL, EN, DE)
- ✅ SEO optimized

### Client Dashboard:
- ✅ Autentykacja (Supabase Auth)
- ✅ Zarządzanie projektami
- ✅ Real-time messaging
- ✅ Upload dokumentów
- ✅ System faktur
- ✅ Analytics i raporty
- ✅ Kalendarz
- ✅ Ustawienia profilu
- ✅ Responsywny design
- ✅ PWA ready

## 💰 Koszty

### Tryb Demo (Development):
- **Koszt:** $0/miesiąc
- **Funkcje:** Wszystkie UI, przykładowe dane
- **Ograniczenia:** Brak persystencji, brak real-time

### Produkcja (Supabase Free Tier):
- **Koszt:** $0/miesiąc
- **Limity:**
  - 500MB database
  - 1GB storage
  - 50k MAU
  - 2GB bandwidth
- **Funkcje:** Wszystkie + persystencja + real-time

### Produkcja (Supabase Pro):
- **Koszt:** $25/miesiąc
- **Limity:**
  - 8GB database
  - 100GB storage
  - 100k MAU
  - 250GB bandwidth
- **Funkcje:** Wszystkie + daily backups + priority support

## 🔧 Komendy

### Główna strona:
```bash
npm run dev          # Development (port 3001)
npm run build        # Build dla produkcji
npm run start        # Start production server
npm run lint         # Lint code
```

### Client Dashboard:
```bash
npm run dev          # Development (port 3002)
npm run build        # Build dla produkcji
npm run start        # Start production server
npm run lint         # Lint code
```

## 🚀 Deployment

### Vercel (Rekomendowane - DARMOWE):

```bash
# 1. Zainstaluj Vercel CLI
npm i -g vercel

# 2. Deploy główną stronę
cd ecmdigitalwebsite
vercel

# 3. Deploy dashboard
cd client-dashboard
vercel

# 4. Dodaj zmienne środowiskowe w Vercel Dashboard
# Settings > Environment Variables
```

### Inne platformy:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify (ironicznie 😄)

## 📖 Dokumentacja

### Dla Developerów:
- `FREE_STACK_MIGRATION.md` - Migracja z AWS
- `client-dashboard/MIGRATION_AWS_TO_SUPABASE.md` - Szczegóły Supabase
- `DEPLOYMENT_GUIDE.md` - Deployment
- `.kiro/specs/` - Specyfikacje funkcji

### Dla Użytkowników:
- `USER_GUIDE.md` - Instrukcja użytkownika
- `SYSTEM_STATUS.md` - Status systemu

### Dla Klientów:
- `CLIENT_MANAGEMENT_INTEGRATION.md` - Integracja CRM
- `CHATBOT-API-INTEGRATION.md` - API chatbota

## 🆘 Troubleshooting

### Problem: Port zajęty
```bash
# Znajdź proces
lsof -ti:3001  # lub 3002

# Zabij proces
kill -9 <PID>
```

### Problem: Błędy instalacji
```bash
# Wyczyść cache
rm -rf node_modules package-lock.json
npm install
```

### Problem: Supabase nie działa
```bash
# Sprawdź .env.local
cat .env.local

# Sprawdź czy plik jest w głównym katalogu
ls -la | grep .env

# Restart dev server
npm run dev
```

### Problem: Build fails
```bash
# Sprawdź błędy TypeScript
npm run lint

# Sprawdź logi
npm run build
```

## 📞 Wsparcie

### Dokumentacja:
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs
- Resend: https://resend.com/docs

### Community:
- Supabase Discord: https://discord.supabase.com
- Next.js Discord: https://nextjs.org/discord

### ECM Digital:
- Email: kontakt@ecm-digital.pl
- Website: https://ecm-digital.com

## 🎓 Nauka

### Supabase:
1. [Quickstart Guide](https://supabase.com/docs/guides/getting-started)
2. [Auth Deep Dive](https://supabase.com/docs/guides/auth)
3. [Database Guide](https://supabase.com/docs/guides/database)
4. [Storage Guide](https://supabase.com/docs/guides/storage)

### Next.js:
1. [Learn Next.js](https://nextjs.org/learn)
2. [App Router](https://nextjs.org/docs/app)
3. [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

## 🎯 Następne Kroki

### Po uruchomieniu:
1. ✅ Przetestuj główną stronę
2. ✅ Przetestuj dashboard w trybie demo
3. ✅ Utwórz konto Supabase
4. ✅ Skonfiguruj bazę danych
5. ✅ Przetestuj pełną funkcjonalność
6. ✅ Deploy na Vercel

### Rozwój:
1. Dodaj więcej projektów do portfolio
2. Rozbuduj funkcje dashboardu
3. Dodaj integracje (Stripe, PayU)
4. Dodaj analytics
5. Dodaj testy

## 💡 Tips & Tricks

### Development:
- Użyj `console.log()` do debugowania
- Sprawdzaj Network tab w DevTools
- Używaj React DevTools
- Testuj na różnych urządzeniach

### Supabase:
- Używaj SQL Editor do testowania queries
- Sprawdzaj Logs w Dashboard
- Testuj RLS policies
- Używaj Database Webhooks dla automatyzacji

### Performance:
- Używaj Next.js Image component
- Lazy load komponenty
- Optymalizuj bundle size
- Używaj CDN dla statycznych plików

---

**🎉 Gotowe! Powodzenia z projektem!**

Jeśli masz pytania, sprawdź dokumentację lub skontaktuj się z zespołem ECM Digital.
