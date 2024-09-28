import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";

//这句话忽略缓存机制，很好用
export const revalidate = 0;
export const GET = async () => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        Orders: true,
        Partner: true,
      },
    });
    return new NextResponse(JSON.stringify({ data: customers }), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};
