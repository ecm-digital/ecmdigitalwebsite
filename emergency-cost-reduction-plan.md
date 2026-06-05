# 🚨 PLAN NATYCHMIASTOWYCH DZIAŁAŃ - REDUKCJA KOSZTÓW AWS

## KRYTYCZNE ODKRYCIA
**Data:** $(date)
**Miesięczny koszt:** $518.24 (przekroczenie budżetu o 418%)

### ZIDENTYFIKOWANE ŹRÓDŁA KOSZTÓW:

#### 1. OpenSearch Serverless: $313.69/miesiąc
- **IndexingOCU:** $163.81 (OCU działają 24/7)
- **SearchOCU:** $149.81 (OCU działają 24/7)
- **Problem:** Serverless Collections nie są widoczne przez standardowe komendy
- **Lokalizacja:** Prawdopodobnie eu-west-1 lub us-west-2

#### 2. Aurora RDS: $105.19/miesiąc  
- **Instancja:** db.r6g.large ($104.24)
- **Storage I/O:** $0.95
- **Problem:** Aurora cluster działa 24/7
- **Lokalizacja:** eu-west-1 (według kosztów)

---

## 🚨 DZIAŁANIA NATYCHMIASTOWE (DO 24H)

### PRIORYTET 1: OpenSearch Serverless ($313.69/miesiąc)

#### Krok 1: Znajdź ukryte Collections
```bash
# Sprawdź wszystkie regiony pod kątem OpenSearch Serverless
for region in eu-west-1 us-west-2 eu-central-1; do
    echo "=== $region ==="
    aws opensearchserverless list-collections --region $region
    aws opensearchserverless list-vpc-endpoints --region $region
done
```

#### Krok 2: Sprawdź polityki bezpieczeństwa
```bash
# Collections mogą być ukryte przez polityki dostępu
aws opensearchserverless list-security-policies --type data
aws opensearchserverless list-security-policies --type network
aws opensearchserverless list-security-policies --type encryption
```

#### Krok 3: Sprawdź przez CloudFormation/CDK
```bash
# Collections mogą być zarządzane przez IaC
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE
aws cloudformation describe-stacks --stack-name [STACK_NAME]
```

#### Krok 4: USUŃ Collections (jeśli nieużywane)
```bash
# UWAGA: To usunie dane!
aws opensearchserverless delete-collection --id [COLLECTION_ID] --region [REGION]
```

### PRIORYTET 2: Aurora RDS ($105.19/miesiąc)

#### Krok 1: Znajdź ukryty Aurora cluster
```bash
# Sprawdź wszystkie regiony
for region in eu-west-1 us-west-2 eu-central-1; do
    echo "=== $region ==="
    aws rds describe-db-clusters --region $region
    aws rds describe-db-instances --region $region
done
```

#### Krok 2: Sprawdź przez CloudFormation
```bash
# Aurora może być zarządzany przez IaC
aws cloudformation describe-stack-resources --stack-name [STACK_NAME] --logical-resource-id [RESOURCE_ID]
```

#### Krok 3: ZATRZYMAJ Aurora (jeśli możliwe)
```bash
# Zatrzymaj cluster (max 7 dni)
aws rds stop-db-cluster --db-cluster-identifier [CLUSTER_ID] --region [REGION]
```

#### Krok 4: USUŃ Aurora (jeśli nieużywany)
```bash
# UWAGA: To usunie bazę danych!
# Najpierw utwórz snapshot
aws rds create-db-cluster-snapshot --db-cluster-identifier [CLUSTER_ID] --db-cluster-snapshot-identifier final-snapshot-$(date +%Y%m%d)

# Następnie usuń cluster
aws rds delete-db-cluster --db-cluster-identifier [CLUSTER_ID] --skip-final-snapshot --region [REGION]
```

---

## 📊 POTENCJALNE OSZCZĘDNOŚCI

### Scenariusz 1: Usunięcie wszystkich zasobów
- **OpenSearch Serverless:** -$313.69/miesiąc
- **Aurora RDS:** -$105.19/miesiąc
- **RAZEM:** -$418.88/miesiąc (81% redukcja kosztów)
- **Nowy miesięczny koszt:** ~$99 (głównie podatek)

### Scenariusz 2: Optymalizacja zasobów
- **OpenSearch:** Przejście na domeny zamiast Serverless (-70%)
- **Aurora:** Zmiana na mniejszą instancję (-50%)
- **Potencjalne oszczędności:** ~$270/miesiąc

---

## ⚠️ OSTRZEŻENIA

1. **BACKUP DANYCH:** Przed usunięciem utwórz snapshoty
2. **SPRAWDŹ ZALEŻNOŚCI:** Aplikacje mogą używać tych zasobów
3. **TESTUJ STOPNIOWO:** Nie usuwaj wszystkiego naraz
4. **MONITORUJ:** Sprawdź czy aplikacje działają po zmianach

---

## 📞 KONTAKT W NAGŁYCH PRZYPADKACH
- **AWS Support:** Jeśli nie możesz znaleźć zasobów
- **CloudFormation:** Sprawdź czy zasoby są zarządzane przez IaC
- **Billing Console:** Szczegółowe raporty kosztów

---

## NASTĘPNE KROKI
1. ✅ Wykonaj natychmiastowe działania
2. ⏰ Monitoruj koszty przez 48h
3. 📊 Zaktualizuj budżety i alerty
4. 🔄 Ustaw automatyczne wyłączanie na przyszłość