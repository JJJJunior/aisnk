import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/db"; // 确保正确引入你的 prisma 实例

export const POST = async (req: NextRequest) => {
  const { visitorId, ip, userAgent, deviceType, os, browser, continentName, countryName, stateProv, city } =
    await req.json();

  if (!visitorId || !ip) {
    return NextResponse.json({ message: "Visitor ID and IP are required" }, { status: 400 });
  }

  try {
    // 查找是否已存在该访客记录
    const existingVisitor = await prisma.visitor.findUnique({
      where: { visitorId },
    });

    if (existingVisitor) {
      // 如果存在，则更新访客的访问次数和最后访问时间
      await prisma.visitor.update({
        where: { visitorId },
        data: {
          visitCount: { increment: 1 }, // 访问次数加一
          lastVisit: new Date(), // 更新最后访问时间
        },
      });
    } else {
      // 如果不存在，则创建新的访客记录
      await prisma.visitor.create({
        data: {
          visitorId,
          ip,
          userAgent,
          deviceType,
          os,
          browser,
          continentName,
          countryName,
          stateProv,
          city,
        },
      });
    }
    return NextResponse.json({ message: "Visitor record updated successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Internal error" }, { status: 500 });
  }
};
