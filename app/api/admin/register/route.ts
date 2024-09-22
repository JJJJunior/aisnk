import { prisma } from "@/prisma/db";
import CrytoJS from "crypto-js";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        password: CrytoJS.AES.encrypt(body.password, process.env.PASS_SEC ? process.env.PASS_SEC : "").toString(),
      },
    });
    return new NextResponse(
      JSON.stringify({
        message: "User registered successfully",
        user: newUser.username,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: "Failed to register user" }), { status: 500 });
  }
};
