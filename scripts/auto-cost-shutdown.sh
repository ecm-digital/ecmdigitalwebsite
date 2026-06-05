#!/bin/bash

# Auto Cost Shutdown Script - Automatyczne wyłączanie kosztownych usług AWS
# Uruchamiaj codziennie o 23:00 przez cron job

set -e

REGION="eu-west-1"
LOG_FILE="/tmp/auto-cost-shutdown-$(date +%Y%m%d).log"

echo "🔍 Auto Cost Shutdown - $(date)" | tee -a "$LOG_FILE"

# Funkcja do logowania
log() {
    echo "$(date '+%H:%M:%S') $1" | tee -a "$LOG_FILE"
}

# 1. Sprawdź i wyłącz nieużywane instancje EC2
log "📊 Sprawdzanie instancji EC2..."
RUNNING_INSTANCES=$(aws ec2 describe-instances \
    --region "$REGION" \
    --filters "Name=instance-state-name,Values=running" \
    --query 'Reservations[*].Instances[*].InstanceId' \
    --output text)

if [ -n "$RUNNING_INSTANCES" ]; then
    log "⚠️  Znaleziono działające instancje EC2: $RUNNING_INSTANCES"
    # Nie wyłączamy automatycznie - tylko logujemy
    log "💡 Sprawdź czy te instancje są potrzebne"
else
    log "✅ Brak działających instancji EC2"
fi

# 2. Sprawdź RDS instancje
log "📊 Sprawdzanie instancji RDS..."
RDS_INSTANCES=$(aws rds describe-db-instances \
    --region "$REGION" \
    --query 'DBInstances[?DBInstanceStatus==`available`].DBInstanceIdentifier' \
    --output text 2>/dev/null || echo "")

if [ -n "$RDS_INSTANCES" ]; then
    log "⚠️  Znaleziono aktywne instancje RDS: $RDS_INSTANCES"
    log "💡 Sprawdź czy te bazy danych są potrzebne"
else
    log "✅ Brak aktywnych instancji RDS"
fi

# 3. Sprawdź OpenSearch/Elasticsearch
log "📊 Sprawdzanie OpenSearch domains..."
OPENSEARCH_DOMAINS=$(aws opensearch list-domain-names \
    --region "$REGION" \
    --query 'DomainNames[*].DomainName' \
    --output text 2>/dev/null || echo "")

if [ -n "$OPENSEARCH_DOMAINS" ]; then
    log "⚠️  Znaleziono domeny OpenSearch: $OPENSEARCH_DOMAINS"
    log "💡 Sprawdź czy te domeny są potrzebne"
else
    log "✅ Brak domen OpenSearch"
fi

# 4. Sprawdź Bedrock Knowledge Bases
log "📊 Sprawdzanie Bedrock Knowledge Bases..."
BEDROCK_KBS=$(aws bedrock-agent list-knowledge-bases \
    --region "$REGION" \
    --query 'knowledgeBaseSummaries[*].knowledgeBaseId' \
    --output text 2>/dev/null || echo "")

if [ -n "$BEDROCK_KBS" ]; then
    log "⚠️  Znaleziono Bedrock Knowledge Bases: $BEDROCK_KBS"
    log "💡 Sprawdź czy te bazy wiedzy są potrzebne"
else
    log "✅ Brak Bedrock Knowledge Bases"
fi

# 5. Sprawdź duże buckety S3
log "📊 Sprawdzanie dużych bucketów S3..."
aws s3api list-buckets --query 'Buckets[*].Name' --output text | while read bucket; do
    if [ -n "$bucket" ]; then
        SIZE=$(aws s3 ls s3://"$bucket" --recursive --summarize 2>/dev/null | grep "Total Size" | awk '{print $3}' || echo "0")
        if [ "$SIZE" -gt 1000000000 ]; then  # > 1GB
            log "⚠️  Duży bucket S3: $bucket (rozmiar: $SIZE bytes)"
        fi
    fi
done

# 6. Sprawdź CloudWatch Logs z długą retencją
log "📊 Sprawdzanie CloudWatch Logs..."
EXPENSIVE_LOGS=$(aws logs describe-log-groups \
    --region "$REGION" \
    --query 'logGroups[?retentionInDays==null || retentionInDays>30].logGroupName' \
    --output text 2>/dev/null || echo "")

if [ -n "$EXPENSIVE_LOGS" ]; then
    log "⚠️  Logi CloudWatch bez retencji lub z długą retencją: $EXPENSIVE_LOGS"
    log "💡 Ustaw retencję na 7-14 dni dla oszczędności"
fi

# 7. Sprawdź Lambda funkcje z wysoką pamięcią
log "📊 Sprawdzanie funkcji Lambda..."
aws lambda list-functions \
    --region "$REGION" \
    --query 'Functions[?MemorySize>`256`].{FunctionName:FunctionName,MemorySize:MemorySize}' \
    --output table >> "$LOG_FILE" 2>/dev/null || true

# 8. Generuj raport kosztów
log "📊 Generowanie raportu kosztów..."
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d)
TODAY=$(date +%Y-%m-%d)

COST_REPORT=$(aws ce get-cost-and-usage \
    --time-period Start="$YESTERDAY",End="$TODAY" \
    --granularity DAILY \
    --metrics BlendedCost \
    --group-by Type=DIMENSION,Key=SERVICE \
    --query 'ResultsByTime[0].Groups[?Metrics.BlendedCost.Amount>`1`].{Service:Keys[0],Cost:Metrics.BlendedCost.Amount}' \
    --output table 2>/dev/null || echo "Brak dostępu do Cost Explorer")

if [ "$COST_REPORT" != "Brak dostępu do Cost Explorer" ]; then
    log "💰 Koszty wczoraj (>1 USD):"
    echo "$COST_REPORT" >> "$LOG_FILE"
fi

# 9. Sprawdź alerty budżetowe
log "📊 Sprawdzanie alertów budżetowych..."
BUDGET_ALERTS=$(aws budgets describe-budgets \
    --account-id $(aws sts get-caller-identity --query Account --output text) \
    --query 'Budgets[?BudgetLimit.Amount>`10`].BudgetName' \
    --output text 2>/dev/null || echo "Brak dostępu do Budgets")

if [ "$BUDGET_ALERTS" != "Brak dostępu do Budgets" ]; then
    log "💰 Aktywne budżety: $BUDGET_ALERTS"
fi

# 10. Rekomendacje oszczędności
log "💡 Rekomendacje oszczędności:"
log "   - Ustaw retencję CloudWatch Logs na 7-14 dni"
log "   - Regularnie sprawdzaj nieużywane zasoby"
log "   - Używaj Spot Instances dla EC2"
log "   - Skonfiguruj lifecycle policies dla S3"
log "   - Monitoruj koszty codziennie"

log "✅ Auto Cost Shutdown zakończony - sprawdź $LOG_FILE"

# Wyślij raport na email (opcjonalnie)
if [ -n "${NOTIFICATION_EMAIL:-}" ]; then
    log "📧 Wysyłanie raportu na email..."
    cat "$LOG_FILE" | mail -s "AWS Cost Shutdown Report - $(date +%Y-%m-%d)" "$NOTIFICATION_EMAIL" || log "❌ Błąd wysyłania email"
fi