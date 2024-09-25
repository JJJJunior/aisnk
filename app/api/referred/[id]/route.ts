import { prisma } from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  if (!params.id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  try {
    const partner = await prisma.customer.findUnique({
      where: {
        referralCode: params.id,
        isRef: 1,
      },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        name: true,
      },
    });
    return NextResponse.json({ data: partner }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
