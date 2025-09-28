#!/bin/bash

# Bedrock Cost Optimization Script
# Optymalizacja kosztów AWS Bedrock

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
REGION="eu-west-1"

# Sprawdzenie dostępnych modeli Bedrock
check_bedrock_models() {
    log_info "Sprawdzanie dostępnych modeli Bedrock..."
    
    if aws bedrock list-foundation-models --region $REGION > /tmp/bedrock-models.json 2>/dev/null; then
        
        log_success "Pobrano listę modeli Bedrock"
        
        # Wyświetlenie modeli z cenami (orientacyjnymi)
        log_info "Dostępne modele i orientacyjne ceny:"
        echo ""
        
        # Claude modeli (najdroższe)
        echo "🤖 CLAUDE MODELI (DROGIE):"
        jq -r '.modelSummaries[] | select(.modelId | contains("claude")) | "  • \(.modelId) - \(.modelName)"' /tmp/bedrock-models.json 2>/dev/null || echo "  • Brak modeli Claude"
        echo "    💰 Claude-3: ~$15-75/1M tokenów"
        echo "    💰 Claude-2: ~$8-24/1M tokenów"
        echo ""
        
        # Titan modeli (tańsze)
        echo "⚡ AMAZON TITAN (TAŃSZE):"
        jq -r '.modelSummaries[] | select(.modelId | contains("titan")) | "  • \(.modelId) - \(.modelName)"' /tmp/bedrock-models.json 2>/dev/null || echo "  • Brak modeli Titan"
        echo "    💰 Titan Text: ~$0.50-1.50/1M tokenów"
        echo "    💰 Titan Embeddings: ~$0.10/1M tokenów"
        echo ""
        
        # Llama modeli (darmowe/tanie)
        echo "🦙 META LLAMA (NAJTAŃSZE):"
        jq -r '.modelSummaries[] | select(.modelId | contains("llama")) | "  • \(.modelId) - \(.modelName)"' /tmp/bedrock-models.json 2>/dev/null || echo "  • Brak modeli Llama"
        echo "    💰 Llama 2: ~$0.20-0.75/1M tokenów"
        echo ""
        
    else
        log_warning "Brak dostępu do Bedrock lub brak uprawnień (bedrock:ListFoundationModels)"
    fi
}

# Sprawdzenie Knowledge Bases
check_knowledge_bases() {
    log_info "Sprawdzanie Bedrock Knowledge Bases..."
    
    if aws bedrock-agent list-knowledge-bases --region $REGION > /tmp/bedrock-kb.json 2>/dev/null; then
        
        local kb_count=$(jq '.knowledgeBaseSummaries | length' /tmp/bedrock-kb.json)
        log_info "Znaleziono $kb_count Knowledge Bases"
        
        if [ $kb_count -gt 0 ]; then
            jq -r '.knowledgeBaseSummaries[] | "KB: \(.name) | ID: \(.knowledgeBaseId) | Status: \(.status)"' /tmp/bedrock-kb.json
            
            # Sprawdzenie szczegółów każdej KB
            jq -r '.knowledgeBaseSummaries[].knowledgeBaseId' /tmp/bedrock-kb.json | while read kb_id; do
                log_info "Sprawdzanie szczegółów KB: $kb_id"
                
                if aws bedrock-agent get-knowledge-base --knowledge-base-id "$kb_id" --region $REGION > "/tmp/kb-details-${kb_id}.json" 2>/dev/null; then
                    
                    local embedding_model=$(jq -r '.knowledgeBase.knowledgeBaseConfiguration.vectorKnowledgeBaseConfiguration.embeddingModelArn' "/tmp/kb-details-${kb_id}.json")
                    log_info "  Model embeddings: $embedding_model"
                    
                    # Sprawdzenie czy używa drogiego modelu
                    if echo "$embedding_model" | grep -q "claude"; then
                        log_warning "  ⚠️  Używa drogiego modelu Claude dla embeddings!"
                        log_info "  💡 Rozważ zmianę na Amazon Titan Embeddings (~90% taniej)"
                    elif echo "$embedding_model" | grep -q "titan"; then
                        log_success "  ✅ Używa ekonomicznego modelu Titan"
                    fi
                    
                else
                    log_warning "  Nie można pobrać szczegółów KB: $kb_id"
                fi
            done
        fi
        
    else
        log_warning "Brak dostępu do Bedrock Knowledge Bases (bedrock-agent:ListKnowledgeBases)"
    fi
}

# Sprawdzenie agentów Bedrock
check_bedrock_agents() {
    log_info "Sprawdzanie Bedrock Agents..."
    
    if aws bedrock-agent list-agents --region $REGION > /tmp/bedrock-agents.json 2>/dev/null; then
        
        local agent_count=$(jq '.agentSummaries | length' /tmp/bedrock-agents.json)
        log_info "Znaleziono $agent_count Bedrock Agents"
        
        if [ $agent_count -gt 0 ]; then
            jq -r '.agentSummaries[] | "Agent: \(.agentName) | ID: \(.agentId) | Status: \(.agentStatus)"' /tmp/bedrock-agents.json
            
            # Sprawdzenie szczegółów każdego agenta
            jq -r '.agentSummaries[].agentId' /tmp/bedrock-agents.json | while read agent_id; do
                log_info "Sprawdzanie agenta: $agent_id"
                
                if aws bedrock-agent get-agent --agent-id "$agent_id" --region $REGION > "/tmp/agent-details-${agent_id}.json" 2>/dev/null; then
                    
                    local foundation_model=$(jq -r '.agent.foundationModel' "/tmp/agent-details-${agent_id}.json")
                    log_info "  Model: $foundation_model"
                    
                    # Sprawdzenie czy używa drogiego modelu
                    if echo "$foundation_model" | grep -q "claude-3"; then
                        log_warning "  ⚠️  Używa drogiego modelu Claude-3!"
                        log_info "  💡 Rozważ zmianę na Claude-2 lub Llama 2"
                    elif echo "$foundation_model" | grep -q "claude-2"; then
                        log_warning "  ⚠️  Używa modelu Claude-2 (średni koszt)"
                        log_info "  💡 Rozważ zmianę na Llama 2 dla oszczędności"
                    elif echo "$foundation_model" | grep -q "llama"; then
                        log_success "  ✅ Używa ekonomicznego modelu Llama"
                    fi
                    
                else
                    log_warning "  Nie można pobrać szczegółów agenta: $agent_id"
                fi
            done
        fi
        
    else
        log_warning "Brak dostępu do Bedrock Agents (bedrock-agent:ListAgents)"
    fi
}

# Analiza użycia Bedrock (jeśli dostępne)
analyze_bedrock_usage() {
    log_info "Analiza użycia Bedrock..."
    
    # Próba pobrania metryk CloudWatch dla Bedrock
    local end_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local start_time=$(date -u -d "30 days ago" +"%Y-%m-%dT%H:%M:%SZ")
    
    log_info "Sprawdzanie metryk za ostatnie 30 dni..."
    
    # Sprawdzenie metryk dla różnych modeli
    local models=("claude-3-sonnet" "claude-2" "titan-text" "llama-2")
    
    for model in "${models[@]}"; do
        log_info "Sprawdzanie użycia modelu: $model"
        
        # Próba pobrania metryk (może nie być dostępne bez odpowiednich uprawnień)
        if aws cloudwatch get-metric-statistics \
            --namespace "AWS/Bedrock" \
            --metric-name "Invocations" \
            --dimensions Name=ModelId,Value="$model" \
            --start-time "$start_time" \
            --end-time "$end_time" \
            --period 86400 \
            --statistics Sum \
            --region $REGION > "/tmp/metrics-${model}.json" 2>/dev/null; then
            
            local total_invocations=$(jq '[.Datapoints[].Sum] | add // 0' "/tmp/metrics-${model}.json")
            log_info "  Invocations: $total_invocations"
            
        else
            log_warning "  Brak dostępu do metryk CloudWatch"
        fi
    done
}

# Rekomendacje optymalizacji
show_optimization_recommendations() {
    log_info "=== REKOMENDACJE OPTYMALIZACJI BEDROCK ==="
    echo ""
    
    log_warning "🔥 WYBÓR MODELU (największy wpływ na koszty):"
    echo "   • Claude-3 Opus: $75/1M tokenów (najdroższy)"
    echo "   • Claude-3 Sonnet: $15/1M tokenów"
    echo "   • Claude-2: $8/1M tokenów"
    echo "   • Llama 2 70B: $0.75/1M tokenów"
    echo "   • Titan Text: $0.50/1M tokenów (najtańszy)"
    echo ""
    
    log_success "💡 STRATEGIE OSZCZĘDNOŚCI:"
    echo "   1. 🎯 WYBÓR MODELU:"
    echo "      • Użyj najtańszego modelu który spełnia wymagania"
    echo "      • Titan/Llama dla prostych zadań"
    echo "      • Claude tylko dla złożonych zadań"
    echo ""
    echo "   2. 📝 OPTYMALIZACJA PROMPTÓW:"
    echo "      • Krótsze prompty = mniej tokenów = niższe koszty"
    echo "      • Unikaj niepotrzebnych przykładów"
    echo "      • Używaj precyzyjnych instrukcji"
    echo ""
    echo "   3. 🔄 CACHE I BATCHING:"
    echo "      • Cachuj odpowiedzi dla powtarzających się pytań"
    echo "      • Grupuj podobne zapytania"
    echo "      • Unikaj redundantnych wywołań"
    echo ""
    echo "   4. 📊 MONITORING:"
    echo "      • Monitoruj użycie tokenów"
    echo "      • Ustaw alerty kosztów"
    echo "      • Analizuj wzorce użycia"
    echo ""
    
    log_info "🎯 KONKRETNE DZIAŁANIA:"
    echo "   • Zmień embeddings z Claude na Titan (~90% oszczędności)"
    echo "   • Użyj Llama 2 zamiast Claude dla prostych zadań"
    echo "   • Skonfiguruj cache dla Knowledge Base"
    echo "   • Ogranicz długość odpowiedzi (max_tokens)"
    echo "   • Implementuj rate limiting"
}

# Utworzenie konfiguracji optymalizacji
create_optimization_config() {
    log_info "Tworzenie zoptymalizowanej konfiguracji..."
    
    # Backup oryginalnej konfiguracji
    if [ -f "bedrock-kb-config.json" ]; then
        cp bedrock-kb-config.json bedrock-kb-config-original.json
        log_info "Backup zapisano jako: bedrock-kb-config-original.json"
    fi
    
    # Utworzenie zoptymalizowanej konfiguracji
    cat > bedrock-optimized-config.json << 'EOF'
{
  "knowledgeBaseName": "ecm-digital-knowledge-optimized",
  "description": "Zoptymalizowana baza wiedzy ECM Digital - niskie koszty",
  "roleArn": "arn:aws:iam::049164057970:role/AmazonBedrockExecutionRoleForKnowledgeBase_ecm",
  "knowledgeBaseConfiguration": {
    "type": "VECTOR",
    "vectorKnowledgeBaseConfiguration": {
      "embeddingModelArn": "arn:aws:bedrock:eu-west-1::foundation-model/amazon.titan-embed-text-v1",
      "embeddingModelConfiguration": {
        "bedrockEmbeddingModelConfiguration": {
          "dimensions": 1536
        }
      }
    }
  },
  "dataSource": {
    "name": "ecm-digital-s3-source",
    "description": "Źródło danych S3 dla ECM Digital",
    "dataSourceConfiguration": {
      "type": "S3",
      "s3Configuration": {
        "bucketArn": "arn:aws:s3:::ecm-digital-knowledge",
        "inclusionPrefixes": [
          "services/",
          "faq/",
          "meta/"
        ]
      }
    },
    "vectorIngestionConfiguration": {
      "chunkingConfiguration": {
        "chunkingStrategy": "FIXED_SIZE",
        "fixedSizeChunkingConfiguration": {
          "maxTokens": 300,
          "overlapPercentage": 20
        }
      }
    }
  },
  "vectorDatabase": {
    "opensearchServerlessConfiguration": {
      "collectionArn": "arn:aws:aoss:eu-west-1:049164057970:collection/bedrock-knowledge-base-default",
      "vectorIndexName": "bedrock-knowledge-base-default-index",
      "fieldMapping": {
        "vectorField": "bedrock-knowledge-base-default-vector",
        "textField": "AMAZON_BEDROCK_TEXT_CHUNK",
        "metadataField": "AMAZON_BEDROCK_METADATA"
      }
    }
  },
  "tags": {
    "Project": "ECM-Digital",
    "Environment": "Production",
    "CostOptimized": "true"
  }
}
EOF

    log_success "Utworzono zoptymalizowaną konfigurację: bedrock-optimized-config.json"
    
    # Utworzenie konfiguracji agenta z tanim modelem
    cat > bedrock-agent-optimized.json << 'EOF'
{
  "agentName": "ecm-digital-agent-optimized",
  "description": "Zoptymalizowany agent ECM Digital - niskie koszty",
  "foundationModel": "meta.llama2-70b-chat-v1",
  "instruction": "Jesteś asystentem ECM Digital. Odpowiadaj zwięźle i precyzyjnie. Używaj polskiego języka.",
  "idleSessionTTLInSeconds": 1800,
  "agentResourceRoleArn": "arn:aws:iam::049164057970:role/AmazonBedrockExecutionRoleForAgents_ecm",
  "tags": {
    "Project": "ECM-Digital",
    "Environment": "Production",
    "CostOptimized": "true"
  }
}
EOF

    log_success "Utworzono konfigurację agenta: bedrock-agent-optimized.json"
}

# Utworzenie skryptu monitoringu kosztów
create_cost_monitoring_script() {
    log_info "Tworzenie skryptu monitoringu kosztów Bedrock..."
    
    cat > bedrock-cost-monitor.sh << 'EOF'
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
EOF

    chmod +x bedrock-cost-monitor.sh
    log_success "Utworzono skrypt monitoringu: bedrock-cost-monitor.sh"
}

# Główna funkcja
main() {
    echo ""
    log_info "🤖 Bedrock Cost Optimization Script - ECM Digital"
    echo "=================================================="
    echo ""
    
    check_bedrock_models
    echo ""
    
    check_knowledge_bases
    echo ""
    
    check_bedrock_agents
    echo ""
    
    analyze_bedrock_usage
    echo ""
    
    show_optimization_recommendations
    echo ""
    
    create_optimization_config
    echo ""
    
    create_cost_monitoring_script
    
    # Cleanup
    rm -f /tmp/bedrock-*.json /tmp/kb-details-*.json /tmp/agent-details-*.json /tmp/metrics-*.json
    
    echo ""
    log_success "✅ Optymalizacja Bedrock zakończona!"
    echo ""
    log_info "🔄 NASTĘPNE KROKI:"
    echo "   1. Przejrzyj zoptymalizowane konfiguracje"
    echo "   2. Przetestuj tańsze modele (Llama 2, Titan)"
    echo "   3. Wdróż monitoring kosztów"
    echo "   4. Zoptymalizuj prompty i długość odpowiedzi"
    echo "   5. Skonfiguruj cache dla częstych zapytań"
}

# Uruchomienie
main "$@"