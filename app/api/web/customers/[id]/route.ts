import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!params.id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        username: true,
        email_stripe: true,
        email: true,
        firstName: true,
        lastName: true,
        is_partner: true,
        name: true,
        createdAt: true,
        lastSignInAt: true,
        phone: true,
        Orders: true,
      },
    });
    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch order" }, { status: 500 });
  }
};
