const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    const { httpMethod, path, body } = event;
    
    try {
        const requestBody = body ? JSON.parse(body) : {};
        
        switch (httpMethod) {
            case 'GET':
                if (path.includes('/projects')) {
                    return await handleGetProjects(requestBody);
                } else if (path.includes('/projects/')) {
                    return await handleGetProject(requestBody);
                }
                break;
                
            case 'POST':
                if (path.includes('/projects')) {
                    return await handleCreateProject(requestBody);
                }
                break;
                
            case 'PUT':
                if (path.includes('/projects/')) {
                    return await handleUpdateProject(requestBody);
                }
                break;
                
            case 'DELETE':
                if (path.includes('/projects/')) {
                    return await handleDeleteProject(requestBody);
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

async function handleCreateProject(projectData) {
    const { name, description, userId, status, budget, deadline } = projectData;
    
    if (!name || !userId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Project name and user ID are required' })
        };
    }
    
    const projectId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const project = {
        id: projectId,
        name,
        description: description || '',
        userId,
        status: status || 'planning',
        budget: budget || 0,
        deadline: deadline || null,
        createdAt: timestamp,
        updatedAt: timestamp,
        progress: 0,
        tasks: [],
        team: []
    };
    
    try {
        await dynamodb.put({
            TableName: 'ecm-projects',
            Item: project
        }).promise();
        
        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Project created successfully',
                project
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to create project' })
        };
    }
}

async function handleGetProjects(requestData) {
    const { userId } = requestData;
    
    if (!userId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'User ID is required' })
        };
    }
    
    try {
        const result = await dynamodb.query({
            TableName: 'ecm-projects',
            IndexName: 'UserIdIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: { ':userId': userId }
        }).promise();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projects: result.Items || []
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to get projects' })
        };
    }
}

async function handleGetProject(requestData) {
    const { id } = requestData;
    
    if (!id) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Project ID is required' })
        };
    }
    
    try {
        const result = await dynamodb.get({
            TableName: 'ecm-projects',
            Key: { id }
        }).promise();
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Project not found' })
            };
        }
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project: result.Item
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to get project' })
        };
    }
}

async function handleUpdateProject(projectData) {
    const { id, name, description, status, budget, deadline, progress } = projectData;
    
    if (!id) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Project ID is required' })
        };
    }
    
    try {
        const updateExpression = [];
        const expressionAttributeValues = {};
        
        if (name) {
            updateExpression.push('SET #name = :name');
            expressionAttributeValues[':name'] = name;
        }
        
        if (description !== undefined) {
            updateExpression.push('SET description = :description');
            expressionAttributeValues[':description'] = description;
        }
        
        if (status) {
            updateExpression.push('SET #status = :status');
            expressionAttributeValues[':status'] = status;
        }
        
        if (budget !== undefined) {
            updateExpression.push('SET budget = :budget');
            expressionAttributeValues[':budget'] = budget;
        }
        
        if (deadline !== undefined) {
            updateExpression.push('SET deadline = :deadline');
            expressionAttributeValues[':deadline'] = deadline;
        }
        
        if (progress !== undefined) {
            updateExpression.push('SET progress = :progress');
            expressionAttributeValues[':progress'] = progress;
        }
        
        if (updateExpression.length === 0) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'No fields to update' })
            };
        }
        
        updateExpression.push('SET updatedAt = :updatedAt');
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
        
        await dynamodb.update({
            TableName: 'ecm-projects',
            Key: { id },
            UpdateExpression: updateExpression.join(', '),
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: { 
                '#name': 'name',
                '#status': 'status'
            }
        }).promise();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Project updated successfully' })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to update project' })
        };
    }
}

async function handleDeleteProject(requestData) {
    const { id } = requestData;
    
    if (!id) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Project ID is required' })
        };
    }
    
    try {
        await dynamodb.delete({
            TableName: 'ecm-projects',
            Key: { id }
        }).promise();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Project deleted successfully' })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to delete project' })
        };
    }
}







