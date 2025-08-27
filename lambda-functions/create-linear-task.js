const { LinearClient } = require('@linear/sdk');

exports.handler = async (event) => {
  try {
    const { title, description, teamKey, labels, priority, estimate, dueDate } = JSON.parse(event.body);
    
    const linear = new LinearClient({
      apiKey: process.env.LINEAR_API_KEY
    });
    
    // Get team by key
    const teams = await linear.teams();
    const team = teams.nodes.find(t => t.key === teamKey);
    
    if (!team) {
      throw new Error(`Team with key ${teamKey} not found`);
    }
    
    // Create issue
    const issue = await linear.createIssue({
      title,
      description,
      teamId: team.id,
      labels: labels || [],
      priority: priority || 2,
      estimate: estimate || null,
      dueDate: dueDate || null
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        issueId: issue.issue.id,
        issueNumber: issue.issue.number
      })
    };
    
  } catch (error) {
    console.error('Error creating Linear task:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
