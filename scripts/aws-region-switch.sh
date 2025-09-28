#!/bin/bash

# AWS Region Switch Script
# Skrypt do łatwego przełączania regionów AWS

set -e

# Kolory
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# Sprawdź aktualny region
current_region=$(aws configure get region)

echo "🌍 AWS Region Manager"
echo "===================="
echo ""
log_info "Aktualny region: $current_region"
echo ""

# Menu wyboru regionu
echo "Dostępne regiony:"
echo "1) eu-west-1 (Ireland) - Główny region ECM Digital"
echo "2) us-east-1 (N. Virginia) - Cost Explorer, CloudFront"
echo "3) eu-central-1 (Frankfurt) - Backup region"
echo "4) us-west-2 (Oregon) - Bedrock, niektóre AI usługi"
echo "5) Pokaż wszystkie zasoby w aktualnym regionie"
echo "6) Wyjście"
echo ""

read -p "Wybierz opcję (1-6): " choice

case $choice in
    1)
        log_info "Przełączanie na eu-west-1..."
        aws configure set region eu-west-1
        export AWS_DEFAULT_REGION=eu-west-1
        export AWS_REGION=eu-west-1
        log_success "Region ustawiony na eu-west-1"
        ;;
    2)
        log_info "Przełączanie na us-east-1..."
        aws configure set region us-east-1
        export AWS_DEFAULT_REGION=us-east-1
        export AWS_REGION=us-east-1
        log_success "Region ustawiony na us-east-1"
        log_warning "Uwaga: Cost Explorer działa głównie w us-east-1"
        ;;
    3)
        log_info "Przełączanie na eu-central-1..."
        aws configure set region eu-central-1
        export AWS_DEFAULT_REGION=eu-central-1
        export AWS_REGION=eu-central-1
        log_success "Region ustawiony na eu-central-1"
        ;;
    4)
        log_info "Przełączanie na us-west-2..."
        aws configure set region us-west-2
        export AWS_DEFAULT_REGION=us-west-2
        export AWS_REGION=us-west-2
        log_success "Region ustawiony na us-west-2"
        log_warning "Uwaga: Bedrock i niektóre AI usługi dostępne w us-west-2"
        ;;
    5)
        echo ""
        log_info "=== ZASOBY W REGIONIE: $current_region ==="
        echo ""
        
        log_info "S3 Buckets:"
        aws s3api list-buckets --query 'Buckets[].Name' --output table 2>/dev/null || echo "Brak dostępu lub błąd"
        echo ""
        
        log_info "Lambda Functions:"
        aws lambda list-functions --query 'Functions[].FunctionName' --output table 2>/dev/null || echo "Brak funkcji lub błąd"
        echo ""
        
        log_info "DynamoDB Tables:"
        aws dynamodb list-tables --query 'TableNames' --output table 2>/dev/null || echo "Brak tabel lub błąd"
        echo ""
        
        log_info "EC2 Instances:"
        aws ec2 describe-instances --query 'Reservations[].Instances[].{ID:InstanceId,State:State.Name,Type:InstanceType}' --output table 2>/dev/null || echo "Brak instancji lub błąd"
        ;;
    6)
        log_info "Wyjście..."
        exit 0
        ;;
    *)
        log_warning "Nieprawidłowy wybór!"
        exit 1
        ;;
esac

echo ""
log_info "Nowy region: $(aws configure get region)"
echo ""
log_info "Aby zastosować zmiany w bieżącej sesji, uruchom:"
echo "export AWS_DEFAULT_REGION=$(aws configure get region)"
echo "export AWS_REGION=$(aws configure get region)"