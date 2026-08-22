import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Simulate WhatsApp Cloud API Webhook Verification (if challenge exists)
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return new NextResponse(challenge, { status: 200 });
    }

    // Process incoming message
    if (payload.entry && payload.entry[0].changes) {
      const change = payload.entry[0].changes[0];
      if (change.value && change.value.messages) {
        const message = change.value.messages[0];
        console.log(`Received WhatsApp message from ${message.from}: ${message.text?.body}`);
        
        // E.g., if user replies "CONFIRM" to a service reminder, update CRM.
        if (message.text?.body?.toUpperCase() === 'CONFIRM') {
          console.log(`Customer ${message.from} confirmed their appointment.`);
          // CRM logic to update appointment status
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('WhatsApp Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Webhook verification endpoint
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  
  return new NextResponse('Invalid Token', { status: 403 });
}
