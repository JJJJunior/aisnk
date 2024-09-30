import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";

export const GET = async (req: NextRequest, { params }: { params: { key: string } }) => {
  if (params.key === undefined || params.key === "") {
    return new Response("Key is required", { status: 400 });
  }
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: params.key } },
          { description: { contains: params.key } },
          { code: { contains: params.key } },
          { category: { contains: params.key } },
        ],
        AND: [
          {
            status: "上架",
          },
        ],
      },
    });
    if (products.length === 0) {
      return new NextResponse("No products found", { status: 404 });
    }
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
