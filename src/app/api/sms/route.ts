import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, targetPhones } = body;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || accountSid.includes('AC000')) {
      return NextResponse.json(
        { error: 'Twilio credentials not properly configured in .env.local (Using dummy keys)' },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Send SMS to all target numbers
    const promises = targetPhones.map((phone: string) => 
      client.messages.create({
        body: message,
        from: fromPhone,
        to: phone
      })
    );

    const results = await Promise.all(promises);

    return NextResponse.json({ success: true, messageCount: results.length });
  } catch (error: any) {
    console.error('SMS dispatch error:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS', details: error.message },
      { status: 500 }
    );
  }
}
