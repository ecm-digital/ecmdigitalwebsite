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
            
            console.log('I18n system initialized successfully');
        } catch (error) {
            console.error('Failed to initialize I18n system:', error);
            // Fallback do wbudowanych tłumaczeń
            this.loadFallbackTranslations();
            this.setLanguage('pl');
        }
    }

    // Ładowanie plików tłumaczeń
    async loadTranslations() {
        try {
            const [plTranslations, enTranslations, deTranslations] = await Promise.all([
                fetch('/src/locales/pl.json').then(res => res.json()),
                fetch('/src/locales/en.json').then(res => res.json()),
                fetch('/src/locales/de.json').then(res => res.json())
            ]);

            this.translations = {
                pl: plTranslations,
                en: enTranslations,
                de: deTranslations
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
                    contact: "Kontakt"
                },
                hero: {
                    subtitle: "Profesjonalna agencja cyfrowa tworząca nowoczesne rozwiązania internetowe. Od prostych stron WWW po zaawansowane aplikacje mobilne i systemy AI.",
                    exploreServices: "Zobacz Ofertę",
                    getQuote: "Darmowa Konsultacja"
                },
                services: {
                    websites: "Strony WWW",
                    shopify: "Sklepy Shopify",
                    mvp: "Prototypy MVP",
                    uxAudit: "Audyty UX",
                    automation: "Automatyzacje",
                    socialMedia: "Social Media & AI",
                    aiAssistants: "Asystenci AI na Amazon Bedrock & Copilot Studio",
                    mobileApps: "Aplikacje Mobilne",
                    voiceAssistants: "Asystenci Głosowi na Amazon Lex"
                },
                sections: {
                    services: { title: "Nasze Usługi" },
                    about: { title: "O ECM Digital" },
                    team: { title: "Nasz Zespół", subtitle: "Poznaj ekspertów, którzy tworzą Twoje projekty" },
                    process: { 
                        title: "Nasz Proces Pracy",
                        steps: {
                            discovery: { title: "Konsultacja", description: "Analiza potrzeb i wymagań projektu" },
                            design: { title: "Planowanie", description: "Strategia i architektura rozwiązania" },
                            development: { title: "Realizacja", description: "Development i testowanie" },
                            launch: { title: "Wdrożenie", description: "Uruchomienie i wsparcie" }
                        }
                    },
                    contact: { 
                        title: "Rozpocznij Projekt",
                        description: "Skontaktuj się z nami, aby omówić Twój projekt. Oferujemy darmową konsultację i wycenę.",
                        contactUs: "Skontaktuj się z nami",
                        sendMessage: "Napisz Email",
                        phone: "Zadzwoń"
                    }
                },
                footer: { copyright: "© 2025 ECM Digital. Wszystkie prawa zastrzeżone." }
            },
            en: {
                nav: {
                    home: "Home",
                    services: "Services",
                    about: "About Us",
                    team: "Team",
                    clientPanel: "Client Panel",
                    contact: "Contact"
                },
                hero: {
                    subtitle: "Professional digital agency creating modern internet solutions. From simple websites to advanced mobile applications and AI systems.",
                    exploreServices: "View Offer",
                    getQuote: "Free Consultation"
                },
                services: {
                    websites: "Websites",
                    shopify: "Shopify Stores",
                    mvp: "MVP Prototypes",
                    uxAudit: "UX Audits",
                    automation: "Automation",
                    socialMedia: "Social Media & AI",
                    aiAssistants: "AI Assistants on Amazon Bedrock & Copilot Studio",
                    mobileApps: "Mobile Applications",
                    voiceAssistants: "Voice Assistants on Amazon Lex"
                },
                sections: {
                    services: { title: "Our Services" },
                    about: { title: "About ECM Digital" },
                    team: { title: "Our Team", subtitle: "Meet the experts who create your projects" },
                    process: { 
                        title: "Our Work Process",
                        steps: {
                            discovery: { title: "Consultation", description: "Analysis of project needs and requirements" },
                            design: { title: "Planning", description: "Strategy and solution architecture" },
                            development: { title: "Implementation", description: "Development and testing" },
                            launch: { title: "Deployment", description: "Launch and support" }
                        }
                    },
                    contact: { 
                        title: "Start Your Project",
                        description: "Contact us to discuss your project. We offer free consultation and quote.",
                        contactUs: "Contact Us",
                        sendMessage: "Write Email",
                        phone: "Call"
                    }
                },
                footer: { copyright: "© 2025 ECM Digital. All rights reserved." }
            },
            de: {
                nav: {
                    home: "Startseite",
                    services: "Dienstleistungen",
                    about: "Über uns",
                    team: "Team",
                    clientPanel: "Kundenbereich",
                    contact: "Kontakt"
                },
                hero: {
                    subtitle: "Professionelle Digitalagentur, die moderne Internetlösungen erstellt. Von einfachen Websites bis hin zu fortschrittlichen mobilen Anwendungen und KI-Systemen.",
                    exploreServices: "Angebot ansehen",
                    getQuote: "Kostenlose Beratung"
                },
                services: {
                    websites: "Websites",
                    shopify: "Shopify Stores",
                    mvp: "MVP Prototypen",
                    uxAudit: "UX Audits",
                    automation: "Automatisierung",
                    socialMedia: "Social Media & KI",
                    aiAssistants: "KI-Assistenten auf Amazon Bedrock & Copilot Studio",
                    mobileApps: "Mobile Anwendungen",
                    voiceAssistants: "Sprachassistenten auf Amazon Lex"
                },
                sections: {
                    services: { title: "Unsere Dienstleistungen" },
                    about: { title: "Über ECM Digital" },
                    team: { title: "Unser Team", subtitle: "Lernen Sie die Experten kennen, die Ihre Projekte erstellen" },
                    process: { 
                        title: "Unser Arbeitsprozess",
                        steps: {
                            discovery: { title: "Beratung", description: "Analyse der Projektanforderungen und Bedürfnisse" },
                            design: { title: "Planung", description: "Strategie und Lösungsarchitektur" },
                            development: { title: "Umsetzung", description: "Entwicklung und Tests" },
                            launch: { title: "Bereitstellung", description: "Start und Support" }
                        }
                    },
                    contact: { 
                        title: "Starten Sie Ihr Projekt",
                        description: "Kontaktieren Sie uns, um Ihr Projekt zu besprechen. Wir bieten kostenlose Beratung und Angebote.",
                        contactUs: "Kontaktieren Sie uns",
                        sendMessage: "E-Mail schreiben",
                        phone: "Anrufen"
                    }
                },
                footer: { copyright: "© 2025 ECM Digital. Alle Rechte vorbehalten." }
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
        localStorage.setItem('preferredLanguage', lang);
        
        // Aktualizacja HTML
        document.documentElement.lang = lang;
        
        // Aktualizacja wszystkich elementów z data-i18n
        this.updatePageContent();
        
        console.log(`Language changed to: ${lang}`);
    }

    // Pobranie zapisanego języka
    getStoredLanguage() {
        return localStorage.getItem('preferredLanguage');
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

// Automatyczna inicjalizacja została usunięta - inicjalizacja jest ręczna w HTML
