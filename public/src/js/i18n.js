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
            console.log('🔍 Current hostname:', window.location.hostname);
            console.log('🔍 Full URL:', window.location.href);

            // Spróbuj różne ścieżki na Vercelu
            let translationPaths = [];
            if (window.location.hostname.includes('vercel.app')) {
                translationPaths = [
                    '/locales/pl.json',
                    '/locales/en.json',
                    '/locales/de.json'
                ];
                console.log('🌐 Using Vercel paths:', translationPaths);
            } else {
                translationPaths = [
                    `${basePath}locales/pl.json`,
                    `${basePath}locales/en.json`,
                    `${basePath}locales/de.json`
                ];
            }

            console.log('📁 Attempting to load translations from:', translationPaths);

            const [plTranslations, enTranslations, deTranslations] = await Promise.all([
                fetch(translationPaths[0]).then(res => {
                    console.log('🇵🇱 PL response status:', res.status);
                    return res.json();
                }),
                fetch(translationPaths[1]).then(res => {
                    console.log('🇬🇧 EN response status:', res.status);
                    return res.json();
                }),
                fetch(translationPaths[2]).then(res => {
                    console.log('🇩🇪 DE response status:', res.status);
                    return res.json();
                })
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
        const hostname = window.location.hostname;

        // Na produkcji Vercela ścieżki mogą być inne
        if (hostname.includes('vercel.app')) {
            // Na Vercelu zawsze używaj ścieżki względnej od root
            if (path.includes('/dokumentacja-ecm/oferta-uslug/')) {
                return '/';
            } else if (path.includes('/dokumentacja-ecm/')) {
                return '/';
            } else {
                return '/';
            }
        }

        // Na localhost zachowaj istniejącą logikę
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
                    learnMore: "Dowiedz się więcej",
                    readMore: "Czytaj więcej"
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
                        description: "Profesjonalne sklepy internetowe na platformie Shopify, które skutecznie sprzedają i skalują się wraz z Twoim biznesem.",
                        heroTitle: "Sklepy <span style=\"color: #96BF47;\">Shopify & Wix</span> Które <span style=\"color: #30D158;\">Sprzedają</span>",
                        heroDescription: "Tworzymy profesjonalne sklepy e-commerce na platformach Shopify i Wix, które konwertują odwiedzających w klientów. Custom design, zaawansowane integracje i automatyzacja sprzedaży.",
                        stats: {
                            salesGrowth: "Wzrost Sprzedaży",
                            loadTime: "Czas Ładowania",
                            startPrice: "PLN Start"
                        },
                        features: {
                            title: "Co Otrzymasz",
                            subtitle: "Kompleksowe rozwiązanie e-commerce na platformach Shopify i Wix",
                            customDesign: {
                                title: "Custom Design",
                                description: "Unikalny design dopasowany do Twojej marki i grupy docelowej"
                            },
                            mobileFirst: {
                                title: "Mobile-First",
                                description: "Zoptymalizowany pod kątem urządzeń mobilnych, gdzie odbywa się 70% zakupów"
                            },
                            payments: {
                                title: "Płatności & Dostawa",
                                description: "Integracje z popularnymi bramkami płatności i firmami kurierskimi"
                            },
                            analytics: {
                                title: "Analytics & Tracking",
                                description: "Google Analytics, Facebook Pixel, konwersje i pełny tracking sprzedaży"
                            },
                            automation: {
                                title: "Automatyzacja",
                                description: "Email marketing, odzyskiwanie koszyków, zarządzanie stanami magazynowymi"
                            },
                            seo: {
                                title: "SEO & Marketing",
                                description: "Optymalizacja pod wyszukiwarki i integracje marketingowe"
                            }
                        },
                        process: {
                            title: "Jak Tworzymy Sklepy Shopify & Wix",
                            subtitle: "Kompleksowy proces od analizy po launch i skalowanie"
                        }
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
                blog: {
                    aiTrends: {
                        category: "🤖 AI Trends",
                        title: "Jak AI zmienia e-commerce w 2024?",
                        description: "Odkryj najnowsze trendy AI dla e-commerce: personalizacja, chatboty, rekomendacje produktów i automatyzacja procesów sprzedaży.",
                        readTime: "15 min czytania",
                        views: "2.5k wyświetleń",
                        tags: {
                            ecommerce: "E-commerce",
                            ai: "AI",
                            trends: "Trends"
                        }
                    },
                    automation: {
                        category: "⚡ Automation",
                        title: "10 procesów biznesowych do automatyzacji",
                        description: "Praktyczny przewodnik po procesach, które warto zautomatyzować w pierwszej kolejności. Oszczędzaj czas i pieniądze dzięki AI.",
                        readTime: "12 min czytania",
                        views: "1.8k wyświetleń",
                        tags: {
                            automation: "Automatyzacja",
                            process: "Proces",
                            roi: "ROI"
                        }
                    }
                },
                newsletter: {
                    title: "📧 Bądź na bieżąco z trendami AI",
                    description: "Otrzymuj najnowsze artykuły, case studies i ekskluzywne wskazówki bezpośrednio na swoją skrzynkę",
                    placeholder: "Twój email",
                    subscribe: "Subskrybuj",
                    privacy: "🔒 Nie spamujemy. Możesz zrezygnować z subskrypcji w dowolnym momencie."
                },
                sections: {
                    services: { 
                        title: "Nasze Usługi",
                        subtitle: "Kompleksowe rozwiązania AI i automatyzacji, które transformują Twój biznes i zwiększają efektywność"
                    },
                    about: { title: "O ECM Digital" },
                    blog: {
                        title: "Blog & Insights",
                        subtitle: "Najnowsze trendy AI, case studies i praktyczne wskazówki dla Twojego biznesu"
                    },
                    team: { 
                        title: "Nasz Zespół", 
                        subtitle: "Poznaj ekspertów, którzy tworzą Twoje projekty",
                        members: {
                            tomasz: {
                                name: "Tomasz Gnat",
                                position: "Konsultant Discovery",
                                description: "Ekspert w odkrywaniu potrzeb biznesowych i strategii AI. Pomaga firmom identyfikować obszary do automatyzacji.",
                                skills: { businessAnalysis: "Business Analysis", aiStrategy: "AI Strategy" }
                            },
                            marta: {
                                name: "Marta Górska",
                                position: "Projektant UX/UI",
                                description: "Projektant skupiony na potrzebach użytkowników w erze AI. Tworzy interfejsy, które naturalnie łączą ludzi z technologią.",
                                skills: { uxResearch: "UX Research", aiUxDesign: "AI/UX Design" }
                            },
                            karol: {
                                name: "Karol Czechowski",
                                position: "QA & Deweloper AI",
                                description: "Specjalista w zapewnianiu jakości rozwiązań AI i testowaniu automatycznym. Gwarantuje niezawodność systemów.",
                                skills: { aiTesting: "AI Testing", qualityAssurance: "Quality Assurance" }
                            },
                            roman: {
                                name: "Roman Dominia",
                                position: "Specjalista Automatyzacji AI",
                                description: "Ekspert w automatyzacji procesów biznesowych z AI i analizie danych social media. Zwiększa efektywność operacyjną.",
                                skills: { processAutomation: "Process Automation", aiAnalytics: "AI Analytics" }
                            }
                        }
                    },
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
                company: {
                    name: "Scrum Software Sp. z o.o.",
                    description1: "ECM Digital działa w ramach Scrum Software Sp. z o.o., która jest formalnym właścicielem wszystkich świadczonych przez nas usług i prawnie odpowiedzialnym podmiotem.",
                    description2: "To Scrum Software Sp. z o.o. wystawia faktury i zawiera umowy z klientami, gwarantując pełną transparentność i bezpieczeństwo współpracy.",
                    badge: "Spółka Zarejestrowana<br>Sp. z o.o.",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "Projektów AI",
                        clientSatisfaction: "95%",
                        clientSatisfactionLabel: "Satysfakcja Klienta",
                        technicalSupport: "24/7",
                        technicalSupportLabel: "Wsparcie Techniczne",
                        yearFounded: "2019",
                        yearFoundedLabel: "Rok Założenia"
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
                    learnMore: "Learn More",
                    readMore: "Read more"
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
                        description: "Professional online stores on the Shopify platform that effectively sell and scale with your business.",
                        heroTitle: "Shopify & Wix Stores That Convert",
                        heroDescription: "We build professional e‑commerce stores on Shopify and Wix that turn visitors into customers. Custom design, advanced integrations and sales automation.",
                        stats: {
                            salesGrowth: "Sales Growth",
                            loadTime: "Load Time",
                            startPrice: "PLN Start"
                        },
                        features: {
                            title: "What You Get",
                            subtitle: "A complete e‑commerce solution on Shopify and Wix",
                            customDesign: {
                                title: "Custom Design",
                                description: "Unique design tailored to your brand and audience"
                            },
                            mobileFirst: {
                                title: "Mobile‑First",
                                description: "Optimized for mobile devices where 70% of purchases happen"
                            },
                            payments: {
                                title: "Payments & Shipping",
                                description: "Integrations with popular payment gateways and couriers"
                            },
                            analytics: {
                                title: "Analytics & Tracking",
                                description: "Google Analytics, Facebook Pixel, conversions and full sales tracking"
                            },
                            automation: {
                                title: "Automation",
                                description: "Email marketing, abandoned cart recovery, inventory management"
                            },
                            seo: {
                                title: "SEO & Marketing",
                                description: "Search engine optimization and marketing integrations"
                            }
                        },
                        process: {
                            title: "How We Build Shopify & Wix Stores",
                            subtitle: "End‑to‑end process from analysis to launch and growth"
                        }
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
                blog: {
                    aiTrends: {
                        category: "🤖 AI Trends",
                        title: "How AI is changing e-commerce in 2024?",
                        description: "Discover the latest AI trends for e-commerce: personalization, chatbots, product recommendations and sales process automation.",
                        readTime: "15 min read",
                        views: "2.5k views",
                        tags: {
                            ecommerce: "E-commerce",
                            ai: "AI",
                            trends: "Trends"
                        }
                    },
                    automation: {
                        category: "⚡ Automation",
                        title: "10 business processes to automate",
                        description: "Practical guide to processes worth automating first. Save time and money with AI.",
                        readTime: "12 min read",
                        views: "1.8k views",
                        tags: {
                            automation: "Automation",
                            process: "Process",
                            roi: "ROI"
                        }
                    }
                },
                newsletter: {
                    title: "📧 Stay up to date with AI trends",
                    description: "Receive the latest articles, case studies and exclusive tips directly to your inbox",
                    placeholder: "Your email",
                    subscribe: "Subscribe",
                    privacy: "🔒 We don't spam. You can unsubscribe at any time."
                },
                sections: {
                    services: { 
                        title: "Our Services",
                        subtitle: "Comprehensive AI and automation solutions that transform your business and increase efficiency"
                    },
                    about: { title: "About ECM Digital" },
                    blog: {
                        title: "Blog & Insights",
                        subtitle: "Latest AI trends, case studies and practical tips for your business"
                    },
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
                company: {
                    name: "Scrum Software Sp. z o.o.",
                    description1: "ECM Digital operates within Scrum Software Sp. z o.o., which is the formal owner of all services we provide and the legally responsible entity.",
                    description2: "It is Scrum Software Sp. z o.o. that issues invoices and enters into contracts with clients, guaranteeing full transparency and security of cooperation.",
                    badge: "Registered Company<br>Sp. z o.o.",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "AI Projects",
                        clientSatisfaction: "95%",
                        clientSatisfactionLabel: "Client Satisfaction",
                        technicalSupport: "24/7",
                        technicalSupportLabel: "Technical Support",
                        yearFounded: "2019",
                        yearFoundedLabel: "Year Founded"
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
                    learnMore: "Mehr erfahren",
                    readMore: "Weiterlesen"
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
                        description: "Professionelle Online‑Shops auf der Shopify‑Plattform, die effektiv verkaufen und mit Ihrem Unternehmen wachsen.",
                        heroTitle: "Shopify & Wix Shops, die konvertieren",
                        heroDescription: "Wir erstellen professionelle E‑Commerce‑Shops auf Shopify und Wix, die Besucher in Kunden verwandeln. Custom Design, erweiterte Integrationen und Verkaufsautomatisierung.",
                        stats: {
                            salesGrowth: "Umsatzwachstum",
                            loadTime: "Ladezeit",
                            startPrice: "PLN Start"
                        },
                        features: {
                            title: "Was Sie erhalten",
                            subtitle: "Komplette E‑Commerce‑Lösung auf Shopify und Wix",
                            customDesign: {
                                title: "Custom Design",
                                description: "Einzigartiges Design, abgestimmt auf Marke und Zielgruppe"
                            },
                            mobileFirst: {
                                title: "Mobile‑First",
                                description: "Optimiert für Mobilgeräte, wo 70% der Käufe stattfinden"
                            },
                            payments: {
                                title: "Zahlungen & Versand",
                                description: "Integrationen mit beliebten Zahlungsanbietern und Kurieren"
                            },
                            analytics: {
                                title: "Analytics & Tracking",
                                description: "Google Analytics, Facebook Pixel, Konversionen und vollständiges Sales‑Tracking"
                            },
                            automation: {
                                title: "Automatisierung",
                                description: "E‑Mail‑Marketing, Warenkorbabbruch‑Recovery, Lagerverwaltung"
                            },
                            seo: {
                                title: "SEO & Marketing",
                                description: "Suchmaschinenoptimierung und Marketing‑Integrationen"
                            }
                        },
                        process: {
                            title: "So bauen wir Shopify & Wix Shops",
                            subtitle: "Kompletter Prozess von Analyse bis Launch und Skalierung"
                        }
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
                blog: {
                    aiTrends: {
                        category: "🤖 KI-Trends",
                        title: "Wie KI den E-Commerce 2024 verändert?",
                        description: "Entdecken Sie die neuesten KI-Trends für E-Commerce: Personalisierung, Chatbots, Produktempfehlungen und Verkaufsprozessautomatisierung.",
                        readTime: "15 Min. Lesen",
                        views: "2.5k Aufrufe",
                        tags: {
                            ecommerce: "E-Commerce",
                            ai: "KI",
                            trends: "Trends"
                        }
                    },
                    automation: {
                        category: "⚡ Automatisierung",
                        title: "10 Geschäftsprozesse zu automatisieren",
                        description: "Praktischer Leitfaden zu Prozessen, die es sich lohnt, zuerst zu automatisieren. Sparen Sie Zeit und Geld mit KI.",
                        readTime: "12 Min. Lesen",
                        views: "1.8k Aufrufe",
                        tags: {
                            automation: "Automatisierung",
                            process: "Prozess",
                            roi: "ROI"
                        }
                    }
                },
                newsletter: {
                    title: "📧 Bleiben Sie auf dem Laufenden mit KI-Trends",
                    description: "Erhalten Sie die neuesten Artikel, Fallstudien und exklusive Tipps direkt in Ihren Posteingang",
                    placeholder: "Ihre E-Mail",
                    subscribe: "Abonnieren",
                    privacy: "🔒 Wir spammen nicht. Sie können sich jederzeit abmelden."
                },
                sections: {
                    services: { 
                        title: "Unsere Dienstleistungen",
                        subtitle: "Umfassende KI- und Automatisierungslösungen, die Ihr Unternehmen transformieren und die Effizienz steigern"
                    },
                    about: { title: "Über ECM Digital" },
                    blog: {
                        title: "Blog & Insights",
                        subtitle: "Neueste KI-Trends, Fallstudien und praktische Tipps für Ihr Unternehmen"
                    },
                    team: { 
                        title: "Unser Team", 
                        subtitle: "Lernen Sie die Experten kennen, die Ihre Projekte erstellen",
                        members: {
                            tomasz: {
                                name: "Tomasz Gnat",
                                position: "Discovery Consultant",
                                description: "Experte für die Entdeckung von Geschäftsanforderungen und digitale Strategie",
                                skills: {
                                    businessAnalysis: "Geschäftsanalyse",
                                    aiStrategy: "KI-Strategie"
                                }
                            },
                            marta: {
                                name: "Marta Górska",
                                position: "UX/UI Designer",
                                description: "Spezialistin für Benutzererfahrungsdesign",
                                skills: {
                                    uxResearch: "UX-Forschung",
                                    aiUxDesign: "KI/UX-Design"
                                }
                            },
                            karol: {
                                name: "Karol Czechowski",
                                position: "QA-Spezialist & Entwickler",
                                description: "Spezialist für Qualitätssicherung und Anwendungstests",
                                skills: {
                                    aiTesting: "KI-Tests",
                                    qualityAssurance: "Qualitätssicherung"
                                }
                            },
                            roman: {
                                name: "Roman Dominia",
                                position: "Social Media & Automatisierungsspezialist",
                                description: "Experte für Social Media und Geschäftsprozessautomatisierung",
                                skills: {
                                    processAutomation: "Prozessautomatisierung",
                                    aiAnalytics: "KI-Analytik"
                                }
                            }
                        }
                    },
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
                company: {
                    name: "Scrum Software Sp. z o.o.",
                    description1: "Die Marke ECM Digital operiert innerhalb der Scrum Software Sp. z o.o., die der formelle Eigentümer aller von uns bereitgestellten Dienstleistungen und die rechtlich verantwortliche Einheit ist.",
                    description2: "Es ist Scrum Software Sp. z o.o., die Rechnungen ausstellt und Verträge mit Kunden abschließt und vollständige Transparenz und Sicherheit der Zusammenarbeit garantiert.",
                    badge: "Registrierte Gesellschaft<br>Sp. z o.o.",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "KI-Projekte",
                        clientSatisfaction: "95%",
                        clientSatisfactionLabel: "Kundenzufriedenheit",
                        technicalSupport: "24/7",
                        technicalSupportLabel: "Technischer Support",
                        yearFounded: "2019",
                        yearFoundedLabel: "Gründungsjahr"
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
                    // If translation contains HTML (e.g., spans for colored text), set innerHTML
                    if (typeof translation === 'string' && translation.includes('<')) {
                        element.innerHTML = translation;
                    } else {
                        element.textContent = translation;
                    }
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
