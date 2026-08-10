import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifySessionToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        bio: true,
        avatarUrl: true,
        address: true,
        createdAt: true
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifySessionToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });

    const updates = await req.json();
    
    // Whitelist allowed update fields
    const allowedUpdates = ["fullName", "email", "phone", "bio", "avatarUrl", "address"];
    const dataToUpdate: Record<string, any> = {};
    
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        dataToUpdate[key] = updates[key];
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: "No valid fields provided to update" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: dataToUpdate,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        bio: true,
        avatarUrl: true,
        address: true
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
