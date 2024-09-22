import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Helper function to save the file
async function saveFile(fileBuffer: Buffer, fileName: string, folderPath: string) {
  await fs.mkdir(folderPath, { recursive: true });
  const filePath = path.join(folderPath, fileName);
  await fs.writeFile(filePath, fileBuffer);
  return filePath;
}

export const POST = async (req: NextRequest) => {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ message: "Invalid content-type" }, { status: 400 });
    }

    // 读取上传文件的数据
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const currentDate = new Date();
    const dateFolder = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
    const uploadDir = path.join(process.cwd(), "uploads", "images", dateFolder);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFileName = `${uniqueSuffix}-${file.name}`;

    // 保存文件
    const newFilePath = await saveFile(fileBuffer, newFileName, uploadDir);
    console.log("newFilePath", newFilePath);
    const publicUrl = `/images/${dateFolder}/${newFileName}`;
    console.log("Uploaded image:", publicUrl);
    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
  }
};
