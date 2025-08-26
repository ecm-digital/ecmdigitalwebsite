const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    const { httpMethod, path, body } = event;
    
    try {
        const requestBody = body ? JSON.parse(body) : {};
        
        switch (httpMethod) {
            case 'POST':
                if (path.includes('/chatbot/message')) {
                    return await handleChatbotMessage(requestBody);
                } else if (path.includes('/chatbot/conversation')) {
                    return await handleGetConversation(requestBody);
                }
                break;
                
            case 'GET':
                if (path.includes('/chatbot/conversation/')) {
                    return await handleGetConversation(requestBody);
                }
                break;
                
            default:
                return {
                    statusCode: 405,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

async function handleChatbotMessage(messageData) {
    const { message, userId, projectId, conversationId } = messageData;
    
    if (!message || !userId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Message and user ID are required' })
        };
    }
    
    const messageId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Generate AI response
    const aiResponse = await generateAIResponse(message, projectId);
    
    // Save user message
    const userMessage = {
        id: messageId,
        content: message,
        sender: 'user',
        userId,
        projectId: projectId || null,
        conversationId: conversationId || uuidv4(),
        timestamp,
        type: 'text'
    };
    
    // Save AI response
    const aiMessage = {
        id: uuidv4(),
        content: aiResponse,
        sender: 'ai',
        userId,
        projectId: projectId || null,
        conversationId: userMessage.conversationId,
        timestamp: new Date().toISOString(),
        type: 'text'
    };
    
    try {
        // Save both messages to DynamoDB
        await dynamodb.batchWrite({
            RequestItems: {
                'ecm-messages': [
                    {
                        PutRequest: {
                            Item: userMessage
                        }
                    },
                    {
                        PutRequest: {
                            Item: aiMessage
                        }
                    }
                ]
            }
        }).promise();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Chat message processed successfully',
                conversation: {
                    conversationId: userMessage.conversationId,
                    messages: [userMessage, aiMessage]
                }
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to process chat message' })
        };
    }
}

async function generateAIResponse(userMessage, projectId) {
    // Simple AI response logic - in production, integrate with real AI service
    const responses = {
        greeting: [
            "Cześć! Jak mogę Ci dzisiaj pomóc?",
            "Witaj! Jestem Twoim asystentem AI. W czym mogę Ci pomóc?",
            "Dzień dobry! Jakie masz pytania dotyczące projektu?"
        ],
        project: [
            "Widzę, że pytasz o projekt. Mogę pomóc Ci z zarządzaniem zadaniami, dokumentami lub harmonogramem.",
            "Projekty to moja specjalność! Opowiedz mi więcej o tym, nad czym pracujesz.",
            "Chętnie pomogę Ci z projektem. Jakie konkretnie aspekty Cię interesują?"
        ],
        technical: [
            "To pytanie techniczne. Mogę pomóc Ci z konfiguracją, dokumentacją lub rozwiązywaniem problemów.",
            "Rozumiem Twoje pytanie techniczne. Potrzebuję więcej szczegółów, żeby lepiej Ci pomóc.",
            "To dobry punkt! Pozwól mi przeanalizować i zaproponować rozwiązanie."
        ],
        default: [
            "Dziękuję za Twoje pytanie. Staram się jak najlepiej Ci pomóc.",
            "To interesujące! Pozwól mi się nad tym zastanowić i zaproponować rozwiązanie.",
            "Rozumiem Twoje pytanie. Mogę pomóc Ci z różnymi aspektami zarządzania projektami."
        ]
    };
    
    // Simple keyword detection
    let category = 'default';
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('cześć') || lowerMessage.includes('witaj') || lowerMessage.includes('dzień dobry')) {
        category = 'greeting';
    } else if (lowerMessage.includes('projekt') || lowerMessage.includes('zadanie') || lowerMessage.includes('deadline')) {
        category = 'project';
    } else if (lowerMessage.includes('techniczny') || lowerMessage.includes('problem') || lowerMessage.includes('błąd')) {
        category = 'technical';
    }
    
    // Add project context if available
    let response = responses[category][Math.floor(Math.random() * responses[category].length)];
    
    if (projectId) {
        response += ` Widzę, że pracujesz nad projektem ${projectId}. `;
    }
    
    // Add helpful suggestions
    response += " Mogę pomóc Ci z: zarządzaniem projektami, dokumentami, harmonogramami, lub odpowiem na pytania techniczne.";
    
    return response;
}

async function handleGetConversation(requestData) {
    const { conversationId, userId, projectId } = requestData;
    
    if (!conversationId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Conversation ID is required' })
        };
    }
    
    try {
        const result = await dynamodb.query({
            TableName: 'ecm-messages',
            IndexName: 'ProjectIdIndex',
            KeyConditionExpression: 'projectId = :projectId',
            FilterExpression: 'conversationId = :conversationId',
            ExpressionAttributeValues: { 
                ':projectId': projectId || 'general',
                ':conversationId': conversationId
            }
        }).promise();
        
        // If no project-specific messages, try general conversation
        let messages = result.Items || [];
        if (messages.length === 0 && projectId) {
            const generalResult = await dynamodb.scan({
                TableName: 'ecm-messages',
                FilterExpression: 'conversationId = :conversationId',
                ExpressionAttributeValues: { ':conversationId': conversationId }
            }).promise();
            messages = generalResult.Items || [];
        }
        
        // Sort messages by timestamp
        messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversation: {
                    conversationId,
                    messages,
                    projectId: projectId || 'general'
                }
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to get conversation' })
        };
    }
}






