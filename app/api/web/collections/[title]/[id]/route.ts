import { prisma } from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: number } }) => {
  const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0");
  const take = parseInt(req.nextUrl.searchParams.get("take") || "12");
  if (!params.id) {
    return NextResponse.json({ message: "id required" }, { status: 400 });
  }
  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id: Number(params.id),
        status: "上线",
      },
      include: {
        images: true,
        products: {
          take, // 只获取一定数量的产品用于分页加载
          skip, // 跳过一定数量的产品用于分页加载
          include: {
            product: {
              select: {
                images: {
                  orderBy: {
                    order_index: "asc",
                  },
                },
                id: true,
                price: true,
                alias_description: true,
                alias_title: true,
                discount: true,
                title: true,
                status: true,
                category: true,
                tags: true,
                size_image: true,
                colors: true,
                sizes: true,
              },
            },
          },
          orderBy: {
            assignedAt: "desc",
          },
        },
      },
    });
    return NextResponse.json(collection);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
  }
};
