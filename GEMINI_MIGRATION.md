# 🔄 Migracja z Amazon Bedrock do Google Gemini

## ✅ Co zostało zrobione

Projekt został zmigrowany z Amazon Bedrock na Google Gemini API.

## 📁 Zmienione pliki

### 1. **Nowe pliki:**
- `src/js/gemini-client.js` - Klient Google Gemini API

### 2. **Zaktualizowane pliki:**
- `src/js/aws-chatbot.js` - Zmieniono z Bedrock na Gemini
- `index.html` - Usunięto referencje do Bedrock, dodano Gemini

## 🔧 Konfiguracja

### Jak uzyskać klucz API Google Gemini:

1. Przejdź do: https://makersuite.google.com/app/apikey
2. Zaloguj się kontem Google
3. Kliknij "Create API Key"
4. Skopiuj wygenerowany klucz

### Jak ustawić klucz API:

**Opcja 1: W localStorage (rekomendowane)**
```javascript
localStorage.setItem('GEMINI_API_KEY', 'YOUR_API_KEY_HERE');
```

**Opcja 2: W pliku index.html**
```javascript
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
```

**Opcja 3: Programowo**
```javascript
if (window.geminiClient) {
    window.geminiClient.setApiKey('YOUR_API_KEY_HERE');
}
```

## 🚀 Użycie

### Podstawowe użycie:

```javascript
// Inicjalizacja klienta
const client = new GeminiClient({ apiKey: 'YOUR_API_KEY' });

// Generowanie odpowiedzi
const response = await client.generateContent(
    'Jesteś asystentem ECM Digital...',
    'Witaj! Jakie usługi oferujecie?'
);
```

### W chatbotie:

Chatbot automatycznie używa Gemini, jeśli klucz API jest ustawiony. Jeśli nie, używa fallback responses.

## 📊 Różnice między Bedrock a Gemini

| Funkcja | Amazon Bedrock | Google Gemini |
|---------|---------------|---------------|
| **Model** | Claude 3 Sonnet | Gemini Pro |
| **API Endpoint** | AWS Bedrock Runtime | Google Generative AI API |
| **Autentykacja** | AWS Credentials | API Key |
| **Koszt** | Pay-per-use | Free tier dostępny |
| **Region** | AWS Regions | Global |

## 🔄 Zmiany w kodzie

### Przed (Bedrock):
```javascript
const response = await this.sendToBedrock(text);
const result = await this.callBedrockAPI(systemPrompt, userMessage);
```

### Po (Gemini):
```javascript
const response = await this.sendToGemini(text);
const result = await this.callGeminiAPI(systemPrompt, userMessage);
```

## ⚙️ Konfiguracja zaawansowana

### Zmiana modelu:
```javascript
const client = new GeminiClient({ apiKey: 'YOUR_KEY' });
client.setModel('gemini-1.5-pro'); // lub 'gemini-1.5-flash'
```

### Dostępne modele:
- `gemini-pro` - Podstawowy model (domyślny)
- `gemini-pro-vision` - Z obsługą obrazów
- `gemini-1.5-pro` - Najnowszy model z lepszą wydajnością
- `gemini-1.5-flash` - Szybszy, zoptymalizowany pod kątem prędkości

### Parametry generowania:
```javascript
const response = await client.generateContent(
    systemPrompt,
    userMessage,
    {
        temperature: 0.7,        // Kreatywność (0-1)
        topK: 40,               // Top-K sampling
        topP: 0.95,            // Top-P sampling
        maxOutputTokens: 2048   // Maksymalna długość odpowiedzi
    }
);
```

## 🐛 Troubleshooting

### Problem: "Gemini API key is required"
**Rozwiązanie:** Ustaw klucz API w localStorage lub w skrypcie

### Problem: "Invalid API key"
**Rozwiązanie:** Sprawdź, czy klucz jest poprawny i aktywny

### Problem: "Rate limit exceeded"
**Rozwiązanie:** Google Gemini ma limity. Sprawdź swoje limity w Google Cloud Console

### Problem: Chatbot używa fallback responses
**Rozwiązanie:** 
1. Sprawdź, czy klucz API jest ustawiony
2. Sprawdź konsolę przeglądarki pod kątem błędów
3. Sprawdź, czy `window.geminiClient` jest zainicjalizowany

## 📝 Uwagi

- **Bezpieczeństwo:** Nie commituj kluczy API do repozytorium
- **Limity:** Google Gemini ma darmowy tier z limitami
- **Fallback:** Jeśli Gemini nie działa, chatbot używa lokalnych odpowiedzi
- **Compatibility:** Kod jest kompatybilny wstecz - stare metody Bedrock są zachowane jako fallback

## 🔗 Przydatne linki

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Get API Key](https://makersuite.google.com/app/apikey)
- [Gemini Models Overview](https://ai.google.dev/models/gemini)
- [Pricing](https://ai.google.dev/pricing)

---

**Status:** ✅ Migracja zakończona
**Ostatnia aktualizacja:** Styczeń 2025




