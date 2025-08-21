// Amazon Bedrock API Configuration
// ECM Digital - Asystenci AI na Amazon Bedrock

const BEDROCK_CONFIG = {
    // AWS Region dla Amazon Bedrock
    region: 'us-east-1', // lub 'eu-west-1', 'ap-southeast-1'
    
    // Endpoint dla Amazon Bedrock - poprawiony dla produkcji
    endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com',
    
    // Alternatywne endpointy dla różnych regionów
    endpoints: {
        'us-east-1': 'https://bedrock-runtime.us-east-1.amazonaws.com',
        'us-west-2': 'https://bedrock-runtime.us-west-2.amazonaws.com',
        'eu-west-1': 'https://bedrock-runtime.eu-west-1.amazonaws.com',
        'ap-southeast-1': 'https://bedrock-runtime.ap-southeast-1.amazonaws.com'
    },
    
    // Dostępne modele AI - z poprawionymi ID
    models: {
        claude: {
            anthropic: {
                claude3Sonnet: 'anthropic.claude-3-sonnet-20240229-v1:0',
                claude3Haiku: 'anthropic.claude-3-haiku-20240307-v1:0',
                claude3Opus: 'anthropic.claude-3-opus-20240229-v1:0'
            }
        },
        titan: {
            amazon: {
                titanText: 'amazon.titan-text-express-v1',
                titanEmbed: 'amazon.titan-embed-text-v1'
            }
        },
        llama: {
            meta: {
                llama2: 'meta.llama2-13b-chat-v1',
                llama2_70b: 'meta.llama2-70b-chat-v1'
            }
        },
        cohere: {
            command: 'cohere.command-text-v14',
            commandLight: 'cohere.command-light-text-v14'
        }
    },
    
    // Domyślne parametry dla modeli
    defaultParams: {
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.9,
        topK: 250
    },
    
    // Prompty systemowe dla różnych zastosowań
    systemPrompts: {
        customerSupport: "Jesteś pomocnym asystentem obsługi klienta ECM Digital. Odpowiadaj profesjonalnie i pomocnie.",
        contentWriter: "Jesteś kreatywnym copywriterem specjalizującym się w treściach marketingowych i technicznych.",
        codeAssistant: "Jesteś doświadczonym programistą pomagającym w rozwiązywaniu problemów technicznych.",
        businessAnalyst: "Jesteś analitykiem biznesowym pomagającym w analizie danych i strategii."
    },
    
    // Konfiguracja dla produkcji
    production: {
        // Włącz szczegółowe logowanie
        enableLogging: true,
        // Timeout dla zapytań (ms)
        requestTimeout: 30000,
        // Maksymalna liczba prób
        maxRetries: 3,
        // Opóźnienie między próbami (ms)
        retryDelay: 1000
    }
};

// Funkcja do bezpiecznego pobierania kluczy API
function getBedrockCredentials() {
    // W produkcji użyj zmiennych środowiskowych
    if (typeof process !== 'undefined' && process.env) {
        return {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN
        };
    }
    
    // Dla frontendu - użyj bezpiecznego przechowywania
    return {
        accessKeyId: localStorage.getItem('BEDROCK_ACCESS_KEY_ID'),
        secretAccessKey: localStorage.getItem('BEDROCK_SECRET_ACCESS_KEY')
    };
}

// Funkcja do sprawdzania dostępności modeli
async function checkModelAvailability(modelId, region = 'us-east-1') {
    try {
        const endpoint = BEDROCK_CONFIG.endpoints[region] || BEDROCK_CONFIG.endpoints['us-east-1'];
        const response = await fetch(`${endpoint}/models/${modelId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log(`✅ Model ${modelId} dostępny w regionie ${region}`);
            return true;
        } else {
            console.warn(`⚠️ Model ${modelId} niedostępny w regionie ${region}: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Błąd sprawdzania modelu ${modelId}:`, error);
        return false;
    }
}

// Funkcja do walidacji konfiguracji
function validateConfig() {
    const errors = [];
    
    // Sprawdź region
    if (!BEDROCK_CONFIG.region) {
        errors.push('Brak zdefiniowanego regionu AWS');
    }
    
    // Sprawdź endpoint
    if (!BEDROCK_CONFIG.endpoint) {
        errors.push('Brak zdefiniowanego endpointu');
    }
    
    // Sprawdź modele
    if (!BEDROCK_CONFIG.models || Object.keys(BEDROCK_CONFIG.models).length === 0) {
        errors.push('Brak zdefiniowanych modeli AI');
    }
    
    if (errors.length > 0) {
        console.error('❌ Błędy konfiguracji Amazon Bedrock:', errors);
        return false;
    }
    
    console.log('✅ Konfiguracja Amazon Bedrock poprawna');
    return true;
}

// Eksportuj konfigurację
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        BEDROCK_CONFIG, 
        getBedrockCredentials, 
        checkModelAvailability, 
        validateConfig 
    };
} else if (typeof window !== 'undefined') {
    window.BEDROCK_CONFIG = BEDROCK_CONFIG;
    window.getBedrockCredentials = getBedrockCredentials;
    window.checkModelAvailability = checkModelAvailability;
    window.validateConfig = validateConfig;
}
