import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";
import CrytoJS from "crypto-js";

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const userId = Number(params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: CrytoJS.AES.encrypt(
          user.username + "@123",
          process.env.PASS_SEC ? process.env.PASS_SEC : ""
        ).toString(),
      },
    });
    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
