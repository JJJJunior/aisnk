import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { LogType } from "@/app/lib/types";
import { getIpInDBIP } from "@/app/lib/actions";

export const POST = async (req: NextRequest) => {
  try {
    const dbip = await getIpInDBIP();
    // console.log(dbip);
    const log: LogType = await req.json();
    await prisma.log.create({
      data: {
        user: log.user,
        type: log.type,
        info: log.info,
        ip: dbip.ipAddress,
        country_name: dbip.countryName,
        city: dbip.city,
      },
    });
    return NextResponse.json({});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
