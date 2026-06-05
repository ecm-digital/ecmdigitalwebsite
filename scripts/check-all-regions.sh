#!/bin/bash

# Skrypt do sprawdzania wszystkich regionów AWS w poszukiwaniu kosztownych zasobów
# ECM Digital - Optymalizacja Kosztów

set -e

echo "🔍 Sprawdzanie wszystkich regionów AWS - $(date)"
echo "=================================================="

# Kolory dla lepszej czytelności
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcja do logowania
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Pobierz wszystkie regiony
log "Pobieranie listy regionów AWS..."
REGIONS=$(aws ec2 describe-regions --query 'Regions[*].RegionName' --output text)

if [ -z "$REGIONS" ]; then
    error "Nie udało się pobrać listy regionów"
    exit 1
fi

log "Znaleziono $(echo $REGIONS | wc -w) regionów"

# Sprawdź każdy region
for region in $REGIONS; do
    echo ""
    echo "🌍 Region: $region"
    echo "------------------------"
    
    # EC2 Instances
    log "Sprawdzanie instancji EC2..."
    EC2_COUNT=$(aws ec2 describe-instances --region $region --query 'Reservations[*].Instances[?State.Name==`running`]' --output text 2>/dev/null | wc -l || echo "0")
    if [ "$EC2_COUNT" -gt 0 ]; then
        warning "Znaleziono $EC2_COUNT działających instancji EC2 w $region"
        aws ec2 describe-instances --region $region --query 'Reservations[*].Instances[?State.Name==`running`].[InstanceId,InstanceType,State.Name]' --output table 2>/dev/null || true
    fi
    
    # RDS Instances
    log "Sprawdzanie instancji RDS..."
    RDS_INSTANCES=$(aws rds describe-db-instances --region $region --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceClass,DBInstanceStatus,Engine]' --output text 2>/dev/null || echo "")
    if [ ! -z "$RDS_INSTANCES" ]; then
        warning "Znaleziono instancje RDS w $region:"
        echo "$RDS_INSTANCES"
    fi
    
    # OpenSearch Domains
    log "Sprawdzanie domen OpenSearch..."
    OPENSEARCH_DOMAINS=$(aws opensearch list-domain-names --region $region --query 'DomainNames[*].DomainName' --output text 2>/dev/null || echo "")
    if [ ! -z "$OPENSEARCH_DOMAINS" ]; then
        warning "Znaleziono domeny OpenSearch w $region: $OPENSEARCH_DOMAINS"
        for domain in $OPENSEARCH_DOMAINS; do
            aws opensearch describe-domain --region $region --domain-name $domain --query 'DomainStatus.[DomainName,ElasticsearchClusterConfig.InstanceType,ElasticsearchClusterConfig.InstanceCount]' --output table 2>/dev/null || true
        done
    fi
    
    # ElastiCache Clusters
    log "Sprawdzanie klastrów ElastiCache..."
    ELASTICACHE_CLUSTERS=$(aws elasticache describe-cache-clusters --region $region --query 'CacheClusters[*].[CacheClusterId,CacheNodeType,CacheClusterStatus]' --output text 2>/dev/null || echo "")
    if [ ! -z "$ELASTICACHE_CLUSTERS" ]; then
        warning "Znaleziono klastry ElastiCache w $region:"
        echo "$ELASTICACHE_CLUSTERS"
    fi
    
    # Redshift Clusters
    log "Sprawdzanie klastrów Redshift..."
    REDSHIFT_CLUSTERS=$(aws redshift describe-clusters --region $region --query 'Clusters[*].[ClusterIdentifier,NodeType,NumberOfNodes,ClusterStatus]' --output text 2>/dev/null || echo "")
    if [ ! -z "$REDSHIFT_CLUSTERS" ]; then
        warning "Znaleziono klastry Redshift w $region:"
        echo "$REDSHIFT_CLUSTERS"
    fi
    
    # NAT Gateways
    log "Sprawdzanie NAT Gateways..."
    NAT_GATEWAYS=$(aws ec2 describe-nat-gateways --region $region --query 'NatGateways[?State==`available`].[NatGatewayId,State]' --output text 2>/dev/null || echo "")
    if [ ! -z "$NAT_GATEWAYS" ]; then
        warning "Znaleziono NAT Gateways w $region:"
        echo "$NAT_GATEWAYS"
    fi
    
    # Load Balancers
    log "Sprawdzanie Load Balancers..."
    ALB_COUNT=$(aws elbv2 describe-load-balancers --region $region --query 'LoadBalancers[*].LoadBalancerName' --output text 2>/dev/null | wc -w || echo "0")
    if [ "$ALB_COUNT" -gt 0 ]; then
        warning "Znaleziono $ALB_COUNT Load Balancers w $region"
        aws elbv2 describe-load-balancers --region $region --query 'LoadBalancers[*].[LoadBalancerName,Type,State.Code]' --output table 2>/dev/null || true
    fi
    
    # Reserved Instances
    log "Sprawdzanie Reserved Instances..."
    RESERVED_EC2=$(aws ec2 describe-reserved-instances --region $region --query 'ReservedInstances[?State==`active`].[ReservedInstancesId,InstanceType,InstanceCount]' --output text 2>/dev/null || echo "")
    if [ ! -z "$RESERVED_EC2" ]; then
        warning "Znaleziono aktywne Reserved Instances EC2 w $region:"
        echo "$RESERVED_EC2"
    fi
    
    RESERVED_RDS=$(aws rds describe-reserved-db-instances --region $region --query 'ReservedDBInstances[?State==`active`].[ReservedDBInstanceId,DBInstanceClass,DBInstanceCount]' --output text 2>/dev/null || echo "")
    if [ ! -z "$RESERVED_RDS" ]; then
        warning "Znaleziono aktywne Reserved Instances RDS w $region:"
        echo "$RESERVED_RDS"
    fi
    
    # Sprawdź czy region ma jakiekolwiek koszty
    REGION_COST=$(aws ce get-cost-and-usage --time-period Start=2025-09-01,End=2025-09-30 --granularity MONTHLY --metrics BlendedCost --group-by Type=DIMENSION,Key=REGION --region us-east-1 --query "ResultsByTime[0].Groups[?Keys[0]=='$region'].Metrics.BlendedCost.Amount" --output text 2>/dev/null || echo "0")
    
    if [ "$REGION_COST" != "0" ] && [ ! -z "$REGION_COST" ]; then
        warning "Region $region generuje koszty: \$$REGION_COST"
    fi
done

echo ""
echo "🎯 PODSUMOWANIE SPRAWDZENIA REGIONÓW"
echo "===================================="

# Sprawdź globalne koszty bez regionu
log "Sprawdzanie kosztów globalnych (NoRegion)..."
GLOBAL_COST=$(aws ce get-cost-and-usage --time-period Start=2025-09-01,End=2025-09-30 --granularity MONTHLY --metrics BlendedCost --group-by Type=DIMENSION,Key=REGION --region us-east-1 --query "ResultsByTime[0].Groups[?Keys[0]=='NoRegion'].Metrics.BlendedCost.Amount" --output text 2>/dev/null || echo "0")

if [ "$GLOBAL_COST" != "0" ] && [ ! -z "$GLOBAL_COST" ]; then
    warning "Koszty globalne (NoRegion): \$$GLOBAL_COST"
    echo "Mogą to być:"
    echo "  - CloudFront"
    echo "  - Route 53"
    echo "  - IAM"
    echo "  - Support"
    echo "  - Data Transfer"
fi

# Sprawdź szczegółowe koszty według usług
log "Generowanie szczegółowego raportu kosztów..."
echo ""
echo "💰 TOP 10 NAJDROŻSZYCH USŁUG:"
aws ce get-cost-and-usage --time-period Start=2025-09-01,End=2025-09-30 --granularity MONTHLY --metrics BlendedCost --group-by Type=DIMENSION,Key=SERVICE --region us-east-1 --query 'ResultsByTime[0].Groups[*].[Keys[0],Metrics.BlendedCost.Amount]' --output text 2>/dev/null | sort -k2 -nr | head -10 | while read service cost; do
    if [ "$cost" != "0" ]; then
        printf "  %-40s \$%s\n" "$service" "$cost"
    fi
done

echo ""
success "Sprawdzenie regionów zakończone - $(date)"
echo "📋 Sprawdź logi powyżej w poszukiwaniu nieoczekiwanych zasobów"
echo "💡 Jeśli znaleziono zasoby, rozważ ich wyłączenie lub optymalizację"