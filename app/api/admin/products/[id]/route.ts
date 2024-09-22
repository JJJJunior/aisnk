import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/db";
import { ImageType, CollectionType } from "@/app/lib/types";

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const product = await prisma.product.findUnique({
        where: { id: Number(params.id) },
      });
      if (!product) {
        throw new Error("Product not found");
      }
      await prisma.image.deleteMany({
        where: { productId: product.id },
      });
      await prisma.productCollection.deleteMany({
        where: { productId: product.id },
      });
      await prisma.product.delete({ where: { id: product.id } });
    });
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const {
      title,
      description,
      price,
      code,
      status,
      collections,
      expense,
      category,
      colors,
      sizes,
      size_image,
      tags,
      alias_title,
      alias_description,
      is_recommended,
      discount,
      shipping,
      commission,
      cost,
      images,
      stock,
    } = await req.json();

    if (!title || !description || !price || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const productId = Number(params.id);

    await prisma.$transaction(async (prisma) => {
      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          title,
          description,
          price,
          code,
          status,
          expense,
          discount,
          stock,
          category: category || "",
          colors,
          sizes,
          alias_description,
          alias_title,
          is_recommended,
          shipping,
          commission,
          cost,
          tags,
          size_image,
          updated_at: new Date(),
        },
      });
      // 删除旧图片并创建新图片
      if (images && images.length > 0) {
        await prisma.image.deleteMany({ where: { productId } });
        await prisma.image.createMany({
          data: images.map((image: ImageType) => ({
            id: image.id,
            url: image.url,
            order_index: image.order_index ? image.order_index : 999,
            productId,
          })),
        });
      }

      if (collections && collections.length > 0) {
        await prisma.productCollection.deleteMany({ where: { productId } });
        await prisma.productCollection.createMany({
          data: collections.map((collection: CollectionType) => ({
            productId,
            collectionId: collection.id as number,
          })),
        });
      }
    });

    return NextResponse.json({ message: "Product updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error updating product:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(params.id),
      },
      include: {
        images: {
          orderBy: {
            order_index: "asc",
          },
        },
        collections: true,
      },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ data: product }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
