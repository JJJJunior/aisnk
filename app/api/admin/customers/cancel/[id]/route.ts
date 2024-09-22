import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await prisma.customer.update({
      where: {
        id: params.id,
      },
      data: {
        referralCode: null,
        isRef: 0,
      },
    });
    return NextResponse.json({ message: "referral code updated successfully" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
