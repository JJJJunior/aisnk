import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const GET = async (req: NextRequest, { params }: { params: { clerkId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!params.clerkId) {
    return NextResponse.json({ message: "clerkId is required" }, { status: 400 });
  }

  try {
    const partner = await prisma.partner.findUnique({
      where: {
        clerkId: params.clerkId,
      },
      include: {
        customers: {
          select: {
            id: true,
            Orders: {
              select: {
                id: true,
                totalAmount: true,
                products: {
                  select: {
                    productId: true,
                    title: true,
                    quantity: true,
                    product: {
                      select: {
                        price: true,
                        commission: true,
                        discount: true,
                      },
                    },
                  },
                },
                commission: true,
                confirmed: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
    if (!partner) {
      return NextResponse.json({ message: "Partner not found" }, { status: 404 });
    }
    return NextResponse.json(partner, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
