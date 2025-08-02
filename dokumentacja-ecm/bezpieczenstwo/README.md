# Bezpieczeństwo i Zgodność ECM Digital

## Wprowadzenie

W ECM Digital bezpieczeństwo danych i zgodność z przepisami prawymi stanowią fundament naszej działalności. Stosujemy najwyższe standardy bezpieczeństwa, aby chronić dane naszych klientów i zapewnić zgodność z obowiązującymi regulacjami prawnymi.

**Nasze zobowiązania:**
- **Bezpieczeństwo danych** - Ochrona informacji klientów na najwyższym poziomie
- **Zgodność z RODO/GDPR** - Pełna zgodność z przepisami o ochronie danych osobowych
- **Standardy branżowe** - Implementacja najlepszych praktyk bezpieczeństwa
- **Ciągłe monitorowanie** - Regularne audyty i aktualizacje zabezpieczeń
- **Transparentność** - Jasne komunikowanie polityk i procedur

## Przegląd Praktyk Bezpieczeństwa

### 🔒 Bezpieczeństwo Techniczne
Implementujemy wielowarstwowe zabezpieczenia techniczne na każdym etapie rozwoju i wdrażania projektów.

### 📋 Zgodność Prawna
Zapewniamy pełną zgodność z obowiązującymi przepisami prawnymi, w tym RODO, ustawą o e-commerce i standardami dostępności.

### 🛡️ Ochrona Danych
Stosujemy zaawansowane metody szyfrowania i bezpiecznego przechowywania danych osobowych i biznesowych.

### ♿ Dostępność Cyfrowa
Wszystkie nasze projekty są zgodne ze standardami WCAG 2.1 AA, zapewniając dostępność dla osób z niepełnosprawnościami.

## Nawigacja

- [Praktyki Bezpieczeństwa](#praktyki-bezpieczenstwa) - Szczegółowe procedury zabezpieczeń
- [Zgodność z RODO/GDPR](#zgodnosc-rodo-gdpr) - Polityki ochrony danych osobowych
- [Przepisy E-commerce](#przepisy-e-commerce) - Zgodność z regulacjami handlu elektronicznego
- [Dostępność WCAG](#dostepnosc-wcag) - Standardy dostępności cyfrowej

## Praktyki Bezpieczeństwa

### Bezpieczeństwo Aplikacji

#### Secure Development Lifecycle (SDL)

**1. Planowanie Bezpieczeństwa**
- Analiza zagrożeń (Threat Modeling)
- Definicja wymagań bezpieczeństwa
- Wybór bezpiecznych technologii i frameworków
- Planowanie testów bezpieczeństwa

**2. Bezpieczne Kodowanie**
- Stosowanie secure coding guidelines
- Input validation i sanitization
- Output encoding
- Proper error handling
- Secure authentication i authorization

**3. Testowanie Bezpieczeństwa**
- Static Application Security Testing (SAST)
- Dynamic Application Security Testing (DAST)
- Interactive Application Security Testing (IAST)
- Penetration testing
- Dependency scanning

**4. Bezpieczne Wdrożenie**
- Secure configuration management
- Infrastructure as Code (IaC) security
- Container security
- Network security
- Monitoring i logging

#### Przykłady Implementacji

**Input Validation:**
```javascript
// Walidacja danych wejściowych
const validator = require('validator');
const xss = require('xss');

function validateUserInput(input) {
    // Sanityzacja XSS
    const cleanInput = xss(input);
    
    // Walidacja formatu
    if (!validator.isLength(cleanInput, { min: 1, max: 255 })) {
        throw new Error('Invalid input length');
    }
    
    // Walidacja znaków specjalnych
    if (!validator.matches(cleanInput, /^[a-zA-Z0-9\s\-_.,!?]+$/)) {
        throw new Error('Invalid characters detected');
    }
    
    return cleanInput;
}
```

**SQL Injection Prevention:**
```javascript
// Użycie prepared statements
const mysql = require('mysql2/promise');

async function getUserById(userId) {
    const connection = await mysql.createConnection(dbConfig);
    
    // Bezpieczne zapytanie z parametrami
    const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ? AND active = ?',
        [userId, 1]
    );
    
    await connection.end();
    return rows[0];
}
```

**Authentication & Authorization:**
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Hashowanie haseł
async function hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

// Weryfikacja JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
}
```

### Bezpieczeństwo Infrastruktury

#### Cloud Security

**AWS Security Best Practices:**
- **IAM (Identity and Access Management)** - Principle of least privilege
- **VPC (Virtual Private Cloud)** - Network isolation
- **Security Groups** - Firewall rules
- **WAF (Web Application Firewall)** - Protection against common attacks
- **CloudTrail** - Audit logging
- **GuardDuty** - Threat detection

**Przykład konfiguracji Terraform:**
```hcl
# Security Group dla aplikacji web
resource "aws_security_group" "web_sg" {
  name_prefix = "web-sg-"
  vpc_id      = aws_vpc.main.id

  # HTTPS tylko z CloudFront
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP redirect do HTTPS
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Brak bezpośredniego dostępu SSH
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web-security-group"
  }
}

# S3 Bucket z szyfrowaniem
resource "aws_s3_bucket" "app_data" {
  bucket = "ecm-digital-app-data"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  versioning {
    enabled = true
  }

  lifecycle_rule {
    enabled = true
    
    noncurrent_version_expiration {
      days = 90
    }
  }
}
```

#### Container Security

**Docker Security:**
```dockerfile
# Użycie oficjalnych, minimalnych obrazów
FROM node:18-alpine

# Utworzenie non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Kopiowanie tylko niezbędnych plików
COPY --chown=nextjs:nodejs package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Uruchomienie jako non-root user
USER nextjs

# Expose tylko niezbędnych portów
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
```

**Kubernetes Security:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-app
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    fsGroup: 1001
  containers:
  - name: app
    image: ecm-digital/app:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
      requests:
        memory: "256Mi"
        cpu: "250m"
```

### Monitoring i Incident Response

#### Security Monitoring

**Log Analysis:**
```javascript
// Centralized logging z Winston
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ecm-digital-app' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Security event logging
function logSecurityEvent(event, details) {
  logger.warn('SECURITY_EVENT', {
    event: event,
    details: details,
    timestamp: new Date().toISOString(),
    ip: details.ip,
    userAgent: details.userAgent
  });
}

// Przykład użycia
app.use((req, res, next) => {
  // Wykrywanie podejrzanych wzorców
  if (req.path.includes('../') || req.path.includes('..\\')) {
    logSecurityEvent('PATH_TRAVERSAL_ATTEMPT', {
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    return res.status(400).json({ error: 'Invalid request' });
  }
  next();
});
```

#### Incident Response Plan

**1. Wykrywanie (Detection)**
- Automated monitoring alerts
- Log analysis
- User reports
- Security scanning results

**2. Analiza (Analysis)**
- Incident classification
- Impact assessment
- Root cause analysis
- Evidence collection

**3. Containment**
- Immediate threat isolation
- System shutdown if necessary
- Access revocation
- Communication to stakeholders

**4. Eradication**
- Remove malicious code/access
- Patch vulnerabilities
- Update security controls
- System hardening

**5. Recovery**
- System restoration
- Monitoring for reoccurrence
- Gradual service restoration
- Performance validation

**6. Lessons Learned**
- Post-incident review
- Process improvements
- Documentation updates
- Team training

### Backup i Disaster Recovery

#### Backup Strategy

**3-2-1 Backup Rule:**
- **3** kopie danych (oryginał + 2 backupy)
- **2** różne media przechowywania
- **1** kopia off-site

**Automated Backup Script:**
```bash
#!/bin/bash

# Database backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_BACKUP_DIR="/backups/database"
APP_BACKUP_DIR="/backups/application"

# MySQL backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $DB_BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Compress backup
gzip $DB_BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Application files backup
tar -czf $APP_BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz /var/www/html

# Upload to S3
aws s3 cp $DB_BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz s3://ecm-digital-backups/database/
aws s3 cp $APP_BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz s3://ecm-digital-backups/application/

# Cleanup old backups (keep 30 days)
find $DB_BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $APP_BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

# Log backup completion
echo "$(date): Backup completed successfully" >> /var/log/backup.log
```

#### Disaster Recovery

**RTO/RPO Targets:**
- **RTO (Recovery Time Objective):** 4 godziny
- **RPO (Recovery Point Objective):** 1 godzina

**DR Procedures:**
1. **Assessment** - Ocena skali awarii
2. **Notification** - Powiadomienie zespołu DR
3. **Activation** - Uruchomienie procedur DR
4. **Recovery** - Przywracanie systemów
5. **Testing** - Weryfikacja funkcjonalności
6. **Communication** - Informowanie stakeholderów

## Zgodność z RODO/GDPR

### Podstawy Prawne

#### Kluczowe Zasady RODO

**1. Zgodność z prawem (Lawfulness)**
- Zgoda osoby, której dane dotyczą
- Wykonanie umowy
- Wypełnienie obowiązku prawnego
- Ochrona żywotnych interesów
- Wykonanie zadania w interesie publicznym
- Prawnie uzasadniony interes

**2. Rzetelność (Fairness)**
- Transparentne przetwarzanie
- Jasne informowanie o celach
- Uczciwe praktyki zbierania danych

**3. Przejrzystość (Transparency)**
- Jasne i zrozumiałe informacje
- Dostępne polityki prywatności
- Regularne komunikaty o przetwarzaniu

**4. Ograniczenie celu (Purpose Limitation)**
- Określone, wyraźne i prawnie uzasadnione cele
- Brak przetwarzania niezgodnego z pierwotnym celem

**5. Minimalizacja danych (Data Minimisation)**
- Tylko niezbędne dane
- Proporcjonalne do celu przetwarzania

**6. Dokładność (Accuracy)**
- Aktualne i poprawne dane
- Mechanizmy korekty błędów

**7. Ograniczenie przechowywania (Storage Limitation)**
- Przechowywanie tylko przez niezbędny czas
- Jasne polityki retencji danych

**8. Integralność i poufność (Integrity and Confidentiality)**
- Odpowiednie zabezpieczenia techniczne
- Ochrona przed nieuprawnionym dostępem

### Implementacja RODO w Projektach

#### Privacy by Design

**Przykład implementacji zgody:**
```javascript
// Consent Management System
class ConsentManager {
  constructor() {
    this.consentTypes = {
      necessary: { required: true, description: 'Niezbędne do funkcjonowania' },
      analytics: { required: false, description: 'Analityka i statystyki' },
      marketing: { required: false, description: 'Marketing i personalizacja' },
      social: { required: false, description: 'Media społecznościowe' }
    };
  }

  // Sprawdzenie zgody
  hasConsent(type) {
    const consent = localStorage.getItem('user-consent');
    if (!consent) return type === 'necessary';
    
    const consentData = JSON.parse(consent);
    return consentData[type] === true;
  }

  // Zapisanie zgody
  saveConsent(consents) {
    const consentData = {
      ...consents,
      necessary: true, // Zawsze wymagane
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('user-consent', JSON.stringify(consentData));
    this.updateTrackingScripts(consentData);
  }

  // Aktualizacja skryptów śledzących
  updateTrackingScripts(consents) {
    // Google Analytics
    if (consents.analytics) {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    } else {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }

    // Facebook Pixel
    if (consents.marketing) {
      fbq('consent', 'grant');
    } else {
      fbq('consent', 'revoke');
    }
  }
}
```

#### Data Subject Rights

**Implementacja praw osoby, której dane dotyczą:**

```javascript
// System obsługi praw RODO
class GDPRRightsHandler {
  
  // Prawo dostępu (Art. 15)
  async handleAccessRequest(userId) {
    const userData = await this.collectUserData(userId);
    
    return {
      personalData: userData.profile,
      processingPurposes: userData.purposes,
      dataCategories: userData.categories,
      recipients: userData.recipients,
      retentionPeriod: userData.retention,
      rights: this.getUserRights(),
      dataSource: userData.source
    };
  }

  // Prawo do sprostowania (Art. 16)
  async handleRectificationRequest(userId, corrections) {
    const validatedData = this.validateCorrections(corrections);
    await this.updateUserData(userId, validatedData);
    
    return {
      status: 'completed',
      updatedFields: Object.keys(validatedData),
      timestamp: new Date().toISOString()
    };
  }

  // Prawo do usunięcia (Art. 17)
  async handleErasureRequest(userId, reason) {
    // Sprawdzenie czy można usunąć dane
    const canErase = await this.checkErasureConditions(userId, reason);
    
    if (!canErase.allowed) {
      return {
        status: 'rejected',
        reason: canErase.reason
      };
    }

    // Usunięcie danych
    await this.eraseUserData(userId);
    
    return {
      status: 'completed',
      erasedData: canErase.dataTypes,
      timestamp: new Date().toISOString()
    };
  }

  // Prawo do ograniczenia przetwarzania (Art. 18)
  async handleRestrictionRequest(userId, reason) {
    await this.restrictProcessing(userId, reason);
    
    return {
      status: 'restricted',
      reason: reason,
      restrictedActivities: ['marketing', 'profiling'],
      timestamp: new Date().toISOString()
    };
  }

  // Prawo do przenoszenia danych (Art. 20)
  async handlePortabilityRequest(userId, format = 'json') {
    const portableData = await this.getPortableData(userId);
    
    switch (format) {
      case 'json':
        return JSON.stringify(portableData, null, 2);
      case 'csv':
        return this.convertToCSV(portableData);
      case 'xml':
        return this.convertToXML(portableData);
      default:
        throw new Error('Unsupported format');
    }
  }
}
```

#### Data Protection Impact Assessment (DPIA)

**Template DPIA:**
```markdown
# Ocena Skutków dla Ochrony Danych (DPIA)

## 1. Opis Przetwarzania
- **Nazwa projektu:** [Nazwa]
- **Opis:** [Szczegółowy opis przetwarzania]
- **Cele:** [Cele przetwarzania danych]
- **Podstawa prawna:** [Art. 6 RODO]

## 2. Dane Osobowe
- **Kategorie danych:** [Lista kategorii]
- **Źródła danych:** [Skąd pochodzą dane]
- **Odbiorcy:** [Kto otrzymuje dane]
- **Okres przechowywania:** [Jak długo]

## 3. Analiza Ryzyka
- **Zidentyfikowane zagrożenia:** [Lista zagrożeń]
- **Prawdopodobieństwo:** [Wysokie/Średnie/Niskie]
- **Wpływ:** [Wysokie/Średnie/Niskie]
- **Poziom ryzyka:** [Wysokie/Średnie/Niskie]

## 4. Środki Zabezpieczające
- **Techniczne:** [Lista środków technicznych]
- **Organizacyjne:** [Lista środków organizacyjnych]
- **Prawne:** [Umowy, zgody, polityki]

## 5. Konsultacje
- **IOD:** [Opinia Inspektora Ochrony Danych]
- **Osoby, których dane dotyczą:** [Konsultacje z użytkownikami]
- **Organy nadzorcze:** [Jeśli wymagane]
```

### Polityki i Procedury

#### Polityka Prywatności Template

```html
<!-- Przykład sekcji polityki prywatności -->
<section id="privacy-policy">
  <h2>Polityka Prywatności</h2>
  
  <h3>1. Administrator Danych</h3>
  <p>Administratorem Państwa danych osobowych jest ECM Digital...</p>
  
  <h3>2. Cele i Podstawy Prawne</h3>
  <table>
    <tr>
      <th>Cel przetwarzania</th>
      <th>Podstawa prawna</th>
      <th>Okres przechowywania</th>
    </tr>
    <tr>
      <td>Realizacja umowy</td>
      <td>Art. 6 ust. 1 lit. b RODO</td>
      <td>Do zakończenia umowy + 3 lata</td>
    </tr>
    <tr>
      <td>Marketing bezpośredni</td>
      <td>Art. 6 ust. 1 lit. f RODO</td>
      <td>Do cofnięcia sprzeciwu</td>
    </tr>
  </table>
  
  <h3>3. Prawa Osoby, której Dane Dotyczą</h3>
  <ul>
    <li>Prawo dostępu do danych (Art. 15 RODO)</li>
    <li>Prawo do sprostowania (Art. 16 RODO)</li>
    <li>Prawo do usunięcia (Art. 17 RODO)</li>
    <li>Prawo do ograniczenia przetwarzania (Art. 18 RODO)</li>
    <li>Prawo do przenoszenia danych (Art. 20 RODO)</li>
    <li>Prawo sprzeciwu (Art. 21 RODO)</li>
  </ul>
</section>
```

## Przepisy E-commerce

### Zgodność z Ustawą o Świadczeniu Usług Drogą Elektroniczną

#### Wymagane Informacje

**Dane identyfikacyjne usługodawcy:**
- Nazwa (firma) i adres
- Adres poczty elektronicznej
- Numer telefonu
- NIP, REGON, KRS
- Numer wpisu do rejestru działalności regulowanej

**Informacje o usłudze:**
- Opis usługi
- Warunki świadczenia
- Cena (z podatkami)
- Koszty dodatkowe
- Sposób płatności
- Czas realizacji

#### Przykład implementacji:

```html
<!-- Footer z wymaganymi informacjami -->
<footer class="legal-footer">
  <div class="company-info">
    <h3>ECM Digital</h3>
    <p>ul. Przykładowa 123, 00-001 Warszawa</p>
    <p>NIP: 1234567890</p>
    <p>REGON: 123456789</p>
    <p>KRS: 0000123456</p>
    <p>Email: hello@ecm-digital.com</p>
    <p>Tel: +48 535 330 323</p>
  </div>
  
  <div class="legal-links">
    <a href="/regulamin">Regulamin</a>
    <a href="/polityka-prywatnosci">Polityka Prywatności</a>
    <a href="/polityka-cookies">Polityka Cookies</a>
  </div>
</footer>
```

### Regulamin Świadczenia Usług

#### Template Regulaminu

```markdown
# REGULAMIN ŚWIADCZENIA USŁUG DROGĄ ELEKTRONICZNĄ

## § 1. POSTANOWIENIA OGÓLNE

1. Niniejszy Regulamin określa zasady świadczenia usług drogą elektroniczną przez ECM Digital.
2. Regulamin jest dostępny bezpłatnie na stronie internetowej.
3. Korzystanie z usług oznacza akceptację Regulaminu.

## § 2. DEFINICJE

1. **Usługodawca** - ECM Digital z siedzibą w Warszawie
2. **Usługobiorca** - osoba fizyczna, prawna lub jednostka organizacyjna
3. **Usługa** - świadczenie usług IT drogą elektroniczną

## § 3. RODZAJE USŁUG

1. Tworzenie stron internetowych
2. Projektowanie sklepów e-commerce
3. Rozwój aplikacji MVP
4. Audyty UX/UI
5. Automatyzacje procesów biznesowych

## § 4. WARUNKI ŚWIADCZENIA USŁUG

1. Usługi świadczone są na podstawie zawartej umowy
2. Wymagane jest podanie prawdziwych danych kontaktowych
3. Usługobiorca zobowiązuje się do współpracy w realizacji projektu

## § 5. PŁATNOŚCI

1. Ceny podane są w złotych polskich brutto
2. Płatność następuje przelewem bankowym
3. Termin płatności: 14 dni od daty wystawienia faktury

## § 6. ODPOWIEDZIALNOŚĆ

1. Usługodawca ponosi odpowiedzialność zgodnie z przepisami prawa
2. Odpowiedzialność ograniczona do wysokości wynagrodzenia za usługę
3. Wyłączenie odpowiedzialności za szkody pośrednie

## § 7. REKLAMACJE

1. Reklamacje można składać na adres email: hello@ecm-digital.com
2. Termin rozpatrzenia: 14 dni roboczych
3. Odpowiedź zostanie udzielona na adres email podany w reklamacji

## § 8. OCHRONA DANYCH OSOBOWYCH

1. Dane osobowe przetwarzane zgodnie z RODO
2. Szczegóły w Polityce Prywatności
3. Prawo do kontroli i korekty danych

## § 9. POSTANOWIENIA KOŃCOWE

1. Regulamin może być zmieniony z ważnych przyczyn
2. O zmianach informujemy z 7-dniowym wyprzedzeniem
3. Prawo właściwe: prawo polskie
4. Sąd właściwy: sąd dla siedziby Usługodawcy
```

### Bezpieczeństwo Płatności

#### PCI DSS Compliance

**Wymagania PCI DSS:**
1. **Firewall** - Ochrona danych posiadaczy kart
2. **Hasła** - Zmiana domyślnych haseł systemowych
3. **Ochrona danych** - Zabezpieczenie przechowywanych danych
4. **Szyfrowanie** - Szyfrowanie transmisji danych
5. **Antywirus** - Aktualne oprogramowanie antywirusowe
6. **Systemy** - Bezpieczne systemy i aplikacje
7. **Dostęp** - Ograniczenie dostępu do danych
8. **Identyfikacja** - Unikalne ID dla dostępu do systemów
9. **Dostęp fizyczny** - Ograniczenie fizycznego dostępu
10. **Monitoring** - Śledzenie dostępu do zasobów sieciowych
11. **Testy** - Regularne testy systemów bezpieczeństwa
12. **Polityki** - Polityki bezpieczeństwa informacji

#### Implementacja Bezpiecznych Płatności

```javascript
// Integracja z Stripe (PCI DSS compliant)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class SecurePaymentProcessor {
  
  // Tworzenie Payment Intent
  async createPaymentIntent(amount, currency = 'pln', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe używa groszy
        currency: currency,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString()
        },
        // Automatyczne potwierdzenie płatności
        confirmation_method: 'manual',
        confirm: true,
        // Zwrot URL w przypadku wymagania dodatkowej autoryzacji
        return_url: `${process.env.DOMAIN}/payment/confirm`
      });

      return {
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status
      };
    } catch (error) {
      this.logPaymentError(error);
      throw new Error('Payment processing failed');
    }
  }

  // Weryfikacja webhook od Stripe
  verifyWebhook(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return event;
    } catch (error) {
      this.logSecurityEvent('WEBHOOK_VERIFICATION_FAILED', {
        error: error.message,
        signature: signature
      });
      throw new Error('Webhook verification failed');
    }
  }

  // Obsługa webhook events
  async handleWebhookEvent(event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handleSuccessfulPayment(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handleFailedPayment(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  // Logowanie błędów płatności
  logPaymentError(error) {
    logger.error('PAYMENT_ERROR', {
      error: error.message,
      code: error.code,
      type: error.type,
      timestamp: new Date().toISOString()
    });
  }
}
```

## Dostępność WCAG

### Standardy WCAG 2.1 AA

#### Zasady Dostępności

**1. Percepcyjność (Perceivable)**
- Alternatywy tekstowe dla treści nietekstowych
- Napisy dla multimediów
- Odpowiedni kontrast kolorów
- Możliwość powiększenia tekstu do 200%

**2. Funkcjonalność (Operable)**
- Dostępność z klawiatury
- Brak treści powodujących napady padaczkowe
- Wystarczający czas na wykonanie zadań
- Pomoc w nawigacji

**3. Zrozumiałość (Understandable)**
- Czytelny i zrozumiały tekst
- Przewidywalna funkcjonalność
- Pomoc w unikaniu i poprawianiu błędów

**4. Solidność (Robust)**
- Kompatybilność z technologiami wspomagającymi
- Poprawny kod HTML
- Semantyczne znaczniki

#### Implementacja WCAG

**Semantic HTML:**
```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ECM Digital - Dostępna Strona Internetowa</title>
</head>
<body>
  <!-- Skip link dla użytkowników czytników ekranu -->
  <a href="#main-content" class="skip-link">Przejdź do głównej treści</a>
  
  <!-- Główna nawigacja -->
  <nav role="navigation" aria-label="Główna nawigacja">
    <ul>
      <li><a href="/" aria-current="page">Strona główna</a></li>
      <li><a href="/uslugi">Usługi</a></li>
      <li><a href="/portfolio">Portfolio</a></li>
      <li><a href="/kontakt">Kontakt</a></li>
    </ul>
  </nav>
  
  <!-- Główna treść -->
  <main id="main-content" role="main">
    <h1>Witamy w ECM Digital</h1>
    
    <!-- Formularz kontaktowy -->
    <form action="/kontakt" method="post" novalidate>
      <fieldset>
        <legend>Dane kontaktowe</legend>
        
        <div class="form-group">
          <label for="name">Imię i nazwisko *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            aria-describedby="name-error"
            aria-invalid="false"
          >
          <div id="name-error" class="error-message" aria-live="polite"></div>
        </div>
        
        <div class="form-group">
          <label for="email">Adres email *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            aria-describedby="email-help email-error"
            aria-invalid="false"
          >
          <div id="email-help" class="help-text">
            Podaj prawidłowy adres email, np. jan@example.com
          </div>
          <div id="email-error" class="error-message" aria-live="polite"></div>
        </div>
        
        <div class="form-group">
          <label for="message">Wiadomość *</label>
          <textarea 
            id="message" 
            name="message" 
            rows="5" 
            required
            aria-describedby="message-error"
            aria-invalid="false"
          ></textarea>
          <div id="message-error" class="error-message" aria-live="polite"></div>
        </div>
      </fieldset>
      
      <button type="submit" class="btn-primary">
        Wyślij wiadomość
        <span class="sr-only">(formularz kontaktowy)</span>
      </button>
    </form>
  </main>
  
  <!-- Stopka -->
  <footer role="contentinfo">
    <p>&copy; 2025 ECM Digital. Wszystkie prawa zastrzeżone.</p>
  </footer>
</body>
</html>
```

**CSS dla Dostępności:**
```css
/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus indicators */
a:focus,
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .btn-primary {
    background: #000;
    color: #fff;
    border: 2px solid #fff;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Color contrast ratios */
.text-primary { color: #1a1a1a; } /* 16.94:1 ratio */
.text-secondary { color: #4a4a4a; } /* 9.64:1 ratio */
.link-primary { color: #0066cc; } /* 7.73:1 ratio */

/* Error states */
.error-message {
  color: #d63384;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

input[aria-invalid="true"],
textarea[aria-invalid="true"] {
  border-color: #d63384;
  box-shadow: 0 0 0 0.2rem rgba(214, 51, 132, 0.25);
}
```

**JavaScript dla Dostępności:**
```javascript
// Accessible form validation
class AccessibleFormValidator {
  constructor(form) {
    this.form = form;
    this.init();
  }

  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    
    const isValid = this.validateForm();
    if (isValid) {
      this.submitForm();
    } else {
      // Focus first invalid field
      const firstError = this.form.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.focus();
      }
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = `Pole ${this.getFieldLabel(field)} jest wymagane.`;
    }

    // Email validation
    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Podaj prawidłowy adres email.';
    }

    this.setFieldValidity(field, isValid, errorMessage);
    return isValid;
  }

  setFieldValidity(field, isValid, errorMessage) {
    const errorElement = document.getElementById(`${field.name}-error`);
    
    field.setAttribute('aria-invalid', !isValid);
    
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = isValid ? 'none' : 'block';
    }
  }

  clearErrors(field) {
    if (field.getAttribute('aria-invalid') === 'true') {
      this.validateField(field);
    }
  }

  getFieldLabel(field) {
    const label = this.form.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.name;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateForm() {
    const fields = this.form.querySelectorAll('input, textarea');
    let isFormValid = true;

    fields.forEach(field => {
      const isFieldValid = this.validateField(field);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  async submitForm() {
    try {
      const formData = new FormData(this.form);
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        this.showSuccessMessage();
      } else {
        this.showErrorMessage('Wystąpił błąd podczas wysyłania formularza.');
      }
    } catch (error) {
      this.showErrorMessage('Wystąpił błąd połączenia.');
    }
  }

  showSuccessMessage() {
    const message = document.createElement('div');
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'polite');
    message.className = 'success-message';
    message.textContent = 'Formularz został wysłany pomyślnie!';
    
    this.form.insertBefore(message, this.form.firstChild);
    message.focus();
  }

  showErrorMessage(text) {
    const message = document.createElement('div');
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'assertive');
    message.className = 'error-message';
    message.textContent = text;
    
    this.form.insertBefore(message, this.form.firstChild);
    message.focus();
  }
}

// Initialize accessible forms
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    new AccessibleFormValidator(form);
  });
});
```

### Narzędzia Testowania Dostępności

#### Automated Testing

**axe-core Integration:**
```javascript
// Automated accessibility testing
const axe = require('axe-core');

async function runAccessibilityTests() {
  try {
    const results = await axe.run();
    
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:');
      results.violations.forEach(violation => {
        console.log(`- ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Help: ${violation.helpUrl}`);
        
        violation.nodes.forEach(node => {
          console.log(`  Element: ${node.target}`);
          console.log(`  HTML: ${node.html}`);
        });
      });
    } else {
      console.log('No accessibility violations found!');
    }
    
    return results;
  } catch (error) {
    console.error('Error running accessibility tests:', error);
  }
}

// Run tests on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', runAccessibilityTests);
}
```

#### Manual Testing Checklist

**Keyboard Navigation:**
- [ ] Wszystkie interaktywne elementy dostępne z klawiatury
- [ ] Logiczna kolejność tabulacji
- [ ] Widoczne wskaźniki focus
- [ ] Możliwość zamknięcia modali klawiszem Escape
- [ ] Skip links działają poprawnie

**Screen Reader Testing:**
- [ ] Nagłówki w logicznej hierarchii (h1, h2, h3...)
- [ ] Alt text dla wszystkich obrazów
- [ ] Labels dla wszystkich pól formularza
- [ ] ARIA labels gdzie potrzebne
- [ ] Live regions dla dynamicznych treści

**Color and Contrast:**
- [ ] Kontrast tekstu minimum 4.5:1 (AA)
- [ ] Kontrast dużego tekstu minimum 3:1 (AA)
- [ ] Informacje nie przekazywane tylko kolorem
- [ ] Wsparcie dla high contrast mode

**Responsive and Zoom:**
- [ ] Tekst czytelny przy 200% powiększeniu
- [ ] Brak poziomego scrollowania przy powiększeniu
- [ ] Funkcjonalność zachowana na urządzeniach mobilnych
- [ ] Touch targets minimum 44x44px

### Certyfikacja i Audyty

#### Proces Certyfikacji WCAG

**1. Wstępny Audyt**
- Automated testing (axe, WAVE)
- Manual testing checklist
- Screen reader testing
- Keyboard navigation testing

**2. Szczegółowa Ocena**
- Expert review przez specjalistę dostępności
- User testing z osobami z niepełnosprawnościami
- Dokumentacja znalezionych problemów
- Plan naprawczy

**3. Implementacja Poprawek**
- Naprawa zidentyfikowanych problemów
- Re-testing po implementacji
- Dokumentacja zmian
- Training zespołu

**4. Certyfikacja**
- Finalna ocena zgodności
- Wystawienie certyfikatu WCAG 2.1 AA
- Dokumentacja compliance
- Plan monitorowania

#### Accessibility Statement Template

```html
<div class="accessibility-statement">
  <h2>Deklaracja Dostępności</h2>
  
  <p>ECM Digital zobowiązuje się do zapewnienia dostępności swojej strony internetowej zgodnie z ustawą z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych.</p>
  
  <h3>Stan zgodności</h3>
  <p>Ta strona internetowa jest <strong>częściowo zgodna</strong> z WCAG 2.1 poziom AA ze względu na niezgodności wymienione poniżej.</p>
  
  <h3>Treści niedostępne</h3>
  <ul>
    <li>Niektóre starsze dokumenty PDF mogą nie być w pełni dostępne</li>
    <li>Treści wideo mogą nie mieć napisów (w trakcie dodawania)</li>
  </ul>
  
  <h3>Przygotowanie deklaracji dostępności</h3>
  <p>Niniejsza deklaracja została sporządzona dnia 15 stycznia 2025 r.</p>
  <p>Deklaracja została sporządzona na podstawie samooceny przeprowadzonej przez podmiot publiczny.</p>
  
  <h3>Informacje zwrotne i dane kontaktowe</h3>
  <p>W przypadku problemów z dostępnością strony internetowej prosimy o kontakt:</p>
  <ul>
    <li>Email: <a href="mailto:dostepnosc@ecm-digital.com">dostepnosc@ecm-digital.com</a></li>
    <li>Telefon: <a href="tel:+48535330323">+48 535 330 323</a></li>
  </ul>
  
  <p>Odpowiedź na zgłoszenie zostanie udzielona w terminie 7 dni roboczych.</p>
</div>
```

---

*Ostatnia aktualizacja: Styczeń 2025*
*Wersja dokumentu: 1.0*