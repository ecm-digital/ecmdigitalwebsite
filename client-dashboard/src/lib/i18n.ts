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
        completed: 'Ukończone',
        budget: 'Budżet',
        averageProgress: 'Średni Postęp',
        allProjects: 'wszystkich',
        completedProjects: 'projektów zakończonych',
        utilized: 'wykorzystane',
        allProjectsProgress: 'wszystkich projektów'
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
        analytics: 'Analityka',
        settings: 'Ustawienia'
      },
      status: {
        online: 'Online'
      }
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
        completed: 'Completed',
        budget: 'Budget',
        averageProgress: 'Average Progress',
        allProjects: 'of all',
        completedProjects: 'projects completed',
        utilized: 'utilized',
        allProjectsProgress: 'of all projects'
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
        analytics: 'Analytics',
        settings: 'Settings'
      },
      status: {
        online: 'Online'
      }
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