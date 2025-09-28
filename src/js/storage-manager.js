/**
 * Storage Manager for ECM Digital Application
 * Provides unified interface for data storage with DynamoDB and localStorage fallback
 */

import { dynamoClient } from './dynamodb-client.js';

class StorageManager {
    constructor() {
        this.useDynamoDB = false;
        this.initializationPromise = this.initialize();
    }

    /**
     * Initialize storage manager
     */
    async initialize() {
        try {
            // Test DynamoDB connection
            const isConnected = await dynamoClient.testConnection();
            this.useDynamoDB = isConnected;
            
            if (this.useDynamoDB) {
                console.log('✅ DynamoDB connected - using cloud storage');
                // Migrate existing localStorage data
                await this.migrateLocalStorageData();
            } else {
                console.log('⚠️ DynamoDB not available - using localStorage fallback');
            }
        } catch (error) {
            console.warn('DynamoDB initialization failed, using localStorage:', error);
            this.useDynamoDB = false;
        }
    }

    /**
     * Ensure initialization is complete
     */
    async ensureInitialized() {
        await this.initializationPromise;
    }

    // ===== USER DATA METHODS =====

    /**
     * Save user data
     */
    async saveUser(userData) {
        await this.ensureInitialized();
        
        if (this.useDynamoDB) {
            try {
                return await dynamoClient.saveUser(userData);
            } catch (error) {
                console.error('DynamoDB save failed, falling back to localStorage:', error);
                this.useDynamoDB = false;
            }
        }
        
        // localStorage fallback
        const userKey = `ecm_user_${userData.email || userData.userId}`;
        localStorage.setItem(userKey, JSON.stringify(userData));
        localStorage.setItem('ecm_user', JSON.stringify(userData));
        return userData;
    }

    /**
     * Get user data
     */
    async getUser(identifier) {
        await this.ensureInitialized();
        
        if (this.useDynamoDB) {
            try {
                // Try by userId first, then by email
                let user = await dynamoClient.getUser(identifier);
                if (!user && identifier.includes('@')) {
                    user = await dynamoClient.getUserByEmail(identifier);
                }
                return user;
            } catch (error) {
                console.error('DynamoDB get failed, falling back to localStorage:', error);
                this.useDynamoDB = false;
            }
        }
        
        // localStorage fallback
        const userKey = `ecm_user_${identifier}`;
        const userData = localStorage.getItem(userKey) || localStorage.getItem('ecm_user');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Update user preferences
     */
    async updateUserPreferences(userId, preferences) {
        await this.ensureInitialized();
        
        if (this.useDynamoDB) {
            try {
                return await dynamoClient.updateUserPreferences(userId, preferences);
            } catch (error) {
                console.error('DynamoDB update failed, falling back to localStorage:', error);
                this.useDynamoDB = false;
            }
        }
        
        // localStorage fallback
        const user = await this.getUser(userId);
        if (user) {
            user.preferences = { ...user.preferences, ...preferences };
            user.updatedAt = new Date().toISOString();
            await this.saveUser(user);
            
            // Update individual preference keys for backward compatibility
            Object.entries(preferences).forEach(([key, value]) => {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            });
        }
        return user;
    }

    // ===== SESSION METHODS =====

    /**
     * Create session
     */
    async createSession(sessionData) {
        await this.ensureInitialized();
        
        if (this.useDynamoDB) {
            try {
                return await dynamoClient.createSession(sessionData);
            } catch (error) {
                console.error('DynamoDB session creation failed, falling back to localStorage:', error);
                this.useDynamoDB = false;
            }
        }
        
        // localStorage fallback
        const sessionKey = `session_${sessionData.sessionId}`;
        localStorage.setItem(sessionKey, JSON.stringify(sessionData));
        localStorage.setItem('aws_session', JSON.stringify(sessionData));
        
        // Store tokens
        if (sessionData.token) {
            localStorage.setItem('ecm_token', sessionData.token);
            localStorage.setItem('aws_access_token', sessionData.token);
        }
        
        return sessionData;
    }

    /**
     * Get session
     */
    async getSession(sessionId) {
        await this.ensureInitialized();
        
        if (this.useDynamoDB) {
            try {
                return await dynamoClient.getSession(sessionId);
            } catch (error) {
                console.error('DynamoDB session get failed, falling back to localStorage:', error);
                this.useDynamoDB = false;
            }
        }
        
        // localStorage fallback
        const sessionKey = `session_${sessionId}`;
        const sessionData = localStorage.getItem(sessionKey) || localStorage.getItem('aws_session');
        return sessionData ? JSON.parse(sessionData) : null;
    }

    /**
     * Delete session
     */
    async deleteSession(sessionId) {
        await this.ensureInitialized();
        
        if (this.useDynamoDB) {
            try {
                return await dynamoClient.deleteSession(sessionId);
            } catch (error) {
                console.error('DynamoDB session deletion failed, falling back to localStorage:', error);
                this.useDynamoDB = false;
            }
        }
        
        // localStorage fallback
        const sessionKey = `session_${sessionId}`;
        localStorage.removeItem(sessionKey);
        localStorage.removeItem('aws_session');
        localStorage.removeItem('ecm_token');
        localStorage.removeItem('aws_access_token');
        return true;
    }

    // ===== PREFERENCE METHODS =====

    /**
     * Set preference
     */
    async setPreference(key, value, userId = null) {
        await this.ensureInitialized();
        
        if (this.useDynamoDB && userId) {
            try {
                const user = await this.getUser(userId);
                if (user) {
                    const preferences = { ...user.preferences, [key]: value };
                    return await this.updateUserPreferences(userId, preferences);
                }
            } catch (error) {
                console.error('DynamoDB preference update failed, falling back to localStorage:', error);
                this.useDynamoDB = false;
            }
        }
        
        // localStorage fallback
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        return value;
    }

    /**
     * Get preference
     */
    async getPreference(key, userId = null) {
        await this.ensureInitialized();
        
        if (this.useDynamoDB && userId) {
            try {
                const user = await this.getUser(userId);
                if (user && user.preferences && user.preferences[key] !== undefined) {
                    return user.preferences[key];
                }
            } catch (error) {
                console.error('DynamoDB preference get failed, falling back to localStorage:', error);
                this.useDynamoDB = false;
            }
        }
        
        // localStorage fallback
        const value = localStorage.getItem(key);
        if (value === null) return null;
        
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    // ===== MIGRATION METHODS =====

    /**
     * Migrate data from localStorage to DynamoDB
     */
    async migrateLocalStorageData() {
        if (!this.useDynamoDB) return;
        
        try {
            console.log('🔄 Starting localStorage to DynamoDB migration...');
            
            const migrations = await dynamoClient.migrateFromLocalStorage();
            
            if (migrations.length > 0) {
                console.log(`✅ Migrated ${migrations.length} items to DynamoDB:`, migrations);
                
                // Optionally clear localStorage after successful migration
                // this.clearMigratedLocalStorageData();
            } else {
                console.log('ℹ️ No data to migrate from localStorage');
            }
            
            return migrations;
        } catch (error) {
            console.error('Migration failed:', error);
            throw error;
        }
    }

    /**
     * Clear migrated localStorage data
     */
    clearMigratedLocalStorageData() {
        const keysToRemove = [
            'ecm_user', 'aws_session', 'ecm_token', 'aws_access_token',
            'preferredLanguage', 'chatbotMuted', 'chatbotVoiceType'
        ];
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log('🧹 Cleared migrated localStorage data');
    }

    // ===== UTILITY METHODS =====

    /**
     * Get storage status
     */
    getStorageStatus() {
        return {
            useDynamoDB: this.useDynamoDB,
            storageType: this.useDynamoDB ? 'DynamoDB' : 'localStorage',
            isCloudStorage: this.useDynamoDB
        };
    }

    /**
     * Force switch to localStorage
     */
    switchToLocalStorage() {
        this.useDynamoDB = false;
        console.log('🔄 Switched to localStorage mode');
    }

    /**
     * Retry DynamoDB connection
     */
    async retryDynamoDBConnection() {
        try {
            const isConnected = await dynamoClient.testConnection();
            this.useDynamoDB = isConnected;
            
            if (this.useDynamoDB) {
                console.log('✅ DynamoDB reconnected successfully');
                await this.migrateLocalStorageData();
            }
            
            return this.useDynamoDB;
        } catch (error) {
            console.error('DynamoDB reconnection failed:', error);
            return false;
        }
    }
}

// Export singleton instance
export const storageManager = new StorageManager();
export default StorageManager;