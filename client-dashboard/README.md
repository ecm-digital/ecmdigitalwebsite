# ECM Digital - Dashboard Klienta

Dashboard do zarządzania projektami dla klientów ECM Digital.

## 🚀 Quick Start

### 1. Instalacja zależności

```bash
npm install
```

### 2. Konfiguracja Supabase

1. Przejdź do [Supabase Dashboard](https://supabase.com/dashboard)
2. Wybierz projekt ECM Digital
3. Przejdź do **SQL Editor**
4. Skopiuj i wklej zawartość pliku `supabase/migrations/001_initial_schema.sql`
5. Kliknij **Run** aby wykonać migrację
6. Następnie skopiuj i wklej zawartość pliku `supabase/migrations/002_storage_buckets.sql`
7. Kliknij **Run** aby utworzyć bucket'y do przechowywania plików

### 3. Dodanie przykładowych danych (opcjonalnie)

1. W SQL Editor wklej zawartość pliku `supabase/seed.sql`
2. Kliknij **Run** aby dodać funkcje do tworzenia przykładowych danych

### 4. Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 📋 Funkcjonalności

### ✅ Zaimplementowane:
- 🔐 **Autentykacja** - logowanie/rejestracja z Supabase Auth
- 📊 **Dashboard** - przegląd projektów i statystyk
- 📁 **Projekty** - zarządzanie projektami z filtrowaniem
- 💬 **Komunikacja** - real-time messaging z zespołem
- 📎 **Upload plików** - drag & drop z Supabase Storage
- 💾 **Baza danych** - kompletny schemat z RLS policies
- 🎨 **UI/UX** - responsywny design z Tailwind CSS
- 📱 **PWA Ready** - przygotowane do Progressive Web App

### 🔄 W trakcie implementacji:
- 📄 **Dokumenty** - zarządzanie plikami projektowych
- 💰 **Faktury** - system płatności
- 📈 **Analityka** - metryki projektów
- 🔧 **Integracje** - zewnętrzne narzędzia

## 🛠 Stack Technologiczny

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **State Management:** Zustand
- **Data Fetching:** React Query
- **Charts:** Recharts
- **Date Handling:** date-fns

## 📁 Struktura Projektu

```
client-dashboard/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React komponenty
│   │   ├── auth/           # Komponenty autentykacji
│   │   ├── dashboard/      # Komponenty dashboardu
│   │   ├── projects/       # Komponenty projektów
│   │   └── ui/             # shadcn/ui komponenty
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities i konfiguracja
│   │   ├── supabase/       # Konfiguracja Supabase
│   │   └── stores/         # Zustand stores
│   └── types/              # TypeScript typy
├── supabase/
│   ├── migrations/         # Migracje bazy danych
│   └── seed.sql           # Przykładowe dane
└── scripts/               # Skrypty pomocnicze
```

## 🔒 Bezpieczeństwo

- **Row Level Security (RLS)** - każdy użytkownik widzi tylko swoje dane
- **JWT Authentication** - bezpieczne tokeny Supabase
- **HTTPS Only** - szyfrowana komunikacja
- **Input Validation** - walidacja danych z Zod

## 📱 Responsive Design

Dashboard jest w pełni responsywny i działa na:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## 🎯 Przykładowe dane

Po zarejestrowaniu możesz dodać przykładowe projekty klikając przycisk "Dodaj przykładowe dane" w dashboardzie. Dane demo zawierają:

- 6 różnych typów projektów (Website, Shopify, MVP, UX Audit, Automation, Social Media)
- Faktury w różnych statusach
- Przykładowe wiadomości
- Różne statusy projektów (Discovery, Design, Development, Testing, Completed)

## 🚀 Deployment

### Vercel (Rekomendowane)

1. Push kod do GitHub
2. Połącz repozytorium z Vercel
3. Dodaj zmienne środowiskowe:
   - `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
4. Deploy!

### Inne platformy

Dashboard może być wdrożony na dowolnej platformie obsługującej Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🐛 Troubleshooting

### Problem z bazą danych
- Sprawdź czy migracje zostały wykonane w Supabase
- Upewnij się, że RLS policies są aktywne
- Sprawdź logi w Supabase Dashboard

### Problem z autentykacją
- Sprawdź zmienne środowiskowe
- Upewnij się, że Supabase URL i klucz są poprawne
- Sprawdź czy użytkownik jest zweryfikowany

### Problem z przykładowymi danymi
- Upewnij się, że funkcja `create_sample_projects_for_user` została utworzona
- Sprawdź czy użytkownik ma profil w tabeli `profiles`

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Sprawdź logi w Supabase Dashboard
3. Skontaktuj się z zespołem ECM Digital

---

**ECM Digital** - Tworzymy przyszłość cyfrową 🚀