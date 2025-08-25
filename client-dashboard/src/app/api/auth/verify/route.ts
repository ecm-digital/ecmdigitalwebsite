import { NextRequest, NextResponse } from 'next/server';

const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const AGENCY_BACKEND_URL = process.env.AGENCY_BACKEND_URL || process.env.NEXT_PUBLIC_AGENCY_BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 /api/auth/verify called');

    const body = await request.json();
    console.log('📝 Request body:', body);

    const email: string | undefined = body?.email;
    const providedFirstName: string | undefined = body?.firstName;
    const providedLastName: string | undefined = body?.lastName;
    const providedName: string | undefined = body?.name; // full name
    const providedCompany: string | undefined = body?.company;

    console.log('📧 Email:', email);

    if (!email) {
      console.log('❌ No email provided');
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Derive names
    const trimmedFullName = (providedName || '').trim();
    let firstName = (providedFirstName || '').trim();
    let lastName = (providedLastName || '').trim();

    if ((!firstName || !lastName) && trimmedFullName) {
      const parts = trimmedFullName.split(/\s+/);
      if (parts.length === 1) {
        firstName = firstName || parts[0];
      } else if (parts.length > 1) {
        firstName = firstName || parts[0];
        lastName = lastName || parts.slice(1).join(' ');
      }
    }

    const displayName = (trimmedFullName || [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0]).trim();
    const company = (providedCompany || '').trim();

    // 🔥 OBSŁUGA DANYCH MARKETINGOWYCH
    const marketingData = body?.marketingData || {};

    // Try to find existing user by email (scan or GSI if available)
    let existingUser: any | null = null;
    try {
      const scanResult = await dynamodb.scan({
        TableName: 'ecm-users',
        FilterExpression: '#email = :email',
        ExpressionAttributeNames: { '#email': 'email' },
        ExpressionAttributeValues: { ':email': email }
      }).promise();
      existingUser = (scanResult.Items && scanResult.Items[0]) || null;
    } catch (scanErr) {
      // Non-fatal; proceed with insert
      // eslint-disable-next-line no-console
      console.warn('Warn: could not scan ecm-users for existing email:', scanErr);
    }

    const nowIso = new Date().toISOString();

    const userData = {
      id: existingUser?.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email,
      firstName: firstName || existingUser?.firstName || '',
      lastName: lastName || existingUser?.lastName || '',
      name: displayName || existingUser?.name || email.split('@')[0],
      company: company || existingUser?.company || '',
      role: existingUser?.role || 'client',
      isEmailVerified: true,
      createdAt: existingUser?.createdAt || nowIso,
      lastLoginAt: nowIso,
      // 🔥 DANE MARKETINGOWE
      marketingData: {
        source: marketingData.source || '',
        budget: marketingData.budget || '',
        timeline: marketingData.timeline || '',
        goals: marketingData.goals || '',
        currentWebsite: marketingData.currentWebsite || '',
        previousExperience: marketingData.previousExperience || '',
        referralSource: marketingData.referralSource || '',
        phone: marketingData.phone || '',
        registrationDate: nowIso
      }
    };

    console.log('💾 Saving user to DynamoDB:', userData);
    await dynamodb.put({ TableName: 'ecm-users', Item: userData }).promise();

    // Fire-and-forget webhook to agency backend (do not block or fail verification if this errors)
    try {
      const payload = {
        email: userData.email,
        contact_person: userData.name,
        company_name: userData.company,
        phone: marketingData.phone || '',
        status: 'active',
        source: 'registration',
        // 🔥 DANE MARKETINGOWE
        marketingData: {
          source: marketingData.source,
          budget: marketingData.budget,
          timeline: marketingData.timeline,
          goals: marketingData.goals,
          currentWebsite: marketingData.currentWebsite,
          previousExperience: marketingData.previousExperience,
          referralSource: marketingData.referralSource
        }
      };

      // Use a short timeout to avoid hanging
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const resp = await fetch(`${AGENCY_BACKEND_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).catch((err) => {
        console.warn('⚠️ Agency webhook fetch failed:', err);
        return null;
      });
      clearTimeout(timeout);
      if (resp && !resp.ok) {
        const text = await resp.text().catch(() => '');
        console.warn('⚠️ Agency webhook non-OK response:', resp.status, text);
      } else if (resp) {
        console.log('🔔 Agency webhook delivered');
      }
    } catch (whErr) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Agency webhook error (ignored):', whErr);
    }

    console.log(`✅ User verified and upserted: ${email}`);
    console.log('🎉 Response sent successfully');

    return NextResponse.json({
      message: 'User verified and data synchronized successfully',
      user: userData
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
