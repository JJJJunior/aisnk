import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");
  // GET /api/images?file=/images/20240805/0b43b.jpg
  const filePath = path.join(process.cwd(), "uploads", fileName ? fileName : "");
  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "image/jpeg", // 根据文件类型设置
      },
    });
  } catch (error) {
    return new NextResponse("File not found", { status: 404 });
  }
}
