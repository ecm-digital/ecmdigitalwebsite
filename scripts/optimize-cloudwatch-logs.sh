#!/bin/bash

# CloudWatch Logs Optimization Script
# Ustawia krótką retencję dla logów w celu oszczędności

set -e

REGION="eu-west-1"
RETENTION_DAYS=7  # 7 dni retencji dla oszczędności

echo "🔧 Optymalizacja CloudWatch Logs - $(date)"

# Funkcja do ustawiania retencji
set_retention() {
    local log_group="$1"
    local retention="$2"
    
    echo "📝 Ustawianie retencji $retention dni dla: $log_group"
    
    aws logs put-retention-policy \
        --log-group-name "$log_group" \
        --retention-in-days "$retention" \
        --region "$REGION" || echo "❌ Błąd ustawiania retencji dla $log_group"
}

# Pobierz wszystkie grupy logów
echo "📊 Pobieranie listy grup logów..."
LOG_GROUPS=$(aws logs describe-log-groups \
    --region "$REGION" \
    --query 'logGroups[*].logGroupName' \
    --output text)

if [ -z "$LOG_GROUPS" ]; then
    echo "✅ Brak grup logów do optymalizacji"
    exit 0
fi

echo "📋 Znalezione grupy logów:"
echo "$LOG_GROUPS" | tr '\t' '\n'

# Ustaw retencję dla wszystkich grup logów
echo ""
echo "🔧 Ustawianie retencji $RETENTION_DAYS dni..."

for log_group in $LOG_GROUPS; do
    if [ -n "$log_group" ]; then
        set_retention "$log_group" "$RETENTION_DAYS"
    fi
done

echo ""
echo "✅ Optymalizacja CloudWatch Logs zakończona"
echo "💰 Oszczędności: ~90% kosztów logów dzięki krótkiej retencji"

# Sprawdź wyniki
echo ""
echo "📊 Sprawdzanie ustawionych retencji:"
aws logs describe-log-groups \
    --region "$REGION" \
    --query 'logGroups[*].{LogGroup:logGroupName,RetentionDays:retentionInDays,StoredBytes:storedBytes}' \
    --output table