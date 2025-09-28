#!/bin/bash

# OpenSearch Migration Script
# Migracja z OpenSearch Serverless na managed instances (Free Tier)

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
DOMAIN_NAME="ecm-digital-search"
INSTANCE_TYPE="t3.small.search"  # Free Tier eligible
INSTANCE_COUNT=1
VOLUME_SIZE=10  # GB - Free Tier limit
VOLUME_TYPE="gp2"

# Sprawdzenie czy domain już istnieje
check_existing_domain() {
    log_info "Sprawdzanie czy domain OpenSearch już istnieje..."
    
    if aws opensearch describe-domain --domain-name $DOMAIN_NAME --region $REGION > /dev/null 2>&1; then
        log_warning "Domain '$DOMAIN_NAME' już istnieje"
        
        # Sprawdzenie statusu
        STATUS=$(aws opensearch describe-domain --domain-name $DOMAIN_NAME --region $REGION --query 'DomainStatus.Processing' --output text)
        if [ "$STATUS" = "True" ]; then
            log_warning "Domain jest w trakcie przetwarzania. Poczekaj na zakończenie."
            return 1
        fi
        
        log_info "Domain jest gotowy do użycia"
        return 0
    fi
    
    return 1
}

# Utworzenie nowego OpenSearch managed domain
create_opensearch_domain() {
    log_info "Tworzenie nowego OpenSearch managed domain..."
    
    # Konfiguracja domain
    cat > /tmp/opensearch-domain-config.json << EOF
{
    "DomainName": "$DOMAIN_NAME",
    "EngineVersion": "OpenSearch_2.3",
    "ClusterConfig": {
        "InstanceType": "$INSTANCE_TYPE",
        "InstanceCount": $INSTANCE_COUNT,
        "DedicatedMasterEnabled": false,
        "ZoneAwarenessEnabled": false
    },
    "EBSOptions": {
        "EBSEnabled": true,
        "VolumeType": "$VOLUME_TYPE",
        "VolumeSize": $VOLUME_SIZE
    },
    "AccessPolicies": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":\"*\"},\"Action\":\"opensearch:*\",\"Resource\":\"arn:aws:opensearch:$REGION:*:domain/$DOMAIN_NAME/*\"}]}",
    "SnapshotOptions": {
        "AutomatedSnapshotStartHour": 2
    },
    "CognitoOptions": {
        "Enabled": false
    },
    "EncryptionAtRestOptions": {
        "Enabled": true
    },
    "NodeToNodeEncryptionOptions": {
        "Enabled": true
    },
    "DomainEndpointOptions": {
        "EnforceHTTPS": true,
        "TLSSecurityPolicy": "Policy-Min-TLS-1-2-2019-07"
    },
    "AdvancedSecurityOptions": {
        "Enabled": false
    }
}
EOF

    # Utworzenie domain
    if aws opensearch create-domain \
        --region $REGION \
        --cli-input-json file:///tmp/opensearch-domain-config.json > /tmp/opensearch-create-result.json; then
        
        log_success "Rozpoczęto tworzenie OpenSearch domain"
        
        # Wyświetlenie informacji
        DOMAIN_ARN=$(jq -r '.DomainStatus.ARN' /tmp/opensearch-create-result.json)
        log_info "Domain ARN: $DOMAIN_ARN"
        log_info "Tworzenie może potrwać 10-15 minut..."
        
        return 0
    else
        log_error "Nie udało się utworzyć OpenSearch domain"
        return 1
    fi
}

# Oczekiwanie na gotowość domain
wait_for_domain() {
    log_info "Oczekiwanie na gotowość domain..."
    
    local max_attempts=60  # 30 minut (30s * 60)
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Sprawdzanie statusu... (próba $attempt/$max_attempts)"
        
        if aws opensearch describe-domain --domain-name $DOMAIN_NAME --region $REGION > /tmp/domain-status.json 2>/dev/null; then
            
            PROCESSING=$(jq -r '.DomainStatus.Processing' /tmp/domain-status.json)
            CREATED=$(jq -r '.DomainStatus.Created' /tmp/domain-status.json)
            
            if [ "$PROCESSING" = "false" ] && [ "$CREATED" = "true" ]; then
                ENDPOINT=$(jq -r '.DomainStatus.Endpoint' /tmp/domain-status.json)
                log_success "Domain jest gotowy!"
                log_info "Endpoint: https://$ENDPOINT"
                return 0
            fi
            
            log_info "Domain nadal się tworzy... (Processing: $PROCESSING, Created: $CREATED)"
        else
            log_warning "Nie można sprawdzić statusu domain"
        fi
        
        sleep 30
        ((attempt++))
    done
    
    log_error "Timeout - domain nie został utworzony w oczekiwanym czasie"
    return 1
}

# Eksport danych z OpenSearch Serverless (jeśli możliwe)
export_serverless_data() {
    log_info "Próba eksportu danych z OpenSearch Serverless..."
    
    # Lista collections
    if aws opensearchserverless list-collections --region $REGION > /tmp/serverless-collections.json 2>/dev/null; then
        
        COLLECTIONS=$(jq -r '.collectionSummaries[].name' /tmp/serverless-collections.json)
        
        for collection in $COLLECTIONS; do
            log_info "Znaleziono collection: $collection"
            
            # Tutaj można dodać logikę eksportu danych
            # Na razie tylko informujemy o istnieniu
            log_warning "Eksport danych z collection '$collection' wymaga ręcznej konfiguracji"
            log_info "Endpoint collection można znaleźć w AWS Console"
        done
        
    else
        log_warning "Brak dostępu do OpenSearch Serverless collections"
    fi
}

# Aktualizacja konfiguracji Bedrock
update_bedrock_config() {
    log_info "Aktualizacja konfiguracji Bedrock..."
    
    # Sprawdzenie czy domain jest gotowy
    if aws opensearch describe-domain --domain-name $DOMAIN_NAME --region $REGION > /tmp/domain-info.json 2>/dev/null; then
        
        ENDPOINT=$(jq -r '.DomainStatus.Endpoint' /tmp/domain-info.json)
        DOMAIN_ARN=$(jq -r '.DomainStatus.ARN' /tmp/domain-info.json)
        
        log_info "Nowy OpenSearch endpoint: https://$ENDPOINT"
        log_info "Domain ARN: $DOMAIN_ARN"
        
        # Aktualizacja pliku konfiguracyjnego
        if [ -f "bedrock-kb-config.json" ]; then
            log_info "Aktualizacja bedrock-kb-config.json..."
            
            # Backup oryginalnego pliku
            cp bedrock-kb-config.json bedrock-kb-config.json.backup
            
            # Aktualizacja konfiguracji
            jq --arg endpoint "https://$ENDPOINT" \
               --arg arn "$DOMAIN_ARN" \
               '.vectorDatabase.opensearchServerlessConfiguration.collectionArn = $arn |
                .vectorDatabase.opensearchServerlessConfiguration.vectorIndexName = "bedrock-knowledge-base-default-index"' \
               bedrock-kb-config.json > bedrock-kb-config-new.json
            
            mv bedrock-kb-config-new.json bedrock-kb-config.json
            
            log_success "Zaktualizowano konfigurację Bedrock"
            log_info "Backup zapisano jako: bedrock-kb-config.json.backup"
        else
            log_warning "Nie znaleziono pliku bedrock-kb-config.json"
        fi
        
    else
        log_error "Nie można pobrać informacji o domain"
        return 1
    fi
}

# Utworzenie skryptu do usunięcia Serverless collections
create_cleanup_script() {
    log_info "Tworzenie skryptu do czyszczenia Serverless collections..."
    
    cat > cleanup-serverless.sh << 'EOF'
#!/bin/bash

# Skrypt do usunięcia OpenSearch Serverless collections
# UWAGA: To usunie wszystkie dane w collections!

set -e

REGION="eu-west-1"

echo "⚠️  UWAGA: Ten skrypt usunie wszystkie OpenSearch Serverless collections!"
echo "To spowoduje utratę wszystkich danych w collections."
echo ""
read -p "Czy na pewno chcesz kontynuować? (wpisz 'TAK' aby potwierdzić): " confirm

if [ "$confirm" != "TAK" ]; then
    echo "Anulowano."
    exit 0
fi

echo "Pobieranie listy collections..."
aws opensearchserverless list-collections --region $REGION > /tmp/collections-to-delete.json

if [ $? -eq 0 ]; then
    COLLECTIONS=$(jq -r '.collectionSummaries[].name' /tmp/collections-to-delete.json)
    
    for collection in $COLLECTIONS; do
        echo "Usuwanie collection: $collection"
        aws opensearchserverless delete-collection --name "$collection" --region $REGION
        
        if [ $? -eq 0 ]; then
            echo "✅ Usunięto collection: $collection"
        else
            echo "❌ Błąd podczas usuwania collection: $collection"
        fi
    done
    
    echo ""
    echo "✅ Zakończono usuwanie collections"
    echo "💰 To powinno znacznie zmniejszyć koszty AWS!"
    
else
    echo "❌ Nie można pobrać listy collections"
    exit 1
fi

rm -f /tmp/collections-to-delete.json
EOF

    chmod +x cleanup-serverless.sh
    log_success "Utworzono skrypt: cleanup-serverless.sh"
    log_warning "Uruchom go TYLKO po potwierdzeniu, że nowy domain działa poprawnie!"
}

# Wyświetlenie podsumowania kosztów
show_cost_summary() {
    log_info "=== PODSUMOWANIE KOSZTÓW ==="
    echo ""
    
    log_error "💸 PRZED MIGRACJĄ (OpenSearch Serverless):"
    echo "   • Minimum 2 OCU = ~$345/miesiąc"
    echo "   • Dodatkowe OCU = ~$172.50/OCU/miesiąc"
    echo "   • Storage = $0.024/GB/miesiąc"
    echo ""
    
    log_success "💰 PO MIGRACJI (OpenSearch Managed):"
    echo "   • t3.small.search = $0.036/godzinę = ~$26/miesiąc"
    echo "   • 10GB storage = $0.135/GB/miesiąc = $1.35/miesiąc"
    echo "   • RAZEM: ~$27.35/miesiąc"
    echo ""
    
    log_success "🎉 OSZCZĘDNOŚCI: ~$318/miesiąc (~$3,816/rok)!"
    echo ""
    
    log_info "📊 FREE TIER (pierwsze 12 miesięcy):"
    echo "   • 750 godzin t3.small.search = DARMOWE"
    echo "   • 10GB storage = $1.35/miesiąc"
    echo "   • RAZEM: $1.35/miesiąc przez pierwszy rok!"
}

# Główna funkcja
main() {
    echo ""
    log_info "🔄 OpenSearch Migration Script - ECM Digital"
    echo "=============================================="
    echo ""
    
    log_warning "Ten skrypt przeprowadzi migrację z OpenSearch Serverless na managed instances"
    log_warning "Oszczędności: ~$318/miesiąc!"
    echo ""
    
    read -p "Czy chcesz kontynuować? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        log_info "Anulowano migrację"
        exit 0
    fi
    
    echo ""
    
    # Sprawdzenie istniejącego domain
    if check_existing_domain; then
        log_info "Używam istniejącego domain"
    else
        # Utworzenie nowego domain
        if create_opensearch_domain; then
            wait_for_domain
        else
            log_error "Nie udało się utworzyć domain"
            exit 1
        fi
    fi
    
    echo ""
    export_serverless_data
    echo ""
    
    update_bedrock_config
    echo ""
    
    create_cleanup_script
    echo ""
    
    show_cost_summary
    
    # Cleanup
    rm -f /tmp/opensearch-*.json /tmp/domain-*.json
    
    echo ""
    log_success "✅ Migracja zakończona!"
    echo ""
    log_info "🔄 NASTĘPNE KROKI:"
    echo "   1. Przetestuj nowy OpenSearch endpoint"
    echo "   2. Sprawdź czy Bedrock Knowledge Base działa poprawnie"
    echo "   3. Po potwierdzeniu uruchom: ./cleanup-serverless.sh"
    echo "   4. Monitoruj koszty w AWS Console"
}

# Uruchomienie
main "$@"