import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const result = await prisma.order.groupBy({
      by: ["customerId"], // 按客户ID分组，可以按其他字段分组
      _count: {
        _all: true, // 统计每个分组的订单数量
      },
      _sum: {
        totalAmount: true, // 对 totalAmount 字段进行求和
      },
      where: {
        totalAmount: {
          not: null, // 排除 totalAmount 为 null 的订单
        },
      },
    });
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
