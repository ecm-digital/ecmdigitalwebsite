# Dostępność WCAG - ECM Digital

## Wprowadzenie

ECM Digital zobowiązuje się do tworzenia dostępnych rozwiązań cyfrowych zgodnych z Web Content Accessibility Guidelines (WCAG) 2.1 na poziomie AA. Dostępność cyfrowa to nie tylko wymóg prawny, ale przede wszystkim kwestia równości i inkluzywności.

## Standardy WCAG 2.1 AA

### Cztery Główne Zasady

#### 1. Percepcyjność (Perceivable)
Informacje i komponenty interfejsu użytkownika muszą być prezentowane w sposób, który użytkownicy mogą postrzegać.

**Wytyczne:**
- **1.1 Alternatywy tekstowe** - Zapewnienie alternatyw tekstowych dla treści nietekstowych
- **1.2 Media czasowe** - Alternatywy dla mediów czasowych
- **1.3 Możliwość adaptacji** - Treści mogą być prezentowane na różne sposoby
- **1.4 Rozróżnialność** - Ułatwienie użytkownikom widzenia i słyszenia treści

#### 2. Funkcjonalność (Operable)
Komponenty interfejsu użytkownika i nawigacja muszą być funkcjonalne.

**Wytyczne:**
- **2.1 Dostępność z klawiatury** - Wszystkie funkcjonalności dostępne z klawiatury
- **2.2 Wystarczający czas** - Użytkownicy mają wystarczający czas na przeczytanie treści
- **2.3 Napady padaczkowe** - Treści nie powodują napadów padaczkowych
- **2.4 Nawigacja** - Pomoc użytkownikom w nawigacji i znajdowaniu treści
- **2.5 Modalności wejściowe** - Ułatwienie użytkownikom funkcjonowania

#### 3. Zrozumiałość (Understandable)
Informacje i obsługa interfejsu użytkownika muszą być zrozumiałe.

**Wytyczne:**
- **3.1 Czytelność** - Tekst czytelny i zrozumiały
- **3.2 Przewidywalność** - Strony internetowe pojawiają się i funkcjonują przewidywalnie
- **3.3 Pomoc przy wprowadzaniu** - Pomoc użytkownikom w unikaniu i poprawianiu błędów

#### 4. Solidność (Robust)
Treści muszą być wystarczająco solidne, aby mogły być interpretowane przez różne programy użytkownika.

**Wytyczne:**
- **4.1 Kompatybilność** - Maksymalizacja kompatybilności z technologiami wspomagającymi

## Implementacja WCAG w Projektach

### Semantic HTML

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECM Digital - Dostępna Strona Internetowa</title>
    
    <!-- Skip links dla użytkowników czytników ekranu -->
    <style>
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 0 0 4px 4px;
        }
        .skip-link:focus {
            top: 6px;
        }
    </style>
</head>
<body>
    <!-- Skip navigation link -->
    <a href="#main-content" class="skip-link">Przejdź do głównej treści</a>
    
    <!-- Header z właściwą strukturą nagłówków -->
    <header role="banner">
        <div class="container">
            <h1 class="logo">
                <a href="/" aria-label="ECM Digital - strona główna">
                    <img src="/logo.svg" alt="ECM Digital" width="200" height="60">
                </a>
            </h1>
            
            <!-- Główna nawigacja -->
            <nav role="navigation" aria-label="Główna nawigacja">
                <ul class="nav-menu">
                    <li><a href="/" aria-current="page">Strona główna</a></li>
                    <li>
                        <a href="/uslugi" aria-expanded="false" aria-haspopup="true">
                            Usługi
                        </a>
                        <ul class="submenu" aria-label="Submenu usług">
                            <li><a href="/uslugi/strony-www">Strony WWW</a></li>
                            <li><a href="/uslugi/shopify">Sklepy Shopify</a></li>
                            <li><a href="/uslugi/mvp">Prototypy MVP</a></li>
                            <li><a href="/uslugi/audyty-ux">Audyty UX</a></li>
                        </ul>
                    </li>
                    <li><a href="/portfolio">Portfolio</a></li>
                    <li><a href="/kontakt">Kontakt</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <!-- Główna treść -->
    <main id="main-content" role="main">
        <section class="hero" aria-labelledby="hero-heading">
            <div class="container">
                <h2 id="hero-heading">Tworzymy dostępne rozwiązania cyfrowe</h2>
                <p class="hero-description">
                    Profesjonalne strony internetowe i aplikacje zgodne z WCAG 2.1 AA, 
                    dostępne dla wszystkich użytkowników.
                </p>
                <a href="/kontakt" class="btn-primary">
                    Rozpocznij projekt
                    <span class="sr-only">(otwiera formularz kontaktowy)</span>
                </a>
            </div>
        </section>
        
        <!-- Sekcja usług -->
        <section class="services" aria-labelledby="services-heading">
            <div class="container">
                <h2 id="services-heading">Nasze usługi</h2>
                
                <div class="services-grid">
                    <article class="service-card">
                        <h3>Strony internetowe</h3>
                        <p>Responsywne strony zgodne z WCAG 2.1 AA</p>
                        <a href="/uslugi/strony-www" aria-describedby="www-description">
                            Dowiedz się więcej
                        </a>
                        <div id="www-description" class="sr-only">
                            o usłudze tworzenia stron internetowych
                        </div>
                    </article>
                    
                    <article class="service-card">
                        <h3>Sklepy Shopify</h3>
                        <p>Dostępne sklepy internetowe na platformie Shopify</p>
                        <a href="/uslugi/shopify" aria-describedby="shopify-description">
                            Dowiedz się więcej
                        </a>
                        <div id="shopify-description" class="sr-only">
                            o usłudze tworzenia sklepów Shopify
                        </div>
                    </article>
                </div>
            </div>
        </section>
        
        <!-- Formularz kontaktowy -->
        <section class="contact-form" aria-labelledby="contact-heading">
            <div class="container">
                <h2 id="contact-heading">Skontaktuj się z nami</h2>
                
                <form action="/kontakt" method="post" novalidate>
                    <fieldset>
                        <legend>Dane kontaktowe</legend>
                        
                        <div class="form-group">
                            <label for="name">
                                Imię i nazwisko
                                <span class="required" aria-label="pole wymagane">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                required 
                                aria-describedby="name-error name-help"
                                aria-invalid="false"
                                autocomplete="name"
                            >
                            <div id="name-help" class="help-text">
                                Podaj swoje imię i nazwisko
                            </div>
                            <div id="name-error" class="error-message" aria-live="polite" role="alert">
                                <!-- Błędy walidacji będą tutaj -->
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">
                                Adres email
                                <span class="required" aria-label="pole wymagane">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                aria-describedby="email-error email-help"
                                aria-invalid="false"
                                autocomplete="email"
                            >
                            <div id="email-help" class="help-text">
                                Podaj prawidłowy adres email, np. jan@example.com
                            </div>
                            <div id="email-error" class="error-message" aria-live="polite" role="alert">
                                <!-- Błędy walidacji będą tutaj -->
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="service">Interesująca Cię usługa</label>
                            <select id="service" name="service" aria-describedby="service-help">
                                <option value="">-- Wybierz usługę --</option>
                                <option value="website">Strona internetowa</option>
                                <option value="shopify">Sklep Shopify</option>
                                <option value="mvp">Prototyp MVP</option>
                                <option value="ux-audit">Audyt UX</option>
                            </select>
                            <div id="service-help" class="help-text">
                                Wybierz usługę, która Cię interesuje (opcjonalnie)
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="message">
                                Wiadomość
                                <span class="required" aria-label="pole wymagane">*</span>
                            </label>
                            <textarea 
                                id="message" 
                                name="message" 
                                rows="5" 
                                required
                                aria-describedby="message-error message-help"
                                aria-invalid="false"
                                maxlength="1000"
                            ></textarea>
                            <div id="message-help" class="help-text">
                                Opisz swój projekt i wymagania (maksymalnie 1000 znaków)
                            </div>
                            <div id="message-error" class="error-message" aria-live="polite" role="alert">
                                <!-- Błędy walidacji będą tutaj -->
                            </div>
                        </div>
                    </fieldset>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">
                            <span class="btn-text">Wyślij wiadomość</span>
                            <span class="btn-loader" aria-hidden="true" style="display: none;">
                                <span class="sr-only">Wysyłanie...</span>
                                ⏳
                            </span>
                        </button>
                        <button type="reset" class="btn-secondary">
                            Wyczyść formularz
                        </button>
                    </div>
                </form>
            </div>
        </section>
    </main>
    
    <!-- Stopka -->
    <footer role="contentinfo">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>ECM Digital</h3>
                    <address>
                        ul. Przykładowa 123<br>
                        00-001 Warszawa<br>
                        <a href="tel:+48535330323">+48 535 330 323</a><br>
                        <a href="mailto:hello@ecm-digital.com">hello@ecm-digital.com</a>
                    </address>
                </div>
                
                <div class="footer-section">
                    <h3>Usługi</h3>
                    <ul>
                        <li><a href="/uslugi/strony-www">Strony WWW</a></li>
                        <li><a href="/uslugi/shopify">Sklepy Shopify</a></li>
                        <li><a href="/uslugi/mvp">Prototypy MVP</a></li>
                        <li><a href="/uslugi/audyty-ux">Audyty UX</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Informacje prawne</h3>
                    <ul>
                        <li><a href="/regulamin">Regulamin</a></li>
                        <li><a href="/polityka-prywatnosci">Polityka prywatności</a></li>
                        <li><a href="/deklaracja-dostepnosci">Deklaracja dostępności</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 ECM Digital. Wszystkie prawa zastrzeżone.</p>
            </div>
        </div>
    </footer>
    
    <!-- Screen reader only content -->
    <div class="sr-only">
        Koniec strony. Możesz wrócić do <a href="#main-content">głównej treści</a> 
        lub <a href="#top">góry strony</a>.
    </div>
</body>
</html>
```### C
SS dla Dostępności

```css
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

/* Skip links */
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px 12px;
    text-decoration: none;
    z-index: 1000;
    border-radius: 0 0 4px 4px;
    font-weight: 600;
}

.skip-link:focus {
    top: 6px;
}

/* Focus indicators - WCAG 2.1 AA requires 3:1 contrast ratio */
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
    
    .btn-secondary {
        background: #fff;
        color: #000;
        border: 2px solid #000;
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
        scroll-behavior: auto !important;
    }
}

/* Color contrast ratios - WCAG AA requires 4.5:1 for normal text */
:root {
    --text-primary: #1a1a1a;      /* 16.94:1 ratio on white */
    --text-secondary: #4a4a4a;    /* 9.64:1 ratio on white */
    --link-primary: #0066cc;      /* 7.73:1 ratio on white */
    --link-hover: #004499;        /* 11.24:1 ratio on white */
    --error-color: #d63384;       /* 5.14:1 ratio on white */
    --success-color: #198754;     /* 4.56:1 ratio on white */
    --warning-color: #fd7e14;     /* 3.76:1 ratio on white - needs darker shade */
    --warning-dark: #e55100;      /* 4.52:1 ratio on white */
}

/* Form styling for accessibility */
.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
}

.required {
    color: var(--error-color);
    font-weight: bold;
}

input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    line-height: 1.5;
    transition: border-color 0.15s ease-in-out;
}

input:focus, textarea:focus, select:focus {
    border-color: var(--link-primary);
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 204, 0.25);
}

/* Error states */
.error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

input[aria-invalid="true"],
textarea[aria-invalid="true"],
select[aria-invalid="true"] {
    border-color: var(--error-color);
    box-shadow: 0 0 0 0.2rem rgba(214, 51, 132, 0.25);
}

/* Help text */
.help-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
}

/* Button accessibility */
.btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: 2px solid transparent;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    min-height: 44px; /* WCAG touch target size */
    min-width: 44px;
}

.btn-primary {
    background: var(--link-primary);
    color: #fff;
    border-color: var(--link-primary);
}

.btn-primary:hover, .btn-primary:focus {
    background: var(--link-hover);
    border-color: var(--link-hover);
    color: #fff;
}

.btn-secondary {
    background: #fff;
    color: var(--text-primary);
    border-color: #ccc;
}

.btn-secondary:hover, .btn-secondary:focus {
    background: #f8f9fa;
    border-color: var(--text-primary);
    color: var(--text-primary);
}

/* Loading states */
.btn-loader {
    display: inline-block;
    margin-left: 0.5rem;
}

/* Navigation accessibility */
.nav-menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-menu a {
    display: block;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: var(--text-primary);
    border-radius: 4px;
    transition: background-color 0.15s ease-in-out;
}

.nav-menu a:hover,
.nav-menu a:focus {
    background-color: #f8f9fa;
    text-decoration: underline;
}

.nav-menu a[aria-current="page"] {
    background-color: var(--link-primary);
    color: #fff;
    font-weight: 600;
}

/* Submenu accessibility */
.submenu {
    display: none;
    position: absolute;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
}

.nav-menu li:hover .submenu,
.nav-menu li:focus-within .submenu {
    display: block;
}

/* Table accessibility */
table {
    border-collapse: collapse;
    width: 100%;
}

th, td {
    border: 1px solid #ccc;
    padding: 0.75rem;
    text-align: left;
}

th {
    background-color: #f8f9fa;
    font-weight: 600;
}

/* Caption for tables */
caption {
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-align: left;
}
```

### JavaScript dla Dostępności

```javascript
// Accessible form validation
class AccessibleFormValidator {
    constructor(form) {
        this.form = form;
        this.errors = new Map();
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Real-time validation on blur
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
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
                // Announce error to screen readers
                this.announceError('Formularz zawiera błędy. Sprawdź pola oznaczone jako nieprawidłowe.');
            }
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `Pole "${this.getFieldLabel(field)}" jest wymagane.`;
        }

        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Podaj prawidłowy adres email.';
        }

        // Phone validation
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Podaj prawidłowy numer telefonu.';
        }

        // Text length validation
        if (field.hasAttribute('maxlength')) {
            const maxLength = parseInt(field.getAttribute('maxlength'));
            if (value.length > maxLength) {
                isValid = false;
                errorMessage = `Tekst nie może być dłuższy niż ${maxLength} znaków.`;
            }
        }

        this.setFieldValidity(field, isValid, errorMessage);
        return isValid;
    }

    setFieldValidity(field, isValid, errorMessage) {
        const errorElement = document.getElementById(`${field.name}-error`);
        
        // Update aria-invalid attribute
        field.setAttribute('aria-invalid', !isValid);
        
        // Update error message
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = isValid ? 'none' : 'block';
        }

        // Store error state
        if (isValid) {
            this.errors.delete(field.name);
        } else {
            this.errors.set(field.name, errorMessage);
        }
    }

    clearFieldError(field) {
        if (field.getAttribute('aria-invalid') === 'true') {
            // Re-validate on input to clear errors
            this.validateField(field);
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        fields.forEach(field => {
            const isFieldValid = this.validateField(field);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
        return phoneRegex.test(phone);
    }

    announceError(message) {
        // Create live region for screen reader announcements
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    async submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoader = submitButton.querySelector('.btn-loader');

        try {
            // Update button state
            submitButton.disabled = true;
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'inline-block';
            buttonLoader.setAttribute('aria-hidden', 'false');

            // Submit form data
            const formData = new FormData(this.form);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showSuccessMessage();
                this.form.reset();
            } else {
                this.showErrorMessage('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
            }
        } catch (error) {
            this.showErrorMessage('Wystąpił błąd połączenia. Sprawdź połączenie internetowe i spróbuj ponownie.');
        } finally {
            // Restore button state
            submitButton.disabled = false;
            buttonText.style.display = 'inline-block';
            buttonLoader.style.display = 'none';
            buttonLoader.setAttribute('aria-hidden', 'true');
        }
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.setAttribute('role', 'alert');
        message.setAttribute('aria-live', 'polite');
        message.className = 'success-message';
        message.innerHTML = `
            <strong>Sukces!</strong> Formularz został wysłany pomyślnie. 
            Skontaktujemy się z Tobą w ciągu 24 godzin.
        `;
        
        this.form.insertBefore(message, this.form.firstChild);
        message.focus();
        
        // Remove message after 10 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 10000);
    }

    showErrorMessage(text) {
        const message = document.createElement('div');
        message.setAttribute('role', 'alert');
        message.setAttribute('aria-live', 'assertive');
        message.className = 'error-message';
        message.innerHTML = `<strong>Błąd:</strong> ${text}`;
        
        this.form.insertBefore(message, this.form.firstChild);
        message.focus();
        
        // Remove message after 10 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 10000);
    }
}

// Accessible navigation menu
class AccessibleNavigation {
    constructor(nav) {
        this.nav = nav;
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupSubmenuHandling();
    }

    setupKeyboardNavigation() {
        const menuItems = this.nav.querySelectorAll('a, button');
        
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        this.focusNextItem(menuItems, index);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.focusPreviousItem(menuItems, index);
                        break;
                    case 'Home':
                        e.preventDefault();
                        menuItems[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        menuItems[menuItems.length - 1].focus();
                        break;
                    case 'Escape':
                        this.closeAllSubmenus();
                        break;
                }
            });
        });
    }

    setupSubmenuHandling() {
        const submenuTriggers = this.nav.querySelectorAll('[aria-haspopup="true"]');
        
        submenuTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSubmenu(trigger);
            });
            
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleSubmenu(trigger);
                }
            });
        });
    }

    focusNextItem(items, currentIndex) {
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
    }

    focusPreviousItem(items, currentIndex) {
        const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        items[prevIndex].focus();
    }

    toggleSubmenu(trigger) {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        // Close all other submenus
        this.closeAllSubmenus();
        
        // Toggle current submenu
        trigger.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            // Focus first item in submenu
            const submenu = trigger.nextElementSibling;
            if (submenu) {
                const firstItem = submenu.querySelector('a, button');
                if (firstItem) {
                    firstItem.focus();
                }
            }
        }
    }

    closeAllSubmenus() {
        const triggers = this.nav.querySelectorAll('[aria-expanded="true"]');
        triggers.forEach(trigger => {
            trigger.setAttribute('aria-expanded', 'false');
        });
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        new AccessibleFormValidator(form);
    });
    
    // Initialize navigation
    const nav = document.querySelector('nav[role="navigation"]');
    if (nav) {
        new AccessibleNavigation(nav);
    }
    
    // Add keyboard support for skip links
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    });
});
```

## Narzędzia Testowania Dostępności

### Automated Testing z axe-core

```javascript
// Automated accessibility testing
const axe = require('axe-core');

class AccessibilityTester {
    constructor() {
        this.violations = [];
        this.passes = [];
    }

    async runFullAudit(options = {}) {
        const defaultOptions = {
            tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
            rules: {
                'color-contrast': { enabled: true },
                'keyboard-navigation': { enabled: true },
                'focus-management': { enabled: true },
                'aria-usage': { enabled: true }
            }
        };

        const config = { ...defaultOptions, ...options };

        try {
            const results = await axe.run(document, config);
            
            this.violations = results.violations;
            this.passes = results.passes;
            
            return this.generateReport();
        } catch (error) {
            console.error('Accessibility testing error:', error);
            return null;
        }
    }

    generateReport() {
        const report = {
            summary: {
                violations: this.violations.length,
                passes: this.passes.length,
                score: this.calculateScore()
            },
            violations: this.violations.map(violation => ({
                id: violation.id,
                impact: violation.impact,
                description: violation.description,
                help: violation.help,
                helpUrl: violation.helpUrl,
                nodes: violation.nodes.map(node => ({
                    target: node.target,
                    html: node.html,
                    failureSummary: node.failureSummary
                }))
            })),
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    calculateScore() {
        const totalTests = this.violations.length + this.passes.length;
        if (totalTests === 0) return 100;
        
        return Math.round((this.passes.length / totalTests) * 100);
    }

    generateRecommendations() {
        const recommendations = [];
        
        this.violations.forEach(violation => {
            switch (violation.id) {
                case 'color-contrast':
                    recommendations.push({
                        priority: 'high',
                        action: 'Zwiększ kontrast kolorów do minimum 4.5:1 dla normalnego tekstu',
                        impact: 'Krytyczne dla użytkowników z problemami wzroku'
                    });
                    break;
                case 'keyboard':
                    recommendations.push({
                        priority: 'high',
                        action: 'Zapewnij dostęp do wszystkich funkcji za pomocą klawiatury',
                        impact: 'Krytyczne dla użytkowników nie używających myszy'
                    });
                    break;
                case 'aria-labels':
                    recommendations.push({
                        priority: 'medium',
                        action: 'Dodaj odpowiednie etykiety ARIA dla elementów interaktywnych',
                        impact: 'Ważne dla użytkowników czytników ekranu'
                    });
                    break;
            }
        });

        return recommendations;
    }
}

// Usage example
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.search.includes('accessibility-test')) {
        const tester = new AccessibilityTester();
        const report = await tester.runFullAudit();
        
        if (report) {
            console.log('Accessibility Report:', report);
            
            // Display results in development
            if (process.env.NODE_ENV === 'development') {
                const reportElement = document.createElement('div');
                reportElement.innerHTML = `
                    <div style="position: fixed; top: 10px; right: 10px; background: white; border: 2px solid #ccc; padding: 20px; z-index: 10000; max-width: 400px;">
                        <h3>Accessibility Report</h3>
                        <p>Score: ${report.summary.score}%</p>
                        <p>Violations: ${report.summary.violations}</p>
                        <p>Passes: ${report.summary.passes}</p>
                        <button onclick="this.parentElement.remove()">Close</button>
                    </div>
                `;
                document.body.appendChild(reportElement);
            }
        }
    }
});
```

---

*Ostatnia aktualizacja: Styczeń 2025*
*Wersja dokumentu: 1.0*