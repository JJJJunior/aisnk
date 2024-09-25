import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: params.id,
      },
      select: {
        isRef: true,
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        referralCode: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    //普通客户直接返回
    if (customer.isRef === 0) {
      return NextResponse.json(customer, { status: 200 });
    }

    const allSubcustomers = await prisma.customer.findMany({
      where: {
        referredById: customer.referralCode,
      },
      select: {
        id: true,
      },
    });

    const subCustomersTotalOrderComission = await prisma.order.aggregate({
      _sum: {
        commission: true,
      },
      where: {
        customerId: {
          in: allSubcustomers.map((subcustomer) => subcustomer.id),
        },
        confirmed: 1,
      },
    });

    const subCustomersTotalOrders = await prisma.order.findMany({
      where: {
        customerId: {
          in: allSubcustomers.map((subcustomer) => subcustomer.id),
        },
        confirmed: 1,
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        customer: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const count = await prisma.customer.count({
      where: {
        referredById: customer.referralCode,
      },
    });
    // 计算此合作伙伴引荐客户的订单总金额

    // 处理可能为 null 的情况
    const totalCommission = subCustomersTotalOrderComission._sum.commission || 0;

    return NextResponse.json(
      {
        data: {
          id: customer.id,
          isRef: customer.isRef,
          username: customer.username,
          fullname: customer.lastName + " " + customer.firstName,
          email: customer.email,
          customerId: customer.id,
          referralCode: customer.referralCode,
          refCount: count,
          commission: totalCommission,
          subCustomersTotalOrders: subCustomersTotalOrders,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
