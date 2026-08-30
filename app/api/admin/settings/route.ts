import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLogger";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keysParam = searchParams.get("keys");
    
    let whereClause = {};
    if (keysParam) {
      const keys = keysParam.split(",");
      whereClause = { key: { in: keys } };
    }

    const settings = await prisma.systemSetting.findMany({
      where: whereClause
    });

    // Convert array to object map
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    // Upsert each key in the payload
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        const setting = await prisma.systemSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        });

        await logActivity({
          userId: session?.userId || session?.id || "system",
          action: "UPDATE",
          entity: "SystemSetting",
          entityId: setting.id,
          details: { key, value }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
