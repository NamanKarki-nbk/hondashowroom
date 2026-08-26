import { prisma } from "@/lib/prisma";
import { sendAdminAlert } from "@/lib/mailer";

interface CreateNotificationParams {
  type: "NEW_LEAD" | "TEST_RIDE" | "AMC_BOOKING" | "SERVICE_BOOKING";
  title: string;
  message: string;
  link?: string;
}

export async function createAdminNotification({ type, title, message, link }: CreateNotificationParams) {
  try {
    // 1. Save to database
    const notification = await prisma.adminNotification.create({
      data: {
        type,
        title,
        message,
        link,
      },
    });

    // 2. Send Email Alert (fire and forget)
    sendAdminAlert(title, message, link).catch((err: any) => {
      console.error("Failed to send admin email alert:", err);
    });

    return notification;
  } catch (error) {
    console.error("Failed to create admin notification:", error);
    // Don't throw, we don't want a notification failure to break the main user flow
    return null;
  }
}
