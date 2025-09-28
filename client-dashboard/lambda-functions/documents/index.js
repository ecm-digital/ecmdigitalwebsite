const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    const { httpMethod, path, body } = event;
    
    try {
        const requestBody = body ? JSON.parse(body) : {};
        
        switch (httpMethod) {
            case 'GET':
                if (path.includes('/documents')) {
                    return await handleGetDocuments(requestBody);
                } else if (path.includes('/documents/')) {
                    return await handleGetDocument(requestBody);
                }
                break;
                
            case 'POST':
                if (path.includes('/documents')) {
                    return await handleCreateDocument(requestBody);
                }
                break;
                
            case 'PUT':
                if (path.includes('/documents/')) {
                    return await handleUpdateDocument(requestBody);
                }
                break;
                
            case 'DELETE':
                if (path.includes('/documents/')) {
                    return await handleDeleteDocument(requestBody);
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

async function handleCreateDocument(documentData) {
    const { name, type, size, projectId, userId, description, tags } = documentData;
    
    if (!name || !type || !projectId || !userId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Document name, type, project ID and user ID are required' })
        };
    }
    
    const documentId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const document = {
        id: documentId,
        name,
        type,
        size: size || 0,
        projectId,
        userId,
        description: description || '',
        tags: tags || [],
        status: 'active',
        createdAt: timestamp,
        updatedAt: timestamp,
        version: 1,
        s3Key: `documents/${projectId}/${documentId}/${name}`,
        url: null
    };
    
    try {
        await dynamodb.put({
            TableName: 'ecm-documents',
            Item: document
        }).promise();
        
        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Document created successfully',
                document
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to create document' })
        };
    }
}

async function handleGetDocuments(requestData) {
    const { projectId, userId } = requestData;
    
    if (!projectId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Project ID is required' })
        };
    }
    
    try {
        const result = await dynamodb.query({
            TableName: 'ecm-documents',
            IndexName: 'ProjectIdIndex',
            KeyConditionExpression: 'projectId = :projectId',
            ExpressionAttributeValues: { ':projectId': projectId }
        }).promise();
        
        // Filter by user if specified
        let documents = result.Items || [];
        if (userId) {
            documents = documents.filter(doc => doc.userId === userId);
        }
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                documents
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to get documents' })
        };
    }
}

async function handleGetDocument(requestData) {
    const { id } = requestData;
    
    if (!id) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Document ID is required' })
        };
    }
    
    try {
        const result = await dynamodb.get({
            TableName: 'ecm-documents',
            Key: { id }
        }).promise();
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Document not found' })
            };
        }
        
        // Generate presigned URL for S3 download
        try {
            const presignedUrl = await s3.getSignedUrlPromise('getObject', {
                Bucket: 'ecm-digital-assets',
                Key: result.Item.s3Key,
                Expires: 3600 // 1 hour
            });
            
            result.Item.downloadUrl = presignedUrl;
        } catch (s3Error) {
            console.error('S3 presigned URL error:', s3Error);
            result.Item.downloadUrl = null;
        }
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                document: result.Item
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to get document' })
        };
    }
}

async function handleUpdateDocument(documentData) {
    const { id, name, description, tags, status } = documentData;
    
    if (!id) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Document ID is required' })
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
        
        if (tags) {
            updateExpression.push('SET tags = :tags');
            expressionAttributeValues[':tags'] = tags;
        }
        
        if (status) {
            updateExpression.push('SET #status = :status');
            expressionAttributeValues[':status'] = status;
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
            TableName: 'ecm-documents',
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
            body: JSON.stringify({ message: 'Document updated successfully' })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to update document' })
        };
    }
}

async function handleDeleteDocument(requestData) {
    const { id } = requestData;
    
    if (!id) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Document ID is required' })
        };
    }
    
    try {
        // Get document info first
        const result = await dynamodb.get({
            TableName: 'ecm-documents',
            Key: { id }
        }).promise();
        
        if (result.Item) {
            // Delete from S3 if exists
            try {
                await s3.deleteObject({
                    Bucket: 'ecm-digital-assets',
                    Key: result.Item.s3Key
                }).promise();
            } catch (s3Error) {
                console.error('S3 delete error:', s3Error);
                // Continue with DynamoDB deletion even if S3 fails
            }
        }
        
        // Delete from DynamoDB
        await dynamodb.delete({
            TableName: 'ecm-documents',
            Key: { id }
        }).promise();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Document deleted successfully' })
        };
    } catch (error) {
        console.error('Delete error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to delete document' })
        };
    }
}














