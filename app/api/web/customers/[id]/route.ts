import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/db";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });
    return NextResponse.json({ data: customer }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Internal errors" }, { status: 500 });
  }
};
