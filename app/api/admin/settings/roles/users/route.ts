import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/session';
import { cookies } from 'next/headers';
import { logActivity } from '@/lib/activityLogger';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    
    console.log("Roles API Debug:", { tokenPresent: !!token, session });

    const allowedEmails = ["successbhattarai1998@gmail.com", "admin@honda.com"];
    const isHardcodedAdmin = session?.email && allowedEmails.includes(session.email);

    if (!session || (!["SUPERADMIN", "ADMIN"].includes(session.role) && !isHardcodedAdmin)) {
      console.log("Unauthorized hit:", { role: session?.role, email: session?.email, isHardcodedAdmin });
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching system users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    
    const allowedEmails = ["successbhattarai1998@gmail.com", "admin@honda.com"];
    const isHardcodedAdmin = session?.email && allowedEmails.includes(session.email);

    // Only SUPERADMIN, ADMIN, or Hardcoded Admins can change roles.
    if (!session || (!["SUPERADMIN", "ADMIN"].includes(session.role) && !isHardcodedAdmin)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
      return new NextResponse("Missing userId or newRole", { status: 400 });
    }

    const validRoles = ["SUPERADMIN", "ADMIN", "MANAGER", "STAFF", "USER"];
    if (!validRoles.includes(newRole)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    // A user cannot demote themselves.
    if (session.id === userId && session.role !== newRole) {
       return new NextResponse("Cannot change your own role", { status: 400 });
    }

    // Only SUPERADMIN can assign the SUPERADMIN role
    if (newRole === "SUPERADMIN" && session.role !== "SUPERADMIN" && !isHardcodedAdmin) {
       return new NextResponse("Only a Superadmin can assign the Superadmin role", { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    
    // Only SUPERADMIN can demote an existing SUPERADMIN
    if (targetUser?.role === "SUPERADMIN" && session.role !== "SUPERADMIN" && !isHardcodedAdmin) {
       return new NextResponse("Only a Superadmin can modify another Superadmin", { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    await logActivity({
      userId: session.userId || session.id,
      action: "UPDATE",
      entity: "SystemSetting",
      entityId: updatedUser.id,
      details: {
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
