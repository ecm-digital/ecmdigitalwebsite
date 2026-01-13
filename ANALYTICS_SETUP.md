# 📊 Google Analytics 4 - Enhanced Configuration

## ✅ Co zostało zaimplementowane

Strona ECM Digital ma teraz kompleksową konfigurację Google Analytics 4 z zaawansowanym trackingiem użytkowników.

## 🎯 Śledzone Eventy

### 1. **Podstawowe Eventy**
- ✅ **Page Views** - Automatyczne śledzenie wyświetleń stron
- ✅ **Scroll Depth** - Śledzenie głębokości przewijania (25%, 50%, 75%, 90%)
- ✅ **Time on Page** - Śledzenie czasu spędzonego na stronie (30s, 60s)
- ✅ **Page Visibility** - Śledzenie przełączania między kartami przeglądarki

### 2. **Engagement Events**
- ✅ **Button Clicks** - Kliknięcia w przyciski
- ✅ **CTA Clicks** - Kliknięcia w przyciski call-to-action
- ✅ **Service Interest** - Kliknięcia w karty usług
- ✅ **File Downloads** - Pobieranie plików (PDF, DOC, ZIP, etc.)
- ✅ **Outbound Links** - Kliknięcia w linki zewnętrzne
- ✅ **Language Changes** - Zmiany języka strony

### 3. **Conversion Events**
- ✅ **Form Submissions** - Wysyłanie formularzy kontaktowych
- ✅ **Contact Conversions** - Konwersje w formularzach HubSpot
- ✅ **Chatbot Interactions** - Interakcje z chatbotem AI
  - Wysłane wiadomości
  - Otrzymane odpowiedzi
  - Wyświetlone rekomendacje usług
  - Błędy

### 4. **Error Tracking**
- ✅ **JavaScript Errors** - Automatyczne śledzenie błędów JavaScript
- ✅ **Unhandled Promise Rejections** - Śledzenie nieobsłużonych błędów asynchronicznych

## 📁 Pliki

### Główne pliki:
- `src/js/analytics.js` - Główny plik konfiguracji GA4
- `index.html` - Zaktualizowany do używania nowego analytics.js
- `src/js/hubspot.js` - Zintegrowany tracking formularzy HubSpot
- `src/js/aws-chatbot.js` - Zintegrowany tracking chatbota

## 🔧 Konfiguracja

### Google Analytics Measurement ID
Obecnie używany ID: `G-V309CX2XT8`

Aby zmienić ID, edytuj plik `src/js/analytics.js`:
```javascript
const GA_MEASUREMENT_ID = 'G-V309CX2XT8'; // Zmień na swoje ID
```

## 📈 Jak używać w kodzie

### Podstawowe użycie:
```javascript
// Track custom event
window.analytics.trackEvent('custom_event_name', {
    category: 'engagement',
    label: 'Custom Label',
    value: 100
});
```

### Przykłady użycia:

#### 1. Tracking kliknięcia w przycisk:
```javascript
button.addEventListener('click', function() {
    window.analytics.trackButtonClick('Button Text', 'section-id');
});
```

#### 2. Tracking konwersji formularza:
```javascript
form.addEventListener('submit', function() {
    window.analytics.trackContactConversion('contact_form');
});
```

#### 3. Tracking interakcji z chatbotem:
```javascript
window.analytics.trackChatbotEvent('message_sent', 'User message text');
window.analytics.trackChatbotEvent('message_received', 'Bot response');
```

#### 4. Tracking zainteresowania usługą:
```javascript
window.analytics.trackServiceInterest('Strony WWW', 'services');
```

#### 5. Tracking zmiany języka:
```javascript
window.analytics.trackLanguageChange('en');
```

#### 6. Tracking wyszukiwania:
```javascript
window.analytics.trackSearch('search term', 10);
```

#### 7. Tracking odtwarzania wideo:
```javascript
window.analytics.trackVideoPlay('Video Title');
```

## 🎨 Automatyczne Tracking

Następujące eventy są śledzone automatycznie:

1. **Formularze** - Wszystkie formularze na stronie
2. **CTA Buttons** - Wszystkie przyciski z klasą `.btn-cta` lub `a[href="#contact"]`
3. **Service Cards** - Wszystkie karty usług z atrybutem `data-service`
4. **File Downloads** - Wszystkie linki do plików (PDF, DOC, ZIP, etc.)
5. **Outbound Links** - Wszystkie linki zewnętrzne
6. **Scroll Depth** - Automatyczne śledzenie przewijania
7. **Time on Page** - Automatyczne śledzenie czasu na stronie
8. **Errors** - Automatyczne śledzenie błędów JavaScript

## 📊 Raporty w Google Analytics

### Gdzie znaleźć dane:

1. **Realtime** → Events
   - Zobacz eventy w czasie rzeczywistym

2. **Reports** → Engagement → Events
   - Wszystkie eventy z ostatnich 30 dni

3. **Reports** → Engagement → Conversions
   - Eventy konwersji (form_submit, contact_conversion, etc.)

4. **Reports** → Engagement → Pages and screens
   - Analiza stron z największym zaangażowaniem

5. **Reports** → Engagement → Scroll depth
   - Głębokość przewijania na stronach

6. **Reports** → Engagement → Time on page
   - Czas spędzony na stronach

### Najważniejsze eventy do monitorowania:

- `cta_click` - Kliknięcia w przyciski CTA
- `form_submit` - Wysyłanie formularzy
- `contact_conversion` - Konwersje kontaktowe
- `service_interest` - Zainteresowanie usługami
- `chatbot_interaction` - Interakcje z chatbotem
- `button_click` - Kliknięcia w przyciski
- `scroll` - Głębokość przewijania
- `time_on_page` - Czas na stronie

## 🔒 Prywatność

Konfiguracja zawiera:
- ✅ `anonymize_ip: true` - Anonimizacja adresów IP
- ✅ `allow_ad_personalization_signals: false` - Wyłączona personalizacja reklam
- ✅ Zgodność z RODO/GDPR

## 🐛 Debug Mode

W trybie development (localhost) automatycznie włączony jest tryb debug:
```javascript
debug_mode: window.location.hostname === 'localhost'
```

W konsoli przeglądarki zobaczysz:
```
[Analytics] Google Analytics 4 initialized with enhanced tracking
```

## 📝 Custom Dimensions

Dostępne custom dimensions:
- `custom_parameter_1` → `user_type`
- `custom_parameter_2` → `page_category`
- `custom_parameter_3` → `content_type`
- `custom_parameter_4` → `language`

## 🚀 Następne kroki

1. **Zweryfikuj w Google Analytics**
   - Sprawdź, czy eventy są rejestrowane w GA4
   - Przejdź do Realtime → Events

2. **Skonfiguruj Conversion Events**
   - W GA4: Admin → Events → Mark as conversion
   - Oznacz: `contact_conversion`, `form_submit`, `cta_click`

3. **Utwórz Custom Reports**
   - Reports → Library → Create custom report
   - Dodaj metryki: Events, Conversions, Engagement

4. **Skonfiguruj Audiences**
   - Admin → Audiences → New audience
   - Utwórz segmenty użytkowników (np. "Interesują się usługami")

5. **Skonfiguruj Goals**
   - Admin → Goals → New goal
   - Utwórz cele biznesowe (np. "Kontakt przez formularz")

## 📞 Wsparcie

W razie pytań:
- Dokumentacja GA4: https://developers.google.com/analytics/devguides/collection/ga4
- ECM Digital: kontakt@ecm-digital.pl

---

**Status:** ✅ Wdrożone i gotowe do użycia
**Ostatnia aktualizacja:** Styczeń 2025




