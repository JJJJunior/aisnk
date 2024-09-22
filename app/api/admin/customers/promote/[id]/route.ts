import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";
import { customAlphabet } from "nanoid";
// 定义只包含字母和数字的字符集
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// 生成长度为8的nanoid
const generateNanoId = customAlphabet(alphabet, 8);

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  if (!params.id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  try {
    await prisma.customer.update({
      where: {
        id: params.id,
      },
      data: {
        referralCode: generateNanoId(),
        isRef: 1,
      },
    });
    return NextResponse.json({ message: "referral code updated successfully" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
