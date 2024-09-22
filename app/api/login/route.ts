import { prisma } from "@/prisma/db";
import CrytoJS from "crypto-js";
import { NextResponse } from "next/server";
import { signToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const user = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
    }
    const hashedPassword = CrytoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC ? process.env.PASS_SEC : "pass-secret"
    );
    const password = hashedPassword.toString(CrytoJS.enc.Utf8);
    if (password !== body.password) {
      return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
    }
    const expires = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12h
    const accessToken = await signToken({
      user: user.id,
      username: user.username,
      role: user.role,
      expires: expires,
    });
    // 设置 cookie
    cookies().set("token", accessToken, { expires, httpOnly: true });
    return NextResponse.json({ message: "Login successful", acessToken: accessToken });
  } catch (error) {
    console.log(error);
  }
};
