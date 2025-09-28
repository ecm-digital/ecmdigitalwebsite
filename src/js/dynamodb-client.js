/**
 * DynamoDB Client for ECM Digital Application
 * Provides CRUD operations for user data and sessions
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

class ECMDynamoDBClient {
    constructor() {
        // Initialize DynamoDB client
        this.client = new DynamoDBClient({
            region: 'eu-west-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || localStorage.getItem('AWS_ACCESS_KEY_ID'),
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || localStorage.getItem('AWS_SECRET_ACCESS_KEY')
            }
        });
        
        this.docClient = DynamoDBDocumentClient.from(this.client);
        this.usersTable = 'ecm-digital-users';
        this.sessionsTable = 'ecm-digital-sessions';
    }

    // ===== USER OPERATIONS =====

    /**
     * Create or update user
     */
    async saveUser(userData) {
        try {
            const params = {
                TableName: this.usersTable,
                Item: {
                    userId: userData.userId || this.generateId(),
                    email: userData.email,
                    name: userData.name,
                    preferences: userData.preferences || {},
                    createdAt: userData.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    ...userData
                }
            };

            const command = new PutCommand(params);
            await this.docClient.send(command);
            return params.Item;
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

    /**
     * Get user by ID
     */
    async getUser(userId) {
        try {
            const params = {
                TableName: this.usersTable,
                Key: { userId }
            };

            const command = new GetCommand(params);
            const result = await this.docClient.send(command);
            return result.Item;
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    /**
     * Get user by email
     */
    async getUserByEmail(email) {
        try {
            const params = {
                TableName: this.usersTable,
                IndexName: 'EmailIndex',
                KeyConditionExpression: 'email = :email',
                ExpressionAttributeValues: {
                    ':email': email
                }
            };

            const command = new QueryCommand(params);
            const result = await this.docClient.send(command);
            return result.Items?.[0];
        } catch (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }
    }

    /**
     * Update user preferences
     */
    async updateUserPreferences(userId, preferences) {
        try {
            const params = {
                TableName: this.usersTable,
                Key: { userId },
                UpdateExpression: 'SET preferences = :preferences, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':preferences': preferences,
                    ':updatedAt': new Date().toISOString()
                },
                ReturnValues: 'ALL_NEW'
            };

            const command = new UpdateCommand(params);
            const result = await this.docClient.send(command);
            return result.Attributes;
        } catch (error) {
            console.error('Error updating user preferences:', error);
            throw error;
        }
    }

    // ===== SESSION OPERATIONS =====

    /**
     * Create session
     */
    async createSession(sessionData) {
        try {
            const params = {
                TableName: this.sessionsTable,
                Item: {
                    sessionId: sessionData.sessionId || this.generateId(),
                    userId: sessionData.userId,
                    token: sessionData.token,
                    expiresAt: sessionData.expiresAt,
                    createdAt: new Date().toISOString(),
                    data: sessionData.data || {},
                    ...sessionData
                }
            };

            const command = new PutCommand(params);
            await this.docClient.send(command);
            return params.Item;
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    /**
     * Get session
     */
    async getSession(sessionId) {
        try {
            const params = {
                TableName: this.sessionsTable,
                Key: { sessionId }
            };

            const command = new GetCommand(params);
            const result = await this.docClient.send(command);
            
            // Check if session is expired
            if (result.Item && result.Item.expiresAt) {
                const now = new Date().toISOString();
                if (now > result.Item.expiresAt) {
                    await this.deleteSession(sessionId);
                    return null;
                }
            }
            
            return result.Item;
        } catch (error) {
            console.error('Error getting session:', error);
            throw error;
        }
    }

    /**
     * Get user sessions
     */
    async getUserSessions(userId) {
        try {
            const params = {
                TableName: this.sessionsTable,
                IndexName: 'UserIndex',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            };

            const command = new QueryCommand(params);
            const result = await this.docClient.send(command);
            return result.Items || [];
        } catch (error) {
            console.error('Error getting user sessions:', error);
            throw error;
        }
    }

    /**
     * Delete session
     */
    async deleteSession(sessionId) {
        try {
            const params = {
                TableName: this.sessionsTable,
                Key: { sessionId }
            };

            const command = new DeleteCommand(params);
            await this.docClient.send(command);
            return true;
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error;
        }
    }

    /**
     * Clean expired sessions
     */
    async cleanExpiredSessions() {
        try {
            const params = {
                TableName: this.sessionsTable,
                FilterExpression: 'expiresAt < :now',
                ExpressionAttributeValues: {
                    ':now': new Date().toISOString()
                }
            };

            const command = new ScanCommand(params);
            const result = await this.docClient.send(command);
            
            // Delete expired sessions
            for (const session of result.Items || []) {
                await this.deleteSession(session.sessionId);
            }
            
            return result.Items?.length || 0;
        } catch (error) {
            console.error('Error cleaning expired sessions:', error);
            throw error;
        }
    }

    // ===== UTILITY METHODS =====

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Migrate data from localStorage to DynamoDB
     */
    async migrateFromLocalStorage() {
        try {
            const migrations = [];
            
            // Migrate user data
            const userData = localStorage.getItem('ecm_user');
            if (userData) {
                const user = JSON.parse(userData);
                const migratedUser = await this.saveUser({
                    userId: this.generateId(),
                    email: user.email,
                    name: user.name,
                    preferences: {
                        language: localStorage.getItem('preferredLanguage') || 'pl',
                        chatbotMuted: localStorage.getItem('chatbotMuted') === 'true',
                        chatbotVoiceType: localStorage.getItem('chatbotVoiceType') || 'auto'
                    }
                });
                migrations.push({ type: 'user', data: migratedUser });
            }

            // Migrate session data
            const sessionData = localStorage.getItem('aws_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                const migratedSession = await this.createSession({
                    sessionId: this.generateId(),
                    userId: session.user?.email || 'anonymous',
                    token: localStorage.getItem('ecm_token') || localStorage.getItem('aws_access_token'),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                    data: session
                });
                migrations.push({ type: 'session', data: migratedSession });
            }

            return migrations;
        } catch (error) {
            console.error('Error migrating from localStorage:', error);
            throw error;
        }
    }

    /**
     * Test connection to DynamoDB
     */
    async testConnection() {
        try {
            const params = {
                TableName: this.usersTable,
                Limit: 1
            };

            const command = new ScanCommand(params);
            await this.docClient.send(command);
            return true;
        } catch (error) {
            console.error('DynamoDB connection test failed:', error);
            return false;
        }
    }
}

// Export singleton instance
export const dynamoClient = new ECMDynamoDBClient();
export default ECMDynamoDBClient;