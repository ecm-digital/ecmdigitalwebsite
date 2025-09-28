#!/bin/bash

# Skrypt do sprawdzania dostępu do Cost Explorer
# Autor: ECM Digital
# Data: $(date)

echo "🔍 Sprawdzanie dostępu do Cost Explorer..."
echo "=========================================="

# Kolory dla lepszej czytelności
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcja do wyświetlania statusu
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Sprawdź konfigurację AWS CLI
echo -e "\n${BLUE}1. Sprawdzanie konfiguracji AWS CLI...${NC}"
aws sts get-caller-identity > /dev/null 2>&1
if [ $? -eq 0 ]; then
    IDENTITY=$(aws sts get-caller-identity --output text --query 'Arn')
    print_status 0 "AWS CLI skonfigurowane poprawnie"
    print_info "Zalogowany jako: $IDENTITY"
else
    print_status 1 "AWS CLI nie jest skonfigurowane"
    echo "Uruchom: aws configure"
    exit 1
fi

# 2. Test podstawowego dostępu do Cost Explorer
echo -e "\n${BLUE}2. Test podstawowego dostępu do Cost Explorer...${NC}"
aws ce get-cost-and-usage \
    --time-period Start=2025-01-01,End=2025-01-02 \
    --granularity DAILY \
    --metrics UnblendedCost > /dev/null 2>&1

if [ $? -eq 0 ]; then
    print_status 0 "Dostęp do Cost Explorer przez CLI działa"
else
    print_status 1 "Brak dostępu do Cost Explorer przez CLI"
    print_warning "Możliwe przyczyny:"
    echo "   - Dostęp IAM użytkowników nie jest aktywowany"
    echo "   - Brak odpowiednich uprawnień IAM"
    echo "   - Problem z konfiguracją konta"
fi

# 3. Test dostępu do kosztów miesięcznych
echo -e "\n${BLUE}3. Test pobierania kosztów miesięcznych...${NC}"
MONTHLY_COSTS=$(aws ce get-cost-and-usage \
    --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
    --granularity MONTHLY \
    --metrics NetUnblendedCost \
    --output text \
    --query 'ResultsByTime[0].Total.NetUnblendedCost.Amount' 2>/dev/null)

if [ $? -eq 0 ] && [ ! -z "$MONTHLY_COSTS" ]; then
    print_status 0 "Pobieranie kosztów miesięcznych działa"
    print_info "Koszty od początku miesiąca: $MONTHLY_COSTS USD"
else
    print_status 1 "Nie można pobrać kosztów miesięcznych"
fi

# 4. Sprawdź uprawnienia IAM
echo -e "\n${BLUE}4. Sprawdzanie uprawnień IAM...${NC}"
aws iam simulate-principal-policy \
    --policy-source-arn $(aws sts get-caller-identity --query Arn --output text) \
    --action-names ce:GetCostAndUsage \
    --resource-arns "*" \
    --output text \
    --query 'EvaluationResults[0].EvalDecision' > /dev/null 2>&1

if [ $? -eq 0 ]; then
    DECISION=$(aws iam simulate-principal-policy \
        --policy-source-arn $(aws sts get-caller-identity --query Arn --output text) \
        --action-names ce:GetCostAndUsage \
        --resource-arns "*" \
        --output text \
        --query 'EvaluationResults[0].EvalDecision' 2>/dev/null)
    
    if [ "$DECISION" = "allowed" ]; then
        print_status 0 "Uprawnienia IAM są poprawne"
    else
        print_status 1 "Brak wymaganych uprawnień IAM"
    fi
else
    print_warning "Nie można sprawdzić uprawnień IAM"
fi

# 5. Informacje diagnostyczne
echo -e "\n${BLUE}5. Informacje diagnostyczne...${NC}"
print_info "Typ użytkownika: $(aws sts get-caller-identity --query Arn --output text | cut -d'/' -f1 | cut -d':' -f6)"
print_info "Region: $(aws configure get region)"
print_info "Data sprawdzenia: $(date)"

# 6. Rekomendacje
echo -e "\n${YELLOW}📋 Rekomendacje:${NC}"
echo "1. Jeśli CLI działa, ale panel AWS nie - aktywuj dostęp IAM w Account Settings"
echo "2. Zaloguj się jako root user do AWS Console"
echo "3. Przejdź do Account Settings → IAM User and Role Access to Billing Information"
echo "4. Zaznacz 'Activate IAM Access' i kliknij Update"
echo "5. Poczekaj 5-10 minut na propagację zmian"

echo -e "\n${BLUE}📚 Dokumentacja:${NC}"
echo "- docs/COST-EXPLORER-IAM-ACTIVATION.md - szczegółowa instrukcja"
echo "- docs/COST-EXPLORER-ERROR-SOLUTION.md - rozwiązywanie błędów"

echo -e "\n${GREEN}✅ Sprawdzenie zakończone${NC}"