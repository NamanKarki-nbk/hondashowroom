import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_honda_key_12345"; // In prod, ALWAYS set JWT_SECRET

// OTP Hashing
export async function hashOtp(otp: string): Promise<string> {
  return await bcrypt.hash(otp, SALT_ROUNDS);
}

export async function verifyOtpHash(otp: string, hashedOtp: string): Promise<boolean> {
  return await bcrypt.compare(otp, hashedOtp);
}

export function generateNumericOtp(length: number = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

// JWT Session Management
export interface JwtPayload {
  userId: string;
  phone?: string;
  email?: string;
}

export function signSessionToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}
