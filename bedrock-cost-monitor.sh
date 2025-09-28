#!/bin/bash

# Bedrock Cost Monitoring Script
# Monitorowanie kosztów i użycia Bedrock

REGION="eu-west-1"
LOG_FILE="bedrock-usage-$(date +%Y%m%d).log"

echo "=== Bedrock Usage Report - $(date) ===" >> $LOG_FILE

# Sprawdzenie metryk CloudWatch
echo "Sprawdzanie metryk użycia..." >> $LOG_FILE

# Modele do monitorowania
models=("claude-3-sonnet" "claude-2" "titan-text" "llama-2")

for model in "${models[@]}"; do
    echo "Model: $model" >> $LOG_FILE
    
    # Invocations za ostatnie 24h
    invocations=$(aws cloudwatch get-metric-statistics \
        --namespace "AWS/Bedrock" \
        --metric-name "Invocations" \
        --dimensions Name=ModelId,Value="$model" \
        --start-time "$(date -u -d '1 day ago' +%Y-%m-%dT%H:%M:%SZ)" \
        --end-time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --period 86400 \
        --statistics Sum \
        --region $REGION \
        --query 'Datapoints[0].Sum' \
        --output text 2>/dev/null || echo "0")
    
    echo "  Invocations (24h): $invocations" >> $LOG_FILE
    
    # Input tokens
    input_tokens=$(aws cloudwatch get-metric-statistics \
        --namespace "AWS/Bedrock" \
        --metric-name "InputTokenCount" \
        --dimensions Name=ModelId,Value="$model" \
        --start-time "$(date -u -d '1 day ago' +%Y-%m-%dT%H:%M:%SZ)" \
        --end-time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --period 86400 \
        --statistics Sum \
        --region $REGION \
        --query 'Datapoints[0].Sum' \
        --output text 2>/dev/null || echo "0")
    
    echo "  Input Tokens (24h): $input_tokens" >> $LOG_FILE
    
    # Output tokens
    output_tokens=$(aws cloudwatch get-metric-statistics \
        --namespace "AWS/Bedrock" \
        --metric-name "OutputTokenCount" \
        --dimensions Name=ModelId,Value="$model" \
        --start-time "$(date -u -d '1 day ago' +%Y-%m-%dT%H:%M:%SZ)" \
        --end-time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --period 86400 \
        --statistics Sum \
        --region $REGION \
        --query 'Datapoints[0].Sum' \
        --output text 2>/dev/null || echo "0")
    
    echo "  Output Tokens (24h): $output_tokens" >> $LOG_FILE
    echo "" >> $LOG_FILE
done

echo "Report zapisany w: $LOG_FILE"
