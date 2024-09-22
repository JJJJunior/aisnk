"use server";
import { cookies } from "next/headers";
import { signToken, verifyToken } from "./jwt";
import { NextResponse } from "next/server";
// 获取 Token 并验证
export const getToken = async () => {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  // 验证 Token
  return await verifyToken(token);
};

// 更新 Token
export const updateToken = async () => {
  // console.log("更新token....");
  const token = cookies().get("token")?.value;
  if (!token) return;
  const payload = await verifyToken(token);
  if (payload === null) return;
  // 设置新的过期时间
  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12h
  payload.expires = expires; // 可选：如果你在 JWT 的 payload 中需要保存 expires
  // 创建新的 JWT
  const newToken = await signToken(payload);
  // 返回响应并设置新的 token
  const res = NextResponse.next();
  res.cookies.set("token", newToken, {
    httpOnly: true,
    expires,
    path: "/", // 确保 token 可以在整个站点使用
  });
  return res; // 返回更新后的响应
};
