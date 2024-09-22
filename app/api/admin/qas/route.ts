import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  const { title, question, answer } = await req.json();
  if (!title || !question || !answer) {
    return NextResponse.json({ message: "title, question and answer are required" }, { status: 400 });
  }
  try {
    await prisma.qA.create({
      data: { title, question, answer },
    });
    return NextResponse.json({ message: "Created successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server internal error" }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    const qas = await prisma.qA.findMany({
      orderBy: {
        created_at: "asc",
      },
    });
    return NextResponse.json({ data: qas }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server internal error" }, { status: 500 });
  }
};
