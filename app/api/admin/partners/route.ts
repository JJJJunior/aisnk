import { NextResponse } from "next/server";
import { prisma } from "@/prisma/db";

export const GET = async () => {
  try {
    // 获取所有 isRef 为 1 的客户
    const partners = await prisma.customer.findMany({
      where: {
        isRef: 1,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        username: true,
        email: true,
        referralCode: true,
      },
    });

    // console.log(partners);

    // 统计每个 referralCode 的数量
    const partnersAndCount = await Promise.all(
      partners.map(async (partner) => {
        const count = await prisma.customer.count({
          where: {
            referredById: partner.referralCode,
          },
        });
        // 计算此合作伙伴引荐客户的订单总金额
        const totalAmount = await prisma.order.aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            customer: {
              referredById: partner.referralCode,
            },
          },
        });
        return {
          id: partner.id,
          username: partner.username,
          email: partner.email,
          customerId: partner.id,
          referralCode: partner.referralCode,
          refCount: count,
          totalAmount: totalAmount._sum.totalAmount || 0, // 如果没有订单，总金额为0
        };
      })
    );
    // 返回统计结果
    return NextResponse.json({ data: partnersAndCount }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
