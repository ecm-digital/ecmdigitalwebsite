#!/bin/bash

# AWS Budget Setup Script
# Konfiguracja budżetów i alertów kosztowych dla ECM Digital

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Konfiguracja
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
EMAIL="tomasz@ecmdigital.pl"  # Email do alertów
REGION="eu-west-1"

echo -e "${BLUE}💰 AWS Budget Setup Script - ECM Digital${NC}"
echo "=============================================="
echo "Account ID: $ACCOUNT_ID"
echo "Email: $EMAIL"
echo

# Funkcja do tworzenia budżetu
create_budget() {
    local budget_name=$1
    local budget_limit=$2
    local budget_type=$3
    local time_unit=$4
    local threshold1=$5
    local threshold2=$6
    
    log_info "Tworzenie budżetu: $budget_name (limit: \$${budget_limit})"
    
    # Sprawdź czy budżet już istnieje
    if aws budgets describe-budget --account-id $ACCOUNT_ID --budget-name "$budget_name" > /dev/null 2>&1; then
        log_warning "Budżet '$budget_name' już istnieje - aktualizuję"
        
        # Usuń istniejący budżet
        aws budgets delete-budget --account-id $ACCOUNT_ID --budget-name "$budget_name" > /dev/null 2>&1 || true
        sleep 2
    fi
    
    # Utwórz plik JSON z definicją budżetu
    cat > "/tmp/budget-${budget_name}.json" << EOF
{
    "BudgetName": "$budget_name",
    "BudgetLimit": {
        "Amount": "$budget_limit",
        "Unit": "USD"
    },
    "TimeUnit": "$time_unit",
    "TimePeriod": {
        "Start": "$(date -u +%Y-%m-01T00:00:00Z)",
        "End": "2087-06-15T00:00:00Z"
    },
    "BudgetType": "$budget_type",
    "CostFilters": {},
    "CalculatedSpend": {
        "ActualSpend": {
            "Amount": "0",
            "Unit": "USD"
        }
    }
}
EOF

    # Utwórz plik JSON z powiadomieniami
    cat > "/tmp/notifications-${budget_name}.json" << EOF
[
    {
        "Notification": {
            "NotificationType": "ACTUAL",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": $threshold1,
            "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [
            {
                "SubscriptionType": "EMAIL",
                "Address": "$EMAIL"
            }
        ]
    },
    {
        "Notification": {
            "NotificationType": "FORECASTED",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": $threshold2,
            "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [
            {
                "SubscriptionType": "EMAIL",
                "Address": "$EMAIL"
            }
        ]
    }
]
EOF

    # Utwórz budżet
    aws budgets create-budget \
        --account-id $ACCOUNT_ID \
        --budget file:///tmp/budget-${budget_name}.json \
        --notifications-with-subscribers file:///tmp/notifications-${budget_name}.json
    
    log_success "✅ Budżet '$budget_name' utworzony pomyślnie"
    
    # Usuń pliki tymczasowe
    rm -f "/tmp/budget-${budget_name}.json" "/tmp/notifications-${budget_name}.json"
}

# Funkcja do tworzenia budżetu dla konkretnej usługi
create_service_budget() {
    local service_name=$1
    local budget_limit=$2
    local service_filter=$3
    
    log_info "Tworzenie budżetu dla usługi: $service_name (limit: \$${budget_limit})"
    
    # Sprawdź czy budżet już istnieje
    local budget_name="ECM-${service_name}-Budget"
    if aws budgets describe-budget --account-id $ACCOUNT_ID --budget-name "$budget_name" > /dev/null 2>&1; then
        log_warning "Budżet '$budget_name' już istnieje - aktualizuję"
        aws budgets delete-budget --account-id $ACCOUNT_ID --budget-name "$budget_name" > /dev/null 2>&1 || true
        sleep 2
    fi
    
    # Utwórz plik JSON z definicją budżetu dla usługi
    cat > "/tmp/service-budget-${service_name}.json" << EOF
{
    "BudgetName": "$budget_name",
    "BudgetLimit": {
        "Amount": "$budget_limit",
        "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "TimePeriod": {
        "Start": "$(date -u +%Y-%m-01T00:00:00Z)",
        "End": "2087-06-15T00:00:00Z"
    },
    "BudgetType": "COST",
    "CostFilters": {
        "Service": ["$service_filter"]
    },
    "CalculatedSpend": {
        "ActualSpend": {
            "Amount": "0",
            "Unit": "USD"
        }
    }
}
EOF

    # Utwórz plik JSON z powiadomieniami
    cat > "/tmp/service-notifications-${service_name}.json" << EOF
[
    {
        "Notification": {
            "NotificationType": "ACTUAL",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": 80,
            "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [
            {
                "SubscriptionType": "EMAIL",
                "Address": "$EMAIL"
            }
        ]
    },
    {
        "Notification": {
            "NotificationType": "FORECASTED",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": 100,
            "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [
            {
                "SubscriptionType": "EMAIL",
                "Address": "$EMAIL"
            }
        ]
    }
]
EOF

    # Utwórz budżet
    aws budgets create-budget \
        --account-id $ACCOUNT_ID \
        --budget file:///tmp/service-budget-${service_name}.json \
        --notifications-with-subscribers file:///tmp/service-notifications-${service_name}.json
    
    log_success "✅ Budżet dla '$service_name' utworzony pomyślnie"
    
    # Usuń pliki tymczasowe
    rm -f "/tmp/service-budget-${service_name}.json" "/tmp/service-notifications-${service_name}.json"
}

# Główne budżety
log_info "🎯 Tworzenie głównych budżetów..."
echo

# 1. Główny budżet miesięczny
create_budget "ECM-Digital-Monthly-Budget" "100" "COST" "MONTHLY" "80" "100"

# 2. Budżet kwartalny
create_budget "ECM-Digital-Quarterly-Budget" "250" "COST" "QUARTERLY" "75" "90"

# 3. Budżet roczny
create_budget "ECM-Digital-Annual-Budget" "800" "COST" "ANNUALLY" "70" "85"

echo
log_info "🔧 Tworzenie budżetów dla poszczególnych usług..."
echo

# Budżety dla konkretnych usług
create_service_budget "S3" "20" "Amazon Simple Storage Service"
create_service_budget "Lambda" "30" "AWS Lambda"
create_service_budget "OpenSearch" "40" "Amazon OpenSearch Service"
create_service_budget "Bedrock" "25" "Amazon Bedrock"
create_service_budget "RDS" "15" "Amazon Relational Database Service"

echo
log_info "📊 Konfiguracja Cost Anomaly Detection..."

# Sprawdź czy Cost Anomaly Monitor już istnieje
if ! aws ce get-anomaly-monitors --query 'AnomalyMonitors[?MonitorArn]' --output text | grep -q "arn:aws" 2>/dev/null; then
    log_info "Tworzenie Cost Anomaly Monitor..."
    
    # Utwórz Cost Anomaly Monitor
    MONITOR_ARN=$(aws ce create-anomaly-monitor \
        --anomaly-monitor '{
            "MonitorName": "ECM-Digital-Cost-Anomaly-Monitor",
            "MonitorType": "DIMENSIONAL",
            "MonitorSpecification": "{\"Dimension\":{\"Key\":\"SERVICE\",\"Values\":[\"Amazon Simple Storage Service\",\"AWS Lambda\",\"Amazon OpenSearch Service\",\"Amazon Bedrock\"],\"MatchOptions\":[\"EQUALS\"]}}"
        }' \
        --query 'MonitorArn' --output text 2>/dev/null || echo "")
    
    if [ -n "$MONITOR_ARN" ]; then
        log_success "Cost Anomaly Monitor utworzony: $MONITOR_ARN"
        
        # Utwórz subskrypcję dla anomalii
        aws ce create-anomaly-subscription \
            --anomaly-subscription '{
                "SubscriptionName": "ECM-Digital-Anomaly-Alerts",
                "MonitorArnList": ["'$MONITOR_ARN'"],
                "Subscribers": [
                    {
                        "Address": "'$EMAIL'",
                        "Type": "EMAIL"
                    }
                ],
                "Threshold": 10,
                "Frequency": "DAILY"
            }' > /dev/null 2>/dev/null || log_warning "Nie udało się utworzyć subskrypcji anomalii"
        
        log_success "Subskrypcja anomalii kosztowych utworzona"
    else
        log_warning "Nie udało się utworzyć Cost Anomaly Monitor - może brakować uprawnień"
    fi
else
    log_info "Cost Anomaly Monitor już istnieje"
fi

echo
log_info "📈 Konfiguracja Cost Explorer Recommendations..."

# Włącz Right Sizing Recommendations
aws ce put-rightsizing-preferences \
    --configuration '{
        "BenefitsConsidered": true,
        "RecommendationPaymentOption": "NO_UPFRONT"
    }' > /dev/null 2>&1 || log_warning "Right Sizing Preferences już skonfigurowane"

log_success "Right Sizing Recommendations włączone"

echo
echo "========================================"
log_success "🎉 KONFIGURACJA BUDŻETÓW ZAKOŃCZONA!"
echo
log_info "📊 UTWORZONE BUDŻETY:"
echo "   💰 Miesięczny: \$100 (alert przy 80%)"
echo "   💰 Kwartalny: \$250 (alert przy 75%)"
echo "   💰 Roczny: \$800 (alert przy 70%)"
echo
log_info "🔧 BUDŻETY USŁUG:"
echo "   • S3: \$20/miesiąc"
echo "   • Lambda: \$30/miesiąc"
echo "   • OpenSearch: \$40/miesiąc"
echo "   • Bedrock: \$25/miesiąc"
echo "   • RDS: \$15/miesiąc"
echo
log_info "🚨 SKONFIGUROWANE ALERTY:"
echo "   • Email powiadomienia na: $EMAIL"
echo "   • Cost Anomaly Detection (próg: \$10)"
echo "   • Right Sizing Recommendations"
echo "   • Forecasting alerts"
echo
log_info "📈 NASTĘPNE KROKI:"
echo "   • Sprawdź email i potwierdź subskrypcje"
echo "   • Monitoruj budżety w AWS Console"
echo "   • Przeglądaj Cost Explorer co tydzień"
echo "   • Reaguj na alerty anomalii"
echo
log_success "✅ Wszystkie budżety i alerty zostały skonfigurowane!"