#!/bin/bash

# S3 Lifecycle Optimization Script
# Automatyczna konfiguracja lifecycle policies dla redukcji kosztów S3

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

# Konfiguracja lifecycle policies
IA_TRANSITION_DAYS=30      # Przejście na Infrequent Access po 30 dniach
GLACIER_TRANSITION_DAYS=90 # Przejście na Glacier po 90 dniach
DEEP_ARCHIVE_DAYS=365      # Przejście na Deep Archive po roku
EXPIRATION_DAYS=2555       # Usunięcie po 7 latach (2555 dni)

# Funkcja do utworzenia lifecycle policy
create_lifecycle_policy() {
    local bucket_name=$1
    local policy_name="ecm-cost-optimization-policy"
    
    log_info "Tworzenie lifecycle policy dla bucket: $bucket_name"
    
    # Sprawdzenie czy bucket ma już lifecycle policy
    if aws s3api get-bucket-lifecycle-configuration --bucket "$bucket_name" > /dev/null 2>&1; then
        log_warning "Bucket '$bucket_name' ma już skonfigurowane lifecycle policies"
        
        # Wyświetlenie istniejącej konfiguracji
        log_info "Istniejąca konfiguracja:"
        aws s3api get-bucket-lifecycle-configuration --bucket "$bucket_name" --query 'Rules[].{ID:ID,Status:Status,Transitions:Transitions}' --output table 2>/dev/null || true
        
        read -p "Czy chcesz zastąpić istniejącą konfigurację? (y/N): " replace
        if [[ ! $replace =~ ^[Yy]$ ]]; then
            log_info "Pomijam bucket: $bucket_name"
            return 0
        fi
    fi
    
    # Utworzenie konfiguracji lifecycle
    cat > "/tmp/lifecycle-${bucket_name}.json" << EOF
{
    "Rules": [
        {
            "ID": "$policy_name",
            "Status": "Enabled",
            "Filter": {
                "Prefix": ""
            },
            "Transitions": [
                {
                    "Days": $IA_TRANSITION_DAYS,
                    "StorageClass": "STANDARD_IA"
                },
                {
                    "Days": $GLACIER_TRANSITION_DAYS,
                    "StorageClass": "GLACIER"
                },
                {
                    "Days": $DEEP_ARCHIVE_DAYS,
                    "StorageClass": "DEEP_ARCHIVE"
                }
            ],
            "Expiration": {
                "Days": $EXPIRATION_DAYS
            },
            "AbortIncompleteMultipartUpload": {
                "DaysAfterInitiation": 7
            }
        },
        {
            "ID": "delete-old-versions",
            "Status": "Enabled",
            "Filter": {
                "Prefix": ""
            },
            "NoncurrentVersionTransitions": [
                {
                    "NoncurrentDays": 30,
                    "StorageClass": "STANDARD_IA"
                },
                {
                    "NoncurrentDays": 60,
                    "StorageClass": "GLACIER"
                }
            ],
            "NoncurrentVersionExpiration": {
                "NoncurrentDays": 365
            }
        }
    ]
}
EOF

    # Zastosowanie lifecycle policy
    if aws s3api put-bucket-lifecycle-configuration \
        --bucket "$bucket_name" \
        --lifecycle-configuration "file:///tmp/lifecycle-${bucket_name}.json"; then
        
        log_success "Skonfigurowano lifecycle policy dla: $bucket_name"
        
        # Wyświetlenie podsumowania
        echo "   📅 Standard → IA: $IA_TRANSITION_DAYS dni"
        echo "   🧊 IA → Glacier: $GLACIER_TRANSITION_DAYS dni"
        echo "   🏔️  Glacier → Deep Archive: $DEEP_ARCHIVE_DAYS dni"
        echo "   🗑️  Usunięcie: $EXPIRATION_DAYS dni"
        echo "   🧹 Cleanup multipart: 7 dni"
        echo "   📦 Stare wersje → IA: 30 dni"
        echo "   🗑️  Usunięcie starych wersji: 365 dni"
        
    else
        log_error "Nie udało się skonfigurować lifecycle policy dla: $bucket_name"
        return 1
    fi
    
    # Cleanup
    rm -f "/tmp/lifecycle-${bucket_name}.json"
}

# Analiza obecnego użycia S3
analyze_s3_usage() {
    local bucket_name=$1
    
    log_info "Analiza użycia bucket: $bucket_name"
    
    # Sprawdzenie regionu bucket
    local region=$(aws s3api get-bucket-location --bucket "$bucket_name" --query LocationConstraint --output text 2>/dev/null || echo "us-east-1")
    if [ "$region" = "None" ]; then
        region="us-east-1"
    fi
    
    echo "   📍 Region: $region"
    
    # Sprawdzenie versioning
    local versioning=$(aws s3api get-bucket-versioning --bucket "$bucket_name" --query Status --output text 2>/dev/null || echo "Disabled")
    echo "   📝 Versioning: $versioning"
    
    if [ "$versioning" = "Enabled" ]; then
        log_warning "   ⚠️  Versioning włączone - może generować dodatkowe koszty"
    fi
    
    # Sprawdzenie czy są incomplete multipart uploads
    local multipart_count=$(aws s3api list-multipart-uploads --bucket "$bucket_name" --query 'length(Uploads)' --output text 2>/dev/null || echo "0")
    if [ "$multipart_count" -gt 0 ]; then
        log_warning "   ⚠️  Znaleziono $multipart_count incomplete multipart uploads"
    fi
    
    # Próba oszacowania rozmiaru (może być czasochłonne)
    log_info "   📊 Szacowanie rozmiaru bucket..."
    local object_count=$(aws s3 ls "s3://$bucket_name" --recursive --summarize 2>/dev/null | grep "Total Objects:" | awk '{print $3}' || echo "N/A")
    local total_size=$(aws s3 ls "s3://$bucket_name" --recursive --summarize 2>/dev/null | grep "Total Size:" | awk '{print $3, $4}' || echo "N/A")
    
    echo "   📁 Liczba obiektów: $object_count"
    echo "   💾 Całkowity rozmiar: $total_size"
}

# Czyszczenie incomplete multipart uploads
cleanup_multipart_uploads() {
    local bucket_name=$1
    
    log_info "Czyszczenie incomplete multipart uploads dla: $bucket_name"
    
    # Lista incomplete uploads
    local uploads=$(aws s3api list-multipart-uploads --bucket "$bucket_name" --query 'Uploads[].{Key:Key,UploadId:UploadId}' --output json 2>/dev/null || echo "[]")
    local upload_count=$(echo "$uploads" | jq length)
    
    if [ "$upload_count" -gt 0 ]; then
        log_warning "Znaleziono $upload_count incomplete multipart uploads"
        
        read -p "Czy chcesz je usunąć? (y/N): " confirm
        if [[ $confirm =~ ^[Yy]$ ]]; then
            
            echo "$uploads" | jq -r '.[] | "\(.Key) \(.UploadId)"' | while read key upload_id; do
                log_info "Usuwanie: $key ($upload_id)"
                
                if aws s3api abort-multipart-upload \
                    --bucket "$bucket_name" \
                    --key "$key" \
                    --upload-id "$upload_id" 2>/dev/null; then
                    echo "   ✅ Usunięto"
                else
                    echo "   ❌ Błąd podczas usuwania"
                fi
            done
            
            log_success "Zakończono czyszczenie multipart uploads"
        fi
    else
        log_success "Brak incomplete multipart uploads"
    fi
}

# Optymalizacja versioning
optimize_versioning() {
    local bucket_name=$1
    
    log_info "Sprawdzanie konfiguracji versioning dla: $bucket_name"
    
    local versioning=$(aws s3api get-bucket-versioning --bucket "$bucket_name" --query Status --output text 2>/dev/null || echo "Disabled")
    
    if [ "$versioning" = "Enabled" ]; then
        log_warning "Versioning jest włączone dla bucket: $bucket_name"
        echo "   💰 Versioning może znacznie zwiększać koszty storage"
        echo "   📦 Każda zmiana pliku tworzy nową wersję"
        echo "   🗑️  Stare wersje nie są automatycznie usuwane"
        
        read -p "Czy chcesz wyłączyć versioning? (y/N): " disable_versioning
        if [[ $disable_versioning =~ ^[Yy]$ ]]; then
            
            if aws s3api put-bucket-versioning \
                --bucket "$bucket_name" \
                --versioning-configuration Status=Suspended; then
                
                log_success "Wyłączono versioning dla: $bucket_name"
                log_info "Istniejące wersje pozostaną, ale nowe nie będą tworzone"
            else
                log_error "Nie udało się wyłączyć versioning"
            fi
        fi
        
        # Sprawdzenie starych wersji
        log_info "Sprawdzanie starych wersji obiektów..."
        local old_versions=$(aws s3api list-object-versions --bucket "$bucket_name" --query 'Versions[?IsLatest==`false`]' --output json 2>/dev/null || echo "[]")
        local old_count=$(echo "$old_versions" | jq length)
        
        if [ "$old_count" -gt 0 ]; then
            log_warning "Znaleziono $old_count starych wersji obiektów"
            echo "   💡 Lifecycle policy automatycznie je usunie po 365 dniach"
        fi
    else
        log_success "Versioning jest wyłączone - dobrze!"
    fi
}

# Podsumowanie oszczędności
show_savings_summary() {
    log_info "=== PODSUMOWANIE OSZCZĘDNOŚCI S3 ==="
    echo ""
    
    log_success "💰 OSZCZĘDNOŚCI Z LIFECYCLE POLICIES:"
    echo "   • Standard → IA (po 30 dniach): ~50% oszczędności"
    echo "   • IA → Glacier (po 90 dniach): ~68% oszczędności vs Standard"
    echo "   • Glacier → Deep Archive (po roku): ~75% oszczędności vs Standard"
    echo ""
    
    log_info "📊 PRZYKŁADOWE KOSZTY (eu-west-1):"
    echo "   • Standard: $0.023/GB/miesiąc"
    echo "   • Standard-IA: $0.0125/GB/miesiąc"
    echo "   • Glacier: $0.004/GB/miesiąc"
    echo "   • Deep Archive: $0.00099/GB/miesiąc"
    echo ""
    
    log_success "🎯 DODATKOWE OSZCZĘDNOŚCI:"
    echo "   • Usunięcie incomplete multipart uploads"
    echo "   • Automatyczne usuwanie starych wersji"
    echo "   • Wyłączenie niepotrzebnego versioning"
    echo ""
    
    log_info "📈 PRZYKŁAD DLA 100GB:"
    echo "   • Bez optymalizacji: $2.30/miesiąc"
    echo "   • Z lifecycle policies: ~$0.50/miesiąc (po roku)"
    echo "   • Oszczędności: ~$1.80/miesiąc (~$21.60/rok)"
}

# Główna funkcja
main() {
    echo ""
    log_info "💾 S3 Lifecycle Optimization Script - ECM Digital"
    echo "=================================================="
    echo ""
    
    log_info "Ten skrypt skonfiguruje lifecycle policies dla wszystkich S3 buckets"
    log_info "Oszczędności mogą wynosić 50-75% kosztów storage!"
    echo ""
    
    # Pobranie listy buckets
    log_info "Pobieranie listy S3 buckets..."
    
    if ! aws s3api list-buckets > /tmp/s3-buckets.json 2>/dev/null; then
        log_error "Nie można pobrać listy S3 buckets"
        exit 1
    fi
    
    local buckets=$(jq -r '.Buckets[].Name' /tmp/s3-buckets.json)
    local bucket_count=$(echo "$buckets" | wc -l)
    
    log_success "Znaleziono $bucket_count buckets"
    echo ""
    
    # Przetwarzanie każdego bucket
    for bucket in $buckets; do
        echo "----------------------------------------"
        log_info "Przetwarzanie bucket: $bucket"
        echo ""
        
        # Analiza użycia
        analyze_s3_usage "$bucket"
        echo ""
        
        # Czyszczenie multipart uploads
        cleanup_multipart_uploads "$bucket"
        echo ""
        
        # Optymalizacja versioning
        optimize_versioning "$bucket"
        echo ""
        
        # Konfiguracja lifecycle policy
        create_lifecycle_policy "$bucket"
        echo ""
        
        read -p "Naciśnij Enter aby kontynuować do następnego bucket..."
        echo ""
    done
    
    echo "========================================"
    show_savings_summary
    
    # Cleanup
    rm -f /tmp/s3-buckets.json /tmp/lifecycle-*.json
    
    echo ""
    log_success "✅ Optymalizacja S3 zakończona!"
    echo ""
    log_info "🔄 NASTĘPNE KROKI:"
    echo "   1. Monitoruj koszty S3 w AWS Console"
    echo "   2. Sprawdź CloudWatch metrics dla S3"
    echo "   3. Przejrzyj lifecycle policies za miesiąc"
    echo "   4. Rozważ dodatkowe optymalizacje (Intelligent Tiering)"
}

# Uruchomienie
main "$@"