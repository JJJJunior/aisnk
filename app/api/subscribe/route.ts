import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";
export const POST = async (req: NextRequest) => {
  const { email, status, visitor_id } = await req.json();
  if (!email || !status) {
    return NextResponse.json({ message: "email and status are required" }, { status: 400 });
  }
  const existingSubscription = await prisma.subscription.findMany({
    where: { email },
  });
  if (existingSubscription.length > 0) {
    await prisma.subscription.updateMany({
      where: { email },
      data: {
        visitor_id,
      },
    });
    return NextResponse.json({ message: "email already exists" }, { status: 409 });
  }
  try {
    await prisma.subscription.create({
      data: {
        email,
        status,
        visitor_id,
      },
    });
    return NextResponse.json({ message: "subscription created" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Inter error", { status: 500 });
  }
};
