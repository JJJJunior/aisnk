import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/db";
import { getAuth } from "@clerk/nextjs/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
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
    const customers = await prisma.customer.findMany({
      where: {
        referredById: customer?.referralCode,
      },
    });
    return NextResponse.json({ data: customers.length }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Internal errors" }, { status: 500 });
  }
};
