# Dostęp do regionu AWS eu-west-1

## 🌍 Status regionu eu-west-1

✅ **Region jest aktywny i skonfigurowany!**

## 📊 Dostępne usługi w eu-west-1

### ✅ S3 Storage
**10 buckets ECM Digital:**
- `ecm-avatars`
- `ecm-client-dashboard-prod-1756058879`
- `ecm-digital-assets`
- `ecm-digital-cms-dev`
- `ecm-digital-kb`
- `ecm-digital-knowledge`
- `ecm-digital-knowledge-dev`
- `ecm-digital-services`
- `ecm-documents`
- `ecm-project-files`

### ✅ Lambda Functions
**9 funkcji aktywnych:**
- `ecm-chatbot-function`
- `ecm-documents-function`
- `ecm-auth-function`
- `ecm-projects-function`
- `create_linear_tasks-*` (wiele instancji)

### ✅ DynamoDB
**8 tabel:**
- `ECMAnalytics`
- `ECMServices`
- `ecm-digital-sessions`
- `ecm-digital-users`
- `ecm-documents`
- `ecm-messages`
- `ecm-projects`
- `ecm-users`

### ✅ Bedrock AI
**Dostępne modele:**
- Anthropic Claude Sonnet 4
- Amazon Titan Text Lite
- TwelveLabs Marengo Embed
- I wiele innych...

### ✅ Cost Explorer
- Pełny dostęp do analizy kosztów
- Wszystkie funkcje monitoringu
- Budżety i alerty

## 🔧 Narzędzia zarządzania

### Przełączanie regionów
```bash
# Użyj interaktywnego skryptu
./scripts/aws-region-switch.sh

# Lub ustaw bezpośrednio
aws configure set region eu-west-1
export AWS_DEFAULT_REGION=eu-west-1
export AWS_REGION=eu-west-1
```

### Analiza kosztów
```bash
# Skrypt zoptymalizowany dla eu-west-1
./scripts/aws-cost-optimization.sh
```

### Sprawdzenie zasobów
```bash
# S3 buckets
aws s3api list-buckets --region eu-west-1

# Lambda functions
aws lambda list-functions --region eu-west-1

# DynamoDB tables
aws dynamodb list-tables --region eu-west-1

# Bedrock models
aws bedrock list-foundation-models --region eu-west-1
```

## 🌐 Porównanie regionów

| Usługa | eu-west-1 | us-east-1 | us-west-2 |
|--------|-----------|-----------|-----------|
| **S3** | ✅ 10 buckets | ✅ Dostępne | ✅ 1 bucket |
| **Lambda** | ✅ 9 funkcji | ✅ Dostępne | ✅ Dostępne |
| **DynamoDB** | ✅ 8 tabel | ✅ Dostępne | ✅ Dostępne |
| **Bedrock** | ✅ Claude 4 | ✅ Wszystkie | ✅ Wszystkie |
| **Cost Explorer** | ✅ Pełny | ✅ **Główny** | ✅ Dostępne |
| **CloudFront** | ⚠️ Global | ✅ **Główny** | ✅ Dostępne |

## 💡 Rekomendacje

### Główny region: eu-west-1
- **Wszystkie zasoby produkcyjne**
- **Najniższa latencja dla Europy**
- **Zgodność z GDPR**

### Użyj us-east-1 dla:
- Cost Explorer (główny region)
- CloudFront distributions
- Niektóre globalne usługi

### Użyj us-west-2 dla:
- Najnowsze modele Bedrock
- Backup i disaster recovery

## 🚀 Szybki start

```bash
# 1. Ustaw region
aws configure set region eu-west-1

# 2. Sprawdź dostęp
./scripts/aws-region-switch.sh

# 3. Analizuj koszty
./scripts/aws-cost-optimization.sh

# 4. Zarządzaj zasobami
aws s3 ls
aws lambda list-functions
aws dynamodb list-tables
```

---
**Status**: ✅ **PEŁNY DOSTĘP DO eu-west-1**  
**Ostatnia aktualizacja**: 2024-01-16