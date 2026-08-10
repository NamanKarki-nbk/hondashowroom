import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_honda_key_12345"; // In prod, ALWAYS set JWT_SECRET
const secretKey = new TextEncoder().encode(JWT_SECRET);

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
  [key: string]: any;
}

export async function signSessionToken(payload: JwtPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
  
  return jwt;
}

export async function verifySessionToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as JwtPayload;
  } catch (error) {
    return null;
  }
}
