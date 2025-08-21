// Amazon Bedrock Client
// ECM Digital - Integracja z Amazon Bedrock API

class BedrockClient {
    constructor(config = {}) {
        this.config = { ...BEDROCK_CONFIG, ...config };
        this.credentials = getBedrockCredentials();
        this.currentModel = this.config.models.claude.anthropic.claude3Sonnet;
    }

    // Generowanie podpisu AWS Signature V4
    async generateSignature(requestBody, timestamp) {
        const date = timestamp.split('T')[0];
        const region = this.config.region;
        const service = 'bedrock';
        
        // W produkcji użyj AWS SDK
        console.log('Generowanie podpisu AWS dla:', { date, region, service });
        
        // Zwróć przykładowy podpis (w produkcji użyj AWS SDK)
        return {
            'X-Amz-Date': timestamp,
            'Authorization': `AWS4-HMAC-SHA256 Credential=${this.credentials.accessKeyId}/${date}/${region}/${service}/aws4_request`
        };
    }

    // Wysyłanie zapytania do Amazon Bedrock
    async invokeModel(prompt, options = {}) {
        const {
            model = this.currentModel,
            maxTokens = this.config.defaultParams.maxTokens,
            temperature = this.config.defaultParams.temperature,
            systemPrompt = this.config.systemPrompts.customerSupport
        } = options;

        try {
            // Przygotuj body dla różnych modeli
            let requestBody;
            if (model.includes('claude')) {
                requestBody = {
                    anthropic_version: "bedrock-2023-05-31",
                    max_tokens: maxTokens,
                    temperature: temperature,
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                };
            } else if (model.includes('titan')) {
                requestBody = {
                    inputText: prompt,
                    textGenerationConfig: {
                        maxTokenCount: maxTokens,
                        temperature: temperature,
                        topP: this.config.defaultParams.topP
                    }
                };
            } else if (model.includes('llama')) {
                requestBody = {
                    prompt: `[INST] ${systemPrompt}\n\n${prompt} [/INST]`,
                    max_gen_len: maxTokens,
                    temperature: temperature,
                    top_p: this.config.defaultParams.topP
                };
            }

            // Wysyłanie zapytania HTTP
            const response = await this.sendRequest(model, requestBody);
            return this.parseResponse(response, model);

        } catch (error) {
            console.error('Błąd podczas wywoływania modelu Bedrock:', error);
            throw new Error(`Błąd Amazon Bedrock: ${error.message}`);
        }
    }

    // Wysyłanie zapytania HTTP
    async sendRequest(model, requestBody) {
        const timestamp = new Date().toISOString();
        const signature = await this.generateSignature(requestBody, timestamp);
        
        const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Amz-Target': `com.amazonaws.bedrock.runtime.model.InvokeModel`,
                ...signature
            },
            body: JSON.stringify({
                modelId: model,
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(requestBody)
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    // Parsowanie odpowiedzi z różnych modeli
    parseResponse(response, model) {
        if (model.includes('claude')) {
            return {
                content: response.content[0].text,
                model: model,
                usage: response.usage,
                type: 'claude'
            };
        } else if (model.includes('titan')) {
            return {
                content: response.results[0].outputText,
                model: model,
                type: 'titan'
            };
        } else if (model.includes('llama')) {
            return {
                content: response.generation,
                model: model,
                type: 'llama'
            };
        }
        
        return {
            content: 'Nieznany format odpowiedzi',
            model: model,
            type: 'unknown'
        };
    }

    // Zmiana modelu AI
    setModel(modelId) {
        this.currentModel = modelId;
        console.log('Zmieniono model na:', modelId);
    }

    // Ustawienie promptu systemowego
    setSystemPrompt(promptType) {
        return this.config.systemPrompts[promptType] || this.config.systemPrompts.customerSupport;
    }

    // Generowanie embeddów (dla Titan Embed)
    async generateEmbedding(text) {
        try {
            const response = await this.invokeModel(text, {
                model: this.config.models.titan.amazon.titanEmbed,
                systemPrompt: 'Generuj embedding dla tekstu.'
            });
            return response;
        } catch (error) {
            console.error('Błąd podczas generowania embeddingu:', error);
            throw error;
        }
    }

    // Chat z historią konwersacji
    async chat(message, conversationHistory = []) {
        const messages = [
            { role: 'system', content: this.config.systemPrompts.customerSupport },
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        try {
            const response = await this.invokeModel(message, {
                systemPrompt: this.config.systemPrompts.customerSupport
            });

            return {
                response: response.content,
                conversationHistory: [...conversationHistory, 
                    { role: 'user', content: message },
                    { role: 'assistant', content: response.content }
                ]
            };
        } catch (error) {
            console.error('Błąd podczas chatu:', error);
            throw error;
        }
    }
}

// Eksportuj klasę
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BedrockClient;
} else if (typeof window !== 'undefined') {
    window.BedrockClient = BedrockClient;
}
