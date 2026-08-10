import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

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
