// System wielojęzyczny ECM Digital
class I18nManager {
    constructor() {
        this.currentLanguage = 'pl';
        this.translations = {};
        this.initialized = false;
    }

    // Inicjalizacja systemu
    async init() {
        try {
            // Ładowanie tłumaczeń
            await this.loadTranslations();
            this.initialized = true;
            
            // Ustawienie domyślnego języka
            this.setLanguage(this.getStoredLanguage() || 'pl');
            
            // Nasłuchiwanie zmian języka
            this.bindLanguageSwitchers();
            
            console.log('I18n system initialized successfully');
        } catch (error) {
            console.error('Failed to initialize I18n system:', error);
        }
    }

    // Ładowanie plików tłumaczeń
    async loadTranslations() {
        try {
            const [plTranslations, enTranslations] = await Promise.all([
                fetch('/src/locales/pl.json').then(res => res.json()),
                fetch('/src/locales/en.json').then(res => res.json())
            ]);

            this.translations = {
                pl: plTranslations,
                en: enTranslations
            };
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback do wbudowanych tłumaczeń
            this.loadFallbackTranslations();
        }
    }

    // Wbudowane tłumaczenia jako fallback
    loadFallbackTranslations() {
        this.translations = {
            pl: {
                nav: {
                    home: "Strona główna",
                    services: "Usługi",
                    about: "O nas",
                    team: "Zespół",
                    clientPanel: "Panel Klienta",
                    contact: "Kontakt",
                    language: "PL"
                },
                hero: {
                    title: "Transformuj Swój Biznes z",
                    titleHighlight: "Innowacjami Cyfrowymi",
                    subtitle: "Jesteśmy profesjonalną agencją cyfrową, która tworzy nowoczesne strony internetowe, rozwiązania e-commerce, asystentów AI i systemy automatyzacji. Budujmy przyszłość razem!",
                    exploreServices: "Poznaj Usługi",
                    getQuote: "Otrzymaj Ofertę"
                }
            },
            en: {
                nav: {
                    home: "Home",
                    services: "Services",
                    about: "About Us",
                    team: "Team",
                    clientPanel: "Client Panel",
                    contact: "Contact",
                    language: "EN"
                },
                hero: {
                    title: "Transform Your Business with",
                    titleHighlight: "Digital Innovation",
                    subtitle: "We are a professional digital agency that creates cutting-edge websites, e-commerce solutions, AI assistants, and automation systems. Let's build the future together!",
                    exploreServices: "Explore Services",
                    getQuote: "Get Quote"
                }
            }
        };
    }

    // Ustawienie języka
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not supported, falling back to pl`);
            lang = 'pl';
        }

        this.currentLanguage = lang;
        localStorage.setItem('ecm-language', lang);
        
        // Aktualizacja HTML
        document.documentElement.lang = lang;
        
        // Aktualizacja wszystkich elementów z data-i18n
        this.updatePageContent();
        
        // Aktualizacja przełączników języka
        this.updateLanguageSwitchers();
        
        console.log(`Language changed to: ${lang}`);
    }

    // Pobranie zapisanego języka
    getStoredLanguage() {
        return localStorage.getItem('ecm-language');
    }

    // Pobranie tłumaczenia
    t(key) {
        if (!this.initialized) {
            return key;
        }

        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return value;
    }

    // Aktualizacja zawartości strony
    updatePageContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Aktualizacja meta tagów
        this.updateMetaTags();
    }

    // Aktualizacja meta tagów
    updateMetaTags() {
        const title = document.querySelector('title');
        const metaDescription = document.querySelector('meta[name="description"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');

        if (title) title.textContent = this.t('meta.title');
        if (metaDescription) metaDescription.setAttribute('content', this.t('meta.description'));
        if (ogTitle) ogTitle.setAttribute('content', this.t('meta.ogTitle'));
        if (ogDescription) ogDescription.setAttribute('content', this.t('meta.ogDescription'));
        if (twitterTitle) twitterTitle.setAttribute('content', this.t('meta.twitterTitle'));
        if (twitterDescription) twitterDescription.setAttribute('content', this.t('meta.twitterDescription'));
    }

    // Aktualizacja przełączników języka
    updateLanguageSwitchers() {
        const switchers = document.querySelectorAll('.language-switcher a');
        
        switchers.forEach(switcher => {
            const lang = switcher.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                switcher.classList.add('active');
            } else {
                switcher.classList.remove('active');
            }
        });
    }

    // Bindowanie przełączników języka
    bindLanguageSwitchers() {
        const switchers = document.querySelectorAll('.language-switcher a, [data-lang]');
        
        switchers.forEach(switcher => {
            switcher.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = switcher.getAttribute('data-lang');
                if (lang) {
                    this.setLanguage(lang);
                }
            });
        });
    }

    // Pobranie aktualnego języka
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Sprawdzenie czy system jest zainicjalizowany
    isInitialized() {
        return this.initialized;
    }
}

// Inicjalizacja systemu wielojęzycznego
const i18n = new I18nManager();

// Eksport dla modułów
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
} else {
    window.I18nManager = I18nManager;
    window.i18n = i18n;
}

// Automatyczna inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});

// Inicjalizacja natychmiast jeśli DOM jest już załadowany
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18n.init();
    });
} else {
    i18n.init();
}
