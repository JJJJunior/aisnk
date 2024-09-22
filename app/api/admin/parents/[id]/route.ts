import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await prisma.parent.deleteMany({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "success!" }, { status: 200 });
  } catch (err) {
    console.log(err);
  }
};
