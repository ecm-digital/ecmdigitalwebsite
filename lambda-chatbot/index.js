const AWS = require('aws-sdk');

// Inicjalizuj AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

/**
 * Lambda function for ECM Digital Chatbot
 * Handles queries about services using data from DynamoDB
 */
exports.handler = async (event) => {
    console.log('📨 Chatbot request received:', JSON.stringify(event, null, 2));

    try {
        let message = '';
        let userId = '';
        let sessionId = '';

        // Handle different event formats
        if (event.body) {
            // API Gateway format
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
            message = body.message;
            userId = body.userId;
            sessionId = body.sessionId;
        } else if (event.message) {
            // Direct Lambda call
            message = event.message;
            userId = event.userId;
            sessionId = event.sessionId;
        }

        if (!message) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Message is required',
                    timestamp: new Date().toISOString()
                })
            };
        }

        // Analizuj wiadomość i znajdź pasujące usługi
        const services = await findRelevantServices(message);

        // Stwórz odpowiedź
        const response = generateResponse(message, services);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: response,
                services: services,
                timestamp: new Date().toISOString(),
                query: message
            })
        };

    } catch (error) {
        console.error('❌ Chatbot error:', error);

        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                error: 'Internal server error',
                details: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

/**
 * Znajdź odpowiednie usługi na podstawie zapytania
 */
async function findRelevantServices(query) {
    const keywords = extractKeywords(query.toLowerCase());

    try {
        // Pobierz wszystkie usługi z DynamoDB
        const result = await dynamodb.scan({
            TableName: 'ECMServices'
        }).promise();

        const services = result.Items || [];

        // Filtruj usługi na podstawie słów kluczowych
        const relevantServices = services.filter(service => {
            const serviceText = `${service.name} ${service.description} ${service.category}`.toLowerCase();
            return keywords.some(keyword => serviceText.includes(keyword));
        });

        return relevantServices.map(service => ({
            id: service.service_id,
            name: service.name,
            description: service.description,
            category: service.category,
            priority: service.priority,
            url: service.url
        }));

    } catch (error) {
        console.error('❌ DynamoDB error:', error);
        return [];
    }
}

/**
 * Wyciągnij słowa kluczowe z zapytania
 */
function extractKeywords(query) {
    const keywords = [];

    // Mapowanie synonimów
    const keywordMap = {
        'strona': ['strony', 'www', 'website', 'strona internetowa'],
        'sklep': ['shopify', 'ecommerce', 'sklep', 'e-commerce'],
        'mvp': ['prototyp', 'mvp', 'prototype'],
        'ux': ['audyt', 'ux', 'ui', 'user experience'],
        'automatyzacja': ['n8n', 'automatyzac', 'automation', 'workflow'],
        'social': ['social media', 'social', 'facebook', 'instagram'],
        'ai': ['ai', 'sztuczna inteligencja', 'bedrock', 'copilot'],
        'mobile': ['aplikacja', 'mobile', 'ios', 'android'],
        'voice': ['głosowy', 'alexa', 'lex', 'voice']
    };

    // Sprawdź każde słowo kluczowe
    Object.values(keywordMap).forEach(synonyms => {
        synonyms.forEach(synonym => {
            if (query.includes(synonym)) {
                keywords.push(...synonyms);
            }
        });
    });

    return [...new Set(keywords)]; // Usuń duplikaty
}

/**
 * Wygeneruj odpowiedź na podstawie znalezionych usług
 */
function generateResponse(query, services) {
    if (services.length === 0) {
        return `Przepraszam, nie znalazłem usług pasujących do Twojego zapytania: "${query}". 

Oferujemy następujące usługi:
- Strony WWW - profesjonalne strony internetowe
- Sklepy Shopify - e-commerce solutions
- Prototypy MVP - szybka walidacja pomysłów
- Audyty UX - analiza doświadczeń użytkownika
- Automatyzacje - workflow automation z n8n
- Social Media & AI - marketing oparty na danych
- Asystenci AI - Amazon Bedrock & Copilot Studio
- Aplikacje Mobilne - iOS, Android, React Native
- Asystenci Głosowi - Amazon Lex

Napisz mi, która usługa Cię interesuje!`;
    }

    if (services.length === 1) {
        const service = services[0];
        return `Oto informacje o usłudze **${service.name}**:

${service.description}

**Kategoria:** ${service.category}
**Priorytet:** ${service.priority}

Chcesz poznać szczegóły lub wycenę?`;
    }

    // Wiele usług
    let response = `Znalazłem ${services.length} usług pasujących do Twojego zapytania:\n\n`;

    services.forEach(service => {
        response += `**${service.name}**\n`;
        response += `${service.description.substring(0, 100)}...\n`;
        response += `*Kategoria: ${service.category}*\n\n`;
    });

    response += `Która usługa Cię interesuje najbardziej?`;

    return response;
}

/**
 * CORS headers dla web requests
 */
function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Content-Type': 'application/json'
    };
}




