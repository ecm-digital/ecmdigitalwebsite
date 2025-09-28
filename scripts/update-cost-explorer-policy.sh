#!/bin/bash

# Skrypt do aktualizacji polityki Cost Explorer z nowymi uprawnieniami
# Rozwiązuje błąd: ce:DescribeReport Access Denied

set -e

# Kolory dla logów
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcje logowania
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Konfiguracja
ACCOUNT_ID="049164057970"
POLICY_NAME="ECM-CostExplorer-Policy"
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${POLICY_NAME}"
POLICY_FILE="scripts/cost-explorer-policy.json"

echo "🔧 Aktualizacja polityki AWS Cost Explorer"
echo "=========================================="

# Sprawdź czy plik polityki istnieje
if [ ! -f "$POLICY_FILE" ]; then
    log_error "Plik polityki nie istnieje: $POLICY_FILE"
    exit 1
fi

log_info "Sprawdzanie aktualnej polityki..."

# Sprawdź czy polityka istnieje
if aws iam get-policy --policy-arn "$POLICY_ARN" > /dev/null 2>&1; then
    log_warning "Polityka już istnieje. Aktualizuję..."
    
    # Pobierz listę użytkowników z dołączoną polityką
    log_info "Sprawdzanie użytkowników z dołączoną polityką..."
    ATTACHED_USERS=$(aws iam list-entities-for-policy --policy-arn "$POLICY_ARN" --entity-filter User --query 'PolicyUsers[].UserName' --output text)
    
    if [ ! -z "$ATTACHED_USERS" ]; then
        log_info "Znaleziono użytkowników: $ATTACHED_USERS"
        
        # Odłącz politykę od użytkowników
        for user in $ATTACHED_USERS; do
            log_info "Odłączanie polityki od użytkownika: $user"
            aws iam detach-user-policy --user-name "$user" --policy-arn "$POLICY_ARN"
        done
    fi
    
    # Usuń wszystkie wersje polityki (oprócz domyślnej)
    log_info "Usuwanie wszystkich wersji polityki..."
    VERSIONS=$(aws iam list-policy-versions --policy-arn "$POLICY_ARN" --query 'Versions[?!IsDefaultVersion].VersionId' --output text)
    
    if [ ! -z "$VERSIONS" ]; then
        for version in $VERSIONS; do
            log_info "Usuwanie wersji: $version"
            aws iam delete-policy-version --policy-arn "$POLICY_ARN" --version-id "$version"
        done
    fi
    
    # Usuń starą politykę
    log_info "Usuwanie starej polityki..."
    aws iam delete-policy --policy-arn "$POLICY_ARN"
    log_success "Stara polityka usunięta"
fi

# Utwórz nową politykę
log_info "Tworzenie nowej polityki z rozszerzonymi uprawnieniami..."
aws iam create-policy \
    --policy-name "$POLICY_NAME" \
    --policy-document "file://$POLICY_FILE" \
    --description "Rozszerzone uprawnienia Cost Explorer dla ECM Digital (zawiera ce:DescribeReport)"

log_success "Nowa polityka utworzona: $POLICY_ARN"

# Dołącz politykę z powrotem do użytkowników
if [ ! -z "$ATTACHED_USERS" ]; then
    for user in $ATTACHED_USERS; do
        log_info "Dołączanie nowej polityki do użytkownika: $user"
        aws iam attach-user-policy --user-name "$user" --policy-arn "$POLICY_ARN"
        log_success "Polityka dołączona do użytkownika: $user"
    done
fi

echo ""
log_success "🎉 Aktualizacja polityki Cost Explorer zakończona!"
echo ""
log_info "Nowe uprawnienia obejmują:"
echo "  • ce:DescribeReport"
echo "  • ce:CreateReport"
echo "  • ce:DeleteReport"
echo "  • ce:ModifyReport"
echo "  • ce:ListReports"
echo "  • ce:GetReports"
echo ""
log_info "Możesz teraz przetestować dostęp do Cost Explorer:"
echo "  ./scripts/aws-cost-optimization.sh"