# 🚀 ECM Digital Services - AWS Upload

## 📋 **Opis**

Ten projekt automatycznie analizuje i zapisuje wszystkie usługi ECM Digital w AWS, tworząc kompletną bazę danych dla:

- **Business Intelligence** 📊
- **AI Chatbot** 🤖
- **Analizy biznesowej** 📈
- **SEO i marketing** 🎯

## 🎯 **Co zostało przeanalizowane**

### **9 Głównych Usług:**
1. **Strony WWW** - Web Development (High Priority)
2. **Sklepy Shopify** - E-commerce (High Priority)
3. **Prototypy MVP** - Web Development (Medium Priority)
4. **Audyty UX** - UX/UI (Medium Priority)
5. **Automatyzacje** - AI & Automation (High Priority)
6. **Social Media & AI** - Digital Marketing (Medium Priority)
7. **Asystenci AI** - AI & Automation (High Priority)
8. **Aplikacje Mobilne** - Mobile (Medium Priority)
9. **Asystenci Głosowi** - AI & Automation (Medium Priority)

## 🛠️ **Instalacja i Uruchomienie**

### **1. Zainstaluj zależności:**
```bash
pip install -r requirements.txt
```

### **2. Skonfiguruj AWS credentials:**
```bash
# Opcja 1: AWS CLI
aws configure

# Opcja 2: Zmienne środowiskowe
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=eu-west-1

# Opcja 3: Plik credentials
~/.aws/credentials
```

### **3. Uruchom upload:**
```bash
python aws-services-upload.py
```

## 📊 **Co zostanie utworzone w AWS**

### **DynamoDB Tables:**
- **`ECMServices`** - Szczegółowe dane o każdej usłudze
- **`ECMAnalytics`** - Analiza biznesowa i insights

### **S3 Bucket:**
- **`ecm-digital-services`** - Backup i wersjonowanie analiz
- **`services-analysis/latest.json`** - Najnowsza wersja
- **`services-analysis/services-analysis-YYYYMMDD_HHMMSS.json`** - Wersjonowane pliki

## 🔍 **Struktura danych w DynamoDB**

### **ECMServices Table:**
```json
{
  "service_id": "websites",
  "name": "Strony WWW",
  "category": "Web Development",
  "description": "...",
  "features": [...],
  "process": {...},
  "technologies": [...],
  "priority": "High",
  "upload_date": "2025-01-24T...",
  "company": "ECM Digital",
  "version": "1.0"
}
```

### **ECMAnalytics Table:**
```json
{
  "analysis_id": "analysis_20250124_...",
  "summary": {
    "total_services": 9,
    "high_priority_services": 4,
    "medium_priority_services": 5,
    "categories": [...]
  },
  "category_breakdown": {...},
  "technology_usage": {...},
  "business_insights": {...}
}
```

## 🎯 **Korzyści biznesowe**

### **1. AI Chatbot:**
- Lepsze odpowiedzi o usługach
- Personalizowane rekomendacje
- Automatyczne lead scoring

### **2. Business Intelligence:**
- Analiza popularności usług
- Identyfikacja luk w ofercie
- Optymalizacja strategii

### **3. Marketing:**
- SEO optimization
- Content strategy
- Lead generation

### **4. Sales:**
- Service comparison
- Pricing optimization
- Cross-selling opportunities

## 🔧 **Konfiguracja AWS**

### **Wymagane uprawnienia IAM:**

#### **Podstawowe uprawnienia (DynamoDB + S3):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "s3:CreateBucket",
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "*"
    }
  ]
}
```

#### **Dodatkowe uprawnienia Cost Explorer:**
⚠️ **Wymagana aktywacja Cost Explorer w AWS Console!**

Dla pełnej funkcjonalności monitoringu kosztów dołącz politykę:
```bash
# Zastosuj politykę Cost Explorer
aws iam attach-user-policy \
    --user-name YOUR_IAM_USER \
    --policy-arn arn:aws:iam::049164057970:policy/ECM-CostExplorer-Policy
```

📋 **Szczegóły**: Zobacz `docs/AWS-COST-EXPLORER-SETUP.md`
```

## 📈 **Monitoring i Analytics**

### **CloudWatch Metrics:**
- Upload success rate
- Data freshness
- Service popularity

### **DynamoDB Insights:**
- Read/Write capacity
- Hot partitions
- Performance optimization

## 🚀 **Następne kroki**

1. **Uruchom upload** do AWS
2. **Skonfiguruj monitoring** w CloudWatch
3. **Zintegruj z AI chatbot** na stronie
4. **Stwórz dashboard** w QuickSight
5. **Automatyzuj aktualizacje** (cron job)

## 📞 **Wsparcie**

W przypadku problemów:
- Sprawdź AWS credentials
- Sprawdź uprawnienia IAM
- Sprawdź region (eu-west-1)
- Sprawdź logi w konsoli

---

**🎉 Gotowe do uruchomienia!**


