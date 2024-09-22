import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const userId = Number(params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
