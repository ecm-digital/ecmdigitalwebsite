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