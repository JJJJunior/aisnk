import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  if (!params.id) {
    return NextResponse.json({ message: "id required" }, { status: 400 });
  }
  try {
    await prisma.qA.delete({
      where: {
        id: Number(params.id),
      },
    });
    return NextResponse.json({ message: "Delete successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server internal error" }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  if (!params.id) {
    return NextResponse.json({ message: "id required" }, { status: 400 });
  }
  const { title, question, answer } = await req.json();
  if (!title || !question || !answer) {
    return NextResponse.json({ message: "title, question and answer are required" }, { status: 400 });
  }
  try {
    await prisma.qA.update({
      where: {
        id: Number(params.id),
      },
      data: {
        title,
        question,
        answer,
      },
    });
    return NextResponse.json({ message: "Update successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server internal error" }, { status: 500 });
  }
};
