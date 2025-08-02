# 🧪 **Scenariusze Testowe - ECM Digital Website**

**Projekt:** ECM Digital Website  
**URL:** www.ecm-digital.com  
**Data utworzenia:** 2 sierpnia 2025  
**Wersja:** 1.0  

---

## 📋 **CHECKLIST TESTÓW - Kompletny Plan Testowania**

### 🌐 **1. TESTY FUNKCJONALNE**

#### **1.1 Nawigacja i Struktura**
- [ ] **Strona główna** (www.ecm-digital.com) ładuje się poprawnie
- [ ] **Menu nawigacyjne** działa na wszystkich stronach
- [ ] **Linki do usług** prowadzą do właściwych podstron
- [ ] **Breadcrumbs** działają poprawnie
- [ ] **Logo ECM Digital** przekierowuje na stronę główną

#### **1.2 Strony Usług - Zawartość**
**Dla każdej z 6 stron usług sprawdź:**
- [ ] **Audyty UX** - `/dokumentacja-ecm/oferta-uslug/audyty-ux/`
- [ ] **Automatyzacje n8n** - `/dokumentacja-ecm/oferta-uslug/automatyzacje-n8n/`
- [ ] **Social Media Data Science** - `/dokumentacja-ecm/oferta-uslug/social-media-data-science/`
- [ ] **Prototypy MVP** - `/dokumentacja-ecm/oferta-uslug/prototypy-mvp/`
- [ ] **Sklepy Shopify** - `/dokumentacja-ecm/oferta-uslug/sklepy-shopify/`
- [ ] **Strony WWW** - `/dokumentacja-ecm/oferta-uslug/strony-www/`

**Na każdej stronie sprawdź:**
- [ ] Tytuł strony wyświetla się poprawnie
- [ ] Hero section z opisem usługi
- [ ] Sekcje: Wprowadzenie, Proces, Case Studies, Pakiety
- [ ] Wszystkie ikony Font Awesome ładują się
- [ ] Obrazy i grafiki wyświetlają się (jeśli są)

### 📱 **2. TESTY RESPONSYWNOŚCI**

#### **2.1 Urządzenia Mobilne**
- [ ] **iPhone** (375px) - Safari/Chrome
- [ ] **Android** (360px) - Chrome
- [ ] **Tablet** (768px) - iPad/Android
- [ ] **Desktop** (1920px) - Chrome/Firefox/Safari

**Na każdym urządzeniu sprawdź:**
- [ ] Menu hamburger działa na mobile
- [ ] Tekst jest czytelny (nie za mały)
- [ ] Przyciski są klikalne (min. 44px)
- [ ] Formularze są użyteczne
- [ ] Nie ma horizontal scroll
- [ ] Timeline i karty układają się poprawnie

#### **2.2 Orientacja**
- [ ] **Portrait** (pionowa) - mobile/tablet
- [ ] **Landscape** (pozioma) - mobile/tablet

### 🔗 **3. TESTY KONTAKTOWE**

#### **3.1 Linki Telefoniczne**
**Na każdej stronie sprawdź:**
- [ ] Kliknięcie `tel:+48535330323` otwiera aplikację telefonu
- [ ] Numer wyświetla się jako `+48 535 330 323`
- [ ] Link działa na mobile i desktop

#### **3.2 Linki Email**
- [ ] `mailto:kontakt@ecmdigital.pl` otwiera klienta email
- [ ] Specjalistyczne emaile (social@, mvp@) działają poprawnie

#### **3.3 Formularze Kontaktowe**
- [ ] Formularz ładuje się poprawnie
- [ ] Pola są wymagane (validation)
- [ ] Wysyłanie działa (jeśli zaimplementowane)
- [ ] Komunikaty błędów wyświetlają się

### ⚡ **4. TESTY WYDAJNOŚCI**

#### **4.1 Szybkość Ładowania**
**Użyj narzędzi: Google PageSpeed Insights, GTmetrix**
- [ ] **Strona główna** < 3 sekundy
- [ ] **Strony usług** < 3 sekundy
- [ ] **Mobile** performance score > 80
- [ ] **Desktop** performance score > 90

#### **4.2 Optymalizacja**
- [ ] Obrazy są skompresowane
- [ ] CSS/JS są zminifikowane
- [ ] Brak błędów 404 w konsoli
- [ ] Brak błędów JavaScript

### 🔍 **5. TESTY SEO**

#### **5.1 Meta Tags**
**Na każdej stronie sprawdź (View Source):**
- [ ] `<title>` jest unikalny i opisowy
- [ ] `<meta name="description">` jest obecny
- [ ] `<meta name="keywords">` jest obecny
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`)
- [ ] Twitter Cards (`twitter:card`, `twitter:title`)
- [ ] `<link rel="canonical">` jest poprawny

#### **5.2 Struktura HTML**
- [ ] Nagłówki H1, H2, H3 są hierarchiczne
- [ ] Alt text dla obrazów
- [ ] Semantic HTML (header, nav, main, footer)
- [ ] Schema.org markup (jeśli jest)

#### **5.3 Crawling**
- [ ] `/robots.txt` jest dostępny i poprawny
- [ ] `/sitemap.xml` zawiera wszystkie strony
- [ ] Brak błędów w Google Search Console

### 📊 **6. TESTY ANALYTICS**

#### **6.1 Google Analytics**
- [ ] Kod tracking `G-V309CX2XT8` jest na wszystkich stronach
- [ ] Real-time visitors pokazują się w GA
- [ ] Page views są rejestrowane
- [ ] Events są trackowane (kliknięcia, formularze)

#### **6.2 Hotjar**
- [ ] Kod Hotjar jest zainstalowany
- [ ] Heatmapy są generowane
- [ ] Session recordings działają
- [ ] Brak błędów w konsoli

### 🌍 **7. TESTY CROSS-BROWSER**

#### **7.1 Przeglądarki Desktop**
- [ ] **Chrome** (najnowsza wersja)
- [ ] **Firefox** (najnowsza wersja)
- [ ] **Safari** (macOS)
- [ ] **Edge** (Windows)

#### **7.2 Przeglądarki Mobile**
- [ ] **Chrome Mobile** (Android)
- [ ] **Safari Mobile** (iOS)
- [ ] **Samsung Internet** (Android)

**Na każdej przeglądarce sprawdź:**
- [ ] Layout wygląda identycznie
- [ ] Wszystkie funkcje działają
- [ ] Brak błędów JavaScript
- [ ] CSS renderuje się poprawnie

### 🔒 **8. TESTY BEZPIECZEŃSTWA**

#### **8.1 HTTPS**
- [ ] Wszystkie strony ładują się przez HTTPS
- [ ] Brak mixed content warnings
- [ ] SSL certificate jest ważny
- [ ] Redirect z HTTP na HTTPS działa

#### **8.2 Headers**
- [ ] Security headers są ustawione
- [ ] CORS jest skonfigurowany poprawnie
- [ ] Brak wrażliwych informacji w source code

### 📝 **9. TESTY TREŚCI**

#### **9.1 Jakość Treści**
**Na każdej stronie sprawdź:**
- [ ] Brak błędów ortograficznych
- [ ] Spójność terminologii
- [ ] Poprawność dat i cen
- [ ] Linki wewnętrzne działają
- [ ] Treść jest aktualna

#### **9.2 Pakiety i Ceny**
- [ ] Ceny są aktualne i spójne
- [ ] Opisy pakietów są kompletne
- [ ] Timeline realizacji jest realistyczny
- [ ] Porównanie pakietów jest czytelne

### 🎯 **10. TESTY KONWERSJI**

#### **10.1 Call-to-Action**
- [ ] Przyciski CTA są widoczne
- [ ] Kolory CTA wyróżniają się
- [ ] Tekst CTA jest zachęcający
- [ ] Pozycjonowanie CTA jest strategiczne

#### **10.2 User Experience**
- [ ] Ścieżka użytkownika jest intuicyjna
- [ ] Informacje są łatwo dostępne
- [ ] Proces kontaktu jest prosty
- [ ] Trust signals są obecne (testimoniale, case studies)

---

## 🚨 **KRYTYCZNE BŁĘDY DO SPRAWDZENIA**

### **Wysokiej Wagi:**
- [ ] Strona nie ładuje się (500/404 errors)
- [ ] Numer telefonu nie działa
- [ ] Email nie działa
- [ ] Mobile layout jest zepsuty
- [ ] Analytics nie trackuje

### **Średniej Wagi:**
- [ ] Wolne ładowanie (>5 sekund)
- [ ] Błędy JavaScript w konsoli
- [ ] Problemy z SEO meta tags
- [ ] Cross-browser compatibility issues

### **Niskiej Wagi:**
- [ ] Drobne błędy wizualne
- [ ] Nieoptymalne obrazy
- [ ] Drobne błędy ortograficzne

---

## 🛠️ **NARZĘDZIA TESTOWE**

### **Performance Testing:**
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### **SEO Testing:**
- [Google Search Console](https://search.google.com/search-console)
- [SEO Site Checkup](https://seositecheckup.com/)
- [Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/)

### **Responsive Testing:**
- Chrome DevTools (F12)
- [Responsive Design Checker](https://responsivedesignchecker.com/)
- [BrowserStack](https://www.browserstack.com/)

### **Analytics Testing:**
- [Google Analytics](https://analytics.google.com/)
- [Hotjar](https://www.hotjar.com/)
- [Google Tag Assistant](https://tagassistant.google.com/)

---

## 📋 **TEMPLATE RAPORTU TESTÓW**

```
## Test Report - ECM Digital Website
Data: [DATA]
Tester: [IMIĘ]
Wersja strony: [COMMIT HASH]

### ✅ PASSED TESTS:
- [Lista przeszłych testów]

### ❌ FAILED TESTS:
- [Lista nieudanych testów z opisem]

### 🔧 ISSUES TO FIX:
1. [Priorytet WYSOKI] - [Opis problemu]
2. [Priorytet ŚREDNI] - [Opis problemu]
3. [Priorytet NISKI] - [Opis problemu]

### 📊 PERFORMANCE SCORES:
- PageSpeed Mobile: [SCORE]/100
- PageSpeed Desktop: [SCORE]/100
- GTmetrix Grade: [GRADE]
- Load Time: [TIME] seconds

### 📱 DEVICE COMPATIBILITY:
- iPhone: ✅/❌
- Android: ✅/❌
- iPad: ✅/❌
- Desktop: ✅/❌

### 🌍 BROWSER COMPATIBILITY:
- Chrome: ✅/❌
- Firefox: ✅/❌
- Safari: ✅/❌
- Edge: ✅/❌

### 📈 ANALYTICS STATUS:
- Google Analytics: ✅/❌
- Hotjar: ✅/❌
- Tracking Events: ✅/❌

### 🔍 SEO STATUS:
- Meta Tags: ✅/❌
- Sitemap: ✅/❌
- Robots.txt: ✅/❌
- Schema Markup: ✅/❌

### 📞 CONTACT FUNCTIONALITY:
- Phone Links: ✅/❌
- Email Links: ✅/❌
- Contact Forms: ✅/❌

### 💬 COMMENTS:
[Dodatkowe uwagi i komentarze]

### 🎯 NEXT STEPS:
1. [Akcja do wykonania]
2. [Akcja do wykonania]
3. [Akcja do wykonania]
```

---

## 📝 **SZCZEGÓŁOWE SCENARIUSZE TESTOWE**

### **Scenariusz 1: Test Podstawowej Funkcjonalności**
1. Otwórz www.ecm-digital.com
2. Sprawdź czy strona ładuje się w <3 sekundy
3. Kliknij w każdy link w menu głównym
4. Sprawdź czy wszystkie strony usług się otwierają
5. Sprawdź czy logo przekierowuje na stronę główną

**Oczekiwany rezultat:** Wszystkie linki działają, strony ładują się szybko

### **Scenariusz 2: Test Responsywności Mobile**
1. Otwórz Chrome DevTools (F12)
2. Przełącz na widok mobile (iPhone 12 Pro)
3. Odwiedź każdą stronę usługi
4. Sprawdź czy menu hamburger działa
5. Sprawdź czy wszystkie sekcje są czytelne

**Oczekiwany rezultat:** Strona wygląda dobrze na mobile, wszystko jest czytelne

### **Scenariusz 3: Test Kontaktu**
1. Idź na dowolną stronę usługi
2. Znajdź sekcję kontaktową
3. Kliknij w numer telefonu +48535330323
4. Sprawdź czy otwiera się aplikacja telefonu
5. Kliknij w adres email
6. Sprawdź czy otwiera się klient email

**Oczekiwany rezultat:** Linki kontaktowe działają poprawnie

### **Scenariusz 4: Test Analytics**
1. Otwórz Google Analytics (analytics.google.com)
2. Przejdź do Real-time > Overview
3. Otwórz stronę www.ecm-digital.com w nowej karcie
4. Sprawdź czy pojawił się visitor w GA
5. Przejdź na różne strony usług
6. Sprawdź czy page views są rejestrowane

**Oczekiwany rezultat:** Analytics trackuje wizyty i page views

### **Scenariusz 5: Test SEO**
1. Otwórz dowolną stronę usługi
2. Kliknij prawym przyciskiem > "View Page Source"
3. Sprawdź czy jest tag `<title>`
4. Sprawdź czy jest `<meta name="description">`
5. Sprawdź czy są Open Graph tags (`og:title`, `og:description`)
6. Sprawdź czy jest Google Analytics kod

**Oczekiwany rezultat:** Wszystkie SEO meta tags są obecne

---

## 🎯 **PRIORYTETY TESTOWANIA**

### **Priorytet 1 (KRYTYCZNY):**
- Podstawowa funkcjonalność nawigacji
- Responsywność mobile
- Linki kontaktowe
- Analytics tracking

### **Priorytet 2 (WYSOKI):**
- Performance (szybkość ładowania)
- Cross-browser compatibility
- SEO meta tags
- Hotjar tracking

### **Priorytet 3 (ŚREDNI):**
- Szczegóły wizualne
- Dodatkowe funkcjonalności
- Optymalizacje

---

**Powodzenia z testowaniem!** 🚀  
W przypadku znalezienia błędów - zgłoś je z opisem i screenshotami.
