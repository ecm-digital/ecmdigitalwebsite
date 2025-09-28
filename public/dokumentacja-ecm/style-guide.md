# 🎨 Style Guide - ECM Digital

## Brand Identity

### 🎯 Logo i Branding
```
ECM Digital
├── Logo: Nowoczesny, minimalistyczny
├── Tagline: "Tworzymy cyfrową przyszłość"
├── Kolory: Niebieski (#007AFF), Szary (#2C2C2E)
└── Font: Inter, SF Pro Display
```

### 🌈 Paleta Kolorów

#### Kolory Główne
```css
:root {
  /* Primary Colors */
  --primary-blue: #007AFF;
  --primary-dark: #0056CC;
  --primary-light: #409CFF;
  
  /* Secondary Colors */
  --accent-green: #30D158;
  --accent-orange: #FF9F0A;
  --accent-purple: #BF5AF2;
  --accent-pink: #FF2D92;
  
  /* Neutral Colors */
  --gray-900: #1C1C1E;
  --gray-800: #2C2C2E;
  --gray-700: #3A3A3C;
  --gray-600: #48484A;
  --gray-500: #636366;
  --gray-400: #8E8E93;
  --gray-300: #C7C7CC;
  --gray-200: #D1D1D6;
  --gray-100: #F2F2F7;
  --white: #FFFFFF;
}
```

#### Zastosowanie Kolorów
- **Niebieski (#007AFF)**: CTA, linki, akcenty
- **Zielony (#30D158)**: Sukces, pozytywne metryki
- **Pomarańczowy (#FF9F0A)**: Ostrzeżenia, ważne informacje
- **Fioletowy (#BF5AF2)**: Premium, zaawansowane funkcje
- **Różowy (#FF2D92)**: Kreatywność, design

### 📝 Typografia

#### Hierarchia Nagłówków
```css
/* H1 - Tytuły główne */
h1 {
  font-family: 'TT Hoves', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--gray-900);
}

/* H2 - Sekcje */
h2 {
  font-family: 'TT Hoves', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--gray-900);
}

/* H3 - Podsekcje */
h3 {
  font-family: 'TT Hoves', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--gray-800);
}

/* Body Text */
p {
  font-family: 'TT Hoves', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--gray-700);
}
```

#### Rozmiary Tekstu
- **Display**: 3rem+ (48px+)
- **H1**: 2.5rem (40px)
- **H2**: 2rem (32px)
- **H3**: 1.5rem (24px)
- **H4**: 1.25rem (20px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)
- **Caption**: 0.75rem (12px)

## 🧩 Komponenty UI

### 📦 Karty (Cards)
```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}
```

### 🔘 Przyciski (Buttons)
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-blue);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--primary-blue);
  border: 2px solid var(--primary-blue);
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--primary-blue);
  color: white;
}
```

### 🏷️ Badges i Tagi
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-success {
  background: rgba(48, 209, 88, 0.1);
  color: var(--accent-green);
}

.badge-warning {
  background: rgba(255, 159, 10, 0.1);
  color: var(--accent-orange);
}

.badge-info {
  background: rgba(0, 122, 255, 0.1);
  color: var(--primary-blue);
}
```

## 📐 Layout i Spacing

### 🔲 Grid System
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.grid {
  display: grid;
  gap: 24px;
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 768px) {
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
}
```

### 📏 Spacing Scale
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
}
```

## 🎭 Ikony i Grafika

### 📱 Ikony
- **Biblioteka**: Lucide React, Heroicons
- **Styl**: Outline, 24px domyślnie
- **Kolory**: Zgodne z paletą kolorów
- **Użycie**: Spójne znaczenia w całej dokumentacji

### 🖼️ Obrazy
- **Format**: WebP z fallback do PNG/JPG
- **Rozmiary**: Responsywne z srcset
- **Alt text**: Zawsze obecny dla dostępności
- **Lazy loading**: Dla lepszej wydajności

## 📱 Responsywność

### 📐 Breakpoints
```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Media Queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 📱 Mobile Optimizations
- Touch-friendly buttons (min 44px)
- Readable font sizes (min 16px)
- Adequate spacing for fingers
- Horizontal scrolling avoided

## 🎨 Animacje i Transitions

### ⚡ Micro-interactions
```css
/* Hover Effects */
.interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive:hover {
  transform: translateY(-2px);
}

/* Loading States */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}
```

### 🎬 Page Transitions
- Smooth scrolling
- Fade in animations
- Staggered loading
- Progressive enhancement

## 📊 Data Visualization

### 📈 Charts i Wykresy
```css
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.metric-card {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-light));
  color: white;
}

.metric-number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.metric-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 4px;
}
```

### 🎯 Progress Indicators
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-light));
  border-radius: 4px;
  transition: width 0.6s ease;
}
```

## 🌙 Dark Mode Support

### 🎨 Dark Theme Colors
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #000000;
    --bg-secondary: #1C1C1E;
    --bg-tertiary: #2C2C2E;
    
    --text-primary: #FFFFFF;
    --text-secondary: #EBEBF5;
    --text-tertiary: rgba(235, 235, 245, 0.6);
  }
  
  .card {
    background: var(--bg-secondary);
    border-color: var(--bg-tertiary);
  }
}
```

## ♿ Accessibility

### 🎯 WCAG 2.1 AA Compliance
```css
/* Focus States */
.focusable:focus {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* High Contrast */
@media (prefers-contrast: high) {
  .card {
    border-width: 2px;
  }
  
  .btn-primary {
    border: 2px solid transparent;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 🔤 Typography Accessibility
- Minimum 16px font size
- 4.5:1 contrast ratio
- 1.5 line height minimum
- No text in images

## 📝 Content Guidelines

### ✍️ Tone of Voice
- **Profesjonalny** ale przystępny
- **Ekspercki** bez żargonu
- **Pomocny** i wspierający
- **Konkretny** z przykładami

### 📋 Formatting Standards
- **Nagłówki**: Hierarchiczne (H1-H6)
- **Listy**: Numerowane lub punktowane
- **Linki**: Opisowe, nie "kliknij tutaj"
- **Obrazy**: Alt text zawsze obecny

### 🎯 Call-to-Action
```html
<!-- Dobry CTA -->
<a href="/kontakt" class="btn-primary">
  Umów bezpłatną konsultację
</a>

<!-- Zły CTA -->
<a href="/kontakt" class="btn-primary">
  Kliknij tutaj
</a>
```

## 🔧 Implementation

### 📦 CSS Framework
```css
/* Base Styles */


* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'TT Hoves', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--gray-700);
  background: var(--gray-100);
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-1 { margin-top: var(--space-xs); }
.mt-2 { margin-top: var(--space-sm); }
.mt-3 { margin-top: var(--space-md); }
.mt-4 { margin-top: var(--space-lg); }

.p-1 { padding: var(--space-xs); }
.p-2 { padding: var(--space-sm); }
.p-3 { padding: var(--space-md); }
.p-4 { padding: var(--space-lg); }
```

### 🎨 CSS Custom Properties
```css
/* Component Tokens */
:root {
  --card-padding: var(--space-lg);
  --card-radius: 12px;
  --card-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  --button-padding: 12px 24px;
  --button-radius: 8px;
  --button-font-weight: 600;
  
  --input-padding: 12px 16px;
  --input-radius: 8px;
  --input-border: 2px solid var(--gray-300);
}
```

## 📚 Resources

### 🎨 Design Tools
- **Figma**: Design system i prototypy
- **Adobe Creative Suite**: Grafika i ilustracje
- **Sketch**: UI design (alternatywa)

### 🔧 Development Tools
- **Tailwind CSS**: Utility-first framework
- **PostCSS**: CSS processing
- **Autoprefixer**: Browser compatibility
- **PurgeCSS**: Unused CSS removal

### 📖 Documentation
- [Design System Figma](https://figma.com/ecm-digital-design-system)
- [Component Library](https://storybook.ecm-digital.com)
- [Brand Guidelines PDF](https://brand.ecm-digital.com)

---

*Style Guide zapewnia spójność wizualną i funkcjonalną we wszystkich materiałach ECM Digital.* 🎨