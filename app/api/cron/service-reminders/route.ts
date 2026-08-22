import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// This endpoint could be triggered by Vercel Cron
export async function GET(request: Request) {
  try {
    // Check for authorization header if using secure cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // return new NextResponse('Unauthorized', { status: 401 }); // Disabled for testing
    }

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Find all uncompleted service reminders due in the next 7 days
    const upcomingReminders = await prisma.serviceReminder.findMany({
      where: {
        isCompleted: false,
        dueDate: {
          lte: nextWeek,
          gte: today
        }
      }
    });

    for (const reminder of upcomingReminders) {
      // Mock WhatsApp Send Logic
      console.log(`[WhatsApp API] Sending reminder to Customer ID ${reminder.customerId} for VIN ${reminder.vehicleVin}. Service Type: ${reminder.serviceType}`);
      
      // Update record to indicate notification sent
      await prisma.serviceReminder.update({
        where: { id: reminder.id },
        data: { notifiedVia: 'WhatsApp' }
      });
    }

    return NextResponse.json({ success: true, processed: upcomingReminders.length });
  } catch (error) {
    console.error('Service reminder cron error:', error);
    return NextResponse.json({ error: 'Cron execution failed' }, { status: 500 });
  }
}
