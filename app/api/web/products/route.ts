import { prisma } from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0");
  const take = parseInt(req.nextUrl.searchParams.get("take") || "12");

  try {
    const products = await prisma.product.findMany({
      take, // 只获取一定数量的产品用于分页加载
      skip, // 跳过一定数量的产品用于分页加载
      select: {
        images: {
          orderBy: {
            order_index: "asc",
          },
        },
        price: true,
        discount: true,
        title: true,
        id: true,
        status: true,
        tags: true,
        category: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
  }
};
