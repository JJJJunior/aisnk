import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  if (!params.id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  const { confirmed } = await req.json();
  if (!confirmed) {
    return NextResponse.json({ message: "confirmed is required" }, { status: 400 });
  }
  try {
    await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        confirmed,
      },
    });
    return NextResponse.json({ message: "confirmed changed" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
};
