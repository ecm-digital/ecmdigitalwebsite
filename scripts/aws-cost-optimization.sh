#!/bin/bash

# AWS Cost Optimization Script
# Skrypt do optymalizacji kosztów AWS i monitoringu
# Zoptymalizowany dla regionu eu-west-1

set -e

# Konfiguracja regionu
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-eu-west-1}
export AWS_REGION=${AWS_REGION:-eu-west-1}

# Kolory dla lepszej czytelności
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcja do wyświetlania kolorowych komunikatów
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Sprawdzenie czy AWS CLI jest skonfigurowane
check_aws_config() {
    log_info "Sprawdzanie konfiguracji AWS CLI..."
    
    if ! aws sts get-caller-identity > /dev/null 2>&1; then
        log_error "AWS CLI nie jest skonfigurowane lub brak uprawnień"
        exit 1
    fi
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
    
    log_success "AWS CLI skonfigurowane poprawnie"
    log_info "Account ID: $ACCOUNT_ID"
    log_info "User ARN: $USER_ARN"
}

# Sprawdzenie aktualnych kosztów (jeśli mamy uprawnienia)
check_costs() {
    log_info "Próba sprawdzenia aktualnych kosztów..."
    
    # Sprawdzenie kosztów za ostatni miesiąc
    if aws ce get-cost-and-usage \
        --time-period Start=2024-12-01,End=2025-01-01 \
        --granularity MONTHLY \
        --metrics BlendedCost \
        --group-by Type=DIMENSION,Key=SERVICE > /tmp/aws-costs.json 2>/dev/null; then
        
        log_success "Pobrano dane o kosztach"
        
        # Wyświetlenie top 5 najdroższych usług
        log_info "Top 5 najdroższych usług AWS:"
        jq -r '.ResultsByTime[0].Groups[] | select(.Metrics.BlendedCost.Amount | tonumber > 0) | "\(.Keys[0]): $\(.Metrics.BlendedCost.Amount)"' /tmp/aws-costs.json | sort -k2 -nr | head -5
        
    else
        log_warning "Brak uprawnień do sprawdzenia kosztów (ce:GetCostAndUsage)"
        log_info "Skontaktuj się z administratorem AWS aby dodać uprawnienia Cost Explorer"
    fi
}

# Utworzenie alertów budżetowych
create_budget_alerts() {
    log_info "Tworzenie alertów budżetowych..."
    
    # Sprawdzenie czy budżet już istnieje
    if aws budgets describe-budget --account-id $ACCOUNT_ID --budget-name "ECM-Digital-Monthly-Budget" > /dev/null 2>&1; then
        log_warning "Budżet 'ECM-Digital-Monthly-Budget' już istnieje"
        return
    fi
    
    # Utworzenie budżetu z alertami
    cat > /tmp/budget-config.json << EOF
{
    "BudgetName": "ECM-Digital-Monthly-Budget",
    "BudgetLimit": {
        "Amount": "50.00",
        "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "TimePeriod": {
        "Start": "2025-01-01T00:00:00Z",
        "End": "2087-06-15T00:00:00Z"
    },
    "CostFilters": {},
    "BudgetType": "COST"
}
EOF

    if aws budgets create-budget \
        --account-id $ACCOUNT_ID \
        --budget file:///tmp/budget-config.json > /dev/null 2>&1; then
        
        log_success "Utworzono budżet miesięczny ($50)"
        
        # Dodanie alertu przy 80% budżetu
        cat > /tmp/budget-notification.json << EOF
{
    "Notification": {
        "NotificationType": "ACTUAL",
        "ComparisonOperator": "GREATER_THAN",
        "Threshold": 80.0,
        "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [
        {
            "SubscriptionType": "EMAIL",
            "Address": "admin@ecm-digital.pl"
        }
    ]
}
EOF
        
        if aws budgets create-notification \
            --account-id $ACCOUNT_ID \
            --budget-name "ECM-Digital-Monthly-Budget" \
            --notification file:///tmp/budget-notification.json > /dev/null 2>&1; then
            
            log_success "Dodano alert przy 80% budżetu"
        else
            log_warning "Nie udało się dodać alertu budżetowego"
        fi
        
    else
        log_warning "Brak uprawnień do tworzenia budżetów (budgets:CreateBudget)"
    fi
}

# Sprawdzenie stanu OpenSearch
check_opensearch() {
    log_info "Sprawdzanie stanu OpenSearch..."
    
    # Sprawdzenie OpenSearch Serverless collections
    if aws opensearchserverless list-collections --region eu-west-1 > /tmp/opensearch-collections.json 2>/dev/null; then
        
        COLLECTIONS_COUNT=$(jq '.collectionSummaries | length' /tmp/opensearch-collections.json)
        log_info "Znaleziono $COLLECTIONS_COUNT OpenSearch Serverless collections"
        
        if [ $COLLECTIONS_COUNT -gt 0 ]; then
            log_warning "OpenSearch Serverless jest BARDZO DROGI (~$345/miesiąc minimum)"
            log_info "Rozważ migrację na OpenSearch managed instances (Free Tier: 750h t3.small.search)"
            
            # Wyświetlenie szczegółów collections
            jq -r '.collectionSummaries[] | "Collection: \(.name) | Status: \(.status) | ARN: \(.arn)"' /tmp/opensearch-collections.json
        fi
        
    else
        log_warning "Brak uprawnień do sprawdzenia OpenSearch Serverless (aoss:ListCollections)"
    fi
    
    # Sprawdzenie tradycyjnych domen OpenSearch
    if aws opensearch list-domain-names --region eu-west-1 > /tmp/opensearch-domains.json 2>/dev/null; then
        
        DOMAINS_COUNT=$(jq '.DomainNames | length' /tmp/opensearch-domains.json)
        log_info "Znaleziono $DOMAINS_COUNT OpenSearch managed domains"
        
        if [ $DOMAINS_COUNT -gt 0 ]; then
            jq -r '.DomainNames[] | "Domain: \(.DomainName)"' /tmp/opensearch-domains.json
        fi
        
    else
        log_warning "Brak uprawnień do sprawdzenia OpenSearch domains (es:ListDomainNames)"
    fi
}

# Sprawdzenie Lambda functions
check_lambda_functions() {
    log_info "Sprawdzanie konfiguracji Lambda functions..."
    
    if aws lambda list-functions --region eu-west-1 > /tmp/lambda-functions.json 2>/dev/null; then
        
        FUNCTIONS_COUNT=$(jq '.Functions | length' /tmp/lambda-functions.json)
        log_info "Znaleziono $FUNCTIONS_COUNT Lambda functions"
        
        # Sprawdzenie czy funkcje mieszczą się w Free Tier
        log_info "Analiza konfiguracji Lambda (Free Tier: 1M requestów, 400,000 GB-sekund):"
        
        jq -r '.Functions[] | "Function: \(.FunctionName) | Memory: \(.MemorySize)MB | Timeout: \(.Timeout)s | Runtime: \(.Runtime)"' /tmp/lambda-functions.json | while read line; do
            echo "  $line"
            
            # Sprawdzenie czy memory > 512MB (może generować wyższe koszty)
            MEMORY=$(echo "$line" | grep -o 'Memory: [0-9]*' | grep -o '[0-9]*')
            if [ "$MEMORY" -gt 512 ]; then
                log_warning "    ⚠️  Wysoka alokacja pamięci ($MEMORY MB) - rozważ optymalizację"
            fi
        done
        
    else
        log_warning "Brak uprawnień do sprawdzenia Lambda functions (lambda:ListFunctions)"
    fi
}

# Sprawdzenie S3 buckets
check_s3_buckets() {
    log_info "Sprawdzanie konfiguracji S3 buckets..."
    
    if aws s3api list-buckets > /tmp/s3-buckets.json 2>/dev/null; then
        
        BUCKETS_COUNT=$(jq '.Buckets | length' /tmp/s3-buckets.json)
        log_info "Znaleziono $BUCKETS_COUNT S3 buckets"
        
        # Sprawdzenie rozmiaru każdego bucketu
        jq -r '.Buckets[] | .Name' /tmp/s3-buckets.json | while read bucket; do
            
            # Sprawdzenie regionu bucketu
            REGION=$(aws s3api get-bucket-location --bucket "$bucket" --query LocationConstraint --output text 2>/dev/null || echo "us-east-1")
            if [ "$REGION" = "None" ]; then
                REGION="us-east-1"
            fi
            
            # Sprawdzenie rozmiaru (może być czasochłonne dla dużych bucketów)
            log_info "Bucket: $bucket (region: $REGION)"
            
            # Sprawdzenie lifecycle policies
            if aws s3api get-bucket-lifecycle-configuration --bucket "$bucket" > /dev/null 2>&1; then
                log_success "  ✅ Ma skonfigurowane lifecycle policies"
            else
                log_warning "  ⚠️  Brak lifecycle policies - rozważ automatyczne przechodzenie na IA/Glacier"
            fi
            
            # Sprawdzenie versioning
            VERSIONING=$(aws s3api get-bucket-versioning --bucket "$bucket" --query Status --output text 2>/dev/null || echo "Disabled")
            if [ "$VERSIONING" = "Enabled" ]; then
                log_warning "  ⚠️  Versioning włączone - może generować dodatkowe koszty"
            fi
            
        done
        
    else
        log_warning "Brak uprawnień do sprawdzenia S3 buckets (s3:ListAllMyBuckets)"
    fi
}

# Rekomendacje optymalizacji
show_optimization_recommendations() {
    log_info "=== REKOMENDACJE OPTYMALIZACJI KOSZTÓW ==="
    
    echo ""
    log_warning "🔥 PRIORYTET WYSOKI - OpenSearch Serverless:"
    echo "   • OpenSearch Serverless kosztuje minimum ~$345/miesiąc (2 OCU)"
    echo "   • Rozważ migrację na OpenSearch managed instances:"
    echo "     - Free Tier: 750 godzin t3.small.search miesięcznie"
    echo "     - 10GB storage za darmo"
    echo "   • Alternatywnie: użyj Elasticsearch na EC2 t3.micro (Free Tier)"
    
    echo ""
    log_info "💡 OPTYMALIZACJE LAMBDA:"
    echo "   • Sprawdź czy wszystkie funkcje są używane"
    echo "   • Optymalizuj memory allocation (mniej = taniej)"
    echo "   • Skróć timeout dla funkcji które nie potrzebują długiego czasu"
    echo "   • Free Tier: 1M requestów + 400,000 GB-sekund miesięcznie"
    
    echo ""
    log_info "💾 OPTYMALIZACJE S3:"
    echo "   • Skonfiguruj lifecycle policies (IA po 30 dniach, Glacier po 90)"
    echo "   • Wyłącz versioning jeśli nie jest potrzebne"
    echo "   • Usuń niepotrzebne pliki i incomplete multipart uploads"
    echo "   • Free Tier: 5GB Standard storage + 20,000 GET + 2,000 PUT"
    
    echo ""
    log_info "📊 MONITORING I ALERTY:"
    echo "   • Skonfiguruj AWS Budgets z alertami"
    echo "   • Używaj AWS Cost Explorer do analizy trendów"
    echo "   • Skonfiguruj CloudWatch alarms dla nietypowego użycia"
    
    echo ""
    log_success "🎯 NASTĘPNE KROKI:"
    echo "   1. Sprawdź aktualne koszty w AWS Console > Billing"
    echo "   2. Skonfiguruj budżet miesięczny ($20-50)"
    echo "   3. Zaplanuj migrację OpenSearch Serverless → managed instances"
    echo "   4. Przejrzyj i zoptymalizuj konfigurację Lambda"
    echo "   5. Skonfiguruj S3 lifecycle policies"
}

# Główna funkcja
main() {
    echo ""
    log_info "🚀 AWS Cost Optimization Script - ECM Digital"
    echo "=============================================="
    echo ""
    
    check_aws_config
    echo ""
    
    check_costs
    echo ""
    
    create_budget_alerts
    echo ""
    
    check_opensearch
    echo ""
    
    check_lambda_functions
    echo ""
    
    check_s3_buckets
    echo ""
    
    show_optimization_recommendations
    
    # Cleanup
    rm -f /tmp/aws-costs.json /tmp/opensearch-*.json /tmp/lambda-functions.json /tmp/s3-buckets.json /tmp/budget-*.json
    
    echo ""
    log_success "✅ Analiza zakończona!"
}

# Uruchomienie skryptu
main "$@"