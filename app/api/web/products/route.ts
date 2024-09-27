import { prisma } from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0");
  const take = parseInt(req.nextUrl.searchParams.get("take") || "12");
  const tag = req.nextUrl.searchParams.get("tag");
  let products;
  try {
    if (tag !== "sale") {
      products = await prisma.product.findMany({
        where: {
          status: "上架",
        },
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
          code: true,
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
    } else {
      products = await prisma.product.findMany({
        where: {
          discount: {
            lt: 1,
          },
          status: "上架",
        },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          status: true,
          discount: true,
          tags: true,
          category: true,
          size_image: true,
          sizes: true,
          colors: true,
          created_at: true,
          updated_at: true,
          images: {
            orderBy: {
              order_index: "asc",
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });
    }
    return NextResponse.json(products);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
  }
};
