import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { LogType } from "@/app/lib/types";

export const GET = async () => {
  try {
    const logs = await prisma.log.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return NextResponse.json({ data: logs }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const log: LogType = await req.json();
    await prisma.log.create({
      data: {
        user: log.user,
        type: log.type,
        info: log.info,
        ip: log.ip,
        country_name: log.country_name,
        city: log.city,
      },
    });
    return NextResponse.json({});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
