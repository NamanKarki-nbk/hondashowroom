import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";
import { withErrorHandler, BusinessException } from "@/lib/api-handler";

async function getActivityLogsHandler(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session")?.value;

  if (!token) {
    throw new BusinessException("Unauthorized", 401);
  }

  const session = await verifySessionToken(token);

  if (!session) {
    throw new BusinessException("Unauthorized", 401);
  }

  const isHardcodedAdmin = process.env.ADMIN_EMAIL && session.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

  // SUPERADMIN check
  if (session.role !== "SUPERADMIN" && !isHardcodedAdmin) {
    throw new BusinessException("Forbidden: Only SUPERADMIN can view activity logs", 403);
  }

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 500, // Limit to recent 500 for performance
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json({ logs });
}

export const GET = withErrorHandler(getActivityLogsHandler);
