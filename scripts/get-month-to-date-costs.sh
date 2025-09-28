#!/bin/bash
# get-month-to-date-costs.sh
# Skrypt do pobierania kosztów AWS od początku miesiąca do dziś

set -e

# Kolory dla output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcja do wyświetlania kolorowego tekstu
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Pobierz pierwszy dzień bieżącego miesiąca
MONTH_START=$(date +%Y-%m-01)
# Pobierz dzisiejszą datę
TODAY=$(date +%Y-%m-%d)

print_status "Pobieranie kosztów AWS od $MONTH_START do $TODAY..."

# Sprawdź czy AWS CLI jest skonfigurowane
if ! aws sts get-caller-identity &>/dev/null; then
    print_error "AWS CLI nie jest skonfigurowane lub brak uprawnień"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
USER_ARN=$(aws sts get-caller-identity --query Arn --output text)

print_status "Konto AWS: $ACCOUNT_ID"
print_status "Użytkownik: $USER_ARN"

echo ""
print_status "=== KOSZTY MONTH-TO-DATE (NetUnblendedCost) ==="

# Pobierz koszty month-to-date
if aws ce get-cost-and-usage \
  --time-period Start=$MONTH_START,End=$TODAY \
  --granularity MONTHLY \
  --metrics NetUnblendedCost \
  --output table; then
    print_success "Pobrano koszty month-to-date"
else
    print_error "Błąd podczas pobierania kosztów month-to-date"
    exit 1
fi

echo ""
print_status "=== KOSZTY POGRUPOWANE WEDŁUG USŁUG ==="

# Pobierz koszty pogrupowane według usług
if aws ce get-cost-and-usage \
  --time-period Start=$MONTH_START,End=$TODAY \
  --granularity MONTHLY \
  --metrics NetUnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE \
  --output table; then
    print_success "Pobrano koszty pogrupowane według usług"
else
    print_warning "Nie udało się pobrać kosztów pogrupowanych według usług"
fi

echo ""
print_status "=== KOSZTY DZIENNE W BIEŻĄCYM MIESIĄCU ==="

# Pobierz koszty dzienne (ostatnie 7 dni)
WEEK_AGO=$(date -d '7 days ago' +%Y-%m-%d 2>/dev/null || date -v-7d +%Y-%m-%d)

if aws ce get-cost-and-usage \
  --time-period Start=$WEEK_AGO,End=$TODAY \
  --granularity DAILY \
  --metrics NetUnblendedCost \
  --output table; then
    print_success "Pobrano koszty dzienne (ostatnie 7 dni)"
else
    print_warning "Nie udało się pobrać kosztów dziennych"
fi

echo ""
print_success "Skrypt zakończony pomyślnie"
print_status "Użyj tego skryptu zamiast nieistniejącej komendy 'get-month-to-date-net-unblended-cost'"