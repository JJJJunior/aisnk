import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/db";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  console.log(params.id);
  if (!params.id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  try {
    const orders = await prisma.order.findMany({
      where: {
        customerId: params.id,
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        products: {
          include: {
            product: {
              select: {
                price: true,
                title: true,
                images: {
                  select: {
                    id: true,
                    url: true,
                  },
                  orderBy: {
                    order_index: "asc",
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Internal errors" }, { status: 500 });
  }
};
