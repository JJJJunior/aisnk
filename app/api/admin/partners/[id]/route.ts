import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";

export const DELETE = async (req: NextRequest, { params }: { params: { id: number } }) => {
  if (!params.id) {
    return new NextResponse("ID is required", { status: 400 });
  }
  try {
    await prisma.partner.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse("Partner deleted successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Server internal error", { status: 500 });
  }
};
