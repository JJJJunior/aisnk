import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const settings = await prisma.settings.findMany();
    return NextResponse.json(settings, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const { key, value } = await req.json();
  if (!value || !key) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const res = await prisma.settings.create({
      data: {
        key,
        value,
      },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
