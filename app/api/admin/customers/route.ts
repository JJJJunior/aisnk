import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "asc",
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
