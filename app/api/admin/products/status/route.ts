import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";
export const GET = async () => {
  try {
    const status = await prisma.productStatus.findMany();
    return NextResponse.json(
      {
        data: status,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
