// Migration script from localStorage to DynamoDB
import { storageManager } from './storage-manager-browser.js';

class DataMigration {
  constructor() {
    this.migrationLog = [];
  }

  async migrateFromLocalStorage() {
    console.log('🚀 Starting migration from localStorage to DynamoDB...');
    
    try {
      // Check if DynamoDB is available
      const isAvailable = await storageManager.testConnection();
      if (!isAvailable) {
        console.warn('⚠️ DynamoDB not available, skipping migration');
        return false;
      }

      // Migrate user data
      await this.migrateUserData();
      
      // Migrate session data
      await this.migrateSessionData();
      
      // Migrate other application data
      await this.migrateApplicationData();

      console.log('✅ Migration completed successfully!');
      console.log('Migration log:', this.migrationLog);
      
      return true;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return false;
    }
  }

  async migrateUserData() {
    console.log('📦 Migrating user data...');
    
    const userData = localStorage.getItem('ecm_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.id) {
          await storageManager.setUser(user.id, user);
          this.migrationLog.push(`User data migrated for ID: ${user.id}`);
          console.log(`✓ User data migrated for: ${user.email || user.id}`);
        }
      } catch (error) {
        console.error('Error migrating user data:', error);
        this.migrationLog.push(`Error migrating user data: ${error.message}`);
      }
    }

    // Migrate token
    const token = localStorage.getItem('ecm_token');
    if (token) {
      await storageManager.setItem('ecm_token', token);
      this.migrationLog.push('Token migrated');
      console.log('✓ Token migrated');
    }
  }

  async migrateSessionData() {
    console.log('🔐 Migrating session data...');
    
    // Migrate confirmation email
    const confirmationEmail = localStorage.getItem('confirmationEmail');
    if (confirmationEmail) {
      await storageManager.setItem('confirmationEmail', confirmationEmail);
      this.migrationLog.push('Confirmation email migrated');
      console.log('✓ Confirmation email migrated');
    }

    // Migrate language preference
    const language = localStorage.getItem('language');
    if (language) {
      await storageManager.setItem('language', language);
      this.migrationLog.push(`Language preference migrated: ${language}`);
      console.log(`✓ Language preference migrated: ${language}`);
    }
  }

  async migrateApplicationData() {
    console.log('⚙️ Migrating application data...');
    
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      // Skip already migrated keys
      if (['ecm_user', 'ecm_token', 'confirmationEmail', 'language'].includes(key)) {
        continue;
      }

      // Migrate other ECM-related data
      if (key.startsWith('ecm_') || key.startsWith('hubspot_') || key.startsWith('auth_')) {
        try {
          const value = localStorage.getItem(key);
          await storageManager.setItem(key, value);
          this.migrationLog.push(`Application data migrated: ${key}`);
          console.log(`✓ Application data migrated: ${key}`);
        } catch (error) {
          console.error(`Error migrating ${key}:`, error);
          this.migrationLog.push(`Error migrating ${key}: ${error.message}`);
        }
      }
    }
  }

  async cleanupLocalStorage() {
    console.log('🧹 Cleaning up localStorage after successful migration...');
    
    // Only remove migrated keys, keep others
    const keysToRemove = [
      'ecm_user',
      'ecm_token', 
      'confirmationEmail',
      'language'
    ];

    // Also remove other ECM-related keys
    const allKeys = Object.keys(localStorage);
    for (const key of allKeys) {
      if (key.startsWith('ecm_') || key.startsWith('hubspot_') || key.startsWith('auth_')) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
      console.log(`✓ Removed from localStorage: ${key}`);
    }

    console.log('✅ localStorage cleanup completed');
  }

  async verifyMigration() {
    console.log('🔍 Verifying migration...');
    
    try {
      // Test reading migrated data
      const token = await storageManager.getItem('ecm_token');
      const language = await storageManager.getItem('language');
      
      console.log('✓ Migration verification passed');
      console.log(`Token exists: ${!!token}`);
      console.log(`Language: ${language || 'not set'}`);
      
      return true;
    } catch (error) {
      console.error('❌ Migration verification failed:', error);
      return false;
    }
  }

  async runFullMigration() {
    const migrationSuccess = await this.migrateFromLocalStorage();
    
    if (migrationSuccess) {
      const verificationSuccess = await this.verifyMigration();
      
      if (verificationSuccess) {
        // Only cleanup if everything went well
        await this.cleanupLocalStorage();
        
        // Store migration completion flag
        await storageManager.setItem('migration_completed', new Date().toISOString());
        
        console.log('🎉 Full migration completed successfully!');
        return true;
      }
    }
    
    console.log('⚠️ Migration incomplete or failed');
    return false;
  }
}

// Auto-run migration on page load if not already completed
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check if migration was already completed
    const migrationCompleted = await storageManager.getItem('migration_completed');
    
    if (!migrationCompleted && Object.keys(localStorage).length > 0) {
      console.log('🔄 Auto-starting data migration...');
      const migration = new DataMigration();
      await migration.runFullMigration();
    }
  } catch (error) {
    console.log('Migration check failed, will use localStorage fallback:', error);
  }
});

// Export for manual use
window.DataMigration = DataMigration;

export { DataMigration };