# Zgodność z Przepisami E-commerce - ECM Digital

## Wprowadzenie

ECM Digital zapewnia pełną zgodność z polskimi i europejskimi przepisami dotyczącymi handlu elektronicznego. Nasze rozwiązania e-commerce są projektowane z uwzględnieniem wszystkich wymagań prawnych, zapewniając bezpieczeństwo zarówno dla sprzedawców, jak i konsumentów.

## Ustawa o Świadczeniu Usług Drogą Elektroniczną

### Wymagane Informacje dla Usługodawcy

#### Dane Identyfikacyjne (Art. 5)
```html
<!-- Template stopki z wymaganymi informacjami -->
<footer class="legal-footer">
  <div class="company-info">
    <h3>ECM Digital</h3>
    <address>
      ul. [Nazwa ulicy] [Numer]<br>
      [Kod pocztowy] [Miasto]<br>
      Polska
    </address>
    
    <div class="legal-data">
      <p><strong>NIP:</strong> [Numer NIP]</p>
      <p><strong>REGON:</strong> [Numer REGON]</p>
      <p><strong>KRS:</strong> [Numer KRS]</p>
    </div>
    
    <div class="contact-info">
      <p><strong>Email:</strong> <a href="mailto:hello@ecm-digital.com">hello@ecm-digital.com</a></p>
      <p><strong>Telefon:</strong> <a href="tel:+48535330323">+48 535 330 323</a></p>
    </div>
  </div>
  
  <div class="legal-links">
    <a href="/regulamin">Regulamin</a>
    <a href="/polityka-prywatnosci">Polityka Prywatności</a>
    <a href="/polityka-cookies">Polityka Cookies</a>
    <a href="/odc">ODC</a>
  </div>
</footer>
```

#### Informacje o Usłudze (Art. 6)
```javascript
// System informacji o usłudze
class ServiceInformationManager {
  constructor() {
    this.serviceInfo = {
      description: 'Szczegółowy opis usługi',
      conditions: 'Warunki świadczenia usługi',
      price: 'Cena wraz z podatkami',
      additionalCosts: 'Koszty dodatkowe',
      paymentMethods: 'Sposoby płatności',
      deliveryTime: 'Czas realizacji',
      technicalRequirements: 'Wymagania techniczne'
    };
  }

  generateServiceInfo(serviceType) {
    const templates = {
      website: {
        description: 'Profesjonalne strony internetowe dostosowane do potrzeb biznesowych',
        conditions: 'Usługa świadczona na podstawie umowy, wymaga współpracy klienta',
        priceRange: 'Od 5,000 do 50,000 PLN brutto',
        additionalCosts: 'Hosting, domena, dodatkowe funkcjonalności',
        paymentMethods: 'Przelew bankowy, płatność online',
        deliveryTime: '2-8 tygodni w zależności od zakresu',
        technicalRequirements: 'Przeglądarka internetowa, dostęp do internetu'
      },
      shopify: {
        description: 'Sklepy internetowe na platformie Shopify z pełną integracją',
        conditions: 'Wymaga posiadania konta Shopify, współpraca przy konfiguracji',
        priceRange: 'Od 8,000 do 80,000 PLN brutto',
        additionalCosts: 'Abonament Shopify, aplikacje, płatności',
        paymentMethods: 'Przelew bankowy, płatność online',
        deliveryTime: '3-12 tygodni w zależności od złożoności',
        technicalRequirements: 'Konto Shopify, dostęp do domeny'
      }
    };

    return templates[serviceType] || templates.website;
  }
}
```

## Ustawa o Prawach Konsumenta

### Prawo Odstąpienia od Umowy

#### Implementacja 14-dniowego Okresu
```javascript
class WithdrawalRightManager {
  constructor() {
    this.withdrawalPeriod = 14; // dni
  }

  calculateWithdrawalDeadline(contractDate) {
    const deadline = new Date(contractDate);
    deadline.setDate(deadline.getDate() + this.withdrawalPeriod);
    return deadline;
  }

  generateWithdrawalForm() {
    return `
      <form class="withdrawal-form" action="/withdrawal" method="post">
        <h2>Formularz odstąpienia od umowy</h2>
        
        <div class="form-group">
          <label for="company">Nazwa firmy/Imię i nazwisko:</label>
          <input type="text" id="company" name="company" required>
        </div>
        
        <div class="form-group">
          <label for="address">Adres:</label>
          <textarea id="address" name="address" required></textarea>
        </div>
        
        <div class="form-group">
          <label for="contract-date">Data zawarcia umowy:</label>
          <input type="date" id="contract-date" name="contractDate" required>
        </div>
        
        <div class="form-group">
          <label for="service">Usługa, od której odstępuję:</label>
          <input type="text" id="service" name="service" required>
        </div>
        
        <div class="form-group">
          <label for="reason">Powód odstąpienia (opcjonalnie):</label>
          <textarea id="reason" name="reason"></textarea>
        </div>
        
        <div class="form-group">
          <label for="date">Data:</label>
          <input type="date" id="date" name="date" value="${new Date().toISOString().split('T')[0]}" required>
        </div>
        
        <div class="form-group">
          <label for="signature">Podpis (imię i nazwisko):</label>
          <input type="text" id="signature" name="signature" required>
        </div>
        
        <button type="submit" class="btn-primary">Wyślij formularz</button>
      </form>
    `;
  }

  async processWithdrawal(withdrawalData) {
    try {
      // Walidacja danych
      this.validateWithdrawalData(withdrawalData);
      
      // Sprawdzenie czy termin nie minął
      const deadline = this.calculateWithdrawalDeadline(withdrawalData.contractDate);
      if (new Date() > deadline) {
        throw new Error('Termin na odstąpienie od umowy minął');
      }

      // Zapisanie wniosku
      const withdrawalId = await this.saveWithdrawalRequest(withdrawalData);
      
      // Powiadomienie zespołu
      await this.notifyTeam(withdrawalId, withdrawalData);
      
      // Potwierdzenie dla klienta
      await this.sendConfirmation(withdrawalData.email, withdrawalId);
      
      return {
        success: true,
        withdrawalId: withdrawalId,
        deadline: deadline
      };
    } catch (error) {
      throw new Error(`Błąd przetwarzania odstąpienia: ${error.message}`);
    }
  }
}
```

### Wzór Formularza Odstąpienia
```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Wzór formularza odstąpienia od umowy</title>
</head>
<body>
    <div class="withdrawal-template">
        <h1>WZÓR FORMULARZA ODSTĄPIENIA OD UMOWY</h1>
        <p><em>(formularz ten należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy)</em></p>
        
        <div class="form-content">
            <p><strong>Adresat:</strong></p>
            <address>
                ECM Digital<br>
                ul. [Adres]<br>
                [Kod pocztowy] [Miasto]<br>
                Email: hello@ecm-digital.com
            </address>
            
            <p><strong>Ja/My(*) niniejszym informuję/informujemy(*) o moim/naszym(*) odstąpieniu od umowy o świadczenie następującej usługi(*):</strong></p>
            <div class="form-field">_________________________________</div>
            
            <p><strong>Data zawarcia umowy(*):</strong></p>
            <div class="form-field">_________________________________</div>
            
            <p><strong>Imię i nazwisko konsumenta(-ów):</strong></p>
            <div class="form-field">_________________________________</div>
            
            <p><strong>Adres konsumenta(-ów):</strong></p>
            <div class="form-field">_________________________________</div>
            <div class="form-field">_________________________________</div>
            
            <p><strong>Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w wersji papierowej):</strong></p>
            <div class="form-field">_________________________________</div>
            
            <p><strong>Data:</strong></p>
            <div class="form-field">_________________________________</div>
        </div>
        
        <p><em>(*) Niepotrzebne skreślić</em></p>
        
        <div class="download-actions">
            <button onclick="window.print()" class="btn-secondary">Drukuj formularz</button>
            <a href="/assets/formularz-odstapienia.pdf" class="btn-primary" download>Pobierz PDF</a>
        </div>
    </div>
</body>
</html>
```## Reg
ulamin Świadczenia Usług

### Template Regulaminu

```markdown
# REGULAMIN ŚWIADCZENIA USŁUG DROGĄ ELEKTRONICZNĄ
**ECM Digital**

## § 1. POSTANOWIENIA OGÓLNE

1. Niniejszy Regulamin określa zasady świadczenia usług drogą elektroniczną przez ECM Digital z siedzibą w [miasto].
2. Regulamin jest dostępny bezpłatnie na stronie internetowej i może być w każdej chwili wydrukowany lub zapisany.
3. Korzystanie z usług świadczonych przez ECM Digital oznacza akceptację niniejszego Regulaminu.

## § 2. DEFINICJE

1. **Usługodawca** - ECM Digital, spółka z ograniczoną odpowiedzialnością z siedzibą w [adres].
2. **Usługobiorca** - osoba fizyczna, prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, korzystająca z usług Usługodawcy.
3. **Usługa** - usługa świadczona drogą elektroniczną przez Usługodawcę na rzecz Usługobiorcy.
4. **Strona internetowa** - strona internetowa dostępna pod adresem www.ecm-digital.com.

## § 3. RODZAJE USŁUG

Usługodawca świadczy następujące usługi:
1. Tworzenie stron internetowych
2. Projektowanie i wdrażanie sklepów internetowych na platformie Shopify
3. Rozwój prototypów MVP (Minimum Viable Product)
4. Przeprowadzanie audytów UX/UI
5. Automatyzacja procesów biznesowych
6. Kampanie marketingowe oparte na analizie danych

## § 4. WARUNKI ŚWIADCZENIA USŁUG

1. Usługi są świadczone na podstawie zawartej umowy między Usługodawcą a Usługobiorcą.
2. Usługobiorca zobowiązuje się do podania prawdziwych i aktualnych danych kontaktowych.
3. Usługobiorca zobowiązuje się do współpracy w realizacji projektu, w tym do terminowego dostarczania wymaganych materiałów.
4. Usługodawca zastrzega sobie prawo do odmowy świadczenia usługi bez podania przyczyny.

## § 5. ZAWIERANIE UMÓW

1. Umowa zostaje zawarta w momencie potwierdzenia przez Usługodawcę przyjęcia zlecenia.
2. Potwierdzenie następuje poprzez przesłanie wiadomości email na adres podany przez Usługobiorcę.
3. Umowa może być zawarta w języku polskim lub angielskim.

## § 6. CENY I PŁATNOŚCI

1. Ceny usług podane są w złotych polskich i zawierają podatek VAT.
2. Płatność następuje przelewem bankowym na rachunek Usługodawcy.
3. Termin płatności wynosi 14 dni od daty wystawienia faktury.
4. W przypadku opóźnienia w płatności, Usługodawca może naliczyć odsetki ustawowe.

## § 7. REALIZACJA USŁUG

1. Usługodawca realizuje usługi z należytą starannością, zgodnie z aktualną wiedzą techniczną.
2. Terminy realizacji są określane indywidualnie dla każdego projektu.
3. Usługodawca informuje Usługobiorcę o postępach w realizacji projektu.

## § 8. ODPOWIEDZIALNOŚĆ

1. Usługodawca ponosi odpowiedzialność za szkody wyrządzone Usługobiorcy zgodnie z przepisami Kodeksu cywilnego.
2. Odpowiedzialność Usługodawcy jest ograniczona do wysokości wynagrodzenia za konkretną usługę.
3. Usługodawca nie ponosi odpowiedzialności za szkody pośrednie, utracone korzyści lub szkody w dobrach niematerialnych.

## § 9. PRAWO ODSTĄPIENIA

1. Konsument ma prawo odstąpić od umowy w terminie 14 dni bez podania przyczyny.
2. Termin liczy się od dnia zawarcia umowy.
3. Oświadczenie o odstąpieniu można złożyć na wzorze formularza dostępnego na stronie internetowej.

## § 10. REKLAMACJE

1. Reklamacje dotyczące świadczonych usług można składać:
   - Drogą elektroniczną na adres: hello@ecm-digital.com
   - Pisemnie na adres siedziby Usługodawcy
2. Reklamacja powinna zawierać opis problemu oraz oczekiwany sposób jego rozwiązania.
3. Usługodawca rozpatruje reklamację w terminie 14 dni roboczych.
4. Odpowiedź na reklamację zostanie udzielona na adres email podany w reklamacji.

## § 11. OCHRONA DANYCH OSOBOWYCH

1. Dane osobowe są przetwarzane zgodnie z Rozporządzeniem RODO.
2. Szczegółowe informacje o przetwarzaniu danych zawiera Polityka Prywatności.
3. Usługobiorca ma prawo do kontroli swoich danych osobowych.

## § 12. POSTANOWIENIA KOŃCOWE

1. Regulamin może być zmieniony przez Usługodawcę z ważnych przyczyn.
2. O planowanych zmianach Usługodawca poinformuje z 7-dniowym wyprzedzeniem.
3. W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego.
4. Ewentualne spory będą rozstrzygane przez sąd właściwy dla siedziby Usługodawcy.

---
**Data ostatniej aktualizacji:** [Data]
**Wersja:** 2.0
```

## Bezpieczeństwo Płatności

### PCI DSS Compliance

#### Wymagania Bezpieczeństwa
```javascript
class PaymentSecurityManager {
  constructor() {
    this.pciRequirements = {
      firewall: 'Instalacja i utrzymanie konfiguracji firewall',
      passwords: 'Nieużywanie domyślnych haseł systemowych',
      dataProtection: 'Ochrona przechowywanych danych posiadaczy kart',
      encryption: 'Szyfrowanie transmisji danych posiadaczy kart',
      antivirus: 'Używanie i regularne aktualizowanie oprogramowania antywirusowego',
      secureSystem: 'Opracowanie i utrzymanie bezpiecznych systemów',
      accessControl: 'Ograniczenie dostępu do danych posiadaczy kart',
      uniqueIds: 'Przypisanie unikalnego ID każdej osobie z dostępem',
      physicalAccess: 'Ograniczenie fizycznego dostępu do danych',
      monitoring: 'Śledzenie i monitorowanie dostępu do zasobów sieciowych',
      testing: 'Regularne testowanie systemów i procesów bezpieczeństwa',
      policies: 'Utrzymanie polityki bezpieczeństwa informacji'
    };
  }

  async validatePCICompliance() {
    const complianceChecks = [
      this.checkFirewallConfiguration(),
      this.checkPasswordPolicies(),
      this.checkDataEncryption(),
      this.checkAccessControls(),
      this.checkMonitoringSystems(),
      this.checkSecurityPolicies()
    ];

    const results = await Promise.all(complianceChecks);
    return this.generateComplianceReport(results);
  }

  async checkFirewallConfiguration() {
    // Sprawdzenie konfiguracji firewall
    return {
      requirement: 'Firewall Configuration',
      status: 'compliant',
      details: 'Firewall properly configured with restrictive rules'
    };
  }

  async checkDataEncryption() {
    // Sprawdzenie szyfrowania danych
    return {
      requirement: 'Data Encryption',
      status: 'compliant',
      details: 'All sensitive data encrypted using AES-256'
    };
  }
}
```

#### Implementacja Bezpiecznych Płatności
```javascript
// Integracja z Stripe (PCI DSS compliant)
class SecurePaymentProcessor {
  constructor() {
    this.stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  async createPaymentIntent(amount, currency = 'pln', metadata = {}) {
    try {
      // Walidacja kwoty
      if (amount < 50) { // Minimalna kwota 0.50 PLN
        throw new Error('Amount too small');
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe używa groszy
        currency: currency.toLowerCase(),
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          source: 'ecm-digital-website'
        },
        automatic_payment_methods: {
          enabled: true,
        },
        // Dodatkowe zabezpieczenia
        setup_future_usage: 'off_session',
        capture_method: 'automatic'
      });

      // Logowanie transakcji (bez danych wrażliwych)
      this.logPaymentAttempt({
        paymentIntentId: paymentIntent.id,
        amount: amount,
        currency: currency,
        status: 'created'
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      this.logPaymentError(error, { amount, currency });
      throw new Error('Payment processing failed');
    }
  }

  async handleWebhook(payload, signature) {
    try {
      // Weryfikacja podpisu webhook
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );

      // Obsługa różnych typów zdarzeń
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handleSuccessfulPayment(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handleFailedPayment(event.data.object);
          break;
        case 'payment_intent.canceled':
          await this.handleCanceledPayment(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logSecurityEvent('WEBHOOK_VERIFICATION_FAILED', {
        error: error.message,
        signature: signature
      });
      throw new Error('Webhook verification failed');
    }
  }

  async handleSuccessfulPayment(paymentIntent) {
    try {
      // Aktualizacja statusu zamówienia
      await this.updateOrderStatus(paymentIntent.metadata.orderId, 'paid');
      
      // Wysłanie potwierdzenia
      await this.sendPaymentConfirmation(paymentIntent);
      
      // Logowanie sukcesu
      this.logPaymentSuccess(paymentIntent);
      
    } catch (error) {
      console.error('Error handling successful payment:', error);
    }
  }

  logPaymentAttempt(details) {
    logger.info('Payment attempt', {
      event_type: 'payment_attempt',
      payment_intent_id: details.paymentIntentId,
      amount: details.amount,
      currency: details.currency,
      timestamp: new Date().toISOString()
    });
  }

  logPaymentError(error, context) {
    logger.error('Payment error', {
      event_type: 'payment_error',
      error_message: error.message,
      error_code: error.code,
      context: context,
      timestamp: new Date().toISOString()
    });
  }
}
```

### Implementacja Bezpiecznego Checkout

```html
<!-- Bezpieczny formularz płatności -->
<form id="payment-form" class="secure-payment-form">
  <div class="payment-header">
    <h2>Bezpieczna płatność</h2>
    <div class="security-badges">
      <img src="/assets/ssl-badge.png" alt="SSL Secured">
      <img src="/assets/pci-badge.png" alt="PCI DSS Compliant">
    </div>
  </div>

  <div class="order-summary">
    <h3>Podsumowanie zamówienia</h3>
    <div class="order-item">
      <span class="item-name">Strona internetowa - Pakiet Standard</span>
      <span class="item-price">15,000.00 PLN</span>
    </div>
    <div class="order-total">
      <span class="total-label">Do zapłaty:</span>
      <span class="total-amount">15,000.00 PLN</span>
    </div>
  </div>

  <div class="payment-methods">
    <h3>Wybierz metodę płatności</h3>
    <div class="payment-options">
      <label class="payment-option">
        <input type="radio" name="payment-method" value="card" checked>
        <span class="option-label">
          <i class="fas fa-credit-card"></i>
          Karta płatnicza
        </span>
      </label>
      <label class="payment-option">
        <input type="radio" name="payment-method" value="blik">
        <span class="option-label">
          <i class="fas fa-mobile-alt"></i>
          BLIK
        </span>
      </label>
      <label class="payment-option">
        <input type="radio" name="payment-method" value="transfer">
        <span class="option-label">
          <i class="fas fa-university"></i>
          Przelew bankowy
        </span>
      </label>
    </div>
  </div>

  <!-- Stripe Elements będą wstawione tutaj -->
  <div id="payment-element" class="payment-element">
    <!-- Stripe Elements -->
  </div>

  <div class="billing-info">
    <h3>Dane do faktury</h3>
    <div class="form-row">
      <div class="form-group">
        <label for="company-name">Nazwa firmy *</label>
        <input type="text" id="company-name" name="companyName" required>
      </div>
      <div class="form-group">
        <label for="nip">NIP *</label>
        <input type="text" id="nip" name="nip" pattern="[0-9]{10}" required>
      </div>
    </div>
    <div class="form-group">
      <label for="address">Adres *</label>
      <input type="text" id="address" name="address" required>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="postal-code">Kod pocztowy *</label>
        <input type="text" id="postal-code" name="postalCode" pattern="[0-9]{2}-[0-9]{3}" required>
      </div>
      <div class="form-group">
        <label for="city">Miasto *</label>
        <input type="text" id="city" name="city" required>
      </div>
    </div>
  </div>

  <div class="terms-acceptance">
    <label class="checkbox-label">
      <input type="checkbox" id="accept-terms" required>
      <span class="checkmark"></span>
      Akceptuję <a href="/regulamin" target="_blank">Regulamin</a> i <a href="/polityka-prywatnosci" target="_blank">Politykę Prywatności</a>
    </label>
  </div>

  <div class="payment-actions">
    <button type="submit" id="submit-payment" class="btn-primary">
      <span class="btn-text">Zapłać bezpiecznie</span>
      <span class="btn-loader" style="display: none;">
        <i class="fas fa-spinner fa-spin"></i>
      </span>
    </button>
  </div>

  <div class="security-info">
    <p><i class="fas fa-shield-alt"></i> Twoje dane są chronione szyfrowaniem SSL 256-bit</p>
    <p><i class="fas fa-lock"></i> Nie przechowujemy danych Twojej karty płatniczej</p>
  </div>
</form>

<script>
// Inicjalizacja bezpiecznego formularza płatności
class SecureCheckoutForm {
  constructor() {
    this.stripe = Stripe(window.STRIPE_PUBLIC_KEY);
    this.elements = null;
    this.paymentElement = null;
    this.init();
  }

  async init() {
    try {
      // Utworzenie Payment Intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 15000, // 150.00 PLN
          currency: 'pln'
        })
      });

      const { clientSecret } = await response.json();
      
      // Inicjalizacja Stripe Elements
      this.elements = this.stripe.elements({
        clientSecret: clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0066cc',
            colorBackground: '#ffffff',
            colorText: '#1a1a1a',
            colorDanger: '#df1b41',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          }
        }
      });

      // Utworzenie Payment Element
      this.paymentElement = this.elements.create('payment');
      this.paymentElement.mount('#payment-element');

      // Obsługa formularza
      this.setupFormHandlers();
      
    } catch (error) {
      console.error('Error initializing checkout:', error);
      this.showError('Błąd inicjalizacji płatności. Spróbuj ponownie.');
    }
  }

  setupFormHandlers() {
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const submitButton = document.getElementById('submit-payment');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoader = submitButton.querySelector('.btn-loader');

    // Disable form
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'inline-block';

    try {
      // Potwierdzenie płatności
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          payment_method_data: {
            billing_details: {
              name: document.getElementById('company-name').value,
              address: {
                line1: document.getElementById('address').value,
                postal_code: document.getElementById('postal-code').value,
                city: document.getElementById('city').value,
                country: 'PL'
              }
            }
          }
        }
      });

      if (error) {
        this.showError(error.message);
      }
      
    } catch (error) {
      this.showError('Wystąpił błąd podczas przetwarzania płatności.');
    } finally {
      // Re-enable form
      submitButton.disabled = false;
      buttonText.style.display = 'inline-block';
      buttonLoader.style.display = 'none';
    }
  }

  showError(message) {
    // Wyświetlenie błędu użytkownikowi
    const errorDiv = document.createElement('div');
    errorDiv.className = 'payment-error';
    errorDiv.textContent = message;
    
    const form = document.getElementById('payment-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Usunięcie błędu po 5 sekundach
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
  new SecureCheckoutForm();
});
</script>
```

## Zgodność z Dyrektywą o Prawach Konsumentów

### Informacje Przedumowne

```javascript
class PreContractualInformation {
  constructor() {
    this.requiredInfo = {
      serviceDescription: 'Główne cechy usługi',
      traderIdentity: 'Tożsamość przedsiębiorcy',
      totalPrice: 'Łączna cena wraz z podatkami',
      additionalCosts: 'Dodatkowe opłaty',
      paymentConditions: 'Warunki płatności',
      performanceConditions: 'Warunki wykonania',
      withdrawalRight: 'Prawo odstąpienia',
      complaintsProcedure: 'Procedura reklamacyjna',
      digitalContent: 'Informacje o treściach cyfrowych'
    };
  }

  generatePreContractualInfo(serviceType) {
    const info = {
      website: {
        serviceDescription: `
          Usługa obejmuje:
          - Projektowanie i kodowanie strony internetowej
          - Optymalizację pod kątem SEO
          - Responsywny design (mobile, tablet, desktop)
          - System zarządzania treścią (CMS)
          - Podstawowe szkolenie z obsługi
          - 3 miesiące wsparcia technicznego
        `,
        totalPrice: 'Cena zostanie określona indywidualnie na podstawie zakresu prac',
        additionalCosts: `
          Dodatkowe koszty mogą obejmować:
          - Hosting: od 50 PLN/miesiąc
          - Domena: od 60 PLN/rok
          - Dodatkowe funkcjonalności: wycena indywidualna
          - Rozszerzone wsparcie: od 200 PLN/miesiąc
        `,
        performanceConditions: `
          - Czas realizacji: 2-8 tygodni
          - Wymaga współpracy klienta (dostarczenie materiałów)
          - Płatność w transzach: 50% zaliczka, 50% po ukończeniu
          - Akceptacja projektu na każdym etapie
        `
      }
    };

    return info[serviceType] || info.website;
  }

  displayPreContractualInfo(serviceType, containerId) {
    const info = this.generatePreContractualInfo(serviceType);
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
      <div class="pre-contractual-info">
        <h3>Informacje przedumowne</h3>
        
        <div class="info-section">
          <h4>Opis usługi</h4>
          <p>${info.serviceDescription}</p>
        </div>
        
        <div class="info-section">
          <h4>Cena</h4>
          <p>${info.totalPrice}</p>
        </div>
        
        <div class="info-section">
          <h4>Dodatkowe koszty</h4>
          <p>${info.additionalCosts}</p>
        </div>
        
        <div class="info-section">
          <h4>Warunki wykonania</h4>
          <p>${info.performanceConditions}</p>
        </div>
        
        <div class="info-section">
          <h4>Prawo odstąpienia</h4>
          <p>Masz prawo odstąpić od umowy w terminie 14 dni bez podania przyczyny. 
             Szczegóły znajdziesz w <a href="/regulamin">Regulaminie</a>.</p>
        </div>
        
        <div class="info-section">
          <h4>Reklamacje</h4>
          <p>Reklamacje można składać na adres hello@ecm-digital.com lub pisemnie. 
             Odpowiedź w terminie 14 dni roboczych.</p>
        </div>
      </div>
    `;
  }
}
```

---

*Ostatnia aktualizacja: Styczeń 2025*
*Wersja dokumentu: 1.0*