import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

//同步购物车逻辑
export const POST = async (req: NextRequest) => {
  const { customerId, cartItems } = await req.json();

  if (!customerId || !Array.isArray(cartItems)) {
    return NextResponse.json({ message: "customerId and cartItems are required" }, { status: 400 });
  }

  try {
    // 获取数据库中该用户的所有购物车条目
    const existingCartItems = await prisma.cart.findMany({
      where: { customerId },
    });

    // 1. 遍历数据库中的购物车条目，进行删除或更新
    for (const existingItem of existingCartItems) {
      const matchingItem = cartItems.find((item) => item.item.id === existingItem.productId);

      if (matchingItem) {
        // 如果存在于传入的 cartItems 中，进行更新
        await prisma.cart.update({
          where: { id: existingItem.id },
          data: {
            quantity: matchingItem.quantity,
            size: matchingItem.size,
            color: matchingItem.color,
          },
        });
      } else {
        // 如果不在传入的 cartItems 中，删除这个条目
        await prisma.cart.delete({
          where: { id: existingItem.id },
        });
      }
    }

    // 2. 遍历传入的 cartItems，进行新增
    for (const newItem of cartItems) {
      // 使用 newItem.item.id 作为 productId
      const productId = newItem.item?.id;
      if (!productId) {
        console.error("Invalid productId", newItem);
        continue; // 跳过无效的 productId
      }

      const existingItem = existingCartItems.find((item) => item.productId === productId);

      if (!existingItem) {
        // 如果数据库中没有该商品，进行创建
        await prisma.cart.create({
          data: {
            customer: { connect: { id: customerId } },
            product: { connect: { id: productId } }, // 确保正确使用 productId
            quantity: newItem.quantity,
            size: newItem.size,
            color: newItem.color,
          },
        });
      }
    }

    return NextResponse.json({ message: "Cart synchronized successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
