// AWS Chatbot Integration for ECM Digital
// Full integration with Amazon Lex, Polly, and Cognito

class AWSChatbot {
    constructor() {
        this.lexRuntime = null;
        this.polly = null;
        this.cognitoIdentity = null;
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.messages = [];
        this.currentLanguage = 'pl';
        this.botName = 'ECMDigitalBot';
        this.botAlias = 'PROD';
        this.userId = this.generateUserId();
        this.isMuted = false;
        this.selectedVoice = null; // Pre-selected voice

        // AWS API Configuration
        this.useAPI = true; // Set to true to use our Lambda API
        this.apiEndpoint = 'https://ctdktnhcv8.execute-api.eu-west-1.amazonaws.com/prod/chat';
        this.apiTimeout = 10000; // 10 seconds

        this.init();
    }
    
    init() {
        try {
            console.log('🚀 Initializing AWS Chatbot...');
            console.log('🔍 Checking dependencies...');
            
            // Check Bedrock client availability
            console.log('window.BedrockClient:', window.BedrockClient);
            console.log('typeof window.BedrockClient:', typeof window.BedrockClient);
            console.log('window.AWS:', window.AWS);
            console.log('typeof window.AWS:', typeof window.AWS);
            
            if (window.BedrockClient) {
                console.log('🤖 Bedrock client found - will use AI responses');
            } else {
                console.log('⚠️ No Bedrock client found - using fallback responses');
            }
            
            if (window.AWS) {
                console.log('☁️ AWS SDK found - will use AWS services');
            } else {
                console.log('⚠️ No AWS SDK found - some features may not work');
            }
            
                    // Initialize AWS SDK (with fallback)
        try {
            this.initAWS();
        } catch (awsError) {
            console.error('❌ AWS initialization failed:', awsError);
            console.log('🔄 Continuing without AWS services...');
        }
        
        // Check available Polly voices
        if (this.polly) {
            this.checkPollyVoices();
        } else {
            console.log('⚠️ Polly not available - using Web Speech API instead');
        }
            
            // Initialize speech recognition
            this.initSpeechRecognition();
            
            // Load mute preference
            this.loadMutePreference();
            
            // Load voice preference
            this.loadVoicePreference();

            // Load API preference
            this.loadAPIPreference();

            // Bind events
            this.bindEvents();
            
            // Add welcome message
            this.addWelcomeMessage();
            
            // Update voice info display
            this.updateCurrentVoiceInfo();
            
            // Update voice counts
            this.updateVoiceCount();
            
            // Show voice initialization summary
            this.showVoiceInitSummary();
            
            console.log('✅ AWS Chatbot initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing AWS Chatbot:', error);
            console.error('Error stack:', error.stack);
            this.fallbackToBasicChatbot();
        }
    }
    

    async checkPollyVoices() {
        try {
            console.log('🔍 Checking available Polly voices...');
            console.log('🔍 Current AWS region:', AWS.config.region);
            console.log('🔍 Polly instance:', this.polly);
            
            const result = await this.polly.describeVoices().promise();
            console.log('✅ Available Polly voices:', result.Voices?.length || 0);
            
            if (result.Voices && result.Voices.length > 0) {
                const polishVoices = result.Voices.filter(v => v.LanguageCode === 'pl-PL');
                const englishVoices = result.Voices.filter(v => v.LanguageCode === 'en-US');
                
                console.log('🇵🇱 Polish Polly voices:', polishVoices.map(v => v.Id));
                console.log('🇺🇸 English Polly voices:', englishVoices.map(v => v.Id));
                
                // Log first few voices for debugging
                console.log('🔍 Sample voices:', result.Voices.slice(0, 3).map(v => ({
                    id: v.Id,
                    language: v.LanguageCode,
                    name: v.Name
                })));
            }
        } catch (error) {
            console.error('❌ Could not check Polly voices:', error);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error message:', error.message);
            console.error('❌ Full error:', error);
        }
    }
    
    // Show voice initialization summary
    showVoiceInitSummary() {
        if (!this.synthesis) return;
        
        const voices = this.synthesis.getVoices();
        const totalVoices = voices.length;
        const premiumVoices = this.getPremiumVoices().length;
        
        if (totalVoices > 0) {
            console.log(`🎵 Voice system initialized successfully!`);
            console.log(`📊 Available voices: ${totalVoices}`);
            console.log(`⭐ Premium voices: ${premiumVoices}`);
            console.log(`💡 Tip: Use voice selector to choose different voice types`);
            console.log(`🔧 Voice parameters can be customized for each type`);
        } else {
            console.warn(`⚠️ No voices available - speech synthesis may not work properly`);
        }
    }
    
    // Fallback method if AWS services fail
    fallbackToBasicChatbot() {
        console.log('🔄 Falling back to basic chatbot functionality');
        try {
            // Initialize basic speech recognition
            this.initSpeechRecognition();
            
            // Load mute preference
            this.loadMutePreference();
            
            // Load voice preference
            this.loadVoicePreference();

            // Load API preference
            this.loadAPIPreference();

            // Bind events
            this.bindEvents();
            
            // Add welcome message
            this.addWelcomeMessage();
            
            // Update voice info display
            this.updateCurrentVoiceInfo();
            
            // Update voice counts
            this.updateVoiceCount();
            
            console.log('✅ Basic chatbot initialized successfully');
        } catch (error) {
            console.error('❌ Even basic chatbot failed:', error);
        }
    }
    
    initAWS() {
        if (typeof AWS === 'undefined') {
            throw new Error('AWS SDK not loaded');
        }
        
        // Get credentials from localStorage
        const accessKeyId = localStorage.getItem('BEDROCK_ACCESS_KEY_ID');
        const secretAccessKey = localStorage.getItem('BEDROCK_SECRET_ACCESS_KEY');
        
        if (!accessKeyId || !secretAccessKey) {
            console.warn('⚠️ AWS credentials not found; skipping AWS service init (using browser fallback)');
            return; // Do not initialize AWS services without credentials
        }
        
        console.log('🔑 Credentials check:', {
            accessKeyId: accessKeyId ? '***' + accessKeyId.slice(-4) : 'Not set',
            secretAccessKey: secretAccessKey ? '***' + secretAccessKey.slice(-4) : 'Not set',
            accessKeyLength: accessKeyId?.length || 0,
            secretKeyLength: secretAccessKey?.length || 0
        });
        
        // Configure AWS for all services
        AWS.config.update({
            region: 'eu-west-1', // Try EU region first
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        });
        
        console.log('🔧 AWS config updated for Bedrock:', {
            region: AWS.config.region,
            hasCredentials: !!accessKeyId && !!secretAccessKey,
            credentialsFormat: {
                accessKeyFormat: accessKeyId?.startsWith('BedrockAPIKey') ? 'Bedrock Format' : 'Unknown',
                secretKeyFormat: secretAccessKey?.length >= 40 ? 'Valid' : 'Invalid length'
            }
        });
        
        // Initialize AWS services
        console.log('🚀 Initializing AWS services...');
        
        try {
            // Initialize Polly for text-to-speech
            this.polly = new AWS.Polly();
            console.log('✅ Amazon Polly initialized');
            
            // Initialize Lex for chatbot
            this.lexRuntime = new AWS.LexRuntime();
            console.log('✅ Amazon Lex initialized');
            
            // Initialize Cognito for identity
            this.cognitoIdentity = new AWS.CognitoIdentity();
            console.log('✅ Amazon Cognito initialized');
            
            console.log('✅ All AWS services initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing AWS services:', error);
            console.log('🔄 Continuing with fallback services...');
        }
    }
    
    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.currentLanguage === 'pl' ? 'pl-PL' : 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI();
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleUserInput(transcript);
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateUI();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateUI();
            };
            
            console.log('Speech recognition initialized');
        } else {
            console.warn('Speech recognition not supported');
        }
        
        // Initialize speech synthesis voices
        this.initSpeechSynthesis();
    }
    
    initSpeechSynthesis() {
        if (this.synthesis) {
            // Wait for voices to load
            if (this.synthesis.getVoices().length === 0) {
                this.synthesis.onvoiceschanged = () => {
                    console.log('🎵 Voices loaded:', this.synthesis.getVoices().length);
                    this.logAvailableVoices();
                };
            } else {
                this.logAvailableVoices();
            }
        }
    }
    
    logAvailableVoices() {
        if (this.synthesis) {
            const voices = this.synthesis.getVoices();
            console.log('🎵 Total voices available:', voices.length);
            
            const polishVoices = voices.filter(v => v.lang.startsWith('pl'));
            const englishVoices = voices.filter(v => v.lang.startsWith('en'));
            const premiumVoices = this.getPremiumVoices();
            
            console.log('🇵🇱 Polish voices:', polishVoices.map(v => ({ name: v.name, lang: v.lang })));
            console.log('🇺🇸 English voices:', englishVoices.map(v => ({ name: v.name, lang: v.lang })));
            console.log('⭐ Premium voices:', premiumVoices.map(v => ({ name: v.name, lang: v.lang })));
            
            // Log voice selection recommendations
            if (voices.length > 0) {
                console.log('💡 Voice recommendations:');
                console.log('  - For Polish: Try voices with "pl-PL" language');
                console.log('  - For English: Try voices with "en-US" language');
                console.log('  - For Premium: Look for voices with "Premium", "Enhanced", "Neural"');
                console.log('  - For Natural: Try "Samantha", "Alex", "Victoria"');
                console.log('  - For AI: Look for voices with "AI", "Robot", "Synthetic"');
                console.log('  - For Google: Look for voices with "Google" in name');
                console.log('  - For Microsoft: Look for voices with "Microsoft" in name');
            }
        }
    }
    
    bindEvents() {
        // Voice input button
        const voiceButton = document.getElementById('voiceInputButton');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => {
                this.toggleListening();
            });
        }
        
        // Mute button
        const muteButton = document.getElementById('voiceChatbotMute');
        if (muteButton) {
            muteButton.addEventListener('click', () => {
                this.toggleMute();
            });
        }
        
        // Text input and send button
        const textInput = document.getElementById('voiceChatbotTextInput');
        const sendButton = document.getElementById('voiceChatbotSendButton');
        
        if (textInput && sendButton) {
            // Send on button click
            sendButton.addEventListener('click', () => {
                const text = textInput.value.trim();
                if (text) {
                    this.handleUserInput(text);
                    textInput.value = '';
                }
            });
            
            // Send on Enter key
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const text = textInput.value.trim();
                    if (text) {
                        this.handleUserInput(text);
                        textInput.value = '';
                    }
                }
            });
        }
        
        // Suggestion clicks
        document.querySelectorAll('.voice-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const text = suggestion.getAttribute('data-suggestion');
                this.handleUserInput(text);
            });
        });
        
        // Voice selector
        const voiceSelector = document.getElementById('voiceSelector');
        if (voiceSelector) {
            voiceSelector.addEventListener('change', (e) => {
                this.handleVoiceChange(e.target.value);
            });
        }
        
        // Voice reset button
        const resetVoiceButton = document.getElementById('resetVoiceButton');
        if (resetVoiceButton) {
            resetVoiceButton.addEventListener('click', () => {
                this.resetVoice();
                this.showVoiceChangeConfirmation('reset');
            });
        }

        // API Mode Toggle
        const apiToggle = document.getElementById('apiModeToggle');
        if (apiToggle) {
            apiToggle.checked = this.useAPI;
            apiToggle.addEventListener('change', (e) => {
                this.useAPI = e.target.checked;
                localStorage.setItem('chatbotUseAPI', this.useAPI);
                console.log(`🔄 API mode ${this.useAPI ? 'enabled' : 'disabled'}`);
                this.showAPIModeChange();
            });
        }
    }
    
    async handleUserInput(text) {
        // Add user message
        this.addMessage(text, 'user');

        try {
            console.log('🔄 Processing user input:', text);

            // Send to Amazon Bedrock for intelligent response
            const response = await this.sendToBedrock(text);

            console.log('🤖 Bot response:', response);

            // Add bot response
            this.addMessage(response.message, 'bot');

            // Show service recommendations if available
            if (response.services && response.services.length > 0) {
                this.showServiceRecommendations(response.services);
            }

            // Speak response
            this.speak(response.message);

        } catch (error) {
            console.error('❌ Error handling user input:', error);

            // Fallback response
            const fallbackResponse = this.generateFallbackResponse(text);
            console.log('🔄 Using fallback response:', fallbackResponse);
            this.addMessage(fallbackResponse, 'bot');
            this.speak(fallbackResponse);
        }
    }
    
        async sendToBedrock(text) {
        // Check if we should use our API instead of direct AWS calls
        if (this.useAPI) {
            console.log('🔄 Using ECM Digital API instead of direct AWS calls');
            return await this.callAPI(text);
        }

        // Use Amazon Bedrock for intelligent responses
        const systemPrompt = `Jesteś cyfrowym asystentem ECM Digital. Reprezentujesz firmę specjalizującą się w usługach cyfrowych.

INFORMACJE O FIRMIE:
- Strony WWW: od 3,500 PLN
- Sklepy Shopify: od 8,000 PLN
- Aplikacje Mobilne: od 15,000 PLN
- Asystenci AI na Amazon Bedrock: od 12,000 PLN
- Automatyzacje (n8n, Zapier, Opal): od 5,000 PLN
- Audyty UX: od 2,500 PLN
- Social Media + Data Science: od 4,000 PLN

ZADANIE:
Odpowiadaj na pytania klientów w sposób przyjazny, profesjonalny i sprzedażowy. Zawsze staraj się:
1. Zrozumieć potrzeby klienta
2. Zaproponować odpowiednie usługi
3. Umówić konsultację
4. Przedstawić portfolio

JĘZYK: Odpowiadaj w języku ${this.currentLanguage === 'pl' ? 'polskim' : 'angielskim'}.

KONTEKST: ${this.getConversationContext()}`;

        const userMessage = text;

        try {
            // Use Claude 3 Sonnet for best results
            const response = await this.callBedrockAPI(systemPrompt, userMessage);
            return {
                message: response,
                source: 'bedrock',
                model: 'claude-3-sonnet'
            };
        } catch (error) {
            console.error('Bedrock error:', error);
            throw error;
        }
    }

    /**
     * Call our ECM Digital API endpoint
     */
    async callAPI(message) {
        console.log('🌐 Calling ECM Digital API:', message);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.apiTimeout);

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    userId: this.userId,
                    sessionId: `session_${Date.now()}`,
                    language: this.currentLanguage
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API response received:', data);

            return {
                message: data.message,
                services: data.services || [],
                source: 'api',
                timestamp: data.timestamp,
                query: data.query
            };

        } catch (error) {
            console.error('❌ API call failed:', error);

            if (error.name === 'AbortError') {
                throw new Error('API request timeout - spróbuj ponownie');
            }

            // Fallback to local responses if API fails
            console.log('🔄 Falling back to local responses');
            return {
                message: this.generateFallbackResponse(message),
                source: 'fallback',
                error: error.message
            };
        }
    }
    
    async callBedrockAPI(systemPrompt, userMessage) {
        try {
            console.log('🔍 Checking BedrockClient availability in callBedrockAPI...');
            console.log('window.BedrockClient:', window.BedrockClient);
            console.log('typeof window.BedrockClient:', typeof window.BedrockClient);
            
            // Try to use existing Bedrock client if available
            if (window.BedrockClient && typeof window.BedrockClient === 'function') {
                console.log('🚀 Using existing Bedrock client');
                console.log('System prompt:', systemPrompt);
                console.log('User message:', userMessage);
                
                const response = await this.callExistingBedrock(systemPrompt, userMessage);
                console.log('✅ Bedrock response received:', response);
                return response;
            }
            
            // Fallback to simulation if no Bedrock client
            console.log('⚠️ No Bedrock client found, using simulation');
            return this.simulateBedrockResponse(systemPrompt, userMessage);
            
        } catch (error) {
            console.error('❌ Bedrock API call failed:', error);
            console.log('🔄 Falling back to simulation');
            // Fallback to simulation
            return this.simulateBedrockResponse(systemPrompt, userMessage);
        }
    }
    
    async callExistingBedrock(systemPrompt, userMessage) {
        try {
            console.log('🔍 Using AWS SDK for Bedrock...');
            
            // Check if AWS SDK v3 is available
            if (typeof window.AWS === 'undefined') {
                throw new Error('AWS SDK not available');
            }
            
            console.log('🔍 AWS SDK available:', {
                v2: !!window.AWS,
                v3: !!window.AWS.BedrockRuntime,
                services: Object.keys(window.AWS || {})
            });
            
            // Configure AWS with credentials from localStorage
            const accessKeyId = localStorage.getItem('BEDROCK_ACCESS_KEY_ID');
            const secretAccessKey = localStorage.getItem('BEDROCK_SECRET_ACCESS_KEY');
            
            if (!accessKeyId || !secretAccessKey) {
                throw new Error('Bedrock credentials not found in localStorage');
            }
            
            console.log('🔑 Using credentials:', { 
                accessKeyId: accessKeyId ? '***' + accessKeyId.slice(-4) : 'Not set',
                secretAccessKey: secretAccessKey ? '***' + secretAccessKey.slice(-4) : 'Not set'
            });
            
            // Try AWS SDK v3 first, then fallback to v2
            let bedrockRuntime;
            if (window.BedrockRuntimeClient) {
                console.log('🚀 Using AWS SDK v3 BedrockRuntimeClient...');
                bedrockRuntime = new window.BedrockRuntimeClient({
                    region: 'us-east-1',
                    credentials: {
                        accessKeyId: accessKeyId,
                        secretAccessKey: secretAccessKey
                    }
                });
            } else if (window.AWS.BedrockRuntime) {
                console.log('🚀 Using AWS SDK v2 BedrockRuntime...');
                bedrockRuntime = new window.AWS.BedrockRuntime({
                    region: 'us-east-1',
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey
                });
            } else {
                console.log('⚠️ No Bedrock client available, using fallback...');
                throw new Error('No Bedrock client available - using fallback responses');
            }
            
            console.log('🚀 Calling Bedrock via AWS SDK...');
            console.log('Model: anthropic.claude-3-sonnet-20240229-v1:0');
            
            // Prepare request body for Claude
            const requestBody = {
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                temperature: 0.7,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            };
            
            const params = {
                modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(requestBody)
            };
            
            console.log('📤 Sending request to Bedrock...');
            
            let response;
            if (bedrockRuntime.constructor.name === 'BedrockRuntimeClient') {
                // AWS SDK v3
                console.log('📤 Using AWS SDK v3 invokeModel...');
                response = await bedrockRuntime.invokeModel(params);
                console.log('🎯 Bedrock response received (v3):', response);
                
                // Parse response
                const responseBody = JSON.parse(response.body);
                console.log('📝 Response body (v3):', responseBody);
            } else {
                // AWS SDK v2
                console.log('📤 Using AWS SDK v2 invokeModel...');
                response = await bedrockRuntime.invokeModel(params).promise();
                console.log('🎯 Bedrock response received (v2):', response);
                
                // Parse response
                const responseBody = JSON.parse(response.body);
                console.log('📝 Response body (v2):', responseBody);
            }
            
            let extractedText = '';
            if (responseBody && responseBody.content && responseBody.content[0] && responseBody.content[0].text) {
                extractedText = responseBody.content[0].text;
                console.log('✅ Extracted Claude text:', extractedText);
            } else {
                extractedText = 'Przepraszam, nie udało się wygenerować odpowiedzi.';
                console.log('⚠️ Using fallback text');
            }
            
            return extractedText;
            
        } catch (error) {
            console.error('❌ AWS SDK Bedrock call failed:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }
    
    simulateBedrockResponse(systemPrompt, userMessage) {
        // This simulates what Bedrock would return
        // Replace with actual Bedrock API call
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('usług') || lowerMessage.includes('oferta') || lowerMessage.includes('co robicie')) {
            return `Oferujemy kompleksowe usługi cyfrowe dla firm w każdym rozmiarze:

 **Strony WWW** - od 3,500 PLN
   • Responsywne designy
   • SEO optimization
   • Integracje z systemami

🛒 **Sklepy Shopify** - od 8,000 PLN
   • Wysokie konwersje
   • Integracje płatności
   • Automatyzacja sprzedaży

📱 **Aplikacje Mobilne** - od 15,000 PLN
   • iOS i Android
   • Nowoczesne technologie
   • Skalowalne rozwiązania

🤖 **Asystenci AI** - od 12,000 PLN
   • Amazon Bedrock integration
   • Copilot Studio
   • Chatboty głosowe

⚡ **Automatyzacje** - od 5,000 PLN
   • n8n, Zapier, Opal
   • Procesy biznesowe
   • Integracje systemów

Która usługa najbardziej pasuje do Twoich potrzeb? Opowiedz mi o swoim projekcie!`;
        }
        
        if (lowerMessage.includes('ceny') || lowerMessage.includes('koszt') || lowerMessage.includes('pakiety')) {
            return `Nasze ceny są indywidualne i zależą od złożoności projektu:

💰 **Strony WWW:** 3,500 - 15,000 PLN
   • Prosta strona firmowa: 3,500 PLN
   • Zaawansowana z e-commerce: 8,000 PLN
   • Portal korporacyjny: 15,000 PLN

🛒 **Sklepy Shopify:** 8,000 - 25,000 PLN
   • Podstawowy sklep: 8,000 PLN
   • Zaawansowany z automatyzacją: 15,000 PLN
   • Enterprise solution: 25,000 PLN

📱 **Aplikacje Mobilne:** 15,000 - 50,000 PLN
   • MVP: 15,000 PLN
   • Pełna aplikacja: 30,000 PLN
   • Enterprise app: 50,000 PLN

🤖 **Asystenci AI:** 12,000 - 40,000 PLN
   • Podstawowy chatbot: 12,000 PLN
   • Zaawansowany z Bedrock: 25,000 PLN
   • Enterprise AI solution: 40,000 PLN

Chcesz otrzymać dokładną wycenę? Opowiedz mi o swoim projekcie!`;
        }
        
        if (lowerMessage.includes('konsultac') || lowerMessage.includes('spotkanie') || lowerMessage.includes('kontakt')) {
            return `Świetnie! Umówię Cię na bezpłatną konsultację z naszym zespołem ekspertów.

📅 **Dostępne terminy:** poniedziałek - piątek, 9:00 - 17:00
⏰ **Czas konsultacji:** 30-45 minut
💬 **Forma:** online (Teams/Zoom) lub stacjonarnie w Warszawie

📧 **Kontakt:** kontakt@ecmdigital.pl
📱 **Telefon:** +48 XXX XXX XXX

**Co przygotować na konsultację:**
1. Opis projektu/idei
2. Budżet (jeśli znany)
3. Deadline
4. Przykłady podobnych rozwiązań

Kiedy byłbyś dostępny? Podaj preferowany termin i sposób kontaktu!`;
        }
        
        if (lowerMessage.includes('portfolio') || lowerMessage.includes('case') || lowerMessage.includes('projekty')) {
            return `Mamy bogate portfolio projektów w różnych branżach:

🏢 **Strony WWW:**
   • Firma transportowa - wzrost ruchu o 200%
   • Kancelaria prawna - profesjonalny design
   • Studio fitness - booking system

🛒 **Sklepy Shopify:**
   • Moda - konwersja +35%
   • Elektronika - automatyzacja sprzedaży
   • Książki - personalizacja rekomendacji

📱 **Aplikacje Mobilne:**
   • Startup fintech - 50,000+ użytkowników
   • Platforma edukacyjna - gamifikacja
   • App dla restauracji - delivery system

🤖 **Asystenci AI:**
   • Automatyzacja HR - 80% czasu oszczędności
   • Customer Support - 24/7 obsługa
   • Sales Assistant - +40% konwersji

Który projekt Cię najbardziej zainteresował? Mogę opowiedzieć więcej szczegółów!`;
        }
        
        if (lowerMessage.includes('ai') || lowerMessage.includes('sztuczna inteligencja') || lowerMessage.includes('chatbot')) {
            return `AI to nasza specjalność! Tworzymy inteligentne rozwiązania które automatyzują i optymalizują Twoje procesy biznesowe.

🤖 **Asystenci AI na Amazon Bedrock:**
   • Claude 3 (Anthropic) - najlepsze zrozumienie kontekstu
   • Titan (Amazon) - integracja z AWS
   • Llama 2 (Meta) - open source, customizable
   • Cohere - specjalizacja w języku naturalnym

🔧 **Copilot Studio dla Microsoft 365:**
   • Integracja z Teams, SharePoint, Outlook
   • Custom knowledge base
   • Enterprise security

🎤 **Chatboty głosowe:**
   • Amazon Lex + Polly
   • Natural language processing
   • Multi-language support

**Przykłady zastosowań:**
• Automatyzacja obsługi klienta
• Analiza dokumentów i raportów
• Personalizacja treści marketingowych
• Predykcyjna analiza danych

Chcesz zobaczyć demo? Mogę pokazać jak AI może zoptymalizować Twoje procesy!`;
        }
        
        // Default intelligent response
        return `Dziękuję za pytanie! Jestem cyfrowym asystentem Tomasza Gnata i jestem tutaj żeby pomóc Ci znaleźć najlepsze rozwiązanie cyfrowe dla Twojej firmy.

Mogę opowiedzieć o:
• Naszych usługach i technologiach
• Cenach i pakietach
• Portfolio i case studies
• Umówić konsultację

Co Cię najbardziej interesuje? Opowiedz mi o swoich potrzebach lub wybierz jedną z sugestii poniżej!`;
    }
    
    getConversationContext() {
        if (this.messages.length === 0) return 'Pierwsza rozmowa z klientem.';
        
        const recentMessages = this.messages.slice(-3);
        const context = recentMessages.map(msg => 
            `${msg.sender}: ${msg.text}`
        ).join(' | ');
        
        return `Ostatnie wiadomości: ${context}`;
    }
    
    async speak(text) {
        // Check if muted
        if (this.isMuted) {
            console.log('🔇 Speech is muted, skipping audio output');
            return;
        }
        
        console.log('🗣️ Starting speech synthesis for:', text.substring(0, 50) + '...');
        console.log('🔍 Polly available:', !!this.polly);
        console.log('🔍 Web Speech available:', !!this.synthesis);
        
        try {
            // Try Amazon Polly first
            if (this.polly) {
                console.log('🚀 Attempting to use Amazon Polly...');
                await this.speakWithPolly(text);
                console.log('✅ Amazon Polly speech completed successfully');
                return;
            } else {
                console.log('⚠️ Amazon Polly not available, using Web Speech API');
            }
        } catch (error) {
            console.error('❌ Amazon Polly failed:', error);
            console.log('🔄 Falling back to Web Speech API...');
        }
        
        // Fallback to Web Speech API
        if (this.synthesis) {
            console.log('🔊 Using Web Speech API fallback...');
            this.speakWithWebSpeech(text);
        } else {
            console.error('❌ No speech synthesis available');
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateMuteButton();
        
        if (this.isMuted) {
            // Stop any ongoing speech
            if (this.synthesis && this.synthesis.speaking) {
                this.synthesis.cancel();
            }
            console.log('Chatbot muted');
        } else {
            console.log('Chatbot unmuted');
        }
        
        // Save preference to localStorage
        localStorage.setItem('chatbotMuted', this.isMuted);
    }
    
    updateMuteButton() {
        const muteButton = document.getElementById('voiceChatbotMute');
        if (muteButton) {
            const icon = muteButton.querySelector('i');
            if (this.isMuted) {
                muteButton.classList.add('muted');
                icon.className = 'fas fa-volume-mute';
                muteButton.title = 'Włącz dźwięk';
            } else {
                muteButton.classList.remove('muted');
                icon.className = 'fas fa-volume-up';
                muteButton.title = 'Wycisz dźwięk';
            }
        }
    }
    
    loadMutePreference() {
        const muted = localStorage.getItem('chatbotMuted');
        if (muted !== null) {
            this.isMuted = muted === 'true';
            this.updateMuteButton();
        }
    }
    
    loadVoicePreference() {
        const voiceType = localStorage.getItem('chatbotVoiceType');
        if (voiceType) {
            console.log('🎵 Loading saved voice preference:', voiceType);
            this.handleVoiceChange(voiceType);

            // Update selector to match saved preference
            const voiceSelector = document.getElementById('voiceSelector');
            if (voiceSelector) {
                voiceSelector.value = voiceType;
            }
        }
    }

    loadAPIPreference() {
        const useAPI = localStorage.getItem('chatbotUseAPI');
        if (useAPI !== null) {
            this.useAPI = useAPI === 'true';
            console.log(`🔄 Loaded API preference: ${this.useAPI ? 'enabled' : 'disabled'}`);
        }

        // Update toggle if it exists
        const apiToggle = document.getElementById('apiModeToggle');
        if (apiToggle) {
            apiToggle.checked = this.useAPI;
        }
    }

    showAPIModeChange() {
        const messagesContainer = document.getElementById('voiceChatbotMessages');
        if (!messagesContainer) return;

        const modeMessage = document.createElement('div');
        modeMessage.className = 'voice-message bot api-mode-change';
        modeMessage.innerHTML = `
            <i class="fas fa-server me-2" style="color: var(--accent);"></i>
            Tryb API ${this.useAPI ? 'włączony' : 'wyłączony'}
        `;

        messagesContainer.appendChild(modeMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Remove after 3 seconds
        setTimeout(() => {
            if (modeMessage.parentNode) {
                modeMessage.remove();
            }
        }, 3000);
    }
    
    async speakWithPolly(text) {
        console.log('🎯 speakWithPolly called with text:', text.substring(0, 50) + '...');
        console.log('🔍 Polly instance:', this.polly);
        console.log('🔍 Current language:', this.currentLanguage);
        console.log('🔍 AWS config region:', AWS.config.region);
        
        // Try different regions and voice configurations
        const regions = ['us-east-1', 'us-west-2', 'eu-west-1'];
        const voices = {
            'pl': ['Ewa', 'Maja', 'Jacek'],
            'en': ['Joanna', 'Matthew', 'Salli']
        };
        
        for (const region of regions) {
            for (const voiceId of voices[this.currentLanguage] || voices['en']) {
                try {
                    console.log(`🔄 Trying region: ${region}, voice: ${voiceId}`);
                    
                    // Update AWS config for this region
                    AWS.config.update({ region: region });
                    
                    const params = {
                        Text: text,
                        OutputFormat: 'mp3',
                        VoiceId: voiceId,
                        Engine: 'neural',
                        TextType: 'text'
                    };
                    
                    console.log('📤 Polly parameters:', params);
                    
                    console.log('🚀 Calling Polly.synthesizeSpeech...');
                    const result = await this.polly.synthesizeSpeech(params).promise();
                    console.log('✅ Polly response received:', result);
                    console.log('🔊 Audio stream length:', result.AudioStream ? result.AudioStream.length : 'No audio stream');
                    
                    // Play the audio
                    const audioBlob = new Blob([result.AudioStream], { type: 'audio/mpeg' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    
                    console.log('🎵 Audio element created, attempting to play...');
                    
                    audio.onended = () => {
                        console.log('✅ Audio playback completed');
                        URL.revokeObjectURL(audioUrl);
                    };
                    
                    audio.onerror = (error) => {
                        console.error('❌ Audio playback error:', error);
                    };
                    
                    await audio.play();
                    console.log('🎵 Audio playback started successfully');
                    
                    // Success! Exit the loop
                    return;
                    
                } catch (error) {
                    console.log(`❌ Polly failed for region ${region}, voice ${voiceId}:`, error.code || error.message);
                    console.error('❌ Error details:', {
                        code: error.code,
                        message: error.message,
                        statusCode: error.statusCode,
                        requestId: error.requestId,
                        region: region,
                        voice: voiceId
                    });
                    
                    // If it's a credentials error, don't try other regions
                    if (error.code === 'CredentialsError' || error.code === 'UnauthorizedOperation') {
                        console.error('❌ Credentials error - stopping retry');
                        throw error;
                    }
                    
                    // If it's error 12 (InvalidParameterValue), it might be permissions
                    if (error.code === 12 || error.code === 'InvalidParameterValue') {
                        console.error('❌ InvalidParameterValue (12) - likely permissions issue');
                        console.error('❌ This usually means the credentials don\'t have Polly permissions');
                    }
                    
                    // Continue to next voice/region
                    continue;
                }
            }
        }
        
        // If we get here, all attempts failed
        throw new Error('All Polly attempts failed');
    }
    
    speakWithWebSpeech(text, forceDifferentVoice = false) {
        console.log('🔊 speakWithWebSpeech called with text:', text.substring(0, 50) + '...');
        console.log('🔍 Synthesis available:', !!this.synthesis);
        
        if (this.synthesis) {
            // Get available voices and select the best one
            const voices = this.synthesis.getVoices();
            console.log('🎵 Available voices:', voices.length);
            
            // Try to find a good Polish or English voice
            let selectedVoice = null;
            
            // If forcing different voice, skip the first few
            if (forceDifferentVoice) {
                const availableVoices = voices.filter(v => v.lang.startsWith('en') || v.lang.startsWith('pl'));
                selectedVoice = availableVoices[Math.floor(Math.random() * Math.min(availableVoices.length, 5))] || availableVoices[0];
                console.log('🔄 Forcing different voice due to error:', selectedVoice?.name);
            } else {
                // Use pre-selected voice if available
                if (this.selectedVoice) {
                    selectedVoice = this.selectedVoice;
                    console.log('🎵 Using pre-selected voice:', selectedVoice.name);
                } else {
                    // First try Polish voices
                    if (this.currentLanguage === 'pl') {
                        // Prefer premium Polish voices
                        selectedVoice = voices.find(v => v.lang === 'pl-PL' && v.name.includes('Premium')) ||
                                      voices.find(v => v.lang === 'pl-PL' && v.name.includes('Enhanced')) ||
                                      voices.find(v => v.lang === 'pl-PL' && v.name.includes('Neural')) ||
                                      voices.find(v => v.lang === 'pl-PL') ||
                                      voices.find(v => v.lang.startsWith('pl')) ||
                                      voices.find(v => v.name.includes('Polish'));
                    }
                    
                    // If no Polish, try English
                    if (!selectedVoice) {
                        // Prefer premium English voices
                        selectedVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Premium')) ||
                                      voices.find(v => v.lang === 'en-US' && v.name.includes('Enhanced')) ||
                                      voices.find(v => v.lang === 'en-US' && v.name.includes('Neural')) ||
                                      voices.find(v => v.lang === 'en-US' && v.name.includes('Samantha')) ||
                                      voices.find(v => v.lang === 'en-US' && v.name.includes('Alex')) ||
                                      voices.find(v => v.lang === 'en-US' && v.name.includes('Victoria')) ||
                                      voices.find(v => v.lang === 'en-US') ||
                                      voices.find(v => v.lang.startsWith('en')) ||
                                      voices.find(v => v.name.includes('English'));
                    }
                    
                    // If still no good voice, use default
                    if (!selectedVoice) {
                        selectedVoice = voices.find(v => v.default) || voices[0];
                    }
                }
            }
            
            console.log('🎵 Selected voice:', selectedVoice ? {
                name: selectedVoice.name,
                lang: selectedVoice.lang,
                default: selectedVoice.default,
                voiceType: localStorage.getItem('chatbotVoiceType') || 'auto'
            } : 'No voice found');
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice ? selectedVoice.lang : (this.currentLanguage === 'pl' ? 'pl-PL' : 'en-US');
            
            // Enhanced voice parameters based on voice type
            const voiceParams = this.getVoiceParameters();
            utterance.rate = voiceParams.rate;
            utterance.pitch = voiceParams.pitch;
            utterance.volume = voiceParams.volume;
            
            // Add slight pauses for better comprehension
            const enhancedText = this.addSpeechPauses(text);
            utterance.text = enhancedText;
            
            console.log('📤 Web Speech parameters:', {
                voice: utterance.voice?.name,
                lang: utterance.lang,
                rate: utterance.rate,
                pitch: utterance.pitch,
                volume: utterance.volume,
                enhancedText: enhancedText.substring(0, 100) + '...',
                voiceType: localStorage.getItem('chatbotVoiceType') || 'auto',
                selectedVoice: this.selectedVoice?.name || 'auto-selected'
            });
            
            utterance.onstart = () => console.log('🎵 Web Speech started');
            utterance.onend = () => console.log('✅ Web Speech completed');
            utterance.onerror = (error) => {
                console.error('❌ Web Speech error:', error);
                console.error('❌ Error type:', error.type);
                console.error('❌ Error name:', error.name);
                console.error('❌ Error message:', error.message);
                console.error('❌ Current voice:', selectedVoice?.name);
                console.error('❌ Voice language:', selectedVoice?.lang);
                
                // Try to recover with different voice
                if (error.name === 'NotAllowedError') {
                    console.log('🔄 Trying with different voice due to permission error...');
                    this.speakWithWebSpeech(text, true); // Force different voice
                } else if (error.name === 'NotSupportedError') {
                    console.log('🔄 Voice not supported, trying default voice...');
                    this.selectedVoice = null; // Reset to default
                    this.speakWithWebSpeech(text, false);
                } else {
                    console.log('🔄 Unknown error, trying with different voice...');
                    this.speakWithWebSpeech(text, true);
                }
            };
            
            this.synthesis.speak(utterance);
            console.log('🎵 Web Speech utterance queued');
        } else {
            console.error('❌ Web Speech synthesis not available');
        }
    }
    
    // Add speech pauses for better comprehension
    addSpeechPauses(text) {
        // Add pauses after sentences and important punctuation
        return text
            .replace(/\./g, '... ')
            .replace(/\!/g, '! ')
            .replace(/\?/g, '? ')
            .replace(/\,/g, ', ')
            .replace(/\:/g, ': ')
            .replace(/\;/g, '; ')
            .trim();
    }
    
    // Get available premium voices
    getPremiumVoices() {
        if (!this.synthesis) return [];
        
        const voices = this.synthesis.getVoices();
        const premiumVoices = voices.filter(voice => 
            voice.name.includes('Premium') ||
            voice.name.includes('Enhanced') ||
            voice.name.includes('Neural') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Alex') ||
            voice.name.includes('Victoria') ||
            voice.name.includes('Daniel') ||
            voice.name.includes('Karen') ||
            voice.name.includes('Google') ||
            voice.name.includes('Microsoft') ||
            voice.name.includes('High') ||
            voice.name.includes('Quality')
        );
        
        console.log('🎵 Premium voices found:', premiumVoices.map(v => ({ name: v.name, lang: v.lang })));
        
        // If no premium voices found, suggest alternatives
        if (premiumVoices.length === 0) {
            console.log('💡 No premium voices found, suggesting alternatives...');
            const alternativeVoices = voices.filter(v => 
                v.name.includes('Google') ||
                v.name.includes('Microsoft') ||
                v.name.includes('Apple') ||
                v.name.includes('Siri')
            );
            console.log('🎵 Alternative voices:', alternativeVoices.map(v => ({ name: v.name, lang: v.lang })));
            return alternativeVoices;
        }
        
        return premiumVoices;
    }
    
    // Set specific voice by name
    setVoiceByName(voiceName) {
        if (!this.synthesis) return false;
        
        const voices = this.synthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === voiceName);
        
        if (selectedVoice) {
            this.selectedVoice = selectedVoice;
            console.log('🎵 Voice set to:', selectedVoice.name);
            return true;
        } else {
            console.warn('⚠️ Voice not found:', voiceName);
            return false;
        }
    }
    
    // Handle voice selection change
    handleVoiceChange(voiceType) {
        console.log('🎵 Voice type selected:', voiceType);
        
        switch (voiceType) {
            case 'premium':
                this.setPremiumVoice();
                break;
            case 'natural':
                this.setNaturalVoice();
                break;
            case 'ai':
                this.setAIVoice();
                break;
            case 'auto':
            default:
                this.setAutoVoice();
                break;
        }
        
        // Save preference
        localStorage.setItem('chatbotVoiceType', voiceType);
        
        // Show confirmation
        this.showVoiceChangeConfirmation(voiceType);
    }
    
    // Set premium voice
    setPremiumVoice() {
        const premiumVoices = this.getPremiumVoices();
        if (premiumVoices.length > 0) {
            const randomPremium = premiumVoices[Math.floor(Math.random() * premiumVoices.length)];
            this.selectedVoice = randomPremium;
            console.log('⭐ Premium voice set:', randomPremium.name);
        } else {
            console.log('⚠️ No premium voices available, using default');
            this.selectedVoice = null;
        }
    }
    
    // Set natural voice
    setNaturalVoice() {
        const voices = this.synthesis.getVoices();
        const naturalVoice = voices.find(v => 
            v.name.includes('Natural') || 
            v.name.includes('Human') || 
            v.name.includes('Real') ||
            v.name.includes('Samantha') ||
            v.name.includes('Alex') ||
            v.name.includes('Victoria') ||
            v.name.includes('Daniel')
        ) || voices[0];
        
        this.selectedVoice = naturalVoice;
        console.log('🌿 Natural voice set:', naturalVoice.name);
        
        if (!naturalVoice) {
            console.log('⚠️ No natural voices available, using default');
            this.selectedVoice = null;
        }
    }
    
    // Set AI voice
    setAIVoice() {
        const voices = this.synthesis.getVoices();
        const aiVoice = voices.find(v => 
            v.name.includes('AI') || 
            v.name.includes('Robot') || 
            v.name.includes('Synthetic') ||
            v.name.includes('Digital') ||
            v.name.includes('Computer') ||
            v.name.includes('System')
        ) || voices[0];
        
        this.selectedVoice = aiVoice;
        console.log('🤖 AI voice set:', aiVoice.name);
        
        if (!aiVoice) {
            console.log('⚠️ No AI voices available, using default');
            this.selectedVoice = null;
        }
    }
    
    // Set auto voice (default behavior)
    setAutoVoice() {
        this.selectedVoice = null; // Will use default selection logic
        console.log('🎵 Auto voice selection enabled');
        
        // Log available voices for auto selection
        if (this.synthesis) {
            const voices = this.synthesis.getVoices();
            const availableVoices = voices.filter(v => 
                v.lang.startsWith('pl') || v.lang.startsWith('en')
            );
            console.log('🎵 Available voices for auto selection:', availableVoices.length);
        }
    }
    
    // Reset voice to default
    resetVoice() {
        this.selectedVoice = null;
        localStorage.removeItem('chatbotVoiceType');
        
        const voiceSelector = document.getElementById('voiceSelector');
        if (voiceSelector) {
            voiceSelector.value = 'auto';
        }
        
        console.log('🔄 Voice reset to default');
        
        // Update display
        this.updateCurrentVoiceInfo();
    }
    
    // Get current voice info
    getCurrentVoiceInfo() {
        if (this.selectedVoice) {
            return {
                name: this.selectedVoice.name,
                lang: this.selectedVoice.lang,
                type: localStorage.getItem('chatbotVoiceType') || 'custom'
            };
        } else {
            // Try to get the actual auto-selected voice
            if (this.synthesis) {
                const voices = this.synthesis.getVoices();
                const autoVoice = voices.find(v => 
                    (this.currentLanguage === 'pl' && v.lang.startsWith('pl')) ||
                    (this.currentLanguage === 'en' && v.lang.startsWith('en'))
                ) || voices.find(v => v.default) || voices[0];
                
                if (autoVoice) {
                    return {
                        name: autoVoice.name,
                        lang: autoVoice.lang,
                        type: 'auto'
                    };
                }
            }
            
            return {
                name: 'Auto-selected',
                lang: this.currentLanguage === 'pl' ? 'pl-PL' : 'en-US',
                type: 'auto'
            };
        }
    }
    
    // Show voice change confirmation
    showVoiceChangeConfirmation(voiceType) {
        const messagesContainer = document.getElementById('voiceChatbotMessages');
        if (!messagesContainer) return;
        
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = 'voice-message bot voice-change-confirmation';
        confirmationDiv.innerHTML = `
            <i class="fas fa-check-circle me-2" style="color: var(--accent);"></i>
            Głos zmieniony na: ${this.getVoiceTypeName(voiceType)}
        `;
        
        messagesContainer.appendChild(confirmationDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Remove confirmation after 3 seconds
        setTimeout(() => {
            if (confirmationDiv.parentNode) {
                confirmationDiv.remove();
            }
        }, 3000);
        
        // Update current voice info
        this.updateCurrentVoiceInfo();
    }
    
    // Get voice type display name
    getVoiceTypeName(voiceType) {
        const names = {
            'premium': '⭐ Premium głosy',
            'natural': '🌿 Naturalny głos',
            'ai': '🤖 AI głos',
            'auto': '🎵 Automatyczny wybór',
            'reset': '🔄 Domyślny głos'
        };
        return names[voiceType] || 'Nieznany typ';
    }
    
    // Get voice parameters based on selected type
    getVoiceParameters() {
        const voiceType = localStorage.getItem('chatbotVoiceType') || 'auto';
        
        const params = {
            'premium': {
                rate: 0.85,      // Slower for premium feel
                pitch: 1.1,      // Slightly higher pitch
                volume: 0.95,    // High volume
                description: 'Premium quality with slower pace'
            },
            'natural': {
                rate: 0.9,       // Natural speaking pace
                pitch: 1.0,      // Natural pitch
                volume: 0.9,     // Good volume
                description: 'Natural human-like speech'
            },
            'ai': {
                rate: 0.8,       // Slower for AI clarity
                pitch: 1.15,     // Higher pitch for AI sound
                volume: 0.95,    // High volume
                description: 'AI-optimized for clarity'
            },
            'auto': {
                rate: 0.9,       // Default balanced
                pitch: 1.05,     // Slightly higher
                volume: 0.95,    // High volume
                description: 'Balanced automatic selection'
            }
        };
        
        const selectedParams = params[voiceType] || params['auto'];
        console.log(`🎵 Voice parameters for ${voiceType}:`, selectedParams);
        
        return selectedParams;
    }
    
    // Update current voice info display
    updateCurrentVoiceInfo() {
        const currentVoiceName = document.getElementById('currentVoiceName');
        if (!currentVoiceName) return;
        
        const voiceInfo = this.getCurrentVoiceInfo();
        
        // Add visual indicator for voice type
        const voiceType = voiceInfo.type;
        const icons = {
            'premium': '⭐',
            'natural': '🌿',
            'ai': '🤖',
            'auto': '🎵',
            'reset': '🔄'
        };
        
        currentVoiceName.innerHTML = `${icons[voiceType] || '🎵'} ${voiceInfo.name}`;
        
        // Update voice details
        const currentVoiceDetails = document.getElementById('currentVoiceDetails');
        if (currentVoiceDetails) {
            const params = this.getVoiceParameters();
            const voiceType = voiceInfo.type;
            
            if (voiceType === 'auto') {
                currentVoiceDetails.innerHTML = `Automatyczny wybór • ${voiceInfo.lang}`;
            } else if (voiceType === 'reset') {
                currentVoiceDetails.innerHTML = `Domyślny głos • ${voiceInfo.lang}`;
            } else {
                currentVoiceDetails.innerHTML = `${params.description} • ${voiceInfo.lang}`;
            }
            
            // Add click hint
            currentVoiceDetails.style.cursor = 'pointer';
            currentVoiceDetails.title = 'Kliknij, aby zmienić głos';
            
            // Add click event to open voice selector
            currentVoiceDetails.onclick = () => {
                const voiceSelector = document.getElementById('voiceSelector');
                if (voiceSelector) {
                    voiceSelector.focus();
                    voiceSelector.click();
                }
            };
            
            // Add hover effect
            currentVoiceDetails.style.transition = 'color 0.3s ease';
            
            // Add hover styles
            currentVoiceDetails.onmouseenter = () => {
                currentVoiceDetails.style.color = 'var(--primary)';
            };
            
            currentVoiceDetails.onmouseleave = () => {
                currentVoiceDetails.style.color = 'var(--text-tertiary)';
            };
            
            // Add keyboard navigation
            currentVoiceDetails.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const voiceSelector = document.getElementById('voiceSelector');
                    if (voiceSelector) {
                        voiceSelector.focus();
                        voiceSelector.click();
                    }
                }
            };
            
            // Make it focusable
            currentVoiceDetails.tabIndex = 0;
            currentVoiceDetails.setAttribute('role', 'button');
            
            // Add ARIA label
            currentVoiceDetails.setAttribute('aria-label', `Aktualny głos: ${voiceInfo.name}. Kliknij, aby zmienić.`);
        }
        
        // Log current voice configuration
        console.log('🎵 Current voice configuration:', {
            name: voiceInfo.name,
            language: voiceInfo.lang,
            type: voiceType,
            parameters: this.getVoiceParameters(),
            selectedVoice: this.selectedVoice?.name || 'auto'
        });
        
        // Show voice quality indicator
        this.showVoiceQualityIndicator(voiceType);
    }
    
    // Show voice quality indicator
    showVoiceQualityIndicator(voiceType) {
        const currentVoiceInfo = document.getElementById('currentVoiceInfo');
        if (!currentVoiceInfo) return;
        
        // Add quality indicator
        const qualityIndicator = currentVoiceInfo.querySelector('.voice-quality-indicator');
        if (qualityIndicator) {
            qualityIndicator.remove();
        }
        
        const qualityDiv = document.createElement('div');
        qualityDiv.className = 'voice-quality-indicator';
        
        const qualityInfo = {
            'premium': { icon: '⭐', text: 'Najwyższa jakość', color: 'var(--accent)' },
            'natural': { icon: '🌿', text: 'Naturalny dźwięk', color: 'var(--accent-orange)' },
            'ai': { icon: '🤖', text: 'Zoptymalizowany AI', color: 'var(--accent-purple)' },
            'auto': { icon: '🎵', text: 'Automatyczny wybór', color: 'var(--primary)' },
            'reset': { icon: '🔄', text: 'Domyślny głos', color: 'var(--text-tertiary)' }
        };
        
        const quality = qualityInfo[voiceType] || qualityInfo['auto'];
        qualityDiv.innerHTML = `
            <small style="color: ${quality.color}; font-weight: 600;">
                ${quality.icon} ${quality.text}
            </small>
        `;
        
        currentVoiceInfo.appendChild(qualityDiv);
        
        // Add animation
        qualityDiv.style.animation = 'fadeInUp 0.5s ease-out';
        
        // Log quality change
        console.log(`🎵 Voice quality indicator updated: ${quality.text} (${voiceType})`);
        
        // Add tooltip for better UX
        qualityDiv.title = `Głos typu: ${voiceType} - ${quality.text}`;
        qualityDiv.style.cursor = 'help';
        
        // Add click to show voice details
        qualityDiv.onclick = () => {
            this.showVoiceDetails(voiceType, quality);
        };
        
        // Add keyboard navigation
        qualityDiv.tabIndex = 0;
        qualityDiv.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showVoiceDetails(voiceType, quality);
            }
        };
        
        // Add ARIA label
        qualityDiv.setAttribute('role', 'button');
        qualityDiv.setAttribute('aria-label', `Kliknij, aby zobaczyć szczegóły głosu: ${quality.text}`);
        
        // Add hover effect
        qualityDiv.style.transition = 'all 0.3s ease';
        qualityDiv.onmouseenter = () => {
            qualityDiv.style.transform = 'scale(1.05)';
            qualityDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        };
        qualityDiv.onmouseleave = () => {
            qualityDiv.style.transform = 'scale(1)';
            qualityDiv.style.boxShadow = 'none';
        };
        
        // Add focus styles
        qualityDiv.onfocus = () => {
            qualityDiv.style.outline = '2px solid var(--primary)';
            qualityDiv.style.outlineOffset = '2px';
        };
        qualityDiv.onblur = () => {
            qualityDiv.style.outline = 'none';
        };
        
        // Add success feedback
        qualityDiv.onclick = () => {
            qualityDiv.style.background = quality.color;
            qualityDiv.style.color = 'white';
            setTimeout(() => {
                qualityDiv.style.background = '';
                qualityDiv.style.color = '';
            }, 200);
        };
        
        // Add voice test functionality
        qualityDiv.ondblclick = () => {
            this.testVoice(voiceType);
        };
        
        // Add tooltip for double-click
        qualityDiv.title += ' (Podwójne kliknięcie = test głosu)';
        
        // Add visual feedback for double-click hint
        const hintDiv = document.createElement('div');
        hintDiv.style.fontSize = '0.6rem';
        hintDiv.style.opacity = '0.7';
        hintDiv.style.marginTop = '0.25rem';
        hintDiv.innerHTML = 'Podwójne kliknięcie = test';
        qualityDiv.appendChild(hintDiv);
        
        // Add keyboard shortcut hint
        const keyboardHint = document.createElement('div');
        keyboardHint.style.fontSize = '0.6rem';
        keyboardHint.style.opacity = '0.7';
        keyboardHint.style.marginTop = '0.1rem';
        keyboardHint.innerHTML = 'Enter = szczegóły';
        qualityDiv.appendChild(keyboardHint);
        
        // Add voice count info
        this.updateVoiceCount();
    }
    
    // Update voice count display
    updateVoiceCount() {
        if (!this.synthesis) return;
        
        const voices = this.synthesis.getVoices();
        const totalVoices = voices.length;
        const polishVoices = voices.filter(v => v.lang.startsWith('pl')).length;
        const englishVoices = voices.filter(v => v.lang.startsWith('en')).length;
        const premiumVoices = this.getPremiumVoices().length;
        
        console.log(`🎵 Voice statistics:`, {
            total: totalVoices,
            polish: polishVoices,
            english: englishVoices,
            premium: premiumVoices
        });
        
        // Update voice selector with counts
        const voiceSelector = document.getElementById('voiceSelector');
        if (voiceSelector) {
            const autoOption = voiceSelector.querySelector('option[value="auto"]');
            const premiumOption = voiceSelector.querySelector('option[value="premium"]');
            const naturalOption = voiceSelector.querySelector('option[value="natural"]');
            const aiOption = voiceSelector.querySelector('option[value="ai"]');
            
            if (autoOption) autoOption.textContent = `🎵 Automatyczny wybór (${totalVoices} głosów)`;
            if (premiumOption) premiumOption.textContent = `⭐ Premium głosy (${premiumVoices} dostępnych)`;
            if (naturalOption) naturalOption.textContent = `🌿 Naturalny głos (${englishVoices + polishVoices} dostępnych)`;
            if (aiOption) aiOption.textContent = `🤖 AI głos (${totalVoices} dostępnych)`;
        }
    }
    
    // Test voice with sample text
    testVoice(voiceType) {
        const testText = 'To jest test głosu. Sprawdź, jak brzmi wybrany głos.';
        console.log(`🎵 Testing voice type: ${voiceType} with text: ${testText}`);
        
        // Show test message
        const messagesContainer = document.getElementById('voiceChatbotMessages');
        if (messagesContainer) {
            const testDiv = document.createElement('div');
            testDiv.className = 'voice-message bot voice-test';
            testDiv.innerHTML = `
                <div style="background: var(--accent); color: white; padding: 0.5rem; border-radius: 8px; margin-bottom: 0.5rem;">
                    <strong>🧪 Test głosu</strong>
                </div>
                <div style="font-size: 0.9rem; color: var(--text-secondary);">
                    <strong>Typ:</strong> ${this.getVoiceTypeName(voiceType)}<br>
                    <strong>Tekst testowy:</strong> "${testText}"<br>
                    <strong>Status:</strong> Odtwarzanie...
                </div>
            `;
            
            messagesContainer.appendChild(testDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Speak test text
            this.speak(testText);
            
            // Update status after speaking
            setTimeout(() => {
                const statusElement = testDiv.querySelector('div:last-child');
                if (statusElement) {
                    statusElement.innerHTML = statusElement.innerHTML.replace('Odtwarzanie...', '✅ Test zakończony');
                }
            }, 3000);
            
            // Remove test message after 8 seconds
            setTimeout(() => {
                if (testDiv.parentNode) {
                    testDiv.remove();
                }
            }, 8000);
        }
    }
    
    // Show voice details
    showVoiceDetails(voiceType, quality) {
        const messagesContainer = document.getElementById('voiceChatbotMessages');
        if (!messagesContainer) return;
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'voice-message bot voice-details';
        detailsDiv.innerHTML = `
            <div style="background: ${quality.color}; color: white; padding: 0.5rem; border-radius: 8px; margin-bottom: 0.5rem;">
                <strong>${quality.icon} ${quality.text}</strong>
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                <strong>Typ głosu:</strong> ${this.getVoiceTypeName(voiceType)}<br>
                <strong>Parametry:</strong> ${this.getVoiceParameters().description}<br>
                <strong>Język:</strong> ${this.getCurrentVoiceInfo().lang}<br>
                <strong>Nazwa:</strong> ${this.getCurrentVoiceInfo().name}
            </div>
        `;
        
        messagesContainer.appendChild(detailsDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Remove details after 5 seconds
        setTimeout(() => {
            if (detailsDiv.parentNode) {
                detailsDiv.remove();
            }
        }, 5000);
        
        console.log(`📋 Voice details shown for type: ${voiceType}`);
    }
    
    generateFallbackResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Service-related responses
        if (lowerInput.includes('usług') || lowerInput.includes('oferta')) {
            return 'Oferujemy kompleksowe usługi cyfrowe: Strony WWW od 3,500 PLN, Sklepy Shopify od 8,000 PLN, Aplikacje Mobilne od 15,000 PLN, Asystenci AI na Amazon Bedrock, Automatyzacje z n8n/Zapier/Opal, Audyty UX i Social Media z AI. Która usługa Cię najbardziej interesuje?';
        }
        
        if (lowerInput.includes('ceny') || lowerInput.includes('pakiety') || lowerInput.includes('koszt')) {
            return 'Nasze ceny zaczynają się od: Strony WWW - 3,500 PLN, Sklepy Shopify - 8,000 PLN, Aplikacje Mobilne - 15,000 PLN, Asystenci AI - 12,000 PLN. Wszystkie ceny są indywidualne i zależą od złożoności projektu. Chcesz otrzymać dokładną wycenę?';
        }
        
        if (lowerInput.includes('konsultac') || lowerInput.includes('spotkanie')) {
            return 'Świetnie! Mogę umówić Cię na bezpłatną konsultację z naszym zespołem. Podaj swój numer telefonu lub email, a my skontaktujemy się z Tobą w ciągu 24 godzin. Kiedy byłbyś dostępny?';
        }
        
        if (lowerInput.includes('case') || lowerInput.includes('portfolio') || lowerInput.includes('projekty')) {
            return 'Mamy bogate portfolio projektów: Strony WWW dla firm z różnych branż, Sklepy Shopify z wysoką konwersją, Aplikacje Mobilne dla startupów, Asystenci AI dla korporacji. Chcesz zobaczyć konkretne przykłady?';
        }
        
        if (lowerInput.includes('ai') || lowerInput.includes('sztuczna inteligencja')) {
            return 'Specjalizujemy się w AI! Tworzymy asystentów na Amazon Bedrock (Claude, Titan, Llama), Copilot Studio dla Microsoft 365, chatboty głosowe na Amazon Lex. AI może zautomatyzować Twoje procesy biznesowe. Chcesz dowiedzieć się więcej?';
        }
        
        if (lowerInput.includes('automatyzac') || lowerInput.includes('n8n') || lowerInput.includes('zapier')) {
            return 'Automatyzujemy procesy biznesowe używając n8n, Zapier i Opal. Możemy zautomatyzować: marketing, sprzedaż, HR, finanse, obsługę klienta. To oszczędza czas i redukuje błędy. Jakie procesy chciałbyś zautomatyzować?';
        }
        
        // Default response
        return 'Dziękuję za pytanie! Mogę opowiedzieć Ci o naszych usługach, cenach, umówić konsultację lub pokazać portfolio. Co Cię najbardziej interesuje?';
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('voiceChatbotMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `voice-message ${sender}`;
        
        const icon = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
        messageDiv.innerHTML = `<i class="${icon} me-2"></i>${text}`;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ text, sender, timestamp: new Date() });
    }
    
    addWelcomeMessage() {
        const welcomeMessage = 'Cześć! Jestem cyfrowym asystentem ECM Digital. Mogę opowiedzieć Ci o naszych usługach, pomóc w wyborze rozwiązania lub umówić konsultację. Jak mogę Ci pomóc?';
        this.addMessage(welcomeMessage, 'bot');
    }
    
    toggleListening() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
    
    updateUI() {
        const button = document.getElementById('voiceInputButton');
        const status = document.getElementById('voiceStatus');
        
        if (button) {
            if (this.isListening) {
                button.classList.add('recording');
                status.textContent = 'Słucham... Mów teraz!';
            } else {
                button.classList.remove('recording');
                status.textContent = 'Kliknij mikrofon, aby rozpocząć rozmowę';
            }
        }
    }
    
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    fallbackToBasicChatbot() {
        console.log('Falling back to basic chatbot functionality');
        // Basic chatbot without AWS integration
        this.bindEvents();
        this.addWelcomeMessage();
    }

    /**
     * Show service recommendations from API
     */
    showServiceRecommendations(services) {
        console.log('💡 Showing service recommendations:', services);

        const messagesContainer = document.getElementById('voiceChatbotMessages');
        if (!messagesContainer) return;

        // Create recommendations container
        const recommendationsDiv = document.createElement('div');
        recommendationsDiv.className = 'service-recommendations';
        recommendationsDiv.innerHTML = `
            <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border);">
                <div style="font-weight: 600; color: var(--accent); margin-bottom: 0.5rem;">
                    💼 Rekomendowane usługi:
                </div>
                <div class="services-grid" style="display: grid; gap: 0.5rem;">
                    ${services.map(service => `
                        <div class="service-card" style="padding: 0.75rem; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border); cursor: pointer; transition: all 0.3s ease;" onclick="window.open('${service.url || '#'}', '_blank')">
                            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">
                                ${service.name}
                            </div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                ${service.category} • ${service.priority}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        messagesContainer.appendChild(recommendationsDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add hover effects
        recommendationsDiv.querySelectorAll('.service-card').forEach(card => {
            card.onmouseenter = () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            };
            card.onmouseleave = () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            };
        });

        // Remove recommendations after 30 seconds
        setTimeout(() => {
            if (recommendationsDiv.parentNode) {
                recommendationsDiv.remove();
            }
        }, 30000);
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        if (this.recognition) {
            this.recognition.lang = lang === 'pl' ? 'pl-PL' : 'en-US';
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWSChatbot;
} else {
    window.AWSChatbot = AWSChatbot;
}
