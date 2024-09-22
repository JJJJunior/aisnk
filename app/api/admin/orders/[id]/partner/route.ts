import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  if (!params.id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  const { partner } = await req.json();
  if (!partner) {
    return NextResponse.json({ message: "partner is required" }, { status: 400 });
  }
  try {
    await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        partner,
      },
    });
    return NextResponse.json({ message: "partner changed" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
};
