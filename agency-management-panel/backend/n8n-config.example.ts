/**
 * N8N Integration Configuration Example
 *
 * Copy this file to n8n-config.ts and update with your actual values
 */

export const n8nConfig = {
  // Your n8n instance URL (without trailing slash)
  baseUrl: 'https://your-n8n-instance.com',

  // API token from n8n (get from Settings > API)
  apiToken: 'your-n8n-api-token-here',

  // Optional: Webhook secret for signature validation
  webhookSecret: 'your-webhook-secret-for-signature-validation',

  // Optional: Specific workflow IDs for different events
  workflows: {
    newClient: 'new-client-workflow',
    newProject: 'new-project-workflow',
    contactForm: 'contact-form-workflow',
    marketingData: 'marketing-data-workflow'
  }
};

/**
 * Setup Instructions:
 *
 * 1. Create your n8n workflows with webhook triggers
 * 2. Get your API token from n8n Settings > API
 * 3. Set up environment variables or update this config file
 * 4. Create webhooks in your workflows pointing to:
 *    - /api/n8n/webhook/new-client-workflow
 *    - /api/n8n/webhook/new-project-workflow
 *    - /api/n8n/webhook/contact-form-workflow
 *    - /api/n8n/webhook/marketing-data-workflow
 *
 * Example n8n webhook URL: https://your-ecm-backend.com/api/n8n/webhook/contact-form-workflow
 */
