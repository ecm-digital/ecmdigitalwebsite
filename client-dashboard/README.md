# ECM Digital - Dashboard Klienta

Dashboard do zarządzania projektami dla klientów ECM Digital.

## 🚀 Quick Start

### 1. Instalacja zależności

```bash
npm install
```

### 2. Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3002

**Tryb demo:** Autentykacja działa lokalnie (localStorage) z przykładowymi danymi — bez zewnętrznego backendu.

## 📋 Funkcjonalności

### ✅ Zaimplementowane:
- 🔐 **Autentykacja** - logowanie/rejestracja w trybie demo
- 📊 **Dashboard** - przegląd projektów i statystyk
- 📁 **Projekty** - zarządzanie projektami z filtrowaniem
- 💬 **Komunikacja** - messaging z zespołem
- 🎨 **UI/UX** - responsywny design z Tailwind CSS
- 📱 **PWA Ready** - przygotowane do Progressive Web App

### 🔄 W trakcie implementacji:
- 📄 **Dokumenty** - zarządzanie plikami projektowymi
- 💰 **Faktury** - system płatności
- 📈 **Analityka** - metryki projektów
- 🔧 **Integracje** - zewnętrzne narzędzia

## 🛠 Stack Technologiczny

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Hosting:** statyczny / Next.js (GitHub Pages, Netlify, własny serwer)
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
│   └── types/              # TypeScript typy
└── scripts/               # Skrypty pomocnicze
```

## 🔒 Bezpieczeństwo

- **HTTPS Only** - szyfrowana komunikacja
- **Input Validation** - walidacja danych z Zod

## 📱 Responsive Design

Dashboard jest w pełni responsywny i działa na:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## 🚀 Deployment

1. Zbuduj aplikację: `npm run build`
2. Wdróż na wybranym hostingu Next.js lub jako eksport statyczny (`npm run build:export` + S3)
3. Ustaw wymagane zmienne środowiskowe (jeśli używasz AWS API)

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Skontaktuj się z zespołem ECM Digital

---

**ECM Digital** - Tworzymy przyszłość cyfrową
