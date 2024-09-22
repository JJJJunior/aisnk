import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";
export const GET = async () => {
  try {
    const users = await prisma.user.findMany({});
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (err) {
    console.error(err);
    NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
