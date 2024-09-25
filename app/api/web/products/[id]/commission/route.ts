import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma/db";

export const POST = async (req: NextRequest, { params }: { params: { id: number } }) => {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (params.id === undefined) {
    return new NextResponse("ID is required", { status: 400 });
  }
  const { customerId } = await req.json();
  if (!customerId) {
    return new NextResponse("customerId is required", { status: 400 });
  }
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      select: {
        isRef: true,
      },
    });
    if (customer?.isRef === 0) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const product = await prisma.product.findUnique({
      where: {
        id: Number(params.id),
      },
      select: {
        commission: true,
      },
    });
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }
    return NextResponse.json({ commission: product.commission }, { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse("Failed to retrieve customer", { status: 500 });
  }
};
