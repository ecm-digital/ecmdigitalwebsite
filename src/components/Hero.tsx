"use client";

export default function Hero() {
  return (
    <section 
      id="home" 
      className="hero" 
      aria-labelledby="hero-title" 
      style={{ 
        padding: '120px 0', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center' 
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h1 
            id="hero-title" 
            className="hero-title mb-4" 
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #BF5AF2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '2rem'
            }}
          >
            Wdrażamy AI w Twojej Firmie
          </h1>
          
          <p 
            className="hero-subtitle mb-5" 
            style={{
              fontSize: '1.3rem',
              color: '#EBEBF599',
              maxWidth: '700px',
              margin: '0 auto 3rem auto',
              lineHeight: 1.6
            }}
          >
            Transformujemy Twoją firmę dzięki sztucznej inteligencji. Od chatbotów po zaawansowane automatyzacje - 
            AI, które naprawdę działa i generuje realne korzyści biznesowe.
          </p>
          
          <div className="hero-visual mb-5">
            <div className="hero-icon-container">
              <i 
                className="fas fa-rocket hero-main-icon" 
                style={{
                  fontSize: '6rem',
                  background: 'linear-gradient(135deg, #007AFF 0%, #BF5AF2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              ></i>
              <div className="hero-glow"></div>
            </div>
          </div>
        </div>
        
        {/* Hero Stats */}
        <div className="row g-4 justify-content-center">
          <div className="col-lg-3 col-md-6">
            <div className="hero-stat-card text-center">
              <div className="stat-icon">🤖</div>
              <div className="stat-number">6+</div>
              <div className="stat-label">Projektów AI</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="hero-stat-card text-center">
              <div className="stat-icon">⚡</div>
              <div className="stat-number">70%</div>
              <div className="stat-label">Redukcja Kosztów</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="hero-stat-card text-center">
              <div className="stat-icon">🚀</div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Wsparcie</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="hero-stat-card text-center">
              <div className="stat-icon">📈</div>
              <div className="stat-number">95%</div>
              <div className="stat-label">Satysfakcja</div>
            </div>
          </div>
        </div>

        <div id="loading-message" className="sr-only">Trwa ładowanie, proszę czekać</div>
      </div>
    </section>
  );
}