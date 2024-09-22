import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const collectionStatus = await prisma.collectionStatus.findMany();
    return NextResponse.json({ data: collectionStatus }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
