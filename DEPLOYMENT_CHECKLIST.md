# ✅ Deployment Checklist - ECM Digital

## 🎯 Pre-Deployment

### 1. Konta i Usługi

- [ ] **Vercel** - https://vercel.com
  - [ ] Utworzono konto
  - [ ] Połączono z GitHub
  - [ ] Dodano zmienne środowiskowe (jeśli potrzebne)

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
NEXT_PUBLIC_APP_URL=https://your-dashboard.vercel.app
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

### 4. Deployment Vercel

- [ ] Deploy głównej strony (`public/` / root)
- [ ] Deploy `client-dashboard`
- [ ] Sprawdź domeny i HTTPS
- [ ] Smoke test: homepage, CTA Calendly, login demo

### 5. Post-Deploy

- [ ] Sprawdź logi Vercel
- [ ] Sprawdź linki wewnętrzne
- [ ] Sprawdź mobile

## 📞 Wsparcie

- **Vercel Support:** https://vercel.com/support
- **ECM Digital:** hello@ecm-digital.com
