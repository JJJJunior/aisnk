import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { ProductType, ImageType, CollectionType } from "@/app/lib/types";

export const POST = async (req: NextRequest) => {
  const newProduct: ProductType = await req.json();
  try {
    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await prisma.$transaction(async (prisma) => {
      const createdProduct = await prisma.product.create({
        data: {
          title: newProduct.title ? newProduct.title : "",
          description: newProduct.description ? newProduct.description : "",
          price: newProduct.price,
          code: newProduct.code ? newProduct.code : "",
          expense: newProduct.expense,
          status: newProduct.status,
          discount: newProduct.discount,
          category: newProduct.category ? newProduct.category : "",
          tags: newProduct.tags,
          colors: newProduct.colors,
          sizes: newProduct.sizes,
          alias_description: newProduct.alias_description ? newProduct.alias_description : "",
          alias_title: newProduct.alias_title ? newProduct.alias_title : "",
          is_recommended: newProduct.is_recommended ? newProduct.is_recommended : 0,
          size_image: newProduct.size_image,
          stock: newProduct.stock,
          shipping: newProduct.shipping,
          commission: newProduct.commission,
          cost: newProduct.cost,
          images: {
            createMany: {
              data: newProduct.images
                ? newProduct.images.map((image: ImageType) => ({
                    id: image.id,
                    url: image.url,
                    order_index: image.order_index ? image.order_index : 999,
                    productId: newProduct.id,
                  }))
                : [],
            },
          },
        },
      });
      //创建产品和集合的关联关系
      if (newProduct.collections && newProduct.collections.length > 0) {
        await prisma.productCollection.createMany({
          data: newProduct.collections.map((collection: CollectionType) => ({
            productId: createdProduct.id ? createdProduct.id : 0,
            collectionId: collection.id ? collection.id : 0,
          })),
        });
      }
    });
    return NextResponse.json(
      {
        message: "Create product successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: {
          orderBy: {
            order_index: "asc",
          },
        },
        collections: {
          select: {
            collection: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        updated_at: "asc",
      },
    });
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
