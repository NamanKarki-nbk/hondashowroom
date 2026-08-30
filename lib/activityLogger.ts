import { prisma } from "@/lib/prisma";

export async function logActivity({
  userId,
  action,
  entity,
  entityId,
  details,
}: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details: details || undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
