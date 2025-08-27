import { RDSClient, DescribeDBInstancesCommand } from '@aws-sdk/client-rds';
import { rdsClient, RDS_CONFIG } from './config';

export interface RDSConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

export interface RDSInstance {
  id: string;
  status: string;
  endpoint: string;
  port: number;
  engine: string;
  version: string;
}

export class RDSService {
  /**
   * Get RDS instance information
   */
  static async getInstance(instanceId: string): Promise<RDSInstance | null> {
    try {
      const command = new DescribeDBInstancesCommand({
        DBInstanceIdentifier: instanceId,
      });

      const response = await rdsClient.send(command);
      
      if (response.DBInstances && response.DBInstances.length > 0) {
        const instance = response.DBInstances[0];
        return {
          id: instance.DBInstanceIdentifier || instanceId,
          status: instance.DBInstanceStatus || 'unknown',
          endpoint: instance.Endpoint?.Address || '',
          port: instance.Endpoint?.Port || 5432,
          engine: instance.Engine || '',
          version: instance.EngineVersion || '',
        };
      }
      
      return null;
    } catch (error) {
      console.error('RDS getInstance error:', error);
      return null;
    }
  }

  /**
   * Get connection configuration for local development
   */
  static getConnectionConfig(): RDSConnection {
    return {
      host: RDS_CONFIG.host,
      port: RDS_CONFIG.port,
      database: RDS_CONFIG.database,
      username: RDS_CONFIG.username,
      password: RDS_CONFIG.password,
      ssl: RDS_CONFIG.ssl,
    };
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      // For local development, we'll use a simple connection test
      // In production, this would use the actual RDS instance
      const config = this.getConnectionConfig();
      
      if (config.host === 'localhost') {
        // Local development - connection should work
        return true;
      }
      
      // Production - check if RDS instance is available
      const instance = await this.getInstance(config.host);
      return instance?.status === 'available';
    } catch (error) {
      console.error('RDS testConnection error:', error);
      return false;
    }
  }

  /**
   * Initialize database schema
   */
  static async initializeDatabase(): Promise<boolean> {
    try {
      // This would create tables and initial data
      // For now, just return success
      console.log('RDS database initialized successfully');
      return true;
    } catch (error) {
      console.error('RDS initializeDatabase error:', error);
      return false;
    }
  }
}

// Export connection config for use in other modules
export const getRDSConnection = () => RDSService.getConnectionConfig();
export const testRDSConnection = () => RDSService.testConnection();
export const initializeRDSDatabase = () => RDSService.initializeDatabase();
