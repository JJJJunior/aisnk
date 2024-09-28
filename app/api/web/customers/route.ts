import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";

export const POST = async (req: NextRequest) => {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id, username, email, is_partner, firstName, lastName, createdAt, lastSignInAt, refId } = await req.json();
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
          is_partner,
          lastSignInAt,
        },
      });
      return NextResponse.json({ message: "customer in db" }, { status: 200 });
    }
    if (refId) {
      const referrer = await prisma.partner.findUnique({
        where: {
          code: refId,
        },
      });
      await prisma.customer.create({
        data: {
          id,
          username,
          email,
          firstName,
          lastName,
          createdAt,
          lastSignInAt,
          is_partner: false,
          Partner: {
            connect: {
              id: referrer?.id,
            },
          },
        },
      });
      return NextResponse.json({ message: "customer created" }, { status: 200 });
    } else {
      await prisma.customer.create({
        data: {
          id,
          username,
          email,
          firstName,
          lastName,
          createdAt,
          lastSignInAt,
          is_partner: false,
          Partner: undefined,
        },
      });
      return NextResponse.json({ message: "customer created" }, { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Internal errors" }, { status: 500 });
  }
};
