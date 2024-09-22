import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { key: string } }) => {
  if (!params.key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }
  try {
    const res = await prisma.settings.findUnique({
      where: {
        key: params.key,
      },
    });
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { key: string } }) => {
  const { is_fake } = await req.json();
  if (!params.key || is_fake === undefined || is_fake === null) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    await prisma.settings.update({
      where: {
        key: params.key,
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
