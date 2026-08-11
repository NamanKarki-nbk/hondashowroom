import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!email || !password || !firstName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Backend Admin Restriction: Prevent public admin registration
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@honda.com";
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Admin accounts cannot be registered via public endpoints. Please use the secure portal." }, { status: 403 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      // Provide a dummy phone number since phone is marked @unique and @required in schema,
      // but standard email registration doesn't guarantee a phone number.
      data: {
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        passwordHash,
        phone: `temp-${Date.now()}`, // Temporary unique phone if not provided
      },
    });

    return NextResponse.json({ success: true, message: "User registered successfully", userId: newUser.id });

  } catch (error: any) {
    console.error("Error in register: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
