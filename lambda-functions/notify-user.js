const AWS = require('aws-sdk');
const ses = new AWS.SES();

exports.handler = async (event) => {
  try {
    const { userEmail, actionType, actionData, message } = JSON.parse(event.body);
    
    // Prepare email content based on action type
    let subject, htmlBody;
    
    switch (actionType) {
      case 'blog_draft_created':
        subject = `📝 Szkic bloga "${actionData.title}" został utworzony`;
        htmlBody = `
          <h2>Twój szkic bloga został utworzony!</h2>
          <p><strong>Tytuł:</strong> ${actionData.title}</p>
          <p><strong>Slug:</strong> ${actionData.slug}</p>
          <p><strong>Język:</strong> ${actionData.language === 'pl' ? 'Polski' : 'English'}</p>
          <p><strong>Status:</strong> ${actionData.publishMode === 'draft' ? 'Szkic' : 'Auto-publikacja'}</p>
          <hr>
          <p>${message || 'Szkic został zapisany w systemie i jest gotowy do edycji.'}</p>
          <p>Możesz go znaleźć w panelu CMS lub skontaktować się z zespołem ECM Digital.</p>
        `;
        break;
        
      case 'linear_tasks_created':
        subject = `✅ Zadania w Linear zostały utworzone`;
        htmlBody = `
          <h2>Zadania zostały utworzone w Linear!</h2>
          <p><strong>Liczba zadań:</strong> ${actionData.taskCount}</p>
          <p><strong>Zespół:</strong> ${actionData.teamKey}</p>
          <hr>
          <p>${message || 'Wszystkie zadania zostały pomyślnie dodane do systemu Linear.'}</p>
          <p>Sprawdź swój dashboard Linear, aby zobaczyć szczegóły.</p>
        `;
        break;
        
      case 'campaign_planned':
        subject = `📅 Kampania marketingowa została zaplanowana`;
        htmlBody = `
          <h2>Kampania marketingowa została zaplanowana!</h2>
          <p><strong>Typ:</strong> ${actionData.campaignType}</p>
          <p><strong>Data rozpoczęcia:</strong> ${actionData.startDate}</p>
          <hr>
          <p>${message || 'Kampania została dodana do kalendarza i jest gotowa do realizacji.'}</p>
        `;
        break;
        
      default:
        subject = `🔔 Powiadomienie z ECM Marketing Agent`;
        htmlBody = `
          <h2>Powiadomienie z ECM Marketing Agent</h2>
          <p><strong>Akcja:</strong> ${actionType}</p>
          <hr>
          <p>${message || 'Akcja została wykonana pomyślnie.'}</p>
        `;
    }
    
    // Send email via SES
    const emailParams = {
      Source: 'noreply@ecm-digital.com',
      Destination: {
        ToAddresses: [userEmail]
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8'
          }
        }
      }
    };
    
    await ses.sendEmail(emailParams).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Notification sent successfully',
        actionType,
        userEmail
      })
    };
    
  } catch (error) {
    console.error('Error sending notification:', error);
    
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
