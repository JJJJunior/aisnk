import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/jwt";

export const GET = async (req: NextRequest) => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login", req.url));
  }
  const user = await verifyToken(token);
  if (user instanceof NextResponse) {
    // 如果令牌无效或未提供，返回错误响应
    return user;
  }
  // 如果令牌验证成功，返回用户信息
  return NextResponse.json({
    message: "User has been authenticated",
    data: user, // user 是解码后的 JWT payload
  });
};
