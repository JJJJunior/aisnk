import { SignJWT, jwtVerify, JWTPayload } from "jose";

// 生成 JWT
export async function signToken(payload: JWTPayload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
  const token = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("24h").sign(secret);
  // console.log("token..........", token);
  return token;
}

// 验证 JWT
export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
    const { payload } = await jwtVerify(token, secret);
    // console.log(payload);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
