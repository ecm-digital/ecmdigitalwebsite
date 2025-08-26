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
            console.log('🔄 Initializing I18n system...');
            
            // Użyj wbudowanych tłumaczeń jako domyślnych
            this.loadFallbackTranslations();
            this.initialized = true;
            
            // Ustawienie domyślnego języka
            this.setLanguage(this.getStoredLanguage() || 'pl');
            
            console.log('✅ I18n system initialized successfully with fallback translations');
            console.log('📊 Available translations:', Object.keys(this.translations));
        } catch (error) {
            console.error('❌ Failed to initialize I18n system:', error);
            // Fallback do wbudowanych tłumaczeń
            this.loadFallbackTranslations();
            this.setLanguage('pl');
        }
    }

    // Ładowanie plików tłumaczeń
    async loadTranslations() {
        try {
            // Dynamicznie określ ścieżkę do plików tłumaczeń
            const basePath = this.getBasePath();
            console.log('🔍 Base path determined:', basePath);
            console.log('🔍 Current pathname:', window.location.pathname);
            
            const [plTranslations, enTranslations, deTranslations] = await Promise.all([
                fetch(`${basePath}src/locales/pl.json`).then(res => res.json()),
                fetch(`${basePath}src/locales/en.json`).then(res => res.json()),
                fetch(`${basePath}src/locales/de.json`).then(res => res.json())
            ]);

            this.translations = {
                pl: plTranslations,
                en: enTranslations,
                de: deTranslations
            };
            
            console.log('✅ Translations loaded successfully');
            console.log('🇵🇱 Polish keys:', Object.keys(plTranslations));
        } catch (error) {
            console.error('❌ Failed to load translations:', error);
            // Fallback do wbudowanych tłumaczeń
            this.loadFallbackTranslations();
        }
    }

    // Określ bazową ścieżkę na podstawie aktualnej lokalizacji
    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/dokumentacja-ecm/oferta-uslug/')) {
            return '../../../';
        } else if (path.includes('/dokumentacja-ecm/')) {
            return '../';
        } else {
            return './';
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
                navigation: {
                    home: "Strona główna",
                    services: "Usługi",
                    about: "O nas",
                    blog: "Blog",
                    caseStudies: "Studia Przypadków",
                    team: "Zespół",
                    myAccount: "Moje Konto",
                    contact: "Kontakt",
                    dropdown: {
                        aiSolutions: "🤖 Rozwiązania AI",
                        aiAssistants: "Asystenci AI na Amazon Bedrock",
                        voiceAssistants: "Asystenci Głosowi na Amazon Lex",
                        aiAudits: "Audyty Wdrożenia AI",
                        socialMediaAI: "Social Media & AI",
                        digitalProducts: "🌐 Produkty Cyfrowe",
                        websites: "Strony WWW",
                        shopifyStores: "Sklepy Shopify",
                        mobileApps: "Aplikacje Mobilne",
                        automationMvp: "⚡ Automatyzacja & MVP",
                        n8nAutomation: "Automatyzacje N8N",
                        mvpPrototypes: "Prototypy MVP",
                        viewAllServices: "Zobacz wszystkie usługi"
                    }
                },
                common: {
                    learnMore: "Dowiedz się więcej"
                },
                hero: {
                    title: "Wdrażamy AI w Twojej Firmie",
                    subtitle: "Transformujemy Twoją firmę dzięki sztucznej inteligencji. Od chatbotów po zaawansowane automatyzacje - AI, które naprawdę działa i generuje realne korzyści biznesowe.",
                    exploreServices: "Zobacz Ofertę",
                    getQuote: "Darmowa Konsultacja",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "Projektów AI",
                        costReduction: "70%",
                        costReductionLabel: "Redukcja Kosztów",
                        support: "24/7",
                        supportLabel: "AI Wsparcie",
                        satisfaction: "95%",
                        satisfactionLabel: "Satysfakcja"
                    }
                },
                services: {
                    websites: {
                        title: "Strony WWW",
                        description: "Profesjonalne strony internetowe dostosowane do potrzeb biznesowych. Zoptymalizowane pod kątem SEO, wydajności i konwersji."
                    },
                    shopifyStores: {
                        title: "Sklepy Shopify",
                        description: "Profesjonalne sklepy internetowe na platformie Shopify, które skutecznie sprzedają i skalują się wraz z Twoim biznesem."
                    },
                    mvpPrototypes: {
                        title: "Prototypy MVP",
                        description: "Szybka walidacja pomysłów biznesowych poprzez tworzenie funkcjonalnych prototypów. Minimalizujemy ryzyko i maksymalizujemy szanse na sukces."
                    },
                    uxAudits: {
                        title: "Audyty Wdrożenia AI w Twojej Firmie",
                        description: "Analizujemy Twoje procesy biznesowe i identyfikujemy obszary do automatyzacji AI. Kompleksowy plan wdrożenia sztucznej inteligencji."
                    },
                    automation: {
                        title: "Automatyzacje",
                        description: "Oszczędzaj 15-20 godzin tygodniowo automatyzując powtarzalne zadania. Integracje systemów, automatyzacja workflow i eliminacja błędów ludzkich."
                    },
                    socialMediaAI: {
                        title: "Social Media & AI",
                        description: "Zwiększ zaangażowanie o 60% dzięki analizie treści AI. Dowiedz się, co naprawdę interesuje Twoich klientów."
                    },
                    aiAssistants: {
                        title: "Asystenci AI na Amazon Bedrock & Copilot Studio",
                        description: "Automatyzuj obsługę klienta 24/7 i oszczędzaj do 70% kosztów wsparcia. Inteligentni asystenci AI odpowiadają na pytania i rozwiązują problemy."
                    },
                    mobileApps: {
                        title: "Aplikacje Mobilne",
                        description: "Od pomysłu do App Store w 8-12 tygodni. Nowoczesne aplikacje iOS i Android, które zwiększają przychody i zaangażowanie klientów."
                    },
                    voiceAssistants: {
                        title: "Asystenci Głosowi na Amazon Lex",
                        description: "Głosowa obsługa klienta - dostępność 24/7 bez kosztów call center. Naturalne rozmowy, inteligentne odpowiedzi."
                    }
                },
                sections: {
                    services: { 
                        title: "Nasze Usługi",
                        subtitle: "Kompleksowe rozwiązania AI i automatyzacji, które transformują Twój biznes i zwiększają efektywność"
                    },
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
                navigation: {
                    home: "Home",
                    services: "Services",
                    about: "About Us",
                    blog: "Blog",
                    caseStudies: "Case Studies",
                    team: "Team",
                    myAccount: "My Account",
                    contact: "Contact",
                    dropdown: {
                        aiSolutions: "🤖 AI Solutions",
                        aiAssistants: "AI Assistants on Amazon Bedrock",
                        voiceAssistants: "Voice Assistants on Amazon Lex",
                        aiAudits: "AI Implementation Audits",
                        socialMediaAI: "Social Media & AI",
                        digitalProducts: "🌐 Digital Products",
                        websites: "Websites",
                        shopifyStores: "Shopify Stores",
                        mobileApps: "Mobile Applications",
                        automationMvp: "⚡ Automation & MVP",
                        n8nAutomation: "N8N Automations",
                        mvpPrototypes: "MVP Prototypes",
                        viewAllServices: "View All Services"
                    }
                },
                common: {
                    learnMore: "Learn More"
                },
                hero: {
                    title: "We Implement AI in Your Company",
                    subtitle: "We transform your company through artificial intelligence. From chatbots to advanced automation - AI that really works and generates real business benefits.",
                    exploreServices: "View Offer",
                    getQuote: "Free Consultation",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "AI Projects",
                        costReduction: "70%",
                        costReductionLabel: "Cost Reduction",
                        support: "24/7",
                        supportLabel: "AI Support",
                        satisfaction: "95%",
                        satisfactionLabel: "Satisfaction"
                    }
                },
                services: {
                    websites: {
                        title: "Websites",
                        description: "Professional websites tailored to business needs. Optimized for SEO, performance and conversion."
                    },
                    shopifyStores: {
                        title: "Shopify Stores",
                        description: "Professional online stores on the Shopify platform that effectively sell and scale with your business."
                    },
                    mvpPrototypes: {
                        title: "MVP Prototypes",
                        description: "Quick validation of business ideas through creating functional prototypes. We minimize risk and maximize chances of success."
                    },
                    uxAudits: {
                        title: "AI Implementation Audits in Your Company",
                        description: "We analyze your business processes and identify areas for AI automation. Comprehensive artificial intelligence implementation plan."
                    },
                    automation: {
                        title: "Automation",
                        description: "Save 15-20 hours weekly by automating repetitive tasks. System integrations, workflow automation and elimination of human errors."
                    },
                    socialMediaAI: {
                        title: "Social Media & AI",
                        description: "Increase engagement by 60% through AI content analysis. Learn what really interests your customers."
                    },
                    aiAssistants: {
                        title: "AI Assistants on Amazon Bedrock & Copilot Studio",
                        description: "Automate customer service 24/7 and save up to 70% on support costs. Intelligent AI assistants answer questions and solve problems."
                    },
                    mobileApps: {
                        title: "Mobile Applications",
                        description: "From idea to App Store in 8-12 weeks. Modern iOS and Android applications that increase revenue and customer engagement."
                    },
                    voiceAssistants: {
                        title: "Voice Assistants on Amazon Lex",
                        description: "Voice customer service - 24/7 availability without call center costs. Natural conversations, intelligent responses."
                    }
                },
                sections: {
                    services: { 
                        title: "Our Services",
                        subtitle: "Comprehensive AI and automation solutions that transform your business and increase efficiency"
                    },
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
                navigation: {
                    home: "Startseite",
                    services: "Dienstleistungen",
                    about: "Über uns",
                    blog: "Blog",
                    caseStudies: "Fallstudien",
                    team: "Team",
                    myAccount: "Mein Konto",
                    contact: "Kontakt",
                    dropdown: {
                        aiSolutions: "🤖 KI-Lösungen",
                        aiAssistants: "KI-Assistenten auf Amazon Bedrock",
                        voiceAssistants: "Sprachassistenten auf Amazon Lex",
                        aiAudits: "KI-Implementierungsaudits",
                        socialMediaAI: "Social Media & KI",
                        digitalProducts: "🌐 Digitale Produkte",
                        websites: "Websites",
                        shopifyStores: "Shopify Stores",
                        mobileApps: "Mobile Anwendungen",
                        automationMvp: "⚡ Automatisierung & MVP",
                        n8nAutomation: "N8N-Automatisierungen",
                        mvpPrototypes: "MVP-Prototypen",
                        viewAllServices: "Alle Dienstleistungen anzeigen"
                    }
                },
                common: {
                    learnMore: "Mehr erfahren"
                },
                hero: {
                    title: "Wir implementieren KI in Ihrem Unternehmen",
                    subtitle: "Wir transformieren Ihr Unternehmen durch künstliche Intelligenz. Von Chatbots bis hin zu fortschrittlicher Automatisierung - KI, die wirklich funktioniert und echte Geschäftsvorteile generiert.",
                    exploreServices: "Angebot ansehen",
                    getQuote: "Kostenlose Beratung",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "KI-Projekte",
                        costReduction: "70%",
                        costReductionLabel: "Kostensenkung",
                        support: "24/7",
                        supportLabel: "KI-Unterstützung",
                        satisfaction: "95%",
                        satisfactionLabel: "Zufriedenheit"
                    }
                },
                services: {
                    websites: {
                        title: "Websites",
                        description: "Professionelle Websites, die auf Geschäftsanforderungen zugeschnitten sind. Optimiert für SEO, Leistung und Konversion."
                    },
                    shopifyStores: {
                        title: "Shopify Stores",
                        description: "Professionelle Online-Shops auf der Shopify-Plattform, die effektiv verkaufen und mit Ihrem Unternehmen wachsen."
                    },
                    mvpPrototypes: {
                        title: "MVP-Prototypen",
                        description: "Schnelle Validierung von Geschäftsideen durch die Erstellung funktionaler Prototypen. Wir minimieren Risiken und maximieren Erfolgschancen."
                    },
                    uxAudits: {
                        title: "KI-Implementierungsaudits in Ihrem Unternehmen",
                        description: "Wir analysieren Ihre Geschäftsprozesse und identifizieren Bereiche für KI-Automatisierung. Umfassender künstlicher Intelligenz-Implementierungsplan."
                    },
                    automation: {
                        title: "Automatisierung",
                        description: "Sparen Sie 15-20 Stunden pro Woche durch die Automatisierung sich wiederholender Aufgaben. Systemintegrationen, Workflow-Automatisierung und Eliminierung menschlicher Fehler."
                    },
                    socialMediaAI: {
                        title: "Social Media & KI",
                        description: "Steigern Sie das Engagement um 60% durch KI-Inhaltsanalyse. Erfahren Sie, was Ihre Kunden wirklich interessiert."
                    },
                    aiAssistants: {
                        title: "KI-Assistenten auf Amazon Bedrock & Copilot Studio",
                        description: "Automatisieren Sie den Kundenservice 24/7 und sparen Sie bis zu 70% der Supportkosten. Intelligente KI-Assistenten beantworten Fragen und lösen Probleme."
                    },
                    mobileApps: {
                        title: "Mobile Anwendungen",
                        description: "Von der Idee zum App Store in 8-12 Wochen. Moderne iOS- und Android-Anwendungen, die den Umsatz und das Kundenengagement steigern."
                    },
                    voiceAssistants: {
                        title: "Sprachassistenten auf Amazon Lex",
                        description: "Sprachbasierter Kundenservice - 24/7-Verfügbarkeit ohne Call-Center-Kosten. Natürliche Gespräche, intelligente Antworten."
                    }
                },
                sections: {
                    services: { 
                        title: "Unsere Dienstleistungen",
                        subtitle: "Umfassende KI- und Automatisierungslösungen, die Ihr Unternehmen transformieren und die Effizienz steigern"
                    },
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
        
        // Aktualizacja wszystkich elementów z data-i18n tylko jeśli nie jest to inicjalizacja
        if (this.initialized) {
            this.updatePageContent();
        }
        
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
        console.log(`🔄 Updating ${elements.length} elements with translations`);
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
                console.log(`✅ Updated ${key}: ${translation}`);
            } else {
                console.warn(`⚠️ No translation found for key: ${key}`);
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
