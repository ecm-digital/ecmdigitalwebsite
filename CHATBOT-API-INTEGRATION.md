# 🤖 Chatbot API Integration - ECM Digital

## 📋 **Opis**

Chatbot na stronie ECM Digital został zaktualizowany, żeby korzystać z naszego systemu AWS API. Teraz może inteligentnie odpowiadać na pytania o usługi używając danych z DynamoDB.

## 🚀 **Funkcje**

### **1. Inteligentne odpowiedzi o usługach**
- Rozpoznaje polskie zapytania
- Odpowiada na podstawie aktualnych danych z AWS
- Pokazuje rekomendacje usług

### **2. Dwa tryby pracy**
- **API Mode** (domyślnie włączony) - używa naszego AWS Lambda API
- **Direct Mode** - używa bezpośrednich wywołań AWS SDK

### **3. Rekomendacje usług**
- Automatycznie pokazuje pasujące usługi
- Karty usług z linkami do szczegółów
- Hover efekty i animacje

## ⚙️ **Konfiguracja**

### **1. Tryb API (domyślnie włączony)**
```javascript
// W konstruktorze AWSChatbot
this.useAPI = true; // ✅ Używa naszego API
this.apiEndpoint = 'https://ctdktnhcv8.execute-api.eu-west-1.amazonaws.com/prod/chat';
```

### **2. Dodanie toggle przycisku (opcjonalnie)**
```html
<div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" id="apiModeToggle">
    <label class="form-check-label" for="apiModeToggle">
        Tryb API (AWS)
    </label>
</div>
```

## 🎯 **Jak to działa**

### **1. Przepływ API:**
```
Użytkownik → Chatbot → API Gateway → Lambda → DynamoDB → Chatbot → Użytkownik
```

### **2. Format odpowiedzi API:**
```json
{
  "message": "Oto informacje o usłudze Strony WWW...",
  "services": [
    {
      "id": "websites",
      "name": "Strony WWW",
      "description": "...",
      "category": "Web Development",
      "priority": "High",
      "url": "/dokumentacja-ecm/oferta-uslug/strony-www/"
    }
  ],
  "timestamp": "2025-01-24T18:05:16.869Z",
  "query": "strony www"
}
```

### **3. Przykładowe zapytania:**
- `"strony www"` → informacje o Strony WWW
- `"automatyzacje"` → informacje o Automatyzacje n8n
- `"shopify"` → informacje o Sklepy Shopify
- `"ai asystent"` → informacje o Asystenci AI

## 🔧 **Rozszerzenia**

### **1. Dodanie nowych usług**
Nowe usługi dodajesz w AWS DynamoDB w tabeli `ECMServices`

### **2. Modyfikacja odpowiedzi**
Edytuj kod w `lambda-chatbot/index.js` w funkcji `findRelevantServices`

### **3. Dodanie nowych języków**
Rozszerz `keywordMap` w pliku Lambda

## 📊 **Monitoring**

### **1. CloudWatch Logs:**
```bash
aws logs tail /aws/lambda/ecm-chatbot-function --follow
```

### **2. API Gateway Metrics:**
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name Count \
  --dimensions Name=ApiName,Value=ECM-Chatbot-API \
  --start-time $(date -u -d '1 hour ago' '+%Y-%m-%dT%H:%M:%S') \
  --end-time $(date -u '+%Y-%m-%dT%H:%M:%S') \
  --period 3600
```

## 🔍 **Debugging**

### **1. Sprawdź tryb API:**
```javascript
console.log('Chatbot API mode:', chatbot.useAPI);
```

### **2. Testuj API bezpośrednio:**
```bash
curl -X POST https://ctdktnhcv8.execute-api.eu-west-1.amazonaws.com/prod/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"strony www"}'
```

### **3. Sprawdź logi przeglądarki:**
- Otwórz Developer Tools (F12)
- Przejdź do Console
- Szukaj logów z prefiksem: `🔄`, `🌐`, `✅`, `❌`

## 🚨 **Rozwiązywanie problemów**

### **1. API nie działa:**
- Sprawdź czy `this.useAPI = true`
- Sprawdź endpoint URL
- Sprawdź CORS w API Gateway

### **2. Brak odpowiedzi:**
- Sprawdź logi Lambda w CloudWatch
- Sprawdź czy tabela DynamoDB ma dane
- Sprawdź uprawnienia IAM

### **3. Błędy CORS:**
- Sprawdź konfigurację API Gateway
- Sprawdź nagłówki w odpowiedzi Lambda

## 📈 **Statystyki użycia**

### **Śledzenie popularności usług:**
```javascript
// W odpowiedzi API
{
  "services": [...],
  "analytics": {
    "query": "strony www",
    "services_found": 1,
    "timestamp": "..."
  }
}
```

## 🎯 **Następne kroki**

1. **Testuj** różne zapytania
2. **Dodaj** przycisk toggle API mode
3. **Monitoruj** użycie w CloudWatch
4. **Optymalizuj** odpowiedzi w Lambda
5. **Rozszerz** bazę wiedzy o usługach

## 📞 **Wsparcie**

W przypadku problemów:
1. Sprawdź logi przeglądarki
2. Testuj API bezpośrednio przez curl
3. Sprawdź status AWS Lambda
4. Sprawdź logi CloudWatch

---

**🎉 Chatbot jest teraz połączony z AWS i gotowy do użycia!**




