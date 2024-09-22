import { prisma } from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";
import { CollectionType } from "@/app/lib/types";

export const POST = async (req: NextRequest) => {
  try {
    if (req.body === null) return;
    const newCollection: CollectionType = await req.json();
    await prisma.collection.create({
      data: {
        title: newCollection.title ? newCollection.title : "",
        order_index: newCollection.order_index ? newCollection.order_index : 999,
        description: newCollection.description ? newCollection.description : "",
        alias_title: newCollection.alias_title ? newCollection.alias_title : "",
        alias_description: newCollection.alias_description ? newCollection.alias_description : "",
        status: newCollection.status ? newCollection.status : "",
        parent: {
          connect: {
            id: newCollection.parentId ? newCollection.parentId : undefined,
          },
        },
        images: {
          createMany: {
            data: newCollection.images
              ? newCollection.images.map((image) => ({
                  id: image.id,
                  url: image.url,
                  order_index: image.order_index ? image.order_index : 999,
                }))
              : [],
          },
        },
      },
    });
    return NextResponse.json({ message: "创建栏目成功" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: {
        updated_at: "asc",
      },
      include: {
        images: {
          orderBy: {
            order_index: "asc",
          },
        },
        products: true,
      },
    });
    return NextResponse.json({ data: collections }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
