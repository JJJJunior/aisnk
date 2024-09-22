import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  if (!params.id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  const { status } = await req.json();
  if (!status) {
    return NextResponse.json({ message: "status is required" }, { status: 400 });
  }
  try {
    await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    });
    return NextResponse.json({ message: "status changed" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
};
