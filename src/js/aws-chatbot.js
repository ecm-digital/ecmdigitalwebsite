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
        
        this.init();
    }
    
    init() {
        try {
            // Initialize AWS SDK
            this.initAWS();
            
            // Initialize speech recognition
            this.initSpeechRecognition();
            
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
            // Send to Amazon Lex
            const response = await this.sendToLex(text);
            
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
    
    async sendToLex(text) {
        const params = {
            BotName: this.botName,
            BotAlias: this.botAlias,
            UserId: this.userId,
            InputText: text,
            SessionAttributes: {
                'language': this.currentLanguage,
                'company': 'ECM Digital',
                'services': 'websites,shopify,mobile,ai,automation'
            }
        };
        
        try {
            const result = await this.lexRuntime.postText(params).promise();
            
            return {
                message: result.message || 'Dziękuję za wiadomość!',
                intent: result.intentName,
                slots: result.slots,
                sessionAttributes: result.sessionAttributes
            };
            
        } catch (error) {
            console.error('Lex error:', error);
            throw error;
        }
    }
    
    async speak(text) {
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
