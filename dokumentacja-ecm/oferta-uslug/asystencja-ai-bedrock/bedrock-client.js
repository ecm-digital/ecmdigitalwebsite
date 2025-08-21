// Amazon Bedrock Client
// ECM Digital - Integracja z Amazon Bedrock API

class BedrockClient {
    constructor(config = {}) {
        this.config = { ...BEDROCK_CONFIG, ...config };
        this.credentials = getBedrockCredentials();
        this.currentModel = this.config.models.claude.anthropic.claude3Sonnet;
        this.currentRegion = this.config.region;
        
        // Walidacja konfiguracji
        if (!validateConfig()) {
            throw new Error('Nieprawidłowa konfiguracja Amazon Bedrock');
        }
        
        // Sprawdź dostępność modeli
        this.checkModelsAvailability();
    }

    // Sprawdzenie dostępności modeli
    async checkModelsAvailability() {
        if (this.config.production.enableLogging) {
            console.log('🔍 Sprawdzanie dostępności modeli...');
            
            for (const [provider, models] of Object.entries(this.config.models)) {
                for (const [modelName, modelId] of Object.entries(models)) {
                    await checkModelAvailability(modelId, this.currentRegion);
                }
            }
        }
    }

    // Generowanie podpisu AWS Signature V4
    async generateSignature(requestBody, timestamp) {
        const date = timestamp.split('T')[0];
        const region = this.currentRegion;
        const service = 'bedrock';
        
        if (this.config.production.enableLogging) {
            console.log('🔐 Generowanie podpisu AWS dla:', { date, region, service });
        }
        
        // W produkcji użyj AWS SDK
        // Zwróć przykładowy podpis (w produkcji użyj AWS SDK)
        return {
            'X-Amz-Date': timestamp,
            'Authorization': `AWS4-HMAC-SHA256 Credential=${this.credentials.accessKeyId}/${date}/${region}/${service}/aws4_request`
        };
    }

    // Wysyłanie zapytania do Amazon Bedrock z retry logic
    async invokeModel(prompt, options = {}) {
        const {
            model = this.currentModel,
            maxTokens = this.config.defaultParams.maxTokens,
            temperature = this.config.defaultParams.temperature,
            systemPrompt = this.config.systemPrompts.customerSupport
        } = options;

        let lastError;
        
        for (let attempt = 1; attempt <= this.config.production.maxRetries; attempt++) {
            try {
                if (this.config.production.enableLogging) {
                    console.log(`🔄 Próba ${attempt}/${this.config.production.maxRetries} dla modelu ${model}`);
                }

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

                // Wysyłanie zapytania HTTP z timeout
                const response = await this.sendRequestWithTimeout(model, requestBody);
                return this.parseResponse(response, model);

            } catch (error) {
                lastError = error;
                
                if (this.config.production.enableLogging) {
                    console.error(`❌ Próba ${attempt} nieudana:`, error.message);
                }

                // Sprawdź czy to błąd 404 (model niedostępny)
                if (error.message.includes('404') || error.message.includes('NOT_FOUND')) {
                    console.error(`🚫 Model ${model} niedostępny w regionie ${this.currentRegion}`);
                    
                    // Spróbuj zmienić region
                    if (await this.tryAlternativeRegion()) {
                        continue; // Spróbuj ponownie z nowym regionem
                    } else {
                        throw new Error(`Model ${model} niedostępny w żadnym regionie`);
                    }
                }

                // Jeśli to ostatnia próba, rzuć błąd
                if (attempt === this.config.production.maxRetries) {
                    break;
                }

                // Czekaj przed kolejną próbą
                await this.delay(this.config.production.retryDelay * attempt);
            }
        }

        throw new Error(`Wszystkie próby nieudane. Ostatni błąd: ${lastError.message}`);
    }

    // Próba zmiany regionu
    async tryAlternativeRegion() {
        const alternativeRegions = ['us-west-2', 'eu-west-1', 'ap-southeast-1'];
        
        for (const region of alternativeRegions) {
            if (region === this.currentRegion) continue;
            
            console.log(`🔄 Próba zmiany regionu na ${region}`);
            this.currentRegion = region;
            this.config.endpoint = this.config.endpoints[region];
            
            // Sprawdź czy model jest dostępny w nowym regionie
            if (await checkModelAvailability(this.currentModel, region)) {
                console.log(`✅ Zmieniono region na ${region}`);
                return true;
            }
        }
        
        return false;
    }

    // Wysyłanie zapytania HTTP z timeout
    async sendRequestWithTimeout(model, requestBody) {
        const timestamp = new Date().toISOString();
        const signature = await this.generateSignature(requestBody, timestamp);
        
        // Kontroler timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.production.requestTimeout);
        
        try {
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
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            return await response.json();

        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error(`Timeout po ${this.config.production.requestTimeout}ms`);
            }
            
            throw error;
        }
    }

    // Parsowanie odpowiedzi z różnych modeli
    parseResponse(response, model) {
        if (this.config.production.enableLogging) {
            console.log('📥 Otrzymano odpowiedź od modelu:', model);
        }

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
        console.log('🔄 Zmieniono model na:', modelId);
    }

    // Zmiana regionu
    setRegion(region) {
        if (this.config.endpoints[region]) {
            this.currentRegion = region;
            this.config.endpoint = this.config.endpoints[region];
            console.log('🌍 Zmieniono region na:', region);
        } else {
            console.error('❌ Nieprawidłowy region:', region);
        }
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
            console.error('❌ Błąd podczas generowania embeddingu:', error);
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
            console.error('❌ Błąd podczas chatu:', error);
            throw error;
        }
    }

    // Pomocnicza funkcja delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Pobierz status połączenia
    getStatus() {
        return {
            model: this.currentModel,
            region: this.currentRegion,
            endpoint: this.config.endpoint,
            credentials: {
                hasAccessKey: !!this.credentials.accessKeyId,
                hasSecretKey: !!this.credentials.secretAccessKey
            }
        };
    }
}

// Eksportuj klasę
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BedrockClient;
} else if (typeof window !== 'undefined') {
    window.BedrockClient = BedrockClient;
}
