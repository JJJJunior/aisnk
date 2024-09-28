import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";

//这句话忽略缓存机制，很好用
export const revalidate = 0;
export const GET = async () => {
  try {
    const partners = await prisma.partner.findMany({
      include: {
        customers: {
          include: {
            Orders: true,
          },
        },
      },
    });
    return NextResponse.json(partners, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const partner = await req.json();
  if (!partner) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    await prisma.partner.create({
      data: {
        ...partner,
        id: undefined,
        email_stripe: undefined,
      },
    });
    return NextResponse.json("Success", { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
