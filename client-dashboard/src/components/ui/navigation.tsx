'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavigationProps {
  user?: {
    name: string
    email: string
  } | null
  onLogout?: () => void
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    router.push('/auth/login')
  }

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{
      background: 'var(--bg-secondary)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--separator)',
      zIndex: 1050
    }}>
      <div className="container">
        {/* Logo */}
        <Link href="/" className="navbar-brand font-display d-flex align-items-center" style={{
          textDecoration: 'none',
          fontWeight: '700'
        }}>
          <i className="fas fa-rocket me-2" style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #BF5AF2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '1.2rem'
          }}></i>
          <span style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #BF5AF2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>ECM Digital</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleMenu}
          style={{
            background: 'none',
            color: 'var(--text-primary)'
          }}
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars" style={{ fontSize: '1.2rem' }}></i>
        </button>

        {/* Navigation Menu */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Main Navigation Links */}
            <li className="nav-item">
              <Link href="/" className="nav-link" style={{
                color: 'var(--text-secondary)',
                transition: 'color 0.3s ease'
              }}>
                <i className="fas fa-home me-1"></i>
                Strona Główna
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="servicesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  color: 'var(--text-secondary)',
                  transition: 'color 0.3s ease'
                }}
              >
                <i className="fas fa-briefcase me-1"></i>
                Usługi
              </a>
              <ul className="dropdown-menu" aria-labelledby="servicesDropdown" style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--separator)',
                borderRadius: '0.75rem',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '280px'
              }}>
                <li><h6 className="dropdown-header text-primary fw-bold">🤖 Rozwiązania AI</h6></li>
                <li><a className="dropdown-item" href="/dokumentacja-ecm/oferta-uslug/asystencja-ai-bedrock/">
                  Asystenci AI na Amazon Bedrock
                </a></li>
                <li><a className="dropdown-item" href="/dokumentacja-ecm/oferta-uslug/asystenci-glosowi-lex/">
                  Asystenci Głosowi na Amazon Lex
                </a></li>
                <li><a className="dropdown-item" href="/dokumentacja-ecm/oferta-uslug/audyty-ux/">
                  Audyty Wdrożenia AI
                </a></li>
                <li><a className="dropdown-item" href="/dokumentacja-ecm/oferta-uslug/social-media-data-science/">
                  Social Media & AI
                </a></li>
                <li><hr className="dropdown-divider" style={{ borderColor: 'var(--separator)' }} /></li>
                <li><h6 className="dropdown-header text-primary fw-bold">🌐 Produkty Cyfrowe</h6></li>
                <li><a className="dropdown-item" href="/dokumentacja-ecm/oferta-uslug/strony-www/">
                  Strony WWW
                </a></li>
                <li><a className="dropdown-item" href="/dokumentacja-ecm/oferta-uslug/sklepy-shopify/">
                  Sklepy Shopify
                </a></li>
                <li><a className="dropdown-item" href="/dokumentacja-ecm/oferta-uslug/aplikacje-mobilne/">
                  Aplikacje Mobilne
                </a></li>
                <li><hr className="dropdown-divider" style={{ borderColor: 'var(--separator)' }} /></li>
                <li><h6 className="dropdown-header text-primary fw-bold">⚡ Automatyzacja & MVP</h6></li>
                <li><a className="dropdown-item" href="/dokumentacja-ecm/oferta-uslug/automatyzacje-n8n/">
                  Automatyzacje N8N
                </a></li>
                <li><a className="dropdown-item" href="/dokumentacja-ecm/oferta-uslug/prototypy-mvp/">
                  Prototypy MVP
                </a></li>
              </ul>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#about-us" style={{
                color: 'var(--text-secondary)',
                transition: 'color 0.3s ease'
              }}>
                <i className="fas fa-users me-1"></i>
                O nas
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#case-studies" style={{
                color: 'var(--text-secondary)',
                transition: 'color 0.3s ease'
              }}>
                <i className="fas fa-chart-line me-1"></i>
                Case Studies
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#contact" style={{
                color: 'var(--text-secondary)',
                transition: 'color 0.3s ease'
              }}>
                <i className="fas fa-envelope me-1"></i>
                Kontakt
              </a>
            </li>

            {/* User Menu */}
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: '500'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-semibold me-2">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="d-none d-lg-inline">{user.name}</span>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--separator)',
                  borderRadius: '0.75rem',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: '200px'
                }}>
                  <li><h6 className="dropdown-header">{user.email}</h6></li>
                  <li><hr className="dropdown-divider" style={{ borderColor: 'var(--separator)' }} /></li>
                  <li><Link className="dropdown-item" href="/dashboard">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                  </Link></li>
                  <li><Link className="dropdown-item" href="/dashboard/settings">
                    <i className="fas fa-cog me-2"></i>
                    Ustawienia
                  </Link></li>
                  <li><hr className="dropdown-divider" style={{ borderColor: 'var(--separator)' }} /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Wyloguj się
                  </button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link href="/auth/login" className="btn btn-primary ms-3" style={{
                  background: 'linear-gradient(135deg, #007AFF 0%, #BF5AF2 100%)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '0.5rem 1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-sign-in-alt"></i>
                  Zaloguj się
                </Link>
              </li>
            )}

            {/* Language Switcher */}
            <li className="nav-item ms-2">
              <div className="dropdown">
                <button
                  className="btn btn-link dropdown-toggle"
                  type="button"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none'
                  }}
                >
                  🇵🇱 PL
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown" style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--separator)',
                  borderRadius: '0.75rem'
                }}>
                  <li><a className="dropdown-item active" href="#" data-lang="pl">🇵🇱 Polski</a></li>
                  <li><a className="dropdown-item" href="#" data-lang="en">🇺🇸 English</a></li>
                  <li><a className="dropdown-item" href="#" data-lang="de">🇩🇪 Deutsch</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .navbar-brand:hover {
          transform: translateY(-1px);
          transition: transform 0.3s ease;
        }

        .nav-link:hover {
          color: var(--text-primary) !important;
          transform: translateY(-1px);
          transition: all 0.3s ease;
        }

        .dropdown-menu {
          animation: fadeIn 0.2s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item {
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: var(--bg-quaternary);
          color: var(--text-primary);
          transform: translateX(5px);
        }

        .dropdown-header {
          color: var(--primary);
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          transition: all 0.3s ease;
        }

        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: var(--bg-secondary);
            border-radius: 0.75rem;
            margin-top: 1rem;
            padding: 1rem;
            border: 1px solid var(--separator);
          }

          .navbar-nav {
            text-align: center;
          }

          .nav-item {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </nav>
  )
}
