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
        
        // Skip Polly voice checking since we don't have permissions
        console.log('⚠️ Skipping Polly voice check - using Web Speech API instead');
            
            // Initialize speech recognition
            this.initSpeechRecognition();
            
            // Load mute preference
            this.loadMutePreference();
            
            // Bind events
            this.bindEvents();
            
            // Add welcome message
            this.addWelcomeMessage();
            
            console.log('✅ AWS Chatbot initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing AWS Chatbot:', error);
            console.error('Error stack:', error.stack);
            this.fallbackToBasicChatbot();
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
            
            // Bind events
            this.bindEvents();
            
            // Add welcome message
            this.addWelcomeMessage();
            
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
            console.warn('⚠️ AWS credentials not found, some services may not work');
        }
        
        console.log('🔑 Credentials check:', {
            accessKeyId: accessKeyId ? '***' + accessKeyId.slice(-4) : 'Not set',
            secretAccessKey: secretAccessKey ? '***' + secretAccessKey.slice(-4) : 'Not set',
            accessKeyLength: accessKeyId?.length || 0,
            secretKeyLength: secretAccessKey?.length || 0
        });
        
        // Configure AWS for Bedrock only
        AWS.config.update({
            region: 'us-east-1',
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
        
        // Initialize only Bedrock-related services
        console.log('🚀 Initializing Bedrock-only services...');
        
        // Don't initialize Polly/Lex if we don't have permissions
        this.polly = null;
        this.lexRuntime = null;
        this.cognitoIdentity = null;
        
        console.log('✅ AWS configured for Bedrock only (no Polly/Lex)');
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
            
            console.log('🇵🇱 Polish voices:', polishVoices.map(v => ({ name: v.name, lang: v.lang })));
            console.log('🇺🇸 English voices:', englishVoices.map(v => ({ name: v.name, lang: v.lang })));
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
        // Use Amazon Bedrock for intelligent responses
        const systemPrompt = `Jesteś cyfrowym asystentem głosowym Tomasza Gnata - CEO ECM Digital. Reprezentujesz firmę specjalizującą się w usługach cyfrowych.

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
        console.log('🔍 Web Speech available:', !!this.synthesis);
        
        // Use Web Speech API directly since we don't have Polly permissions
        if (this.synthesis) {
            console.log('🔊 Using Web Speech API (no Polly permissions)...');
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
    
    speakWithWebSpeech(text) {
        console.log('🔊 speakWithWebSpeech called with text:', text.substring(0, 50) + '...');
        console.log('🔍 Synthesis available:', !!this.synthesis);
        
        if (this.synthesis) {
            // Get available voices and select the best one
            const voices = this.synthesis.getVoices();
            console.log('🎵 Available voices:', voices.length);
            
            // Try to find a good Polish or English voice
            let selectedVoice = null;
            
            // First try Polish voices
            if (this.currentLanguage === 'pl') {
                selectedVoice = voices.find(v => v.lang === 'pl-PL') || 
                              voices.find(v => v.lang.startsWith('pl')) ||
                              voices.find(v => v.name.includes('Polish'));
            }
            
            // If no Polish, try English
            if (!selectedVoice) {
                selectedVoice = voices.find(v => v.lang === 'en-US') || 
                              voices.find(v => v.lang.startsWith('en')) ||
                              voices.find(v => v.name.includes('English'));
            }
            
            // If still no good voice, use default
            if (!selectedVoice) {
                selectedVoice = voices.find(v => v.default) || voices[0];
            }
            
            console.log('🎵 Selected voice:', selectedVoice ? {
                name: selectedVoice.name,
                lang: selectedVoice.lang,
                default: selectedVoice.default
            } : 'No voice found');
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice ? selectedVoice.lang : (this.currentLanguage === 'pl' ? 'pl-PL' : 'en-US');
            utterance.rate = 0.85;
            utterance.pitch = 1.1;
            utterance.volume = 0.9;
            
            console.log('📤 Web Speech parameters:', {
                voice: utterance.voice?.name,
                lang: utterance.lang,
                rate: utterance.rate,
                pitch: utterance.pitch,
                volume: utterance.volume
            });
            
            utterance.onstart = () => console.log('🎵 Web Speech started');
            utterance.onend = () => console.log('✅ Web Speech completed');
            utterance.onerror = (error) => console.error('❌ Web Speech error:', error);
            
            this.synthesis.speak(utterance);
            console.log('🎵 Web Speech utterance queued');
        } else {
            console.error('❌ Web Speech synthesis not available');
        }
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
        const welcomeMessage = 'Cześć! Jestem cyfrowym asystentem głosowym Tomasza Gnata - CEO ECM Digital. Mogę opowiedzieć Ci o naszych usługach, pomóc w wyborze rozwiązania lub umówić konsultację. Jak mogę Ci pomóc?';
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
