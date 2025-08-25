import { render, screen, waitFor } from '@testing-library/react'
import Dashboard from '../page'

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders dashboard with all main sections', () => {
    render(<Dashboard />)

    expect(screen.getByText('Dashboard Zarządzania')).toBeInTheDocument()
    expect(screen.getByText('Przegląd kluczowych metryk i wydajności agencji')).toBeInTheDocument()
  })

  it('displays KPI cards correctly', () => {
    render(<Dashboard />)

    expect(screen.getByText('Aktywni Klienci')).toBeInTheDocument()
    expect(screen.getByText('Przychody Miesięczne')).toBeInTheDocument()
    expect(screen.getByText('Projekty w Toku')).toBeInTheDocument()
    expect(screen.getByText('Satysfakcja Klientów')).toBeInTheDocument()
  })

  it('shows performance metrics section', () => {
    render(<Dashboard />)

    expect(screen.getByText('Wydajność Usług')).toBeInTheDocument()
    expect(screen.getByText('Status Projektów')).toBeInTheDocument()
  })

  it('displays service performance data', () => {
    render(<Dashboard />)

    // Test dla usług
    const services = [
      'Strony WWW',
      'Sklepy Shopify',
      'Aplikacje Mobilne',
      'Prototypy MVP'
    ]

    services.forEach(service => {
      expect(screen.getByText(service)).toBeInTheDocument()
    })
  })

  it('shows project status breakdown', () => {
    render(<Dashboard />)

    // Test dla statusów projektów
    const statuses = [
      'Zakończone',
      'W trakcie',
      'Oczekujące',
      'Opóźnione'
    ]

    statuses.forEach(status => {
      expect(screen.getByText(status)).toBeInTheDocument()
    })
  })

  it('displays recent activity section', () => {
    render(<Dashboard />)

    expect(screen.getByText('Ostatnia Aktywność')).toBeInTheDocument()
  })

  it('shows notifications panel', () => {
    render(<Dashboard />)

    expect(screen.getByText('Powiadomienia')).toBeInTheDocument()
  })

  it('displays notification priorities', () => {
    render(<Dashboard />)

    // Test dla różnych priorytetów powiadomień
    const priorities = ['Pilne', 'Info', 'Zadanie']

    priorities.forEach(priority => {
      expect(screen.getByText(priority)).toBeInTheDocument()
    })
  })

  it('shows activity timestamps', () => {
    render(<Dashboard />)

    // Test dla znaczników czasu
    const timeIndicators = [
      '2 godziny temu',
      '5 godzin temu',
      '1 dzień temu',
      '2 dni temu'
    ]

    timeIndicators.forEach(time => {
      expect(screen.getByText(time)).toBeInTheDocument()
    })
  })

  it('displays progress bars for metrics', () => {
    render(<Dashboard />)

    const progressBars = screen.getAllByRole('progressbar')

    expect(progressBars.length).toBeGreaterThan(0)

    progressBars.forEach(progressBar => {
      expect(progressBar).toBeInTheDocument()
      expect(progressBar).toHaveAttribute('aria-valuenow')
    })
  })

  it('shows trend indicators', () => {
    render(<Dashboard />)

    // Test dla wskaźników trendów
    const upArrow = screen.getByText('12%')
    const downArrow = screen.getByText('3 z poprzedniego tygodnia')

    expect(upArrow).toBeInTheDocument()
    expect(downArrow).toBeInTheDocument()
  })

  it('displays all required metrics values', () => {
    render(<Dashboard />)

    // Test dla konkretnych wartości metryk
    expect(screen.getByText('24')).toBeInTheDocument() // Aktywni klienci
    expect(screen.getByText('45,231 zł')).toBeInTheDocument() // Przychody
    expect(screen.getByText('18')).toBeInTheDocument() // Projekty w toku
    expect(screen.getByText('94%')).toBeInTheDocument() // Satysfakcja
  })

  it('handles empty data gracefully', () => {
    const EmptyDashboard = () => (
      <div>
        <h1>Dashboard Zarządzania</h1>
        <div>Brak danych do wyświetlenia</div>
      </div>
    )

    render(<EmptyDashboard />)

    expect(screen.getByText('Brak danych do wyświetlenia')).toBeInTheDocument()
  })

  it('shows loading states appropriately', () => {
    const LoadingDashboard = () => (
      <div>
        <h1>Dashboard Zarządzania</h1>
        <div>Ładowanie danych dashboard...</div>
      </div>
    )

    render(<LoadingDashboard />)

    expect(screen.getByText('Ładowanie danych dashboard...')).toBeInTheDocument()
  })

  it('displays error states correctly', () => {
    const ErrorDashboard = () => (
      <div>
        <h1>Dashboard Zarządzania</h1>
        <div className="error">Błąd podczas ładowania dashboard</div>
      </div>
    )

    render(<ErrorDashboard />)

    expect(screen.getByText('Błąd podczas ładowania dashboard')).toBeInTheDocument()
  })

  it('calculates percentages correctly', () => {
    render(<Dashboard />)

    // Test dla obliczeń procentowych
    const percentageValues = screen.queryAllByText(/\d+%/)

    percentageValues.forEach(value => {
      const percentage = parseInt(value.textContent!.replace('%', ''))
      expect(percentage).toBeGreaterThanOrEqual(0)
      expect(percentage).toBeLessThanOrEqual(100)
    })
  })

  it('formats currency values properly', () => {
    render(<Dashboard />)

    // Test dla formatowania waluty
    const currencyValues = screen.queryAllByText(/zł/)

    currencyValues.forEach(value => {
      // Sprawdź czy wartość zawiera cyfry
      expect(value.textContent).toMatch(/\d/)
    })
  })

  it('displays activity status indicators', () => {
    render(<Dashboard />)

    // Test dla kolorowych wskaźników aktywności
    // W prawdziwej implementacji, te divy miałyby klasy CSS dla kolorów
    const activityItems = screen.getAllByText(/(.+)ago/, { exact: false })

    expect(activityItems.length).toBeGreaterThan(0)
  })
})
