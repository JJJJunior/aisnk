import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";

export const GET = async (req: NextRequest) => {
  try {
    const exchange = await prisma.exchangeAndShipping.findMany({
      select: {
        id: true,
        courtyName: true,
        exchangeRate: true,
        currencyCode: true,
        code: true,
      },
    });
    return NextResponse.json({ data: exchange }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
