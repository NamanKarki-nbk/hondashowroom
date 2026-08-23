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
      include: {
        customerProfile: true
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const flatUser = {
      ...user,
      ...(user.customerProfile || {}),
      isVerified: user.isVerified,
      kycVerified: user.customerProfile?.isVerified || false,
    };
    delete (flatUser as any).passwordHash;
    delete (flatUser as any).customerProfile;

    return NextResponse.json({ user: flatUser });
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
    const allowedUserUpdates = [
      "fullName", "email", "phone", "avatarUrl", "address", 
      "gender", "dobAd", "dobBs"
    ];

    const allowedCustomerUpdates = [
      "fullName", "email", "phone", "address",
      "citizenshipVerified", "citizenshipNumber", "citizenshipFront", "citizenshipBack",
      "licenseVerified", "licenseNumber", "licenseFront", "licenseBack",
      "nationalIdVerified", "nationalIdNumber", "nationalIdFront", "nationalIdBack"
    ];
    
    const userData: Record<string, any> = {};
    const customerData: Record<string, any> = {};
    
    for (const key of Object.keys(updates)) {
      if (updates[key] !== undefined) {
        if (allowedUserUpdates.includes(key)) {
          userData[key] = updates[key];
        }
        if (allowedCustomerUpdates.includes(key)) {
          customerData[key] = updates[key];
        }
      }
    }

    if (Object.keys(userData).length === 0 && Object.keys(customerData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided to update" }, { status: 400 });
    }

    let updatedUser: any = null;
    if (Object.keys(userData).length > 0) {
      updatedUser = await prisma.user.update({
        where: { id: payload.userId },
        data: userData,
      });
    } else {
      updatedUser = await prisma.user.findUnique({ where: { id: payload.userId } });
    }

    if (Object.keys(customerData).length > 0) {
      const upsertCustomerData = {
        ...customerData,
        phone: customerData.phone || updatedUser.phone,
        fullName: customerData.fullName || updatedUser.fullName || "Unknown",
      };

      await prisma.customer.upsert({
        where: { userId: payload.userId },
        update: customerData,
        create: {
          ...upsertCustomerData,
          userId: payload.userId,
        }
      });
    }

    const finalUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { customerProfile: true }
    });

    const flatUser = {
      ...finalUser,
      ...(finalUser?.customerProfile || {}),
      isVerified: finalUser?.isVerified || false,
      kycVerified: finalUser?.customerProfile?.isVerified || false,
    };
    delete (flatUser as any).passwordHash;
    delete (flatUser as any).customerProfile;

    return NextResponse.json({ success: true, user: flatUser });
  } catch (error) {
    console.error("Profile update error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
