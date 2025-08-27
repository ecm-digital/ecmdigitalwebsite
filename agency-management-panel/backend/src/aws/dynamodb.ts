import { 
  DynamoDBClient, 
  PutItemCommand, 
  GetItemCommand, 
  QueryCommand, 
  ScanCommand, 
  UpdateItemCommand, 
  DeleteItemCommand,
  AttributeValue
} from '@aws-sdk/client-dynamodb';
import { dynamoClient, DYNAMODB_CONFIG } from './config';

export interface DynamoDBItem {
  [key: string]: any;
}

export interface QueryResult<T> {
  items: T[];
  count: number;
  lastEvaluatedKey?: Record<string, AttributeValue>;
}

export class DynamoDBService {
  /**
   * Put item into DynamoDB table
   */
  static async putItem<T extends DynamoDBItem>(
    tableName: string, 
    item: T
  ): Promise<boolean> {
    try {
      const command = new PutItemCommand({
        TableName: tableName,
        Item: this.serializeItem(item),
      });

      await dynamoClient.send(command);
      return true;
    } catch (error) {
      console.error('DynamoDB putItem error:', error);
      return false;
    }
  }

  /**
   * Get item from DynamoDB table by primary key
   */
  static async getItem<T extends DynamoDBItem>(
    tableName: string, 
    key: Record<string, any>
  ): Promise<T | null> {
    try {
      const command = new GetItemCommand({
        TableName: tableName,
        Key: this.serializeItem(key),
      });

      const response = await dynamoClient.send(command);
      
      if (response.Item) {
        return this.deserializeItem(response.Item) as T;
      }
      
      return null;
    } catch (error) {
      console.error('DynamoDB getItem error:', error);
      return null;
    }
  }

  /**
   * Query items from DynamoDB table
   */
  static async query<T extends DynamoDBItem>(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>
  ): Promise<QueryResult<T>> {
    try {
      const command = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: this.serializeItem(expressionAttributeValues),
        ExpressionAttributeNames: expressionAttributeNames,
      });

      const response = await dynamoClient.send(command);
      
      return {
        items: (response.Items || []).map(item => this.deserializeItem(item) as T),
        count: response.Count || 0,
        lastEvaluatedKey: response.LastEvaluatedKey,
      };
    } catch (error) {
      console.error('DynamoDB query error:', error);
      return { items: [], count: 0 };
    }
  }

  /**
   * Scan all items from DynamoDB table
   */
  static async scan<T extends DynamoDBItem>(
    tableName: string,
    filterExpression?: string,
    expressionAttributeValues?: Record<string, any>,
    expressionAttributeNames?: Record<string, string>
  ): Promise<QueryResult<T>> {
    try {
      const command = new ScanCommand({
        TableName: tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues ? this.serializeItem(expressionAttributeValues) : undefined,
        ExpressionAttributeNames: expressionAttributeNames,
      });

      const response = await dynamoClient.send(command);
      
      return {
        items: (response.Items || []).map(item => this.deserializeItem(item) as T),
        count: response.Count || 0,
        lastEvaluatedKey: response.LastEvaluatedKey,
      };
    } catch (error) {
      console.error('DynamoDB scan error:', error);
      return { items: [], count: 0 };
    }
  }

  /**
   * Update item in DynamoDB table
   */
  static async updateItem<T extends DynamoDBItem>(
    tableName: string,
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>
  ): Promise<boolean> {
    try {
      const command = new UpdateItemCommand({
        TableName: tableName,
        Key: this.serializeItem(key),
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: this.serializeItem(expressionAttributeValues),
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
      });

      await dynamoClient.send(command);
      return true;
    } catch (error) {
      console.error('DynamoDB updateItem error:', error);
      return false;
    }
  }

  /**
   * Delete item from DynamoDB table
   */
  static async deleteItem(
    tableName: string,
    key: Record<string, any>
  ): Promise<boolean> {
    try {
      const command = new DeleteItemCommand({
        TableName: tableName,
        Key: this.serializeItem(key),
      });

      await dynamoClient.send(command);
      return true;
    } catch (error) {
      console.error('DynamoDB deleteItem error:', error);
      return false;
    }
  }

  /**
   * Serialize JavaScript object to DynamoDB AttributeValue format
   */
  private static serializeItem(item: Record<string, any>): Record<string, AttributeValue> {
    const serialized: Record<string, AttributeValue> = {};
    
    for (const [key, value] of Object.entries(item)) {
      if (value === null || value === undefined) continue;
      
      if (typeof value === 'string') {
        serialized[key] = { S: value };
      } else if (typeof value === 'number') {
        serialized[key] = { N: value.toString() };
      } else if (typeof value === 'boolean') {
        serialized[key] = { BOOL: value };
      } else if (Array.isArray(value)) {
        serialized[key] = { L: value.map(v => this.serializeValue(v)) };
      } else if (typeof value === 'object') {
        serialized[key] = { M: this.serializeItem(value) };
      }
    }
    
    return serialized;
  }

  /**
   * Serialize single value to DynamoDB AttributeValue
   */
  private static serializeValue(value: any): AttributeValue {
    if (typeof value === 'string') {
      return { S: value };
    } else if (typeof value === 'number') {
      return { N: value.toString() };
    } else if (typeof value === 'boolean') {
      return { BOOL: value };
    } else if (Array.isArray(value)) {
      return { L: value.map(v => this.serializeValue(v)) };
    } else if (typeof value === 'object') {
      return { M: this.serializeItem(value) };
    }
    
    return { S: String(value) };
  }

  /**
   * Deserialize DynamoDB AttributeValue to JavaScript object
   */
  private static deserializeItem(item: Record<string, AttributeValue>): Record<string, any> {
    const deserialized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(item)) {
      deserialized[key] = this.deserializeValue(value);
    }
    
    return deserialized;
  }

  /**
   * Deserialize single DynamoDB AttributeValue
   */
  private static deserializeValue(value: AttributeValue): any {
    if (value.S) return value.S;
    if (value.N) return parseFloat(value.N);
    if (value.BOOL !== undefined) return value.BOOL;
    if (value.L) return value.L.map(v => this.deserializeValue(v));
    if (value.M) return this.deserializeItem(value.M);
    if (value.NULL) return null;
    
    return undefined;
  }
}

// Convenience methods for specific tables
export const UsersService = {
  async createUser(user: any): Promise<boolean> {
    return DynamoDBService.putItem(DYNAMODB_CONFIG.Tables.users, user);
  },
  
  async getUser(userId: string): Promise<any> {
    return DynamoDBService.getItem(DYNAMODB_CONFIG.Tables.users, { id: userId });
  },
  
  async getAllUsers(): Promise<any[]> {
    const result = await DynamoDBService.scan(DYNAMODB_CONFIG.Tables.users);
    return result.items;
  },
  
  async updateUser(userId: string, updates: any): Promise<boolean> {
    const updateExpression = 'SET ' + Object.keys(updates).map(key => `#${key} = :${key}`).join(', ');
    const expressionAttributeNames = Object.keys(updates).reduce((acc, key) => {
      acc[`#${key}`] = key;
      return acc;
    }, {} as Record<string, string>);
    const expressionAttributeValues = Object.entries(updates).reduce((acc, [key, value]) => {
      acc[`:${key}`] = value;
      return acc;
    }, {} as Record<string, any>);
    
    return DynamoDBService.updateItem(
      DYNAMODB_CONFIG.Tables.users,
      { id: userId },
      updateExpression,
      expressionAttributeValues,
      expressionAttributeNames
    );
  },
  
  async deleteUser(userId: string): Promise<boolean> {
    return DynamoDBService.deleteItem(DYNAMODB_CONFIG.Tables.users, { id: userId });
  }
};

export const ProjectsService = {
  async createProject(project: any): Promise<boolean> {
    return DynamoDBService.putItem(DYNAMODB_CONFIG.Tables.projects, project);
  },
  
  async getProject(projectId: string): Promise<any> {
    return DynamoDBService.getItem(DYNAMODB_CONFIG.Tables.projects, { id: projectId });
  },
  
  async getAllProjects(): Promise<any[]> {
    const result = await DynamoDBService.scan(DYNAMODB_CONFIG.Tables.projects);
    return result.items;
  },
  
  async getProjectsByClient(clientId: string): Promise<any[]> {
    const result = await DynamoDBService.query(
      DYNAMODB_CONFIG.Tables.projects,
      'clientId = :clientId',
      { ':clientId': clientId }
    );
    return result.items;
  },
  
  async updateProject(projectId: string, updates: any): Promise<boolean> {
    const updateExpression = 'SET ' + Object.keys(updates).map(key => `#${key} = :${key}`).join(', ');
    const expressionAttributeNames = Object.keys(updates).reduce((acc, key) => {
      acc[`#${key}`] = key;
      return acc;
    }, {} as Record<string, string>);
    const expressionAttributeValues = Object.entries(updates).reduce((acc, [key, value]) => {
      acc[`:${key}`] = value;
      return acc;
    }, {} as Record<string, any>);
    
    return DynamoDBService.updateItem(
      DYNAMODB_CONFIG.Tables.projects,
      { id: projectId },
      updateExpression,
      expressionAttributeValues,
      expressionAttributeNames
    );
  },
  
  async deleteProject(projectId: string): Promise<boolean> {
    return DynamoDBService.deleteItem(DYNAMODB_CONFIG.Tables.projects, { id: projectId });
  }
};
