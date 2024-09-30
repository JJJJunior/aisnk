import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const parents = await prisma.parent.findMany({});
    return NextResponse.json(parents, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Internal errors" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    await prisma.parent.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json({ message: "success!" }, { status: 200 });
  } catch (err) {
    console.log(err);
  }
};
