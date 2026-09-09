# ✅ Deployment Checklist - ECM Digital

## 🎯 Pre-Deployment

### 1. Konta i Usługi

- [ ] **Hosting** (GitHub Pages / Netlify / własny serwer statyczny)
  - [ ] Połączono z repozytorium
  - [ ] Skonfigurowano domenę i HTTPS

- [ ] **Resend** (opcjonalne) - https://resend.com
  - [ ] Utworzono konto
  - [ ] Dodano domenę
  - [ ] Skopiowano API key

### 2. Zmienne Środowiskowe

#### Client Dashboard (.env.local) — opcjonalne (AWS API):
```env
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
NEXT_PUBLIC_APP_URL=https://your-dashboard.example.com
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

### 4. Deployment

- [ ] Wdróż katalog `public/` jako stronę statyczną
- [ ] Wdróż `client-dashboard` (Next.js) na wybranym hostingu
- [ ] Sprawdź domeny i HTTPS
- [ ] Smoke test: homepage, CTA Calendly, login demo

### 5. Post-Deploy

- [ ] Sprawdź logi hostingu
- [ ] Sprawdź linki wewnętrzne
- [ ] Sprawdź mobile

## 📞 Wsparcie

- **ECM Digital:** hello@ecm-digital.com
