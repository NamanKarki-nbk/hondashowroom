import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_honda_key_12345";
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function main() {
  const token = await new SignJWT({
    userId: "admin-id",
    email: "successbhattarai1998@gmail.com",
    role: "ADMIN"
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  console.log("TOKEN:", token);
  
  const res = await fetch("http://localhost:3000/api/admin/settings/roles/users", {
    headers: {
      "Cookie": `auth_session=${token}`
    }
  });
  
  const text = await res.text();
  console.log("RESPONSE STATUS:", res.status);
  console.log("RESPONSE BODY:", text);
}

main().catch(console.error);
