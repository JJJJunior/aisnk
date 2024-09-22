import { prisma } from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";
import { CollectionType, ImageType } from "@/app/lib/types";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id: Number(params.id),
      },
      include: {
        images: {
          orderBy: {
            order_index: "asc",
          },
        },
      },
    });
    if (!collection) {
      return NextResponse.json({ error: "找不到该栏目" }, { status: 404 });
    }
    return NextResponse.json({ data: collection }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const collection = await prisma.collection.findUnique({
        where: {
          id: Number(params.id),
        },
        include: {
          images: true,
        },
      });
      if (!collection) {
        return NextResponse.json({ error: "collection not found" }, { status: 404 });
      }
      // 删除关联的 productCollection
      await prisma.productCollection.deleteMany({
        where: {
          collection: { id: collection.id },
        },
      });

      // 删除关联的 images
      if (collection.images && collection.images.length > 0) {
        await prisma.image.deleteMany({
          where: {
            collectionId: collection.id,
          },
        });
      }
      // 删除 collection
      await prisma.collection.delete({
        where: {
          id: Number(params.id),
        },
      });
    });
    return NextResponse.json({ message: "delete success" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { title, description, order_index, status, parentId, images, alias_description, alias_title } =
    await req.json();
  try {
    const collectionId = Number(params.id);
    const updatedCollection = await prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        title,
        description,
        order_index,
        alias_description,
        alias_title,
        updated_at: new Date(),
        status,
        parent: parentId
          ? {
              connect: {
                id: parentId,
              },
            }
          : {
              disconnect: true,
            },
      },
    });
    if (images && images.length > 0) {
      // 删除旧图片并创建新图片
      await prisma.image.deleteMany({ where: { collectionId } });
      await prisma.image.createMany({
        data: images.map((image: ImageType) => ({
          id: image.id,
          url: image.url,
          order_index: image.order_index ? image.order_index : 999,
          collectionId,
        })),
      });
    }
    if (!updatedCollection) {
      return NextResponse.json({ error: "找不到该栏目" }, { status: 404 });
    }
    return NextResponse.json({ message: "更新栏目成功" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
};
