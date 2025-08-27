import fetch from 'node-fetch';

export interface N8NConfig {
  baseUrl: string;
  apiToken: string;
  webhookSecret?: string;
}

export interface N8NWorkflowData {
  workflowId?: string;
  data: any;
  metadata?: {
    source: string;
    timestamp: string;
    userId?: string;
    [key: string]: any;
  };
}

export interface N8NWebhookPayload {
  workflowId: string;
  executionId: string;
  data: any;
  status: 'success' | 'error' | 'running';
  timestamp: string;
}

export class N8NService {
  private config: N8NConfig;

  constructor(config: N8NConfig) {
    this.config = config;
  }

  /**
   * Wyślij dane do n8n workflow przez webhook
   */
  async triggerWorkflow(workflowData: N8NWorkflowData): Promise<any> {
    try {
      const { workflowId, data, metadata } = workflowData;

      if (!workflowId) {
        throw new Error('Workflow ID is required');
      }

      const webhookUrl = `${this.config.baseUrl}/webhook/${workflowId}`;

      const payload = {
        data,
        metadata: {
          ...metadata,
          source: metadata?.source || 'ecm-digital-backend',
          timestamp: metadata?.timestamp || new Date().toISOString(),
        }
      };

      console.log(`🚀 Triggering n8n workflow: ${workflowId}`);
      console.log(`📡 Webhook URL: ${webhookUrl}`);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiToken}`,
          'X-Webhook-Source': 'ecm-digital-backend'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ n8n webhook error: ${response.status} ${response.statusText}`);
        console.error(`Error details: ${errorText}`);
        throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`✅ n8n workflow triggered successfully: ${workflowId}`);

      return result;
    } catch (error) {
      console.error('Error triggering n8n workflow:', error);
      throw error;
    }
  }

  /**
   * Wyślij dane nowego klienta do n8n
   */
  async sendNewClient(clientData: any): Promise<any> {
    return this.triggerWorkflow({
      workflowId: process.env.N8N_NEW_CLIENT_WORKFLOW_ID || 'new-client-workflow',
      data: {
        client: clientData,
        eventType: 'new_client_registration'
      },
      metadata: {
        source: 'client-registration',
        timestamp: new Date().toISOString(),
        userId: clientData.id
      }
    });
  }

  /**
   * Wyślij dane nowego projektu do n8n
   */
  async sendNewProject(projectData: any): Promise<any> {
    return this.triggerWorkflow({
      workflowId: process.env.N8N_NEW_PROJECT_WORKFLOW_ID || 'new-project-workflow',
      data: {
        project: projectData,
        eventType: 'new_project_created'
      },
      metadata: {
        source: 'project-creation',
        timestamp: new Date().toISOString(),
        userId: projectData.clientId
      }
    });
  }

  /**
   * Wyślij dane nowej wiadomości kontaktowej do n8n
   */
  async sendContactMessage(messageData: any): Promise<any> {
    return this.triggerWorkflow({
      workflowId: process.env.N8N_CONTACT_WORKFLOW_ID || 'contact-form-workflow',
      data: {
        message: messageData,
        eventType: 'contact_form_submission'
      },
      metadata: {
        source: 'contact-form',
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Wyślij dane marketingowe do n8n
   */
  async sendMarketingData(marketingData: any): Promise<any> {
    return this.triggerWorkflow({
      workflowId: process.env.N8N_MARKETING_WORKFLOW_ID || 'marketing-data-workflow',
      data: {
        marketing: marketingData,
        eventType: 'marketing_analytics_update'
      },
      metadata: {
        source: 'marketing-analytics',
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Pobierz status wykonania workflow
   */
  async getWorkflowExecutionStatus(executionId: string): Promise<any> {
    try {
      const statusUrl = `${this.config.baseUrl}/executions/${executionId}`;

      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get execution status: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting workflow execution status:', error);
      throw error;
    }
  }

  /**
   * Pobierz listę dostępnych workflow-ów
   */
  async getWorkflows(): Promise<any> {
    try {
      const workflowsUrl = `${this.config.baseUrl}/workflows`;

      const response = await fetch(workflowsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get workflows: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting workflows:', error);
      throw error;
    }
  }

  /**
   * Walidacja webhook-a z n8n (sprawdzenie podpisu)
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      console.warn('⚠️ Webhook secret not configured, skipping signature validation');
      return true;
    }

    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload)
        .digest('hex');

      return signature === `sha256=${expectedSignature}`;
    } catch (error) {
      console.error('Error validating webhook signature:', error);
      return false;
    }
  }
}

// Konfiguracja domyślna
const defaultConfig: N8NConfig = {
  baseUrl: process.env.N8N_BASE_URL || 'https://your-n8n-instance.com',
  apiToken: process.env.N8N_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYTNjNWEwYS1jMGQ1LTQ5ODEtOWQ4NS00MjlkOGI2OGZlOGIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MjYyMDk4LCJleHAiOjE3NTg4Mzc2MDB9.HBznfCBaPGKYnDSVVegBqCpReW8pBWW5A6-pKTzNfdw',
  webhookSecret: process.env.N8N_WEBHOOK_SECRET
};

// Export singleton instance
export const n8nService = new N8NService(defaultConfig);
