import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/db";

export const GET = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        products: {
          include: {
            product: {
              select: {
                id: true,
                images: {
                  orderBy: {
                    order_index: "asc",
                  },
                  select: {
                    id: true,
                    url: true,
                  },
                },
                code: true,
                commission: true,
                cost: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });
    return NextResponse.json({ data: orders });
  } catch (err) {
    return NextResponse.json({ message: "查询失败" }, { status: 500 });
  }
};
