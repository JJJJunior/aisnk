import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";
export const POST = async (req: NextRequest) => {
  try {
    const { collection_ids, product_ids } = await req.json();
    if (!collection_ids || !product_ids) {
      return NextResponse.json({ error: "Collection IDs and Product IDs are required" }, { status: 400 });
    }

    await prisma.$transaction(async (prisma) => {
      // Delete existing associations
      await prisma.productCollection.deleteMany({
        where: {
          productId: {
            in: product_ids,
          },
        },
      });

      // Create new associations
      const data = [];
      for (const productId of product_ids) {
        for (const collectionId of collection_ids) {
          data.push({
            productId: productId,
            collectionId: collectionId,
          });
        }
      }

      await prisma.productCollection.createMany({
        data,
      });
    });

    return NextResponse.json({ message: "Collections added successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
