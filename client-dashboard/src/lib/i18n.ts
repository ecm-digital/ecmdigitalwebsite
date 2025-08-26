export const translations = {
  pl: {
    // Login page
    login: {
      title: 'Panel Klienta',
      subtitle: 'ECM Digital',
      description: 'Kompleksowe narzędzie do zarządzania projektami cyfrowymi. Wszystko czego potrzebujesz w jednym miejscu.',
      loginButton: 'Zaloguj się',
      loginDescription: 'Wprowadź swoje dane, aby uzyskać dostęp do panelu',
      email: 'Adres email',
      password: 'Hasło',
      emailPlaceholder: 'twoj@email.com',
      passwordPlaceholder: '••••••••',
      loggingIn: 'Logowanie...',
      noAccount: 'Nie masz konta?',
      contactUs: 'Skontaktuj się z nami',
      secureLogin: 'Bezpieczne logowanie chronione szyfrowaniem SSL',
      features: {
        projectManagement: {
          title: 'Zarządzanie Projektami',
          description: 'Śledź postęp swoich projektów w czasie rzeczywistym'
        },
        communication: {
          title: 'Komunikacja Real-time',
          description: 'Bezpośredni kontakt z zespołem projektowym'
        },
        documents: {
          title: 'Biblioteka Dokumentów',
          description: 'Wszystkie pliki projektowe w jednym miejscu'
        },
        invoices: {
          title: 'Faktury i Płatności',
          description: 'Przejrzyste rozliczenia i historia płatności'
        },
        analytics: {
          title: 'Analityka i Raporty',
          description: 'Szczegółowe metryki wydajności projektów'
        },
        calendar: {
          title: 'Harmonogram',
          description: 'Kalendarz spotkań i kamieni milowych'
        }
      },
      security: {
        secure: 'Bezpieczne i szyfrowane połączenie',
        gdpr: 'Zgodność z RODO i najwyższymi standardami',
        realtime: 'Aktualizacje w czasie rzeczywistym'
      }
    },
    // Dashboard
    dashboard: {
      welcome: 'Witaj',
      overview: 'Oto przegląd Twoich projektów i aktywności',
      stats: {
        activeProjects: 'Aktywne Projekty',
        activeProjectsDesc: 'projektów w trakcie realizacji',
        completed: 'Ukończone',
        completedProjects: 'projektów zakończonych',
        completedProjectsDesc: 'projektów zakończonych',
        budget: 'Budżet',
        totalBudget: 'Całkowity Budżet',
        totalBudgetDesc: 'całkowity budżet projektów',
        averageProgress: 'Średni Postęp',
        unreadMessages: 'Nieprzeczytane Wiadomości',
        unreadMessagesDesc: 'nieprzeczytanych wiadomości',
        allProjects: 'wszystkich',
        utilized: 'wykorzystane',
        allProjectsProgress: 'wszystkich projektów'
      },
      budget: {
        title: 'Postęp Budżetu',
        description: 'Śledź wykorzystanie budżetu w projektach',
        used: 'Wykorzystane',
        total: 'Całkowity'
      },
      recentProjects: {
        title: 'Ostatnie Projekty',
        description: 'Twoje najnowsze projekty i ich status'
      },
      quickActions: {
        title: 'Szybkie Akcje',
        description: 'Najczęściej używane funkcje',
        newProject: 'Nowy Projekt',
        newProjectDesc: 'Utwórz nowy projekt cyfrowy',
        sendMessage: 'Wyślij Wiadomość',
        sendMessageDesc: 'Skontaktuj się z zespołem',
        uploadDocument: 'Dodaj Dokument',
        uploadDocumentDesc: 'Prześlij plik do projektu'
      },
      sections: {
        recentProjects: 'Ostatnie Projekty',
        recentProjectsDesc: 'Twoje najnowsze projekty i ich status',
        quickActions: 'Szybkie Akcje',
        quickActionsDesc: 'Najczęściej używane funkcje'
      },
      actions: {
        messages: 'Wiadomości',
        documents: 'Dokumenty',
        calendar: 'Kalendarz',
        invoices: 'Faktury'
      },
      navigation: {
        dashboard: 'Dashboard',
        projects: 'Projekty',
        communication: 'Komunikacja',
        documents: 'Dokumenty',
        invoices: 'Faktury',
        calendar: 'Kalendarz',
        analytics: 'Analityka',
        settings: 'Ustawienia'
      },
      status: {
        online: 'Online'
      }
    },
    // AI Assistant
    aiAssistant: {
      title: 'AI Asystent',
      subtitle: 'Inteligentny asystent do obsługi projektów',
      welcome: 'Cześć! Jestem Twoim AI asystentem. Mogę pomóc Ci w sprawach związanych z projektem. Jak mogę Ci dzisiaj pomóc?',
      quickActions: {
        status: 'Status Projektu',
        statusDesc: 'Sprawdź postęp i status',
        faq: 'Częste Pytania',
        faqDesc: 'Odpowiedzi na popularne pytania',
        task: 'Moje Zadania',
        taskDesc: 'Co muszę przygotować',
        contact: 'Kontakt Zespołu',
        contactDesc: 'Porozmawiaj z developerem'
      },
      projectStatus: {
        name: 'E-commerce Platform',
        progress: 'Postęp',
        status: 'Status',
        nextMilestone: 'Następny kamień milowy',
        team: 'Zespół'
      },
      messages: {
        placeholder: 'Wpisz wiadomość...',
        send: 'Wyślij',
        loading: 'AI myśli...',
        error: 'Wystąpił błąd. Spróbuj ponownie.'
      },
      responses: {
        status: 'Twój projekt "E-commerce Platform" ma postęp 75% i status "W trakcie". Następny kamień milowy to 15 lutego 2025. Zespół: Anna Kowalska, Piotr Wiśniewski.',
        faq: 'Oto najczęściej zadawane pytania:\n\n1. Jak sprawdzić postęp projektu?\n2. Gdzie znaleźć dokumenty?\n3. Jak skontaktować się z zespołem?\n4. Kiedy następne spotkanie?\n\nKtóre pytanie Cię interesuje?',
        task: 'Twoje zadania do przygotowania:\n\n1. Materiały referencyjne - do 20 stycznia\n2. Feedback do mockupów - do 25 stycznia\n3. Zatwierdzenie finalnej wersji - do 30 stycznia\n\nCzy chcesz, żebym przypomniał Ci o którymś z zadań?',
        contact: 'Mogę połączyć Cię z zespołem:\n\n- Anna Kowalska (Project Manager)\n- Piotr Wiśniewski (Lead Developer)\n- Marta Nowak (UX Designer)\n\nKogo chcesz skontaktować?'
      }
    },
    // Projects
    projects: {
      title: 'Projekty',
      subtitle: 'Zarządzaj swoimi projektami cyfrowymi',
      search: 'Szukaj projektów...',
      filters: {
        status: 'Status',
        type: 'Typ',
        allStatuses: 'Wszystkie statusy',
        allTypes: 'Wszystkie typy'
      },
      status: {
        discovery: 'Analiza',
        design: 'Projektowanie',
        development: 'Rozwój',
        testing: 'Testowanie',
        completed: 'Ukończone',
        onHold: 'Wstrzymane'
      },
      types: {
        website: 'Strona WWW',
        shopify: 'Sklep Shopify',
        mvp: 'Prototyp MVP',
        uxAudit: 'Audyt UX',
        automation: 'Automatyzacja',
        socialMedia: 'Social Media'
      },
      actions: {
        create: 'Nowy Projekt',
        view: 'Zobacz Szczegóły',
        edit: 'Edytuj',
        delete: 'Usuń'
      },
      form: {
        name: 'Nazwa projektu',
        description: 'Opis',
        type: 'Typ projektu',
        status: 'Status',
        budget: 'Budżet',
        deadline: 'Termin',
        submit: 'Utwórz Projekt',
        creating: 'Tworzenie...'
      }
    },
    // Messages
    messages: {
      title: 'Wiadomości',
      subtitle: 'Komunikacja z zespołem projektowym',
      newMessage: 'Nowa Wiadomość',
      search: 'Szukaj wiadomości...',
      compose: 'Napisz Wiadomość',
      form: {
        to: 'Do',
        subject: 'Temat',
        message: 'Wiadomość',
        send: 'Wyślij',
        sending: 'Wysyłanie...'
      },
      status: {
        unread: 'Nieprzeczytane',
        read: 'Przeczytane',
        sent: 'Wysłane'
      }
    },
    // Documents
    documents: {
      title: 'Dokumenty',
      subtitle: 'Biblioteka plików projektowych',
      upload: 'Dodaj Dokument',
      search: 'Szukaj dokumentów...',
      categories: {
        contracts: 'Umowy',
        designs: 'Projekty',
        reports: 'Raporty',
        invoices: 'Faktury',
        other: 'Inne'
      },
      actions: {
        download: 'Pobierz',
        preview: 'Podgląd',
        delete: 'Usuń'
      }
    },
    // Invoices
    invoices: {
      title: 'Faktury',
      subtitle: 'Historia płatności i rozliczeń',
      search: 'Szukaj faktur...',
      status: {
        paid: 'Opłacone',
        pending: 'Oczekujące',
        overdue: 'Przeterminowane'
      },
      actions: {
        download: 'Pobierz PDF',
        pay: 'Zapłać',
        view: 'Zobacz Szczegóły'
      }
    },
    // Calendar
    calendar: {
      title: 'Kalendarz',
      subtitle: 'Harmonogram spotkań i kamieni milowych',
      today: 'Dzisiaj',
      week: 'Tydzień',
      month: 'Miesiąc',
      newEvent: 'Nowe Wydarzenie',
      form: {
        title: 'Tytuł',
        date: 'Data',
        time: 'Czas',
        description: 'Opis',
        save: 'Zapisz'
      }
    },
    // Analytics
    analytics: {
      title: 'Analityka',
      subtitle: 'Metryki i raporty projektów',
      overview: 'Przegląd',
      performance: 'Wydajność',
      budget: 'Budżet',
      timeline: 'Harmonogram',
      export: 'Eksportuj Raport'
    },
    // Settings
    settings: {
      title: 'Ustawienia',
      subtitle: 'Konfiguracja konta i preferencji',
      profile: 'Profil',
      notifications: 'Powiadomienia',
      security: 'Bezpieczeństwo',
      language: 'Język',
      theme: 'Motyw',
      save: 'Zapisz Zmiany'
    },
    // Chatbot
    chatbot: {
      title: 'AI Asystent ECM Digital',
      subtitle: 'Pomoc i konsultacje',
      welcome: 'Witaj w AI Asystencie!',
      description: 'Jestem tutaj, aby pomóc Ci z usługami ECM Digital',
      features: {
        text: '💬 Możesz pisać wiadomości tekstowe',
        voiceInput: '🎤 Możesz również używać mikrofonu do rozmowy głosowej',
        voiceOutput: '🔊 Bot może odpowiadać głosowo (możesz wyłączyć dźwięk)'
      },
      status: {
        online: 'Online',
        listening: '🎤 Słucham... Mów teraz!',
        processing: 'Przetwarzanie...',
        muted: 'Wyciszony'
      },
      buttons: {
        messages: 'Wiadomości',
        aiAssistant: 'AI Asystent',
        mute: 'Wycisz dźwięk',
        unmute: 'Włącz dźwięk',
        voiceInput: 'Nagraj głos',
        send: 'Wyślij'
      },
      errors: {
        noSpeech: 'Nie wykryto mowy. Spróbuj ponownie.',
        noMicrophone: 'Brak dostępu do mikrofonu. Sprawdź uprawnienia.',
        microphoneBlocked: 'Dostęp do mikrofonu zabroniony. Zezwól na dostęp w ustawieniach przeglądarki.',
        network: 'Problem z siecią. Sprawdź połączenie internetowe.',
        speechNotSupported: 'Rozpoznawanie mowy nie jest dostępne w tej przeglądarce',
        speechError: 'Wystąpił błąd z rozpoznawaniem mowy.'
      },
      placeholder: 'Napisz wiadomość lub użyj mikrofonu...'
    }
  },
  en: {
    // Login page
    login: {
      title: 'Client Portal',
      subtitle: 'ECM Digital',
      description: 'Comprehensive digital project management tool. Everything you need in one place.',
      loginButton: 'Sign In',
      loginDescription: 'Enter your credentials to access the portal',
      email: 'Email address',
      password: 'Password',
      emailPlaceholder: 'your@email.com',
      passwordPlaceholder: '••••••••',
      loggingIn: 'Signing in...',
      noAccount: "Don't have an account?",
      contactUs: 'Contact us',
      secureLogin: 'Secure login protected by SSL encryption',
      features: {
        projectManagement: {
          title: 'Project Management',
          description: 'Track your project progress in real-time'
        },
        communication: {
          title: 'Real-time Communication',
          description: 'Direct contact with the project team'
        },
        documents: {
          title: 'Document Library',
          description: 'All project files in one place'
        },
        invoices: {
          title: 'Invoices & Payments',
          description: 'Transparent billing and payment history'
        },
        analytics: {
          title: 'Analytics & Reports',
          description: 'Detailed project performance metrics'
        },
        calendar: {
          title: 'Schedule',
          description: 'Meeting calendar and milestones'
        }
      },
      security: {
        secure: 'Secure and encrypted connection',
        gdpr: 'GDPR compliant with highest standards',
        realtime: 'Real-time updates'
      }
    },
    // Dashboard
    dashboard: {
      welcome: 'Welcome',
      overview: 'Here\'s an overview of your projects and activity',
      stats: {
        activeProjects: 'Active Projects',
        activeProjectsDesc: 'projects in progress',
        completed: 'Completed',
        completedProjects: 'projects completed',
        completedProjectsDesc: 'projects completed',
        budget: 'Budget',
        totalBudget: 'Total Budget',
        totalBudgetDesc: 'total project budget',
        averageProgress: 'Average Progress',
        unreadMessages: 'Unread Messages',
        unreadMessagesDesc: 'unread messages',
        allProjects: 'of all',
        utilized: 'utilized',
        allProjectsProgress: 'of all projects'
      },
      budget: {
        title: 'Budget Progress',
        description: 'Track budget utilization in projects',
        used: 'Used',
        total: 'Total'
      },
      recentProjects: {
        title: 'Recent Projects',
        description: 'Your latest projects and their status'
      },
      quickActions: {
        title: 'Quick Actions',
        description: 'Most frequently used features',
        newProject: 'New Project',
        newProjectDesc: 'Create a new digital project',
        sendMessage: 'Send Message',
        sendMessageDesc: 'Contact the team',
        uploadDocument: 'Upload Document',
        uploadDocumentDesc: 'Upload file to project'
      },
      sections: {
        recentProjects: 'Recent Projects',
        recentProjectsDesc: 'Your latest projects and their status',
        quickActions: 'Quick Actions',
        quickActionsDesc: 'Most frequently used features'
      },
      actions: {
        messages: 'Messages',
        documents: 'Documents',
        calendar: 'Calendar',
        invoices: 'Invoices'
      },
      navigation: {
        dashboard: 'Dashboard',
        projects: 'Projects',
        communication: 'Communication',
        documents: 'Documents',
        invoices: 'Invoices',
        calendar: 'Calendar',
        analytics: 'Analytics',
        settings: 'Settings'
      },
      status: {
        online: 'Online'
      }
    },
    // AI Assistant
    aiAssistant: {
      title: 'AI Assistant',
      subtitle: 'Intelligent project management assistant',
      welcome: 'Hello! I\'m your AI assistant. I can help you with project-related matters. How can I help you today?',
      quickActions: {
        status: 'Project Status',
        statusDesc: 'Check progress and status',
        faq: 'Frequently Asked Questions',
        faqDesc: 'Answers to popular questions',
        task: 'My Tasks',
        taskDesc: 'What I need to prepare',
        contact: 'Team Contact',
        contactDesc: 'Talk to the developer'
      },
      projectStatus: {
        name: 'E-commerce Platform',
        progress: 'Progress',
        status: 'Status',
        nextMilestone: 'Next milestone',
        team: 'Team'
      },
      messages: {
        placeholder: 'Type your message...',
        send: 'Send',
        loading: 'AI is thinking...',
        error: 'An error occurred. Please try again.'
      },
      responses: {
        status: 'Your project "E-commerce Platform" has 75% progress and status "In Progress". Next milestone is February 15, 2025. Team: Anna Kowalska, Piotr Wiśniewski.',
        faq: 'Here are the most frequently asked questions:\n\n1. How to check project progress?\n2. Where to find documents?\n3. How to contact the team?\n4. When is the next meeting?\n\nWhich question interests you?',
        task: 'Your tasks to prepare:\n\n1. Reference materials - by January 20\n2. Feedback on mockups - by January 25\n3. Final version approval - by January 30\n\nWould you like me to remind you about any of these tasks?',
        contact: 'I can connect you with the team:\n\n- Anna Kowalska (Project Manager)\n- Piotr Wiśniewski (Lead Developer)\n- Marta Nowak (UX Designer)\n\nWho would you like to contact?'
      }
    },
    // Projects
    projects: {
      title: 'Projects',
      subtitle: 'Manage your digital projects',
      search: 'Search projects...',
      filters: {
        status: 'Status',
        type: 'Type',
        allStatuses: 'All statuses',
        allTypes: 'All types'
      },
      status: {
        discovery: 'Discovery',
        design: 'Design',
        development: 'Development',
        testing: 'Testing',
        completed: 'Completed',
        onHold: 'On Hold'
      },
      types: {
        website: 'Website',
        shopify: 'Shopify Store',
        mvp: 'MVP Prototype',
        uxAudit: 'UX Audit',
        automation: 'Automation',
        socialMedia: 'Social Media'
      },
      actions: {
        create: 'New Project',
        view: 'View Details',
        edit: 'Edit',
        delete: 'Delete'
      },
      form: {
        name: 'Project name',
        description: 'Description',
        type: 'Project type',
        status: 'Status',
        budget: 'Budget',
        deadline: 'Deadline',
        submit: 'Create Project',
        creating: 'Creating...'
      }
    },
    // Messages
    messages: {
      title: 'Messages',
      subtitle: 'Communication with the project team',
      newMessage: 'New Message',
      search: 'Search messages...',
      compose: 'Compose Message',
      form: {
        to: 'To',
        subject: 'Subject',
        message: 'Message',
        send: 'Send',
        sending: 'Sending...'
      },
      status: {
        unread: 'Unread',
        read: 'Read',
        sent: 'Sent'
      }
    },
    // Documents
    documents: {
      title: 'Documents',
      subtitle: 'Project files library',
      upload: 'Upload Document',
      search: 'Search documents...',
      categories: {
        contracts: 'Contracts',
        designs: 'Designs',
        reports: 'Reports',
        invoices: 'Invoices',
        other: 'Other'
      },
      actions: {
        download: 'Download',
        preview: 'Preview',
        delete: 'Delete'
      }
    },
    // Invoices
    invoices: {
      title: 'Invoices',
      subtitle: 'Payment history and billing',
      search: 'Search invoices...',
      status: {
        paid: 'Paid',
        pending: 'Pending',
        overdue: 'Overdue'
      },
      actions: {
        download: 'Download PDF',
        pay: 'Pay',
        view: 'View Details'
      }
    },
    // Calendar
    calendar: {
      title: 'Calendar',
      subtitle: 'Meeting schedule and milestones',
      today: 'Today',
      week: 'Week',
      month: 'Month',
      newEvent: 'New Event',
      form: {
        title: 'Title',
        date: 'Date',
        time: 'Time',
        description: 'Description',
        save: 'Save'
      }
    },
    // Analytics
    analytics: {
      title: 'Analytics',
      subtitle: 'Project metrics and reports',
      overview: 'Overview',
      performance: 'Performance',
      budget: 'Budget',
      timeline: 'Timeline',
      export: 'Export Report'
    },
    // Settings
    settings: {
      title: 'Settings',
      subtitle: 'Account configuration and preferences',
      profile: 'Profile',
      notifications: 'Notifications',
      security: 'Security',
      language: 'Language',
      theme: 'Theme',
      save: 'Save Changes'
    },
    // Chatbot
    chatbot: {
      title: 'AI Assistant ECM Digital',
      subtitle: 'Help and consultations',
      welcome: 'Welcome to AI Assistant!',
      description: 'I\'m here to help you with ECM Digital services',
      features: {
        text: '💬 You can write text messages',
        voiceInput: '🎤 You can also use microphone for voice conversation',
        voiceOutput: '🔊 Bot can respond with voice (you can mute the sound)'
      },
      status: {
        online: 'Online',
        listening: '🎤 Listening... Speak now!',
        processing: 'Processing...',
        muted: 'Muted'
      },
      buttons: {
        messages: 'Messages',
        aiAssistant: 'AI Assistant',
        mute: 'Mute sound',
        unmute: 'Unmute sound',
        voiceInput: 'Record voice',
        send: 'Send'
      },
      errors: {
        noSpeech: 'No speech detected. Please try again.',
        noMicrophone: 'No microphone access. Please check permissions.',
        microphoneBlocked: 'Microphone access blocked. Please allow access in browser settings.',
        network: 'Network problem. Please check your internet connection.',
        speechNotSupported: 'Speech recognition is not available in this browser',
        speechError: 'Speech recognition error occurred.'
      },
      placeholder: 'Type a message or use microphone...'
    }
  }
}

export type Language = 'pl' | 'en'
export type TranslationKey = keyof typeof translations.pl

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}