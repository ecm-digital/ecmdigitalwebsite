import { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Panel Klienta - ECM Digital',
  description: 'Dashboard do zarządzania projektami ECM Digital',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative flex min-h-screen">
        {/* Left Side - Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-12">
          <div className="max-w-lg">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Panel Klienta
                <span className="block text-blue-400">ECM Digital</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Kompleksowe narzędzie do zarządzania projektami cyfrowymi. 
                Wszystko czego potrzebujesz w jednym miejscu.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Bezpieczne i szyfrowane połączenie</span>
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Zgodność z RODO i najwyższymi standardami</span>
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Aktualizacje w czasie rzeczywistym</span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="group">
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors">
                      Zarządzanie Projektami
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Śledź postęp swoich projektów w czasie rzeczywistym
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors">
                      Komunikacja Real-time
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Bezpośredni kontakt z zespołem projektowym
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors">
                      Biblioteka Dokumentów
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Wszystkie pliki projektowe w jednym miejscu
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors">
                      Faktury i Płatności
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Przejrzyste rozliczenia i historia płatności
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <div className="flex justify-end mb-6">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex rounded-lg bg-slate-800/50 p-1">
                  <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md">
                    PL
                  </button>
                  <button className="px-3 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-700 rounded-md">
                    EN
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Zaloguj się</h2>
                <p className="text-sm text-slate-300 mt-1">
                  Wprowadź swoje dane, aby uzyskać dostęp do panelu
                </p>
              </div>

              <LoginForm />

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Nie masz konta?{' '}
                  <button className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Skontaktuj się z nami
                  </button>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-500 text-center">
                  Bezpieczne logowanie chronione szyfrowaniem SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}