import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/db";

export const POST = async (req: NextRequest) => {
  const { id, username, email, firstName, lastName, createdAt, lastSignInAt, referredById } = await req.json();
  if (!id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
    });
    if (customer?.id) {
      await prisma.customer.update({
        where: {
          id: id,
        },
        data: {
          username,
          email,
          firstName,
          lastName,
          createdAt,
          lastSignInAt,
        },
      });
      return NextResponse.json({ message: "customer in db" }, { status: 200 });
    }
    await prisma.customer.create({
      data: {
        id,
        username,
        email,
        firstName,
        lastName,
        createdAt,
        lastSignInAt,
        referredById,
      },
    });
    return NextResponse.json({ message: "customer created" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Internal errors" }, { status: 500 });
  }
};
