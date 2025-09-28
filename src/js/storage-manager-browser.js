/**
 * Browser-compatible Storage Manager for ECM Digital Application
 * Provides unified interface with localStorage fallback for testing
 */

class BrowserStorageManager {
    constructor() {
        this.useDynamoDB = false;
        this.isInitialized = false;
        this.initialize();
    }

    /**
     * Initialize storage manager
     */
    async initialize() {
        console.log('🔧 Inicjalizacja Storage Manager...');
        
        // For browser testing, we'll use localStorage
        // In production, this would connect to DynamoDB
        this.useDynamoDB = false;
        this.isInitialized = true;
        
        console.log('✅ Storage Manager zainicjalizowany (localStorage mode)');
        return true;
    }

    /**
     * Test connection (simulated for browser)
     */
    async testConnection() {
        try {
            // Test localStorage availability
            const testKey = 'ecm_test_' + Date.now();
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            
            console.log('✅ localStorage dostępne');
            return true;
        } catch (error) {
            console.error('❌ Błąd testowania localStorage:', error);
            return false;
        }
    }

    // ===== USER DATA METHODS =====

    /**
     * Save user data
     */
    async setUser(userData) {
        try {
            const userKey = `ecm_user_${userData.userId || userData.email}`;
            const userDataWithTimestamp = {
                ...userData,
                updatedAt: new Date().toISOString(),
                createdAt: userData.createdAt || new Date().toISOString()
            };
            
            localStorage.setItem(userKey, JSON.stringify(userDataWithTimestamp));
            localStorage.setItem('ecm_current_user', userData.userId || userData.email);
            
            console.log('✅ Dane użytkownika zapisane:', userKey);
            return userDataWithTimestamp;
        } catch (error) {
            console.error('❌ Błąd zapisywania użytkownika:', error);
            throw error;
        }
    }

    /**
     * Get user data
     */
    async getUser(identifier) {
        try {
            const userKey = `ecm_user_${identifier}`;
            const userData = localStorage.getItem(userKey);
            
            if (userData) {
                const parsed = JSON.parse(userData);
                console.log('✅ Dane użytkownika pobrane:', userKey);
                return parsed;
            }
            
            console.log('ℹ️ Użytkownik nie znaleziony:', userKey);
            return null;
        } catch (error) {
            console.error('❌ Błąd pobierania użytkownika:', error);
            throw error;
        }
    }

    /**
     * Get current user
     */
    async getCurrentUser() {
        try {
            const currentUserId = localStorage.getItem('ecm_current_user');
            if (currentUserId) {
                return await this.getUser(currentUserId);
            }
            return null;
        } catch (error) {
            console.error('❌ Błąd pobierania aktualnego użytkownika:', error);
            return null;
        }
    }

    // ===== SESSION METHODS =====

    /**
     * Create session
     */
    async setSession(sessionData) {
        try {
            const sessionKey = `ecm_session_${sessionData.sessionId}`;
            const sessionWithTimestamp = {
                ...sessionData,
                updatedAt: new Date().toISOString(),
                createdAt: sessionData.createdAt || new Date().toISOString()
            };
            
            localStorage.setItem(sessionKey, JSON.stringify(sessionWithTimestamp));
            localStorage.setItem('ecm_current_session', sessionData.sessionId);
            
            console.log('✅ Sesja zapisana:', sessionKey);
            return sessionWithTimestamp;
        } catch (error) {
            console.error('❌ Błąd zapisywania sesji:', error);
            throw error;
        }
    }

    /**
     * Get session
     */
    async getSession(sessionId) {
        try {
            const sessionKey = `ecm_session_${sessionId}`;
            const sessionData = localStorage.getItem(sessionKey);
            
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                console.log('✅ Sesja pobrana:', sessionKey);
                return parsed;
            }
            
            console.log('ℹ️ Sesja nie znaleziona:', sessionKey);
            return null;
        } catch (error) {
            console.error('❌ Błąd pobierania sesji:', error);
            throw error;
        }
    }

    // ===== GENERIC ITEM METHODS =====

    /**
     * Set item
     */
    async setItem(key, value, userId = null) {
        try {
            const fullKey = userId ? `ecm_${userId}_${key}` : `ecm_${key}`;
            const itemData = {
                value: value,
                userId: userId,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem(fullKey, JSON.stringify(itemData));
            console.log('✅ Element zapisany:', fullKey);
            return true;
        } catch (error) {
            console.error('❌ Błąd zapisywania elementu:', error);
            throw error;
        }
    }

    /**
     * Get item
     */
    async getItem(key, userId = null) {
        try {
            const fullKey = userId ? `ecm_${userId}_${key}` : `ecm_${key}`;
            const itemData = localStorage.getItem(fullKey);
            
            if (itemData) {
                const parsed = JSON.parse(itemData);
                console.log('✅ Element pobrany:', fullKey);
                return parsed.value;
            }
            
            console.log('ℹ️ Element nie znaleziony:', fullKey);
            return null;
        } catch (error) {
            console.error('❌ Błąd pobierania elementu:', error);
            throw error;
        }
    }

    /**
     * Remove item
     */
    async removeItem(key, userId = null) {
        try {
            const fullKey = userId ? `ecm_${userId}_${key}` : `ecm_${key}`;
            localStorage.removeItem(fullKey);
            console.log('✅ Element usunięty:', fullKey);
            return true;
        } catch (error) {
            console.error('❌ Błąd usuwania elementu:', error);
            throw error;
        }
    }

    // ===== UTILITY METHODS =====

    /**
     * Get all ECM keys
     */
    getAllECMKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ecm_')) {
                keys.push(key);
            }
        }
        return keys;
    }

    /**
     * Clear all ECM data
     */
    async clearAllData() {
        try {
            const keys = this.getAllECMKeys();
            keys.forEach(key => localStorage.removeItem(key));
            console.log(`✅ Usunięto ${keys.length} elementów ECM`);
            return keys.length;
        } catch (error) {
            console.error('❌ Błąd czyszczenia danych:', error);
            throw error;
        }
    }

    /**
     * Get storage statistics
     */
    getStorageStats() {
        const keys = this.getAllECMKeys();
        const stats = {
            totalKeys: keys.length,
            users: keys.filter(k => k.includes('_user_')).length,
            sessions: keys.filter(k => k.includes('_session_')).length,
            items: keys.filter(k => !k.includes('_user_') && !k.includes('_session_')).length,
            useDynamoDB: this.useDynamoDB,
            isInitialized: this.isInitialized
        };
        
        console.log('📊 Statystyki storage:', stats);
        return stats;
    }

    /**
     * Export all data for migration
     */
    exportAllData() {
        const keys = this.getAllECMKeys();
        const data = {};
        
        keys.forEach(key => {
            try {
                const value = localStorage.getItem(key);
                data[key] = JSON.parse(value);
            } catch (error) {
                data[key] = value; // Store as string if not JSON
            }
        });
        
        console.log(`📦 Wyeksportowano ${Object.keys(data).length} elementów`);
        return data;
    }

    /**
     * Import data (for testing migration)
     */
    async importData(data) {
        try {
            let imported = 0;
            
            for (const [key, value] of Object.entries(data)) {
                const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                localStorage.setItem(key, stringValue);
                imported++;
            }
            
            console.log(`📥 Zaimportowano ${imported} elementów`);
            return imported;
        } catch (error) {
            console.error('❌ Błąd importowania danych:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const storageManager = new BrowserStorageManager();
export default BrowserStorageManager;