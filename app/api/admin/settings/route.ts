import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { is_fake, key } = await req.json();
  if (is_fake === undefined || is_fake === null || !key) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const res = await prisma.settings.create({
      data: {
        key,
        is_fake,
      },
    });
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const { key, is_fake } = await req.json();
  if (!key || !is_fake) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    await prisma.settings.update({
      where: {
        key,
      },
      data: {
        is_fake,
      },
    });
    return NextResponse.json({ message: "Settings updated successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
