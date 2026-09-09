# ECM Digital Agency - Dokumentacja (Updated)

Kompleksowa dokumentacja agencji ECM Digital zawierająca ofertę usług, portfolio projektów, metodologię pracy oraz case studies.

## 🚀 Struktura Projektu

```
dokumentacja-ecm/
├── index.html                 # Główna strona dokumentacji
├── oferta-uslug/             # Szczegółowa oferta usług
│   ├── strony-www/           # Usługi tworzenia stron WWW
│   ├── sklepy-shopify/       # Sklepy e-commerce na Shopify
│   ├── prototypy-mvp/        # Prototypy MVP i walidacja pomysłów
│   ├── audyty-ux/           # Audyty UX i optymalizacja
│   ├── automatyzacje-n8n/   # Automatyzacje procesów biznesowych
│   └── social-media-data-science/ # Kampanie social media z data science
├── portfolio-case-studies/   # Portfolio i case studies
│   ├── www/                 # Case studies stron WWW
│   ├── shopify/             # Case studies sklepów Shopify
│   ├── mvp/                 # Case studies prototypów MVP
│   └── ux/                  # Case studies audytów UX
├── metodologia/             # Metodologia pracy
├── technologie/             # Stosowane technologie
└── zespol/                  # Informacje o zespole
```

## 📋 Zawartość

### Oferta Usług
- **Strony WWW** - Nowoczesne, responsywne strony internetowe
- **Sklepy Shopify** - Profesjonalne sklepy e-commerce
- **Prototypy MVP** - Szybka walidacja pomysłów biznesowych
- **Audyty UX** - Optymalizacja doświadczenia użytkownika
- **Automatyzacje z n8n** - Zaawansowane rozwiązania automatyzacji procesów biznesowych
- **Social Media z Data Science** - Kampanie social media oparte na data science z wysokimi współczynnikami konwersji

### Portfolio
- **25+ Case Studies** - Szczegółowe opisy zrealizowanych projektów
- **Różnorodne branże** - FinTech, HealthTech, EdTech, PropTech, E-commerce
- **Mierzalne rezultaty** - KPI, ROI, feedback klientów

### Metodologia
- **Proces współpracy** - Krok po kroku od pomysłu do wdrożenia
- **Technologie** - Nowoczesny stack technologiczny
- **Best practices** - Sprawdzone podejścia i metodyki

## 🛠️ Technologie

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5 dla responsywności
- Marked.js dla renderowania Markdown

### Hosting i Deployment
- Statyczna strona HTML
- Kompatybilna z GitHub Pages, Netlify, Vercel
- CDN dla optymalnej wydajności

## 🔗 Integracje

- **Vercel** (Hosting)
- **n8n** (Automatyzacje)
- Google Analytics (gtag)
- Hotjar
- HubSpot (tracking + formularz)

## 📚 Dokumentacja

- 📖 **[QUICK_START.md](QUICK_START.md)** - Szybki start
- 👥 **[Client Dashboard](client-dashboard/README.md)** - Panel dla klientów

### HubSpot (statyczna strona)

1. Uzupełnij `hubspot-config.json` w katalogu projektu:

```
{
  "portalId": "YOUR_PORTAL_ID",
  "formId": "YOUR_FORM_ID",
  "region": "na1",
  "formTargetId": "hubspot-form"
}
```

2. W `index.html` dodano placeholder `<div id="hubspot-form"></div>` w sekcji `#contact` oraz loader `src/js/hubspot.js`.

### HubSpot (Next.js aplikacje)

Dodaj w `.env.local` odpowiedniej aplikacji:

```
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=YOUR_PORTAL_ID
```

Skrypt śledzący jest wstrzykiwany w `src/app/layout.tsx` przez `next/script` dla obu aplikacji.

## 🚀 Uruchomienie Lokalnie

### Opcja 1: Python HTTP Server
```bash
cd dokumentacja-ecm
python3 -m http.server 8000
```

### Opcja 2: Node.js HTTP Server
```bash
cd dokumentacja-ecm
npx http-server -p 8000
```

### Opcja 3: PHP Built-in Server
```bash
cd dokumentacja-ecm
php -S localhost:8000
```

Następnie otwórz przeglądarkę i przejdź do `http://localhost:8000`

## 📁 Kluczowe Pliki

- `index.html` - Główna strona z nawigacją i renderowaniem Markdown
- `oferta-uslug/README.md` - Przegląd wszystkich usług
- `portfolio-case-studies/README.md` - Indeks wszystkich case studies
- `metodologia/README.md` - Opis metodologii pracy

## 🎯 Case Studies

### Strony WWW (5 projektów)
- TechFlow Solutions - Strona korporacyjna B2B
- Premium Estates - Portal nieruchomości premium
- FluentSpeak Academy - Platforma edukacyjna
- LexPartners Law - Kancelaria prawna
- ProHealth Clinic - Klinika medyczna

### Sklepy Shopify (5 projektów)
- LuxHome Marketplace - Marketplace mebli premium
- GreenTech Dropshipping - Sklep eco-friendly
- CoffeeBox Subscription - Subskrypcja kawy
- BuildPro B2B - Sklep B2B dla branży budowlanej
- XYZ Fashion Store - Sklep odzieżowy

### Prototypy MVP (5 projektów)
- PayFlow - Aplikacja płatności P2P (FinTech)
- MediConnect - Platforma telemedyczna (HealthTech)
- EduFlow - Platforma e-learningowa (EdTech)
- RentEasy - Platforma wynajmu (PropTech)
- QuickDeliver - Platforma dostaw (Logistics)

### Audyty UX (5 projektów)
- E-commerce Optimization - Zwiększenie konwersji o 45%
- SaaS Platform Redesign - Poprawa UX o 60%
- Mobile App Audit - Optymalizacja interfejsu mobilnego
- Corporate Website - Redesign strony korporacyjnej
- Startup MVP Review - Audyt prototypu MVP

## 📊 Statystyki

- **25+ projektów** w portfolio
- **5 głównych branż** (FinTech, HealthTech, EdTech, PropTech, E-commerce)
- **100% projektów** zakończonych sukcesem
- **Średni ROI** dla klientów: 250%+

## 🤝 Współpraca

### Proces Współpracy
1. **Konsultacja** - Bezpłatna analiza potrzeb
2. **Propozycja** - Spersonalizowana oferta
3. **Realizacja** - Agile development
4. **Wdrożenie** - Launch i optymalizacja
5. **Wsparcie** - Długoterminowe utrzymanie

### Kontakt
- **Email**: hello@ecm-digital.com
- **Telefon**: +48 535330323
- **Website**: [www.ecm-digital.com](https://www.ecm-digital.com)

## 📄 Licencja

© 2025 ECM Digital Agency. Wszystkie prawa zastrzeżone.

---

*Dokumentacja przygotowana przez zespół ECM Digital | Ostatnia aktualizacja: Styczeń 2025*