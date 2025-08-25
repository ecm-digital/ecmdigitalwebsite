const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    const { httpMethod, path, body } = event;
    
    try {
        // Parse body
        const requestBody = body ? JSON.parse(body) : {};
        
        switch (httpMethod) {
            case 'POST':
                if (path.includes('/auth/signup')) {
                    return await handleSignUp(requestBody);
                } else if (path.includes('/auth/signin')) {
                    return await handleSignIn(requestBody);
                } else if (path.includes('/auth/verify')) {
                    return await handleVerifyUser(requestBody);
                } else if (path.includes('/auth/profile')) {
                    return await handleGetProfile(requestBody);
                }
                break;
                
            case 'PUT':
                if (path.includes('/auth/profile')) {
                    return await handleUpdateProfile(requestBody);
                }
                break;
            case 'GET':
                if (path.includes('/auth/users')) {
                    return await handleListUsers();
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

async function handleSignUp(userData) {
    const { email, name, company } = userData;
    
    if (!email || !name) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Email and name are required' })
        };
    }
    
    const userId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const user = {
        id: userId,
        email,
        name,
        company: company || '',
        role: 'client',
        isEmailVerified: false,
        createdAt: timestamp,
        lastLoginAt: timestamp
    };
    
    try {
        await dynamodb.put({
            TableName: 'ecm-users',
            Item: user
        }).promise();
        
        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'User created successfully',
                user: { ...user, password: undefined }
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to create user' })
        };
    }
}

async function handleSignIn(credentials) {
    const { email, password } = credentials;
    
    if (!email || !password) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Email and password are required' })
        };
    }
    
    try {
        // In a real app, you'd verify password hash here
        // For now, we'll just check if user exists
        const result = await dynamodb.scan({
            TableName: 'ecm-users',
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email }
        }).promise();
        
        if (result.Items.length === 0) {
            return {
                statusCode: 401,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Invalid credentials' })
            };
        }
        
        const user = result.Items[0];
        
        // Update last login
        await dynamodb.update({
            TableName: 'ecm-users',
            Key: { id: user.id },
            UpdateExpression: 'SET lastLoginAt = :lastLoginAt',
            ExpressionAttributeValues: { ':lastLoginAt': new Date().toISOString() }
        }).promise();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Login successful',
                user: { ...user, password: undefined },
                token: `demo-token-${user.id}` // In real app, generate JWT
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Login failed' })
        };
    }
}

async function handleVerifyUser(data) {
    const { email, name, firstName, lastName, company } = data;
    if (!email) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Email is required' })
        };
    }

    try {
        // Find user by email
        const result = await dynamodb.scan({
            TableName: 'ecm-users',
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email }
        }).promise();

        if (result.Items && result.Items.length > 0) {
            const user = result.Items[0];
            const updateExp = []
            const exprValues = { ':v': true, ':ll': new Date().toISOString() }
            const exprNames = {}

            updateExp.push('isEmailVerified = :v')
            updateExp.push('lastLoginAt = :ll')

            if (firstName) {
                updateExp.push('#fn = :firstName')
                exprValues[':firstName'] = firstName
                exprNames['#fn'] = 'firstName'
            }
            if (lastName) {
                updateExp.push('#ln = :lastName')
                exprValues[':lastName'] = lastName
                exprNames['#ln'] = 'lastName'
            }
            if ((firstName || lastName) && name) {
                updateExp.push('#name = :name')
                exprValues[':name'] = name
                exprNames['#name'] = 'name'
            }
            if (company) {
                updateExp.push('#company = :company')
                exprValues[':company'] = company
                exprNames['#company'] = 'company'
            }

            await dynamodb.update({
                TableName: 'ecm-users',
                Key: { id: user.id },
                UpdateExpression: 'SET ' + updateExp.join(', '),
                ExpressionAttributeValues: exprValues,
                ExpressionAttributeNames: Object.keys(exprNames).length ? exprNames : undefined,
            }).promise();

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'User verified' })
            };
        }

        // If user doesn't exist yet, create minimal record (upsert)
        const userId = uuidv4();
        const timestamp = new Date().toISOString();
        const user = {
            id: userId,
            email,
            name: name || [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0],
            firstName: firstName || (name ? name.split(' ')[0] : ''),
            lastName: lastName || (name ? name.split(' ').slice(1).join(' ') : ''),
            company: company || '',
            role: 'client',
            isEmailVerified: true,
            createdAt: timestamp,
            lastLoginAt: timestamp
        };

        await dynamodb.put({
            TableName: 'ecm-users',
            Item: user
        }).promise();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'User created and verified' })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to verify user' })
        };
    }
}

async function handleListUsers() {
    try {
        const result = await dynamodb.scan({
            TableName: 'ecm-users'
        }).promise();

        const users = (result.Items || []).map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            firstName: u.firstName,
            lastName: u.lastName,
            company: u.company,
            role: u.role,
            isEmailVerified: !!u.isEmailVerified,
            createdAt: u.createdAt,
            lastLoginAt: u.lastLoginAt
        }));

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ users })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to list users' })
        };
    }
}

async function handleGetProfile(userId) {
    try {
        const result = await dynamodb.get({
            TableName: 'ecm-users',
            Key: { id: userId }
        }).promise();
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'User not found' })
            };
        }
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: { ...result.Item, password: undefined }
            })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to get profile' })
        };
    }
}

async function handleUpdateProfile(userData) {
    const { id, name, company } = userData;
    
    if (!id) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'User ID is required' })
        };
    }
    
    try {
        const updateExpression = [];
        const expressionAttributeValues = {};
        
        if (name) {
            updateExpression.push('SET #name = :name');
            expressionAttributeValues[':name'] = name;
        }
        
        if (company !== undefined) {
            updateExpression.push('SET company = :company');
            expressionAttributeValues[':company'] = company;
        }
        
        if (updateExpression.length === 0) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'No fields to update' })
            };
        }
        
        await dynamodb.update({
            TableName: 'ecm-users',
            Key: { id },
            UpdateExpression: updateExpression.join(', '),
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: { '#name': 'name' }
        }).promise();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Profile updated successfully' })
        };
    } catch (error) {
        console.error('DynamoDB error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to update profile' })
        };
    }
}



