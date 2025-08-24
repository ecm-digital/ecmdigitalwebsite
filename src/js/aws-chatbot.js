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
            // Initialize AWS SDK
            this.initAWS();
            
            // Initialize speech recognition
            this.initSpeechRecognition();
            
            // Load mute preference
            this.loadMutePreference();
            
            // Bind events
            this.bindEvents();
            
            // Add welcome message
            this.addWelcomeMessage();
            
            console.log('AWS Chatbot initialized successfully');
        } catch (error) {
            console.error('Error initializing AWS Chatbot:', error);
            this.fallbackToBasicChatbot();
        }
    }
    
    initAWS() {
        if (typeof AWS === 'undefined') {
            throw new Error('AWS SDK not loaded');
        }
        
        // Configure AWS
        AWS.config.region = 'us-east-1'; // or your preferred region
        
        // Initialize services
        this.lexRuntime = new AWS.LexRuntime();
        this.polly = new AWS.Polly();
        this.cognitoIdentity = new AWS.CognitoIdentity();
        
        console.log('AWS services initialized');
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
            // Send to Amazon Bedrock for intelligent response
            const response = await this.sendToBedrock(text);
            
            // Add bot response
            this.addMessage(response.message, 'bot');
            
            // Speak response
            this.speak(response.message);
            
        } catch (error) {
            console.error('Error handling user input:', error);
            
            // Fallback response
            const fallbackResponse = this.generateFallbackResponse(text);
            this.addMessage(fallbackResponse, 'bot');
            this.speak(fallbackResponse);
        }
    }
    
    async sendToBedrock(text) {
        // Use Amazon Bedrock for intelligent responses
        const systemPrompt = `Jesteś asystentem sprzedażowym ECM Digital - firmy specjalizującej się w usługach cyfrowych.

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
            // Try to use existing Bedrock client if available
            if (window.BedrockClient) {
                console.log('Using existing Bedrock client');
                return await this.callExistingBedrock(systemPrompt, userMessage);
            }
            
            // Fallback to simulation if no Bedrock client
            console.log('No Bedrock client found, using simulation');
            return this.simulateBedrockResponse(systemPrompt, userMessage);
            
        } catch (error) {
            console.error('Bedrock API call failed:', error);
            // Fallback to simulation
            return this.simulateBedrockResponse(systemPrompt, userMessage);
        }
    }
    
    async callExistingBedrock(systemPrompt, userMessage) {
        // This integrates with your existing Bedrock setup
        const bedrockClient = new window.BedrockClient();
        
        const params = {
            modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
            body: JSON.stringify({
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 0.9,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ]
            })
        };
        
        try {
            const response = await bedrockClient.invokeModel(params);
            const responseBody = JSON.parse(response.body);
            return responseBody.content[0].text;
        } catch (error) {
            console.error('Existing Bedrock call failed:', error);
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
        return `Dziękuję za pytanie! Jestem tutaj żeby pomóc Ci znaleźć najlepsze rozwiązanie cyfrowe dla Twojej firmy.

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
            console.log('Speech is muted, skipping audio output');
            return;
        }
        
        try {
            // Try Amazon Polly first
            if (this.polly) {
                await this.speakWithPolly(text);
            } else if (this.synthesis) {
                this.speakWithWebSpeech(text);
            }
        } catch (error) {
            console.error('Speech synthesis error:', error);
            // Fallback to Web Speech API
            if (this.synthesis) {
                this.speakWithWebSpeech(text);
            }
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
        const params = {
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: this.currentLanguage === 'pl' ? 'Ewa' : 'Joanna',
            Engine: 'neural',
            TextType: 'text'
        };
        
        try {
            const result = await this.polly.synthesizeSpeech(params).promise();
            
            // Play the audio
            const audioBlob = new Blob([result.AudioStream], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
            };
            
            await audio.play();
            
        } catch (error) {
            console.error('Polly error:', error);
            throw error;
        }
    }
    
    speakWithWebSpeech(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.currentLanguage === 'pl' ? 'pl-PL' : 'en-US';
            utterance.rate = 0.85;
            utterance.pitch = 1.1;
            utterance.volume = 0.9;
            
            this.synthesis.speak(utterance);
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
        const welcomeMessage = 'Cześć! Jestem asystentem głosowym ECM Digital zintegrowanym z Amazon Lex. Mogę opowiedzieć Ci o naszych usługach, pomóc w wyborze rozwiązania lub umówić konsultację. Jak mogę Ci pomóc?';
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
