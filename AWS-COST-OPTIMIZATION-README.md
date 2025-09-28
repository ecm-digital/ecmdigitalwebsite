# 💰 AWS Cost Optimization Guide - ECM Digital

## 🎯 Cel
Optymalizacja kosztów AWS dla projektu ECM Digital z potencjalnymi oszczędnościami **~$4,000/rok**.

## 📊 Analiza kosztów

### 🔥 Największe źródła kosztów:
1. **OpenSearch Serverless**: ~$345/miesiąc (minimum 2 OCU)
2. **Bedrock**: $0.50-75/1M tokenów (zależnie od modelu)
3. **S3**: $0.023/GB/miesiąc (bez lifecycle policies)
4. **Lambda**: Zwykle w ramach Free Tier

### 💡 Potencjalne oszczędności:
- **OpenSearch**: $318/miesiąc → migracja na managed instances
- **Bedrock**: 50-90% → zmiana modeli na tańsze
- **S3**: 50-75% → lifecycle policies
- **Łącznie**: ~$4,000/rok oszczędności

## 🚀 Skrypty optymalizacji

### 1. 📋 Analiza ogólna
```bash
./scripts/aws-cost-optimization.sh
```
**Co robi:**
- Sprawdza aktualne koszty (jeśli masz uprawnienia)
- Analizuje konfigurację wszystkich usług AWS
- Tworzy budżet miesięczny z alertami
- Pokazuje rekomendacje optymalizacji

### 2. 🔄 Migracja OpenSearch (PRIORYTET!)
```bash
./scripts/opensearch-migration.sh
```
**Oszczędności: ~$318/miesiąc**
- Migruje z OpenSearch Serverless na managed instances
- Konfiguruje t3.small.search (Free Tier eligible)
- Tworzy skrypt do usunięcia Serverless collections
- **UWAGA**: Sprawdź czy nowy domain działa przed usunięciem Serverless!

### 3. 💾 Optymalizacja S3
```bash
./scripts/s3-lifecycle-optimization.sh
```
**Oszczędności: 50-75% kosztów storage**
- Konfiguruje lifecycle policies (IA → Glacier → Deep Archive)
- Usuwa incomplete multipart uploads
- Optymalizuje versioning
- Automatyzuje przejścia między klasami storage

### 4. 🤖 Optymalizacja Bedrock
```bash
./scripts/bedrock-cost-optimization.sh
```
**Oszczędności: 50-90% kosztów modeli**
- Analizuje używane modele
- Rekomenduje tańsze alternatywy
- Tworzy zoptymalizowane konfiguracje
- Implementuje monitoring kosztów

## 📋 Plan wdrożenia (krok po kroku)

### Faza 1: Analiza i monitoring (dzisiaj)
1. ✅ Uruchom: `./scripts/aws-cost-optimization.sh`
2. ✅ Sprawdź aktualne koszty w AWS Console → Billing
3. ✅ Skonfiguruj budżet miesięczny ($50)
4. ✅ Ustaw alerty kosztów

### Faza 2: OpenSearch migration (priorytet - największe oszczędności)
1. 🔄 Uruchom: `./scripts/opensearch-migration.sh`
2. 🔄 Poczekaj 10-15 minut na utworzenie domain
3. 🔄 Przetestuj nowy endpoint
4. 🔄 Zaktualizuj konfigurację Bedrock
5. 🔄 Po potwierdzeniu uruchom: `./cleanup-serverless.sh`

### Faza 3: S3 optimization
1. 📦 Uruchom: `./scripts/s3-lifecycle-optimization.sh`
2. 📦 Skonfiguruj lifecycle policies dla wszystkich buckets
3. 📦 Wyczyść niepotrzebne pliki

### Faza 4: Bedrock optimization
1. 🤖 Uruchom: `./scripts/bedrock-cost-optimization.sh`
2. 🤖 Przetestuj tańsze modele (Llama 2, Titan)
3. 🤖 Zoptymalizuj prompty
4. 🤖 Wdróż monitoring

## 💰 Szczegółowe oszczędności

### OpenSearch Serverless → Managed
```
PRZED: $345/miesiąc (minimum 2 OCU)
PO:    $27/miesiąc (t3.small.search + 10GB)
FREE TIER: $1.35/miesiąc (pierwszy rok)

OSZCZĘDNOŚCI: $318/miesiąc = $3,816/rok
```

### Bedrock Models
```
Claude-3 Opus:    $75/1M tokenów
Claude-3 Sonnet:  $15/1M tokenów  
Claude-2:         $8/1M tokenów
Llama 2:          $0.75/1M tokenów ← REKOMENDOWANE
Titan:            $0.50/1M tokenów ← NAJTAŃSZE

OSZCZĘDNOŚCI: 90% przy zmianie Claude → Titan
```

### S3 Lifecycle Policies
```
Standard:      $0.023/GB/miesiąc
Standard-IA:   $0.0125/GB/miesiąc (po 30 dniach)
Glacier:       $0.004/GB/miesiąc (po 90 dniach)
Deep Archive:  $0.00099/GB/miesiąc (po roku)

OSZCZĘDNOŚCI: 75% dla starszych plików
```

## 🔍 Monitoring i alerty

### AWS Budgets
- Budżet miesięczny: $50
- Alert przy 80%: $40
- Alert przy 100%: $50

### CloudWatch Alarms
- Nietypowe użycie Lambda
- Wysokie koszty Bedrock
- Duże transfery S3

### Regularne sprawdzenia
- Tygodniowo: AWS Cost Explorer
- Miesięcznie: Przegląd budżetu
- Kwartalnie: Optymalizacja konfiguracji

## ⚠️ Ważne uwagi

### Przed migracją OpenSearch:
1. **Backup danych** z Serverless collections
2. **Przetestuj** nowy endpoint
3. **Zaktualizuj** wszystkie aplikacje
4. **Dopiero potem** usuń Serverless

### Bedrock optimization:
1. **Przetestuj** tańsze modele na dev environment
2. **Sprawdź jakość** odpowiedzi
3. **Monitoruj** performance
4. **Stopniowo** migruj na production

### S3 lifecycle:
1. **Przeanalizuj** wzorce dostępu do plików
2. **Dostosuj** okresy przejść
3. **Przetestuj** restore z Glacier (może być kosztowne)

## 🆘 Troubleshooting

### Brak uprawnień AWS
```bash
# Sprawdź uprawnienia
aws sts get-caller-identity

# Potrzebne uprawnienia:
# - budgets:CreateBudget
# - ce:GetCostAndUsage  
# - opensearch:*
# - bedrock:*
# - s3:*
```

### OpenSearch migration issues
```bash
# Sprawdź status domain
aws opensearch describe-domain --domain-name ecm-digital-search

# Sprawdź logi
aws logs describe-log-groups --log-group-name-prefix "/aws/opensearch"
```

### Bedrock model errors
```bash
# Lista dostępnych modeli
aws bedrock list-foundation-models --region eu-west-1

# Sprawdź limity
aws service-quotas get-service-quota --service-code bedrock --quota-code L-12345
```

## 📞 Kontakt i wsparcie

W przypadku problemów:
1. Sprawdź logi AWS CloudTrail
2. Skontaktuj się z AWS Support
3. Przejrzyj dokumentację AWS

## 🎉 Podsumowanie

**Potencjalne oszczędności roczne: ~$4,000**

1. **OpenSearch migration**: $3,816/rok
2. **Bedrock optimization**: $500-1,000/rok  
3. **S3 lifecycle**: $100-300/rok

**ROI**: Oszczędności zwrócą się w pierwszym miesiącu!

---

*Ostatnia aktualizacja: $(date)*
*Wersja: 1.0*