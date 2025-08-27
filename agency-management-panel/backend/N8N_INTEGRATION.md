# N8N Integration Guide

## Overview

This integration connects your ECM Digital backend with n8n workflows to automate business processes and enhance productivity.

## Features

- ✅ **Automatic Triggers**: New clients, projects, and contact forms automatically trigger n8n workflows
- ✅ **Webhook Support**: Receive data back from n8n workflows
- ✅ **Authentication**: Secure API token validation
- ✅ **Error Handling**: Non-blocking integration - failures don't affect main app functionality
- ✅ **Health Check**: Monitor integration status
- ✅ **Workflow Management**: List and trigger workflows manually

## Quick Start

### 1. Configure Your n8n Instance

1. **Get API Token**:
   - Go to n8n Settings > API
   - Generate or copy your API token

2. **Set Environment Variables**:
   ```bash
   export N8N_BASE_URL=https://your-n8n-instance.com
   export N8N_API_TOKEN=your-api-token-here
   export N8N_WEBHOOK_SECRET=your-webhook-secret  # Optional
   ```

3. **Optional Workflow IDs** (for specific workflows):
   ```bash
   export N8N_NEW_CLIENT_WORKFLOW_ID=new-client-workflow
   export N8N_NEW_PROJECT_WORKFLOW_ID=new-project-workflow
   export N8N_CONTACT_WORKFLOW_ID=contact-form-workflow
   export N8N_MARKETING_WORKFLOW_ID=marketing-data-workflow
   ```

### 2. Create n8n Workflows

Create workflows with webhook triggers for the following endpoints:

#### New Client Workflow
- **Webhook URL**: `https://your-backend.com/api/n8n/webhook/new-client-workflow`
- **Data Structure**:
  ```json
  {
    "data": {
      "id": "1234567890",
      "email": "client@example.com",
      "contact_person": "John Doe",
      "company": "Example Corp",
      "phone": "+48 123 456 789",
      "registration_date": "2025-01-15T10:30:00Z",
      "status": "active"
    },
    "metadata": {
      "source": "client-registration",
      "timestamp": "2025-01-15T10:30:00Z"
    }
  }
  ```

#### New Project Workflow
- **Webhook URL**: `https://your-backend.com/api/n8n/webhook/new-project-workflow`
- **Data Structure**:
  ```json
  {
    "data": {
      "id": "1234567890",
      "name": "E-commerce Platform",
      "client": "client@example.com",
      "status": "active",
      "description": "Complete e-commerce solution"
    },
    "metadata": {
      "source": "project-creation",
      "timestamp": "2025-01-15T10:30:00Z"
    }
  }
  ```

#### Contact Form Workflow
- **Webhook URL**: `https://your-backend.com/api/n8n/webhook/contact-form-workflow`
- **Data Structure**:
  ```json
  {
    "data": {
      "id": "1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+48 123 456 789",
      "company": "Example Corp",
      "service": "Web Development",
      "budget": "50k-100k PLN",
      "message": "I need a new website...",
      "timestamp": "2025-01-15T10:30:00Z",
      "source": "contact-form"
    },
    "metadata": {
      "source": "contact-form",
      "timestamp": "2025-01-15T10:30:00Z"
    }
  }
  ```

## API Endpoints

### Automatic Triggers

These endpoints automatically send data to n8n when called:

#### `POST /api/clients`
Creates a new client and triggers the new-client-workflow.

#### `POST /api/projects`
Creates a new project and triggers the new-project-workflow.

#### `POST /api/contact`
Handles contact form submissions and triggers the contact-form-workflow.

### Manual Integration Endpoints

#### `POST /api/n8n/clients/new`
Manually send client data to n8n.
```bash
curl -X POST http://localhost:3001/api/n8n/clients/new \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","contact_person":"John Doe"}'
```

#### `POST /api/n8n/projects/new`
Manually send project data to n8n.

#### `POST /api/n8n/contact`
Manually send contact data to n8n.

#### `POST /api/n8n/trigger/:workflowId`
Trigger any n8n workflow by ID.

### Management Endpoints

#### `GET /api/n8n/workflows`
List all available n8n workflows.

#### `GET /api/n8n/executions/:executionId`
Get status of a workflow execution.

#### `GET /api/n8n/health`
Check integration health and configuration.

### Webhook Endpoint

#### `POST /api/n8n/webhook/:workflowId`
Receive data from n8n workflows. Supports signature validation.

## Integration Examples

### 1. Email Notification on New Client

Create an n8n workflow that:
1. Receives webhook data from `/api/n8n/webhook/new-client-workflow`
2. Sends a welcome email to the new client
3. Creates a task in your project management tool
4. Updates CRM with client information

### 2. Lead Qualification on Contact Form

Create an n8n workflow that:
1. Receives webhook data from `/api/n8n/webhook/contact-form-workflow`
2. Analyzes the message using AI to qualify the lead
3. Routes high-quality leads to sales team
4. Sends auto-response email to the contact

### 3. Project Setup Automation

Create an n8n workflow that:
1. Receives webhook data from `/api/n8n/webhook/new-project-workflow`
2. Creates project folder structure
3. Sets up CI/CD pipeline
4. Creates initial tasks in project management tool
5. Sends notification to development team

## Error Handling

The integration is designed to be non-blocking:
- If n8n is unavailable, the main application continues to work
- Failed n8n requests are logged but don't affect user experience
- Use `/api/n8n/health` to monitor integration status

## Security

- All API endpoints require Bearer token authentication
- Webhook signature validation (optional)
- HTTPS recommended for production
- Store API tokens securely as environment variables

## Testing

### Test Integration Health
```bash
curl http://localhost:3001/api/n8n/health
```

### Test Workflow Trigger
```bash
curl -X POST http://localhost:3001/api/n8n/trigger/test-workflow \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Test data"}'
```

### Test with Real Data
```bash
# Test new client trigger
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","contact_person":"Test User"}'
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your API token in environment variables
2. **Connection Refused**: Verify n8n instance URL and network connectivity
3. **Webhook Not Triggering**: Check webhook URL in n8n workflow configuration

### Logs

Monitor logs for integration activity:
```bash
tail -f /path/to/your/logs/app.log | grep -i n8n
```

### Debug Mode

Enable detailed logging by setting:
```bash
export NODE_ENV=development
export DEBUG=n8n-integration:*
```

## Support

For issues with n8n integration:
1. Check `/api/n8n/health` endpoint
2. Review application logs
3. Verify n8n workflow configuration
4. Test webhook endpoints manually

---

**Note**: This integration requires n8n to be properly configured and accessible from your backend server.
