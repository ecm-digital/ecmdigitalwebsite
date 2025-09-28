# Amazon Bedrock Integration - ECM Digital

## 🚀 Przegląd

Kompletna integracja z Amazon Bedrock API dla asystentów AI. Zawiera konfigurację, klienta API i interaktywne demo.

## 📁 Struktura Plików

```
asystencja-ai-bedrock/
├── index.html              # Główna strona usługi
├── bedrock-config.js       # Konfiguracja API i modele
├── bedrock-client.js       # Główny klient Bedrock
├── bedrock-demo.html       # Interaktywne demo
└── README.md               # Ta dokumentacja
```

## 🔧 Instalacja i Konfiguracja

### 1. Klucze API

**Ważne:** Nigdy nie commituj kluczy API do repozytorium!

#### Opcja A: Zmienne środowiskowe (Produkcja)
```bash
export AWS_ACCESS_KEY_ID="twój_access_key"
export AWS_SECRET_ACCESS_KEY="twój_secret_key"
export AWS_SESSION_TOKEN="twój_session_token"  # opcjonalnie
```

#### Opcja B: localStorage (Development)
```javascript
// W konsoli przeglądarki
localStorage.setItem('BEDROCK_ACCESS_KEY_ID', 'twój_access_key');
localStorage.setItem('BEDROCK_SECRET_ACCESS_KEY', 'twój_secret_key');
```

### 2. Konfiguracja Region

Edytuj `bedrock-config.js`:
```javascript
const BEDROCK_CONFIG = {
    region: 'us-east-1', // lub 'eu-west-1', 'ap-southeast-1'
    endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com'
};
```

## 🎯 Użycie

### Podstawowe Użycie

```javascript
// Inicjalizacja klienta
const client = new BedrockClient();

// Proste zapytanie
const response = await client.invokeModel("Witaj, jak się masz?");

// Z parametrami
const response = await client.invokeModel("Opisz sztuczną inteligencję", {
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    temperature: 0.8,
    maxTokens: 2000
});
```

### Dostępne Modele

#### Claude (Anthropic)
- `anthropic.claude-3-sonnet-20240229-v1:0` - Najlepszy ogólny model
- `anthropic.claude-3-haiku-20240307-v1:0` - Szybki i wydajny
- `anthropic.claude-3-opus-20240229-v1:0` - Najbardziej zaawansowany

#### Titan (Amazon)
- `amazon.titan-text-express-v1` - Generowanie tekstu
- `amazon.titan-embed-text-v1` - Embeddingi

#### Llama (Meta)
- `meta.llama2-13b-chat-v1` - 13B parametrów
- `meta.llama2-70b-chat-v1` - 70B parametrów

#### Cohere
- `cohere.command-text-v14` - Generowanie tekstu
- `cohere.command-light-text-v14` - Lżejsza wersja

### Typy Asystentów

```javascript
// Obsługa klienta
client.setSystemPrompt('customerSupport');

// Copywriter
client.setSystemPrompt('contentWriter');

// Asystent programowania
client.setSystemPrompt('codeAssistant');

// Analityk biznesowy
client.setSystemPrompt('businessAnalyst');
```

## 🔒 Bezpieczeństwo

### Best Practices

1. **Nigdy nie commituj kluczy API**
2. **Używaj zmiennych środowiskowych w produkcji**
3. **Implementuj rate limiting**
4. **Loguj wszystkie zapytania**
5. **Używaj HTTPS**

### Implementacja Rate Limiting

```javascript
class RateLimitedBedrockClient extends BedrockClient {
    constructor(config) {
        super(config);
        this.requestCount = 0;
        this.lastReset = Date.now();
        this.maxRequestsPerMinute = 100;
    }

    async invokeModel(prompt, options) {
        if (this.isRateLimited()) {
            throw new Error('Rate limit exceeded. Try again later.');
        }
        
        this.requestCount++;
        return super.invokeModel(prompt, options);
    }

    isRateLimited() {
        const now = Date.now();
        if (now - this.lastReset > 60000) {
            this.requestCount = 0;
            this.lastReset = now;
        }
        return this.requestCount >= this.maxRequestsPerMinute;
    }
}
```

## 🧪 Testowanie

### Demo Strona

Otwórz `bedrock-demo.html` w przeglądarce:

1. **Dodaj klucze API** w localStorage
2. **Wybierz model AI**
3. **Dostosuj parametry** (temperatura, tokeny)
4. **Rozpocznij chat** z AI

### Testy Automatyczne

```javascript
// Przykład testu
describe('BedrockClient', () => {
    it('should initialize with default config', () => {
        const client = new BedrockClient();
        expect(client.currentModel).toBe('anthropic.claude-3-sonnet-20240229-v1:0');
    });

    it('should change model', () => {
        const client = new BedrockClient();
        client.setModel('amazon.titan-text-express-v1');
        expect(client.currentModel).toBe('amazon.titan-text-express-v1');
    });
});
```

## 📊 Monitorowanie

### Logi

```javascript
// Dodaj logging do klienta
class LoggingBedrockClient extends BedrockClient {
    async invokeModel(prompt, options) {
        console.log(`[${new Date().toISOString()}] Model request:`, {
            model: options.model || this.currentModel,
            promptLength: prompt.length,
            options
        });

        try {
            const response = await super.invokeModel(prompt, options);
            console.log(`[${new Date().toISOString()}] Model response:`, {
                contentLength: response.content.length,
                model: response.model,
                type: response.type
            });
            return response;
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Model error:`, error);
            throw error;
        }
    }
}
```

### Metryki

```javascript
// Śledzenie użycia
const metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    totalTokens: 0
};

// Dodaj do klienta
client.on('request', () => metrics.totalRequests++);
client.on('success', (response) => {
    metrics.successfulRequests++;
    metrics.totalTokens += response.usage?.input_tokens || 0;
});
```

## 🚀 Deployment

### Produkcja

1. **Skonfiguruj AWS IAM** z odpowiednimi uprawnieniami
2. **Ustaw zmienne środowiskowe**
3. **Włącz CloudWatch** dla monitorowania
4. **Skonfiguruj VPC** jeśli potrzebne

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
```

## 📚 Zasoby

- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [Claude API Reference](https://docs.anthropic.com/claude/reference)
- [Titan Models](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-models.html)

## 🤝 Wsparcie

- **ECM Digital Team** - Wsparcie techniczne
- **AWS Support** - Problemy z Bedrock API
- **GitHub Issues** - Błędy w kodzie

## 📄 Licencja

MIT License - ECM Digital 2025

---

**Uwaga:** Ta integracja jest w wersji beta. Przetestuj dokładnie przed użyciem w produkcji.
