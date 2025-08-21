// Amazon Bedrock API Configuration
// ECM Digital - Asystenci AI na Amazon Bedrock

const BEDROCK_CONFIG = {
    // AWS Region dla Amazon Bedrock
    region: 'us-east-1', // lub 'eu-west-1', 'ap-southeast-1'
    
    // Endpoint dla Amazon Bedrock
    endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com',
    
    // Dostępne modele AI
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

// Eksportuj konfigurację
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BEDROCK_CONFIG, getBedrockCredentials };
} else if (typeof window !== 'undefined') {
    window.BEDROCK_CONFIG = BEDROCK_CONFIG;
    window.getBedrockCredentials = getBedrockCredentials;
}
