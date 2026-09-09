"use client";

import { useState } from 'react';

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg fixed-top" role="navigation" aria-label="Główna nawigacja">
      <div className="container">
        <a className="navbar-brand font-display" href="#">
          <i className="fas fa-rocket me-2" style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #BF5AF2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}></i>
          <span style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #BF5AF2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700
          }}>ECM Digital</span>
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ border: 'none', background: 'none' }}
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <i className="fas fa-bars" style={{ color: '#FFFFFF !important', fontSize: '1.2rem' }}></i>
        </button>
        
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#home">Strona główna</a>
            </li>
            
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Usługi
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><h6 className="dropdown-header text-primary fw-bold">🤖 Rozwiązania AI</h6></li>
                <li><a className="dropdown-item" href="dokumentacja-ecm/oferta-uslug/asystencja-ai-bedrock/index.html">Asystenci AI na Amazon Bedrock</a></li>
                <li><a className="dropdown-item" href="dokumentacja-ecm/oferta-uslug/asystenci-glosowi-lex/index.html">Asystenci Głosowi na Amazon Lex</a></li>
                <li><a className="dropdown-item" href="dokumentacja-ecm/oferta-uslug/audyty-ux/index.html">Audyty Wdrożenia AI</a></li>
                <li><a className="dropdown-item" href="dokumentacja-ecm/oferta-uslug/social-media-data-science/index.html">Social Media & AI</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><h6 className="dropdown-header text-primary fw-bold">🌐 Produkty Cyfrowe</h6></li>
                <li><a className="dropdown-item" href="dokumentacja-ecm/oferta-uslug/strony-www/index.html">Strony WWW</a></li>
                <li><a className="dropdown-item" href="dokumentacja-ecm/oferta-uslug/sklepy-shopify/index.html">Sklepy Shopify & Wix</a></li>
                <li><a className="dropdown-item" href="dokumentacja-ecm/oferta-uslug/aplikacje-mobilne/index.html">Aplikacje Mobilne</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><h6 className="dropdown-header text-primary fw-bold">⚡ Automatyzacja & MVP</h6></li>
                <li><a className="dropdown-item" href="dokumentacja-ecm/oferta-uslug/automatyzacje-n8n/index.html">Automatyzacje N8N</a></li>
                <li><a className="dropdown-item" href="dokumentacja-ecm/oferta-uslug/prototypy-mvp/index.html">Prototypy MVP</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-center fw-bold" href="#services" style={{ color: 'var(--primary)' }}>
                  <i className="fas fa-eye me-2"></i>Zobacz wszystkie usługi
                </a></li>
              </ul>
            </li>
            
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="accountDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="fas fa-user me-2"></i>Moje Konto
              </a>
              <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                <li><h6 className="dropdown-header text-primary fw-bold">👤 Dostęp do systemów</h6></li>
                <li><a className="dropdown-item" href="/dashboard" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-tachometer-alt me-2"></i>Panel Klienta
                  <small className="text-muted d-block">Zarządzaj projektami i dokumentami</small>
                </a></li>
                <li><a className="dropdown-item" href="/agency-management-panel/" target="_blank">
                  <i className="fas fa-cogs me-2"></i>Panel Zarządzania
                  <small className="text-muted d-block">Administracja i zarządzanie agencją</small>
                </a></li>
                <li><hr className="dropdown-divider" /></li>
              </ul>
            </li>
          </ul>
          
          <div className="language-switcher dropdown">
            <button 
              className="btn btn-link dropdown-toggle" 
              type="button" 
              id="languageDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              🇵🇱 PL
            </button>
            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
              <li><a className="dropdown-item lang-btn active" href="#" data-lang="pl">🇵🇱 Polski</a></li>
              <li><a className="dropdown-item lang-btn" href="#" data-lang="en">🇺🇸 English</a></li>
              <li><a className="dropdown-item lang-btn" href="#" data-lang="de">🇩🇪 Deutsch</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}